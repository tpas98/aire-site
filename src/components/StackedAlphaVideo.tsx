'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Plays a "stacked alpha" video: a double-height clip where the top half holds
 * the colour and the bottom half holds the alpha channel as luminance. A WebGL
 * shader recombines them at playback.
 *
 * Why: no browser-native alpha video format works everywhere. VP9-alpha WebM is
 * ignored by Safari (renders opaque) and HEVC-alpha can only be encoded on macOS.
 * Stacking sidesteps both — the alpha is just pixels, so ordinary AV1/H.264
 * plays everywhere and compresses far better than animated WebP.
 *
 * Playback policy (2026-09-17): phones refuse autoplay for all sorts of reasons
 * — iOS Low Power Mode, data saver, a backgrounded tab, the element not yet in
 * view. An earlier version treated any refusal as permanent and showed the
 * poster forever, which is why the cans "stopped moving" on mobile. Now a
 * refusal keeps the poster up and retries on the first tap, on scroll into
 * view, and when the tab becomes visible. The only permanent fallbacks are a
 * decode error, no WebGL, or prefers-reduced-motion.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2((a_pos.x + 1.0) * 0.5, (1.0 - a_pos.y) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG = `
precision mediump float;
uniform sampler2D u_frame;
varying vec2 v_uv;
void main() {
  vec2 colorCoord = vec2(v_uv.x, v_uv.y * 0.5);
  vec2 alphaCoord = vec2(v_uv.x, 0.5 + v_uv.y * 0.5);
  vec3 color = texture2D(u_frame, colorCoord).rgb;
  float alpha = texture2D(u_frame, alphaCoord).r;
  gl_FragColor = vec4(color * alpha, alpha); // premultiplied
}`

interface Source { src: string; type: string }

interface Props {
  sources: Source[]
  poster: string
  width: number
  height: number
  alt: string
  className?: string
}

/**
 * Safari (every iOS browser is Safari underneath) has reported AV1 as playable
 * on devices that cannot actually decode it, which surfaces as a media error
 * after the source is chosen — and a chosen source that fails to decode does
 * not fall through to the next <source>. H.264 is universal, so on Safari it
 * goes first. Everything else keeps AV1 first for the smaller file.
 */
function orderSources(sources: Source[]): Source[] {
  const ua = navigator.userAgent
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Android/.test(ua)
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!isSafari && !isIOS) return sources
  const h264 = sources.filter(s => /avc1|h264/i.test(s.type))
  const rest = sources.filter(s => !/avc1|h264/i.test(s.type))
  return [...h264, ...rest]
}

export default function StackedAlphaVideo({
  sources, poster, width, height, alt, className = '',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [fallback, setFallback] = useState(false)
  const [painted, setPainted] = useState(false)
  // Sources are attached after mount so Safari gets H.264 first without a
  // server/client markup mismatch. The video is hidden, so nothing is lost
  // by waiting one tick.
  const [ordered, setOrdered] = useState<Source[] | null>(null)

  // Keyed on the source URLs, not array identity: parents pass inline arrays.
  const sourceKey = sources.map(s => s.src).join('|')
  useEffect(() => {
    setOrdered(orderSources(sources))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey])

  useEffect(() => {
    if (!ordered) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setFallback(true); return }

    const root = rootRef.current
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!root || !canvas || !video) return

    const gl = canvas.getContext('webgl', {
      alpha: true, premultipliedAlpha: true, antialias: false, depth: false,
    })
    if (!gl) { setFallback(true); return }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
      return s
    }

    let program: WebGLProgram | null = null
    let texture: WebGLTexture | null = null
    let buffer: WebGLBuffer | null = null
    let raf = 0
    let disposed = false
    let hasPainted = false
    let inView = true

    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link')
      gl.useProgram(program)

      buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(program, 'a_pos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    } catch {
      setFallback(true); return
    }

    // Match the canvas backing store to the displayed size at device pixel ratio
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w; canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const draw = () => {
      if (disposed) return
      raf = requestAnimationFrame(draw)
      if (video.readyState < 2 || video.paused) return
      resize()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!hasPainted) { hasPainted = true; setPainted(true) }
    }

    // --- Playback: try now, and keep trying on the signals that unlock it. ---
    // Properties, not attributes: React does not reliably serialise `muted`
    // into server HTML, and an unmuted play() is refused everywhere.
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    video.load()

    const retryEvents: (keyof WindowEventMap)[] = ['touchend', 'pointerup', 'click', 'keydown']
    let retryArmed = false

    const disarmRetry = () => {
      if (!retryArmed) return
      retryArmed = false
      retryEvents.forEach(e => window.removeEventListener(e, onUserGesture))
    }
    const armRetry = () => {
      if (retryArmed) return
      retryArmed = true
      retryEvents.forEach(e => window.addEventListener(e, onUserGesture, { passive: true }))
    }

    const tryPlay = () => {
      if (disposed || !inView || document.visibilityState === 'hidden') return
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.then(disarmRetry).catch(() => { if (!disposed) armRetry() })
      }
    }
    function onUserGesture() { tryPlay() }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Only play while on screen: saves battery, and satisfies Safari's rule
    // that inline video autoplays only when visible.
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        inView = entries.some(e => e.isIntersecting)
        if (inView) tryPlay()
        else if (!video.paused) video.pause()
      }, { rootMargin: '25% 0px' })
      io.observe(root)
    }

    // A decode error on the chosen source is the one genuine dead end.
    const onError = () => { if (video.error) setFallback(true) }
    video.addEventListener('error', onError)

    tryPlay()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      disarmRetry()
      io?.disconnect()
      video.removeEventListener('error', onError)
      if (texture) gl.deleteTexture(texture)
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
    }
  }, [ordered])

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      role="img"
      aria-label={alt}
    >
      {/*
        The poster renders on the server so the hero paints immediately — the
        canvas only exists after hydration. It stays mounted underneath and is
        revealed again if WebGL or playback fails.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={alt}
        width={width}
        height={height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
        style={{ opacity: painted && !fallback ? 0 : 1, transition: 'opacity 240ms ease' }}
      />
      {!fallback && (
        <>
          {/*
            The video is a texture source, never shown directly. It sits at the
            canvas's own size (not 1×1) so browsers that gate playback on
            "is this element visible" see a real, on-screen element; the canvas
            paints over it.
          */}
          <video ref={videoRef} muted loop playsInline preload="auto"
            aria-hidden="true" tabIndex={-1}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              opacity: 0.01, pointerEvents: 'none', objectFit: 'contain',
            }}>
            {ordered?.map(s => <source key={s.src} src={s.src} type={s.type} />)}
          </video>
          {/*
            A canvas draws a full-bleed quad, so it cannot letterbox itself the
            way object-fit does on an <img>. Constraining it to the source aspect
            ratio inside a centred flex parent reproduces `contain` without
            distortion.
          */}
          <canvas
            ref={canvasRef}
            className="relative block select-none pointer-events-none"
            style={{
              aspectRatio: `${width} / ${height}`,
              maxWidth: '100%', maxHeight: '100%',
              opacity: painted ? 1 : 0, transition: 'opacity 240ms ease',
            }}
          />
        </>
      )}
    </div>
  )
}

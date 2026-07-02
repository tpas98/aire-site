'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import {
  createRenderer,
  createStudioEnvironment,
  addStudioLighting,
  loadCanTextures,
  createCanResources,
  disposeCanTextures,
  easedTurntable,
} from './three/canFactory'

const BASE_TILT_X = -0.55
const BASE_TILT_Z = -0.03
const CYCLE_TIME = 4.5
const EASING_STRENGTH = 1.4

// === SCROLL-SCRUB MAPPING (scrollDriven mode) ===
// The Our Story can reads as a continuation of the hero can: it enters the
// viewport already mid-turn and eases through a full presentation turn as the
// section transits, landing face-front (rotation.y ≈ 0 mod 2π) when the section
// is centered (progress ≈ 0.5). Direction is positive-Y to match the hero's
// scroll rotation (DEFAULT_SCROLL_FX.sceneRotationY is positive).
const SCRUB_TOTAL_TURN = Math.PI * 2 * 1.15 // slightly more than one full turn
// startAngle = 2π − totalTurn/2 so the FRONT label lands at rotation.y ≡ 0 (mod 2π)
// exactly at progress 0.5 (smoothstep(0.5) = 0.5); entry still reads mid-turn.
const SCRUB_START_ANGLE = Math.PI * 2 - SCRUB_TOTAL_TURN / 2
// Scrubbed scale: dips slightly on entry, peaks face-front, eases back on exit.
const SCRUB_SCALE_ENTER = 0.94
const SCRUB_SCALE_MID = 1.0
const SCRUB_SCALE_EXIT = 0.97

// smoothstep — monotonic, reversible easing on [0,1] to soften the linear scrub.
function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

export interface SpinningCanProps {
  className?: string
  /**
   * RAF loop reads `.current` (0-1) each frame with no React re-renders.
   * Legacy (non-scrollDriven) mapping: rotation.y += progress * 0.6 rad on top
   * of the autonomous spin, tiltGroup.position.y -= progress * 0.5.
   * When `scrollDriven` is set, this ref instead OWNS the can's rotation
   * (autonomous turntable is off) — see SCRUB_* constants above.
   */
  scrollProgressRef?: React.MutableRefObject<number>
  /**
   * Desktop + motion-OK only. When true, the autonomous 4.5s turntable is
   * disabled and canGroup.rotation.y is scrubbed by scrollProgressRef so the
   * can's rotation is owned by the user's scroll (continuous 3D narrative with
   * the hero). Float bob + mouse tilt stay alive as ambient life.
   * Requires scrollProgressRef; ignored under reducedMotion.
   */
  scrollDriven?: boolean
  /** When true: render one static frame at rest pose, no RAF loop, no mouse-tilt. */
  reducedMotion?: boolean
}

export default function SpinningCan({ className = '', scrollProgressRef, scrollDriven = false, reducedMotion = false }: SpinningCanProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()

    const width = mount.clientWidth
    const height = mount.clientHeight

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
    camera.position.set(0, 0, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = createRenderer(mount)

    // === STUDIO ENVIRONMENT MAP (for realistic reflections) ===
    const studioEnv = createStudioEnvironment(renderer)
    scene.environment = studioEnv.envMap

    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    const textures = loadCanTextures(renderer, onTextureLoad)

    // SpinningCan uses 128 segments everywhere, bevel radial segments 12
    const canResources = createCanResources(textures, { segments: 128, bevelRadialSegments: 12 })
    const canGroup = canResources.buildCan()

    // Outer group holds the fixed tilt (product-shot angle)
    // Inner canGroup spins on its local Y axis within that tilt
    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.x = BASE_TILT_X
    tiltGroup.rotation.z = BASE_TILT_Z
    tiltGroup.add(canGroup)

    scene.add(tiltGroup)

    // === LIGHTING — bright studio setup ===
    addStudioLighting(scene)

    // === MOUSE INTERACTION ===
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const handleMouseLeave = () => {
      mouseX = 0
      mouseY = 0
    }
    if (!reducedMotion) {
      mount.addEventListener('mousemove', handleMouseMove)
      mount.addEventListener('mouseleave', handleMouseLeave)
    }

    // === VISIBILITY GATING ===
    // The Our Story canvas otherwise renders every frame forever, even scrolled
    // far off-screen. An IntersectionObserver (generous rootMargin) marks the
    // mount in/out of view; when out, the RAF loop keeps running but skips the
    // expensive renderer.render. Pose (scroll-scrub rotation/scale, float, tilt)
    // is recomputed from scrollProgressRef + clock at the top of every frame, so
    // the first re-entered frame is already correct — no stale time to resume.
    let inView = true
    const io = new IntersectionObserver(
      (entries) => { inView = entries[0].isIntersecting },
      { rootMargin: '25%' },
    )
    io.observe(mount)

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    const renderStaticFrame = () => {
      // Reduced motion: front-facing at rest pose
      canGroup.rotation.set(0, 0, 0)
      tiltGroup.position.set(0, 0, 0)
      tiltGroup.rotation.x = BASE_TILT_X
      tiltGroup.rotation.z = BASE_TILT_Z
      if (scrollProgressRef) {
        const progress = scrollProgressRef.current
        canGroup.rotation.y = progress * 0.6
        tiltGroup.position.y = -progress * 0.5
      }
      renderer.render(scene, camera)
    }

    const scrubbing = scrollDriven && !!scrollProgressRef

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (scrubbing && scrollProgressRef) {
        // === SCROLL-SCRUBBED: rotation owned by scroll (autonomous spin OFF) ===
        const p = scrollProgressRef.current
        const eased = smoothstep(p)
        canGroup.rotation.y = SCRUB_START_ANGLE + eased * SCRUB_TOTAL_TURN
        // Scrubbed scale: enter -> mid (peak, face-front) -> exit.
        const scale =
          p < 0.5
            ? SCRUB_SCALE_ENTER + (SCRUB_SCALE_MID - SCRUB_SCALE_ENTER) * smoothstep(p / 0.5)
            : SCRUB_SCALE_MID + (SCRUB_SCALE_EXIT - SCRUB_SCALE_MID) * smoothstep((p - 0.5) / 0.5)
        canGroup.scale.setScalar(scale)
      } else {
        // Eased spin on local Y axis (stays in tilted frame)
        canGroup.rotation.y = easedTurntable(t, CYCLE_TIME, EASING_STRENGTH, 1)
      }

      // Float and jiggle on the outer tilt group (ambient life — always on)
      tiltGroup.position.y = Math.sin(t * 0.5) * 0.06
      tiltGroup.position.x = Math.sin(t * 0.3) * 0.015

      // Gentle rocking jiggle
      const jiggleX = Math.sin(t * 0.7) * 0.02
      const jiggleZ = Math.cos(t * 0.5) * 0.015

      // Mouse-responsive tilt on the outer group
      const targetTiltX = BASE_TILT_X + mouseY * 0.12 + jiggleX
      const targetTiltZ = BASE_TILT_Z + mouseX * -0.1 + jiggleZ
      tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.04
      tiltGroup.rotation.z += (targetTiltZ - tiltGroup.rotation.z) * 0.04

      // Legacy scroll drift (only when NOT scrubbing — keeps old behavior intact)
      if (scrollProgressRef && !scrubbing) {
        const progress = scrollProgressRef.current
        canGroup.rotation.y += progress * 0.6
        tiltGroup.position.y -= progress * 0.5
      }

      // Skip the GPU-heavy render when the canvas is scrolled out of view.
      if (inView) renderer.render(scene, camera)
    }

    if (reducedMotion) {
      renderStaticFrame()
    } else {
      animate()
    }

    // === RESIZE HANDLER ===
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      if (reducedMotion) renderStaticFrame()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (!reducedMotion) cancelAnimationFrame(animId)
      io.disconnect()
      window.removeEventListener('resize', handleResize)
      mount.removeEventListener('mousemove', handleMouseMove)
      mount.removeEventListener('mouseleave', handleMouseLeave)
      studioEnv.dispose()
      renderer.dispose()
      canResources.dispose()
      disposeCanTextures(textures)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [reducedMotion, scrollDriven])

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
        cursor: 'grab',
      }}
    />
  )
}

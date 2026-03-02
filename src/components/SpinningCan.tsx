'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function SpinningCan({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const width = mount.clientWidth
    const height = mount.clientHeight

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100)
    camera.position.set(0, 1.5, 7.5)
    camera.lookAt(0, 0, 0)

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    /* ═══════════════════════════════════════════════════
       ENVIRONMENT MAP — clean studio
       ═══════════════════════════════════════════════════ */
    const envC = document.createElement('canvas')
    envC.width = 2048; envC.height = 1024
    const ec = envC.getContext('2d')!

    const skyGrad = ec.createLinearGradient(0, 0, 0, 1024)
    skyGrad.addColorStop(0, '#c0d0e4')
    skyGrad.addColorStop(0.2, '#d8e4f0')
    skyGrad.addColorStop(0.4, '#eef3f9')
    skyGrad.addColorStop(0.5, '#fafcff')
    skyGrad.addColorStop(0.6, '#f0f4fa')
    skyGrad.addColorStop(0.8, '#dce6f0')
    skyGrad.addColorStop(1, '#b0c0d4')
    ec.fillStyle = skyGrad
    ec.fillRect(0, 0, 2048, 1024)

    function addPanel(x: number, y: number, w: number, h: number, intensity: number) {
      ec.save()
      ec.globalAlpha = intensity
      const g = ec.createLinearGradient(x - w / 2, y, x + w / 2, y)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(0.15, 'rgba(255,255,255,0.7)')
      g.addColorStop(0.5, '#ffffff')
      g.addColorStop(0.85, 'rgba(255,255,255,0.7)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ec.fillStyle = g
      ec.fillRect(x - w / 2, y - h / 2, w, h)
      ec.restore()
    }

    function addSoft(x: number, y: number, r: number, intensity: number) {
      ec.save()
      ec.globalAlpha = intensity
      const g = ec.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.4, 'rgba(255,255,255,0.5)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ec.fillStyle = g
      ec.beginPath()
      ec.arc(x, y, r, 0, Math.PI * 2)
      ec.fill()
      ec.restore()
    }

    addPanel(1350, 140, 350, 70, 0.6)
    addPanel(500, 180, 280, 55, 0.35)
    addPanel(1024, 480, 900, 35, 0.2)
    addSoft(850, 40, 400, 0.4)
    addSoft(1700, 300, 200, 0.15)
    addPanel(1024, 950, 1400, 50, 0.06)

    const envMap = new THREE.CanvasTexture(envC)
    envMap.mapping = THREE.EquirectangularReflectionMapping

    /* ═══════════════════════════════════════════════════
       TIN — LatheGeometry
       ═══════════════════════════════════════════════════ */
    const R = 1.48, lidR = 1.53, D = 0.82, lidH = 0.10
    const bev = 0.065, groove = 0.018, segs = 16

    function buildProfile() {
      const pts: THREE.Vector2[] = []
      function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number) {
        for (let i = 0; i <= n; i++) {
          const a = a0 + (a1 - a0) * (i / n)
          pts.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a)))
        }
      }
      const botY = -D / 2, topBody = D / 2, topLid = D / 2 + lidH

      pts.push(new THREE.Vector2(0, botY))
      pts.push(new THREE.Vector2(R - bev, botY))
      arc(R - bev, botY + bev, bev, -Math.PI / 2, 0, segs)
      pts.push(new THREE.Vector2(R, topBody - groove * 3))
      pts.push(new THREE.Vector2(R - groove * 0.6, topBody - groove * 1.5))
      pts.push(new THREE.Vector2(R - groove * 0.8, topBody - groove * 0.3))
      pts.push(new THREE.Vector2(R + groove * 0.3, topBody + 0.003))
      pts.push(new THREE.Vector2(lidR, topBody + 0.012))
      pts.push(new THREE.Vector2(lidR, topLid - bev))
      arc(lidR - bev, topLid - bev, bev, 0, Math.PI / 2, segs)
      pts.push(new THREE.Vector2(0, topLid))
      return pts
    }

    const latheGeo = new THREE.LatheGeometry(buildProfile(), 160)
    latheGeo.computeVertexNormals()

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.90, 0.93),
      roughness: 0.14,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
      envMap,
      envMapIntensity: 0.7,
      side: THREE.DoubleSide,
    })
    const latheMesh = new THREE.Mesh(latheGeo, bodyMat)
    const canGroup = new THREE.Group()
    canGroup.add(latheMesh)

    /* ── Textures ── */
    const loader = new THREE.TextureLoader()
    let texLoaded = 0
    const onTex = () => { texLoaded++; if (texLoaded >= 3) setLoaded(true) }
    const cfgTex = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    }

    /* ── TOP face (branding) ── */
    const lidTex = loader.load('/images/can-front-texture.png', onTex)
    cfgTex(lidTex)
    const topY = D / 2 + lidH
    const lidSize = lidR * 2 * 0.95
    const lidGeo = new THREE.PlaneGeometry(lidSize, lidSize)
    const lidMat = new THREE.MeshPhysicalMaterial({
      map: lidTex, roughness: 0.24, metalness: 0.0,
      clearcoat: 0.6, clearcoatRoughness: 0.12,
      envMap, envMapIntensity: 0.08,
      transparent: true, alphaTest: 0.01,
    })
    const lidMesh = new THREE.Mesh(lidGeo, lidMat)
    lidMesh.rotation.x = -Math.PI / 2
    lidMesh.rotation.z = Math.PI
    lidMesh.position.y = topY + 0.002
    canGroup.add(lidMesh)

    /* ── BOTTOM face (supplement facts) ── */
    const backTex = loader.load('/images/can-back-texture.png', onTex)
    cfgTex(backTex)
    const botY = -D / 2
    const backSize = R * 2 * 0.93
    const backGeo = new THREE.PlaneGeometry(backSize, backSize)
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTex, roughness: 0.24, metalness: 0.0,
      clearcoat: 0.6, clearcoatRoughness: 0.12,
      envMap, envMapIntensity: 0.08,
      transparent: true, alphaTest: 0.01,
    })
    const backMesh = new THREE.Mesh(backGeo, backMat)
    backMesh.rotation.x = Math.PI / 2
    backMesh.rotation.z = Math.PI
    backMesh.position.y = botY - 0.002
    canGroup.add(backMesh)

    /* ── Band texture ── */
    const bandTex = loader.load('/images/can-band-texture.png', onTex)
    cfgTex(bandTex)
    bandTex.wrapS = THREE.RepeatWrapping
    bandTex.wrapT = THREE.ClampToEdgeWrapping
    const bandGeo = new THREE.CylinderGeometry(R + 0.004, R + 0.004, D * 0.94, 160, 1, true)
    const bandMat = new THREE.MeshPhysicalMaterial({
      map: bandTex, roughness: 0.22, metalness: 0.04,
      clearcoat: 0.6, clearcoatRoughness: 0.15,
      envMap, envMapIntensity: 0.10,
      side: THREE.FrontSide,
    })
    const bandMesh = new THREE.Mesh(bandGeo, bandMat)
    canGroup.add(bandMesh)

    scene.add(canGroup)

    /* ══ LIGHTING ══ */
    scene.add(new THREE.AmbientLight(0xe8eef6, 0.3))

    const keyL = new THREE.DirectionalLight(0xfff2e0, 0.9)
    keyL.position.set(4, 5, 4)
    scene.add(keyL)

    const fillL = new THREE.DirectionalLight(0xd8e6f8, 0.4)
    fillL.position.set(-5, 2, 3)
    scene.add(fillL)

    const rimL = new THREE.DirectionalLight(0xffffff, 0.6)
    rimL.position.set(0, 2, -6)
    scene.add(rimL)

    const topL = new THREE.DirectionalLight(0xf0f4ff, 0.25)
    topL.position.set(0, 9, 0)
    scene.add(topL)

    const bounceL = new THREE.DirectionalLight(0xf0e8d8, 0.1)
    bounceL.position.set(0, -4, 2)
    scene.add(bounceL)

    /* ── Mouse ── */
    let mx = 0, my = 0
    const handleMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const handleLeave = () => { mx = 0; my = 0 }
    mount.addEventListener('mousemove', handleMove)
    mount.addEventListener('mouseleave', handleLeave)

    /* ═══════════════════════════════════════════════════
       ANIMATION — oscillating tilt to show both faces
       ═══════════════════════════════════════════════════ */
    let animId: number
    const clock = new THREE.Clock()
    const SPIN_SPEED = 0.35
    const TILT_RANGE = 0.5
    const TILT_CENTER = -0.1

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      canGroup.rotation.y = t * SPIN_SPEED
      const tiltPhase = t * SPIN_SPEED
      canGroup.rotation.x = TILT_CENTER + Math.sin(tiltPhase) * TILT_RANGE
      canGroup.position.y = Math.sin(t * 0.4) * 0.025

      canGroup.rotation.x += my * 0.05
      canGroup.rotation.z = mx * -0.03

      renderer.render(scene, camera)
    }
    animate()

    /* ── Resize ── */
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      mount.removeEventListener('mousemove', handleMove)
      mount.removeEventListener('mouseleave', handleLeave)
      renderer.dispose()
      ;[latheGeo, lidGeo, backGeo, bandGeo].forEach(g => g.dispose())
      ;[bodyMat, lidMat, backMat, bandMat].forEach(m => m.dispose())
      lidTex?.dispose(); backTex?.dispose(); bandTex?.dispose(); envMap?.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

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

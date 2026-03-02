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

    /* ── Camera — product-photo angle ── */
    const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 100)
    camera.position.set(0, 3.5, 7.0)
    camera.lookAt(0, -0.05, 0)

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
    renderer.toneMappingExposure = 1.0
    mount.appendChild(renderer.domElement)

    /* ═══════════════════════════════════════════════════
       PREMIUM ENVIRONMENT MAP — studio HDRI simulation
       ═══════════════════════════════════════════════════ */
    const envC = document.createElement('canvas')
    envC.width = 2048; envC.height = 1024
    const ec = envC.getContext('2d')!

    // Base: neutral studio grey gradient
    const skyGrad = ec.createLinearGradient(0, 0, 0, 1024)
    skyGrad.addColorStop(0, '#b8c8dc')
    skyGrad.addColorStop(0.15, '#d0dcea')
    skyGrad.addColorStop(0.35, '#e8eff6')
    skyGrad.addColorStop(0.5, '#f8fbff')
    skyGrad.addColorStop(0.55, '#f0f4fa')
    skyGrad.addColorStop(0.7, '#dce6f0')
    skyGrad.addColorStop(0.85, '#c8d4e2')
    skyGrad.addColorStop(1, '#a8b8cc')
    ec.fillStyle = skyGrad
    ec.fillRect(0, 0, 2048, 1024)

    // Sharp studio light panels
    function addPanelLight(x: number, y: number, w: number, h: number, intensity: number) {
      ec.save()
      ec.globalAlpha = intensity
      const g = ec.createLinearGradient(x - w/2, y, x + w/2, y)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(0.2, 'rgba(255,255,255,0.8)')
      g.addColorStop(0.5, '#ffffff')
      g.addColorStop(0.8, 'rgba(255,255,255,0.8)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ec.fillStyle = g
      ec.fillRect(x - w/2, y - h/2, w, h)
      ec.restore()
    }

    function addSoftLight(x: number, y: number, rx: number, ry: number, intensity: number, color?: string) {
      ec.save()
      ec.globalAlpha = intensity
      const g = ec.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      g.addColorStop(0, color || '#ffffff')
      g.addColorStop(0.3, color ? color.replace(')', ',0.6)').replace('rgb', 'rgba') : 'rgba(255,255,255,0.6)')
      g.addColorStop(0.7, 'rgba(255,255,255,0.15)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ec.fillStyle = g
      ec.beginPath()
      ec.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
      ec.fill()
      ec.restore()
    }

    // Key light panel (upper right)
    addPanelLight(1400, 160, 300, 80, 0.55)
    // Fill panel (upper left)
    addPanelLight(400, 200, 250, 60, 0.3)
    // Rim panel (behind)
    addPanelLight(1024, 500, 800, 40, 0.25)
    // Top overhead softbox
    addSoftLight(900, 50, 500, 100, 0.35)
    // Warm side accent
    addSoftLight(1700, 350, 200, 150, 0.15, 'rgb(255,248,230)')
    // Cool side accent
    addSoftLight(200, 400, 180, 120, 0.1, 'rgb(220,230,248)')
    // Ground bounce
    addPanelLight(1024, 900, 1200, 80, 0.08)

    const envMap = new THREE.CanvasTexture(envC)
    envMap.mapping = THREE.EquirectangularReflectionMapping

    /* ═══════════════════════════════════════════════════
       TIN PROFILE — LatheGeometry from cross-section
       ═══════════════════════════════════════════════════ */
    const R      = 1.48
    const lidR   = 1.53
    const D      = 0.82
    const lidH   = 0.10
    const bev    = 0.065
    const groove = 0.018
    const segments = 16

    function buildProfile() {
      const pts: THREE.Vector2[] = []

      function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number) {
        for (let i = 0; i <= n; i++) {
          const a = a0 + (a1 - a0) * (i / n)
          pts.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a)))
        }
      }

      const botY = -D / 2
      const topBody = D / 2
      const topLid = D / 2 + lidH

      // 1. Center of bottom
      pts.push(new THREE.Vector2(0, botY))
      // 2. Bottom face (flat)
      pts.push(new THREE.Vector2(R - bev, botY))
      // 3. Bottom corner
      arc(R - bev, botY + bev, bev, -Math.PI / 2, 0, segments)
      // 4. Body wall
      pts.push(new THREE.Vector2(R, topBody - groove * 3))
      // 5. Seam groove
      pts.push(new THREE.Vector2(R - groove * 0.6, topBody - groove * 1.5))
      pts.push(new THREE.Vector2(R - groove * 0.8, topBody - groove * 0.3))
      pts.push(new THREE.Vector2(R + groove * 0.3, topBody + 0.003))
      // 6. Lid shoulder
      pts.push(new THREE.Vector2(lidR, topBody + 0.012))
      pts.push(new THREE.Vector2(lidR, topLid - bev))
      // 7. Lid top corner
      arc(lidR - bev, topLid - bev, bev, 0, Math.PI / 2, segments)
      // 8. Lid top surface
      pts.push(new THREE.Vector2(0, topLid))

      return pts
    }

    const profile = buildProfile()
    const latheGeo = new THREE.LatheGeometry(profile, 160)
    latheGeo.computeVertexNormals()

    /* ═══════════════════════════════════════════════════
       MATERIALS
       ═══════════════════════════════════════════════════ */
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.90, 0.93),
      roughness: 0.14,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
      envMap,
      envMapIntensity: 0.75,
      side: THREE.DoubleSide,
    })
    const latheMesh = new THREE.Mesh(latheGeo, bodyMat)
    const canGroup = new THREE.Group()
    canGroup.add(latheMesh)

    /* ── Texture loading ── */
    const loader = new THREE.TextureLoader()
    let texLoaded = 0
    const onTex = () => { texLoaded++; if (texLoaded >= 2) setLoaded(true) }

    const configTex = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    }

    /* ── Lid top face ── */
    const lidTex = loader.load('/images/can-front-texture.png', onTex)
    configTex(lidTex)

    const topY = D / 2 + lidH
    const lidFaceSize = lidR * 2 * 0.95
    const lidFaceGeo = new THREE.PlaneGeometry(lidFaceSize, lidFaceSize)
    const lidFaceMat = new THREE.MeshPhysicalMaterial({
      map: lidTex,
      roughness: 0.22,
      metalness: 0.0,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      envMap,
      envMapIntensity: 0.08,
      transparent: true,
      alphaTest: 0.01,
    })
    const lidFaceMesh = new THREE.Mesh(lidFaceGeo, lidFaceMat)
    lidFaceMesh.rotation.x = -Math.PI / 2
    lidFaceMesh.rotation.z = Math.PI
    lidFaceMesh.position.y = topY + 0.002
    canGroup.add(lidFaceMesh)

    /* ── Body band texture ── */
    const bandTex = loader.load('/images/can-band-texture.png', onTex)
    configTex(bandTex)
    bandTex.wrapS = THREE.RepeatWrapping
    bandTex.wrapT = THREE.ClampToEdgeWrapping

    const bandGeo = new THREE.CylinderGeometry(R + 0.004, R + 0.004, D * 0.94, 160, 1, true)
    const bandMat = new THREE.MeshPhysicalMaterial({
      map: bandTex,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMap,
      envMapIntensity: 0.10,
      transparent: false,
      side: THREE.FrontSide,
    })
    const bandMesh = new THREE.Mesh(bandGeo, bandMat)
    bandMesh.position.y = 0
    canGroup.add(bandMesh)

    /* ── Ground shadow ── */
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x445566,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = -D / 2 - 0.08
    shadowMesh.scale.set(1, 0.5, 1)
    scene.add(shadowMesh)

    /* ── Reflection plane ── */
    const reflGeo = new THREE.PlaneGeometry(6, 6)
    const reflMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.92, 0.94, 0.97),
      roughness: 0.7,
      metalness: 0.0,
      transparent: true,
      opacity: 0.25,
      envMap,
      envMapIntensity: 0.05,
    })
    const reflMesh = new THREE.Mesh(reflGeo, reflMat)
    reflMesh.rotation.x = -Math.PI / 2
    reflMesh.position.y = -D / 2 - 0.06
    scene.add(reflMesh)

    /* ── Position ── */
    canGroup.rotation.x = -0.14
    canGroup.rotation.z = 0.02
    scene.add(canGroup)

    /* ══ LIGHTING — 6-point studio ══ */
    scene.add(new THREE.AmbientLight(0xe8eef6, 0.25))

    const keyLight = new THREE.DirectionalLight(0xfff2e0, 0.95)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xd8e6f8, 0.4)
    fillLight.position.set(-5, 2.5, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.65)
    rimLight.position.set(0, 3, -6)
    scene.add(rimLight)

    const topKick = new THREE.DirectionalLight(0xf0f4ff, 0.22)
    topKick.position.set(-1, 9, 0)
    scene.add(topKick)

    const bounceLight = new THREE.DirectionalLight(0xf0e8d8, 0.08)
    bounceLight.position.set(0, -3, 2)
    scene.add(bounceLight)

    const accentLight = new THREE.DirectionalLight(0xe0eaff, 0.18)
    accentLight.position.set(-6, 1, -1)
    scene.add(accentLight)

    /* ── Mouse interaction ── */
    let mx = 0, my = 0
    const handleMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const handleLeave = () => { mx = 0; my = 0 }
    mount.addEventListener('mousemove', handleMove)
    mount.addEventListener('mouseleave', handleLeave)

    /* ── Animation ── */
    let animId: number
    const clock = new THREE.Clock()
    const BASE_X = -0.14
    const BASE_Z = 0.02

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      canGroup.rotation.y = t * 0.32
      canGroup.position.y = Math.sin(t * 0.4) * 0.025

      canGroup.rotation.x += (BASE_X + my * 0.08 - canGroup.rotation.x) * 0.02
      canGroup.rotation.z += (BASE_Z - mx * 0.05 - canGroup.rotation.z) * 0.02

      // Shadow follows can
      shadowMesh.position.x = canGroup.position.x
      shadowMesh.position.z = canGroup.position.z
      const sh = 1 + canGroup.position.y * 0.15
      shadowMesh.scale.set(sh, 0.5 * sh, sh)
      ;(shadowMesh.material as THREE.MeshBasicMaterial).opacity = 0.12 - canGroup.position.y * 0.02

      renderer.render(scene, camera)
    }
    animate()

    /* ── Resize ── */
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      mount.removeEventListener('mousemove', handleMove)
      mount.removeEventListener('mouseleave', handleLeave)
      renderer.dispose()
      ;[latheGeo, lidFaceGeo, bandGeo, shadowGeo, reflGeo].forEach(g => g.dispose())
      ;[bodyMat, lidFaceMat, bandMat, shadowMat, reflMat].forEach(m => m.dispose())
      lidTex?.dispose()
      bandTex?.dispose()
      envMap?.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
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

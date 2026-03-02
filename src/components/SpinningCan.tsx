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

    /* ── Camera: product-photo angle — higher to show lid clearly ── */
    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100)
    camera.position.set(0, 4.2, 6.8)
    camera.lookAt(0, -0.15, 0)

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.95
    renderer.physicallyCorrectLights = true
    mount.appendChild(renderer.domElement)

    /* ── Soft environment map for reflections ── */
    const eC = document.createElement('canvas')
    eC.width = 1024; eC.height = 512
    const eCtx = eC.getContext('2d')!
    const eGrad = eCtx.createLinearGradient(0, 0, 0, 512)
    eGrad.addColorStop(0, '#dce8f4')
    eGrad.addColorStop(0.35, '#f0f5fb')
    eGrad.addColorStop(0.5, '#ffffff')
    eGrad.addColorStop(0.65, '#edf2f8')
    eGrad.addColorStop(1, '#c8d8e8')
    eCtx.fillStyle = eGrad
    eCtx.fillRect(0, 0, 1024, 512)
    eCtx.globalAlpha = 0.12
    eCtx.fillStyle = '#fff'
    eCtx.beginPath(); eCtx.arc(380, 100, 180, 0, Math.PI * 2); eCtx.fill()
    eCtx.beginPath(); eCtx.arc(750, 150, 120, 0, Math.PI * 2); eCtx.fill()
    eCtx.globalAlpha = 1
    const envMap = new THREE.CanvasTexture(eC)
    envMap.mapping = THREE.EquirectangularReflectionMapping

    /* ── Can dimensions (matching real Aire tin) ── */
    const R = 1.50
    const D = 0.82
    const lidR = R + 0.045
    const lidH = 0.09
    const bev = 0.055

    const canGroup = new THREE.Group()
    const loader = new THREE.TextureLoader()

    let texLoaded = 0
    const onTex = () => { texLoaded++; if (texLoaded >= 2) setLoaded(true) }

    const configTex = (tex: THREE.Texture) => {
      tex.encoding = THREE.sRGBEncoding
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    }

    /* ── 1. LID TOP (PlaneGeometry — avoids radial UV distortion) ── */
    const lidTex = loader.load('/images/can-front-texture.png', onTex)
    configTex(lidTex)

    const lidSize = lidR * 2
    const lidGeo = new THREE.PlaneGeometry(lidSize, lidSize)
    const lidMat = new THREE.MeshPhysicalMaterial({
      map: lidTex,
      roughness: 0.28,
      metalness: 0.0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
      envMap,
      envMapIntensity: 0.12,
      transparent: true,
      alphaTest: 0.01,
    })
    const lidMesh = new THREE.Mesh(lidGeo, lidMat)
    lidMesh.rotation.x = -Math.PI / 2
    lidMesh.rotation.z = Math.PI
    lidMesh.position.y = D / 2 + lidH + 0.001
    canGroup.add(lidMesh)

    /* ── 2. LID RIM (vertical side) ── */
    const lidRimGeo = new THREE.CylinderGeometry(lidR, lidR, lidH, 128, 1, true)
    const lidRimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.93, 0.94, 0.96),
      roughness: 0.15,
      metalness: 0.06,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      envMap,
      envMapIntensity: 0.35,
    })
    const lidRimMesh = new THREE.Mesh(lidRimGeo, lidRimMat)
    lidRimMesh.position.y = D / 2 + lidH / 2
    canGroup.add(lidRimMesh)

    /* ── 3. LID BEVEL (rounded top edge) ── */
    const bevGeo = new THREE.TorusGeometry(lidR - bev * 0.4, bev, 24, 128)
    const bevMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.92, 0.93, 0.95),
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMap,
      envMapIntensity: 0.45,
    })
    const bevMesh = new THREE.Mesh(bevGeo, bevMat)
    bevMesh.rotation.x = Math.PI / 2
    bevMesh.position.y = D / 2 + lidH
    canGroup.add(bevMesh)

    /* ── 4. LID-BODY SEAM ── */
    const seamGeo = new THREE.TorusGeometry(R + 0.008, 0.018, 16, 128)
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.80, 0.82, 0.86),
      roughness: 0.22,
      metalness: 0.12,
      envMap,
      envMapIntensity: 0.25,
    })
    const seamMesh = new THREE.Mesh(seamGeo, seamMat)
    seamMesh.rotation.x = Math.PI / 2
    seamMesh.position.y = D / 2 + 0.002
    canGroup.add(seamMesh)

    /* ── 5. BODY WALL (band texture) ── */
    const bandTex = loader.load('/images/can-band-texture.png', onTex)
    configTex(bandTex)
    bandTex.wrapS = THREE.RepeatWrapping
    bandTex.wrapT = THREE.ClampToEdgeWrapping

    const bodyGeo = new THREE.CylinderGeometry(R, R, D, 128, 1, true)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      map: bandTex,
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
      envMap,
      envMapIntensity: 0.15,
      side: THREE.DoubleSide,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    canGroup.add(bodyMesh)

    /* ── 6. BOTTOM CAP ── */
    const bottomGeo = new THREE.CircleGeometry(R, 128)
    const bottomMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.87, 0.89, 0.92),
      roughness: 0.35,
      metalness: 0.04,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMap,
      envMapIntensity: 0.1,
    })
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat)
    bottomMesh.rotation.x = Math.PI / 2
    bottomMesh.position.y = -D / 2
    canGroup.add(bottomMesh)

    /* ── 7. BOTTOM EDGE RING ── */
    const bEdgeGeo = new THREE.TorusGeometry(R + 0.003, 0.022, 16, 128)
    const bEdgeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.86, 0.88, 0.91),
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.75,
      clearcoatRoughness: 0.1,
      envMap,
      envMapIntensity: 0.3,
    })
    const bEdgeMesh = new THREE.Mesh(bEdgeGeo, bEdgeMat)
    bEdgeMesh.rotation.x = Math.PI / 2
    bEdgeMesh.position.y = -D / 2
    canGroup.add(bEdgeMesh)

    /* ── 8. Inner lid shadow ── */
    const innerShadowGeo = new THREE.RingGeometry(R - 0.12, R, 128)
    const innerShadowMat = new THREE.MeshBasicMaterial({
      color: 0x667788,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    })
    const innerShadowMesh = new THREE.Mesh(innerShadowGeo, innerShadowMat)
    innerShadowMesh.rotation.x = -Math.PI / 2
    innerShadowMesh.position.y = D / 2 - 0.01
    canGroup.add(innerShadowMesh)

    /* ── Position ── */
    canGroup.rotation.x = -0.18
    canGroup.rotation.z = 0.025
    scene.add(canGroup)

    /* ══ LIGHTING — Studio setup ══ */
    scene.add(new THREE.AmbientLight(0xeef2f8, 0.35))

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 0.95)
    keyLight.position.set(4, 5.5, 4.5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xdce8f8, 0.4)
    fillLight.position.set(-4.5, 2.5, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55)
    rimLight.position.set(0.5, 2, -5.5)
    scene.add(rimLight)

    const topKick = new THREE.DirectionalLight(0xf4f6ff, 0.2)
    topKick.position.set(-1, 8, 1)
    scene.add(topKick)

    const bounceLight = new THREE.DirectionalLight(0xe8ddd0, 0.08)
    bounceLight.position.set(0, -3, 2)
    scene.add(bounceLight)

    const accentLight = new THREE.PointLight(0xf0f4ff, 0.15, 12)
    accentLight.position.set(3, 0.5, 2)
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
    const BASE_X = -0.18
    const BASE_Z = 0.025

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      canGroup.rotation.y = t * 0.35
      canGroup.position.y = Math.sin(t * 0.45) * 0.035

      canGroup.rotation.x += (BASE_X + my * 0.12 - canGroup.rotation.x) * 0.025
      canGroup.rotation.z += (BASE_Z - mx * 0.08 - canGroup.rotation.z) * 0.025

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
      // Dispose geometries
      ;[lidGeo, lidRimGeo, bevGeo, seamGeo, bodyGeo, bottomGeo, bEdgeGeo, innerShadowGeo].forEach(g => g.dispose())
      // Dispose materials
      ;[lidMat, lidRimMat, bevMat, seamMat, bodyMat, bottomMat, bEdgeMat, innerShadowMat].forEach(m => m.dispose())
      // Dispose textures
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

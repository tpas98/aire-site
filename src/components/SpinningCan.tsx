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

    // Camera — straight on, eye level with the upright tin face
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
    camera.position.set(0, 0, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    mount.appendChild(renderer.domElement)

    // === TIN DIMENSIONS ===
    // Flat wide tin oriented as a coin (circular face toward camera)
    const tinRadius = 1.4
    const tinDepth = 0.547
    const lidOverhang = 0.0
    const lidThickness = 0.02

    const canGroup = new THREE.Group()

    const textureLoader = new THREE.TextureLoader()
    let texturesLoaded = 0
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= 3) setLoaded(true)
    }

    // === FRONT FACE (Aire branding) ===
    const frontTexture = textureLoader.load('/images/can-front-texture.png', onTextureLoad)
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter
    frontTexture.magFilter = THREE.LinearFilter
    frontTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const faceSize = (tinRadius + lidOverhang) * 2
    const frontGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.25,
      metalness: 0.04,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transparent: true,
      side: THREE.FrontSide,
    })
    const frontMesh = new THREE.Mesh(frontGeo, frontMat)
    frontMesh.position.z = tinDepth / 2 + lidThickness + 0.001
    canGroup.add(frontMesh)

    // === BACK FACE (Supplement Facts) ===
    const backTexture = textureLoader.load('/images/can-back-texture.png', onTextureLoad)
    backTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.minFilter = THREE.LinearMipmapLinearFilter
    backTexture.magFilter = THREE.LinearFilter
    backTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const backGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.25,
      metalness: 0.04,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transparent: true,
      side: THREE.FrontSide,
    })
    const backMesh = new THREE.Mesh(backGeo, backMat)
    backMesh.rotation.y = Math.PI
    backMesh.position.z = -(tinDepth / 2 + 0.001)
    canGroup.add(backMesh)

    // === EDGE / BODY (thin rim with band texture) ===
    const edgeGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, tinDepth, 64, 1, true)
    const bandTexture = textureLoader.load('/images/can-band-texture.png', onTextureLoad)
    bandTexture.colorSpace = THREE.SRGBColorSpace
    bandTexture.wrapS = THREE.RepeatWrapping
    bandTexture.wrapT = THREE.ClampToEdgeWrapping
    bandTexture.minFilter = THREE.LinearMipmapLinearFilter
    bandTexture.magFilter = THREE.LinearFilter
    bandTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const edgeMat = new THREE.MeshPhysicalMaterial({
      map: bandTexture,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide,
    })
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat)
    // Rotate cylinder from Y-axis to Z-axis (circular face on Z)
    edgeMesh.rotation.x = Math.PI / 2
    canGroup.add(edgeMesh)

    // === LID RIM (slightly larger ring on front side) ===
    const lidRadius = tinRadius + lidOverhang
    const lidRimGeo = new THREE.CylinderGeometry(lidRadius, lidRadius, lidThickness, 64)
    const rimColor = new THREE.Color(0.9, 0.92, 0.94)
    const lidRimMat = new THREE.MeshPhysicalMaterial({
      color: rimColor,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
    })
    const lidRimMesh = new THREE.Mesh(lidRimGeo, lidRimMat)
    lidRimMesh.rotation.x = Math.PI / 2
    lidRimMesh.position.z = tinDepth / 2 + lidThickness / 2
    canGroup.add(lidRimMesh)

    // === SEAM RING (where lid meets body) ===
    const seamGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.012, 16, 64)
    const seamColor = new THREE.Color(0.85, 0.87, 0.9)
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: seamColor,
      roughness: 0.2,
      metalness: 0.15,
    })
    const seamMesh = new THREE.Mesh(seamGeo, seamMat)
    seamMesh.position.z = tinDepth / 2
    canGroup.add(seamMesh)

    // === BOTTOM RIM ===
    const bottomRimGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.01, 16, 64)
    const bottomRimMesh = new THREE.Mesh(bottomRimGeo, seamMat)
    bottomRimMesh.position.z = -tinDepth / 2
    canGroup.add(bottomRimMesh)

    // === BOTTOM CAP (back of tin) ===
    const bottomCapGeo = new THREE.CircleGeometry(tinRadius, 64)
    const bottomCapMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.91, 0.93),
      roughness: 0.35,
      metalness: 0.06,
    })
    const bottomCapMesh = new THREE.Mesh(bottomCapGeo, bottomCapMat)
    bottomCapMesh.rotation.y = Math.PI
    bottomCapMesh.position.z = -tinDepth / 2
    canGroup.add(bottomCapMesh)

    // Slight tilt so it doesn't look perfectly flat
    canGroup.rotation.x = 0.08
    canGroup.rotation.z = -0.03

    scene.add(canGroup)

    // === LIGHTING — bright studio setup to match product renders ===
    scene.add(new THREE.AmbientLight(0xf4f7fa, 0.7))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(4, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xeaf2f8, 0.65)
    fillLight.position.set(-4, 2, 4)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
    rimLight.position.set(0, 2, -5)
    scene.add(rimLight)

    const topLight = new THREE.DirectionalLight(0xf8f8ff, 0.3)
    topLight.position.set(0, 6, 2)
    scene.add(topLight)

    const bounceLight = new THREE.DirectionalLight(0xe0ecf4, 0.2)
    bounceLight.position.set(0, -3, 3)
    scene.add(bounceLight)

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
    mount.addEventListener('mousemove', handleMouseMove)
    mount.addEventListener('mouseleave', handleMouseLeave)

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()
    const baseTiltX = 0.08
    const baseTiltZ = -0.03

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Coin-spin rotation showing front and back
      canGroup.rotation.y = t * 0.5

      // Gentle floating
      canGroup.position.y = Math.sin(t * 0.4) * 0.025

      // Mouse-responsive tilt
      const targetTiltX = baseTiltX + mouseY * 0.12
      const targetTiltZ = baseTiltZ + mouseX * -0.1
      canGroup.rotation.x += (targetTiltX - canGroup.rotation.x) * 0.04
      canGroup.rotation.z += (targetTiltZ - canGroup.rotation.z) * 0.04

      renderer.render(scene, camera)
    }
    animate()

    // === RESIZE HANDLER ===
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      mount.removeEventListener('mousemove', handleMouseMove)
      mount.removeEventListener('mouseleave', handleMouseLeave)
      renderer.dispose()
      frontGeo.dispose()
      backGeo.dispose()
      edgeGeo.dispose()
      lidRimGeo.dispose()
      seamGeo.dispose()
      bottomRimGeo.dispose()
      bottomCapGeo.dispose()
      frontMat.dispose()
      backMat.dispose()
      edgeMat.dispose()
      lidRimMat.dispose()
      seamMat.dispose()
      bottomCapMat.dispose()
      frontTexture?.dispose()
      backTexture?.dispose()
      bandTexture?.dispose()
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

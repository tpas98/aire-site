'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function SpinningCan({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()

    const width = mount.clientWidth
    const height = mount.clientHeight

    // Camera — elevated angle to show lid + side of flat tin
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100)
    camera.position.set(0, 3.2, 5.5)
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
    renderer.toneMappingExposure = 1.0
    mount.appendChild(renderer.domElement)

    // Can dimensions — flat wide tin (like a mint/snus tin)
    const canRadius = 1.1
    const canHeight = 0.5
    const lidOverhang = 0.04
    const lidThickness = 0.06

    const canBodyColor = new THREE.Color(0.88, 0.91, 0.93)
    const rimColor = new THREE.Color(0.9, 0.92, 0.94)
    const seamColor = new THREE.Color(0.85, 0.87, 0.9)

    // Texture loader
    const textureLoader = new THREE.TextureLoader()
    let bandTexture: THREE.Texture | null = null
    let lidTexture: THREE.Texture | null = null
    let texturesReady = 0

    const onTextureLoad = () => {
      texturesReady++
      if (texturesReady >= 2) setLoaded(true)
    }

    const canGroup = new THREE.Group()

    // === CAN BODY (cylinder side — uses band texture) ===
    const bodyGeo = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 64, 1, true)
    bandTexture = textureLoader.load('/images/can-band-texture.png', onTextureLoad)
    bandTexture.colorSpace = THREE.SRGBColorSpace
    bandTexture.wrapS = THREE.RepeatWrapping
    bandTexture.wrapT = THREE.ClampToEdgeWrapping
    bandTexture.minFilter = THREE.LinearMipmapLinearFilter
    bandTexture.magFilter = THREE.LinearFilter
    bandTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const bodyMat = new THREE.MeshPhysicalMaterial({
      map: bandTexture,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide,
    })
    canGroup.add(new THREE.Mesh(bodyGeo, bodyMat))

    // === BOTTOM CAP ===
    const bottomGeo = new THREE.CircleGeometry(canRadius, 64)
    const bottomMat = new THREE.MeshPhysicalMaterial({
      color: canBodyColor,
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.3,
    })
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat)
    bottomMesh.rotation.x = Math.PI / 2
    bottomMesh.position.y = -canHeight / 2
    canGroup.add(bottomMesh)

    // === LID TOP (PlaneGeometry for perfect flat UV mapping) ===
    const lidRadius = canRadius + lidOverhang
    const lidSize = lidRadius * 2
    lidTexture = textureLoader.load('/images/can-lid-texture.png', onTextureLoad)
    lidTexture.colorSpace = THREE.SRGBColorSpace
    lidTexture.minFilter = THREE.LinearMipmapLinearFilter
    lidTexture.magFilter = THREE.LinearFilter
    lidTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const lidTopGeo = new THREE.PlaneGeometry(lidSize, lidSize)
    const lidTopMat = new THREE.MeshPhysicalMaterial({
      map: lidTexture,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      transparent: true,
    })
    const lidTopMesh = new THREE.Mesh(lidTopGeo, lidTopMat)
    lidTopMesh.rotation.x = -Math.PI / 2
    lidTopMesh.position.y = canHeight / 2 + lidThickness + 0.001
    canGroup.add(lidTopMesh)

    // === LID SIDE (rim) ===
    const lidSideGeo = new THREE.CylinderGeometry(lidRadius, lidRadius, lidThickness, 64)
    const lidSideMat = new THREE.MeshPhysicalMaterial({
      color: rimColor,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.6,
    })
    const lidSideMesh = new THREE.Mesh(lidSideGeo, lidSideMat)
    lidSideMesh.position.y = canHeight / 2 + lidThickness / 2
    canGroup.add(lidSideMesh)

    // === SEAM RING (where lid meets body) ===
    const seamGeo = new THREE.TorusGeometry(canRadius + 0.01, 0.015, 16, 64)
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: seamColor,
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.5,
    })
    const seamMesh = new THREE.Mesh(seamGeo, seamMat)
    seamMesh.rotation.x = Math.PI / 2
    seamMesh.position.y = canHeight / 2
    canGroup.add(seamMesh)

    // === BOTTOM RIM ===
    const bottomRimGeo = new THREE.TorusGeometry(canRadius + 0.005, 0.012, 16, 64)
    const bottomRimMesh = new THREE.Mesh(bottomRimGeo, seamMat)
    bottomRimMesh.rotation.x = Math.PI / 2
    bottomRimMesh.position.y = -canHeight / 2
    canGroup.add(bottomRimMesh)

    scene.add(canGroup)

    // === LIGHTING — studio-quality 5-light setup ===
    const ambient = new THREE.AmbientLight(0xf0f4f8, 0.5)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 0.95)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe0eef6, 0.55)
    fillLight.position.set(-5, 3, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.45)
    rimLight.position.set(0, 4, -5)
    scene.add(rimLight)

    const topLight = new THREE.DirectionalLight(0xf8f8ff, 0.15)
    topLight.position.set(0, 8, 0)
    scene.add(topLight)

    const bounceLight = new THREE.DirectionalLight(0xd0e0f0, 0.15)
    bounceLight.position.set(0, -3, 2)
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
    const baseRotationX = -0.05

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth continuous Y rotation
      canGroup.rotation.y = t * 0.4

      // Gentle floating
      canGroup.position.y = Math.sin(t * 0.5) * 0.03

      // Mouse-responsive tilt (subtle)
      const targetTiltX = baseRotationX + mouseY * 0.1
      const targetTiltZ = mouseX * -0.08
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
      bodyGeo.dispose()
      bottomGeo.dispose()
      lidTopGeo.dispose()
      lidSideGeo.dispose()
      seamGeo.dispose()
      bottomRimGeo.dispose()
      bodyMat.dispose()
      bottomMat.dispose()
      lidTopMat.dispose()
      lidSideMat.dispose()
      seamMat.dispose()
      bandTexture?.dispose()
      lidTexture?.dispose()
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

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
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
    camera.position.set(0, 1.8, 6.5)
    camera.lookAt(0, 0.3, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    // Can dimensions (proportional to a real pouch can)
    const canRadius = 1.0
    const canHeight = 0.65
    const lidThickness = 0.08

    // Materials
    const canBodyColor = new THREE.Color(0.85, 0.9, 0.93)    // light sage
    const navyColor = new THREE.Color(0.1, 0.18, 0.29)       // navy band
    const accentColor = new THREE.Color(0.35, 0.61, 0.75)    // accent blue
    const rimColor = new THREE.Color(0.92, 0.94, 0.96)       // white rim

    // Texture loader
    const textureLoader = new THREE.TextureLoader()
    let bodyTexture: THREE.Texture | null = null
    let lidTexture: THREE.Texture | null = null

    // Create can group
    const canGroup = new THREE.Group()

    // === CAN BODY (cylinder) ===
    const bodyGeo = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 64, 1, true)

    // Load body texture
    bodyTexture = textureLoader.load('/images/can-body-texture.png', () => {
      bodyTexture!.colorSpace = THREE.SRGBColorSpace
      bodyTexture!.wrapS = THREE.RepeatWrapping
      bodyTexture!.wrapT = THREE.ClampToEdgeWrapping
      setLoaded(true)
    })

    const bodyMat = new THREE.MeshPhysicalMaterial({
      map: bodyTexture,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    canGroup.add(bodyMesh)

    // === BOTTOM CAP ===
    const bottomGeo = new THREE.CircleGeometry(canRadius, 64)
    const bottomMat = new THREE.MeshPhysicalMaterial({
      color: canBodyColor,
      roughness: 0.4,
      metalness: 0.05,
    })
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat)
    bottomMesh.rotation.x = Math.PI / 2
    bottomMesh.position.y = -canHeight / 2
    canGroup.add(bottomMesh)

    // === LID (slightly larger, sits on top) ===
    const lidRadius = canRadius + 0.03
    const lidGeo = new THREE.CylinderGeometry(lidRadius, lidRadius, lidThickness, 64)

    // Load lid texture
    lidTexture = textureLoader.load('/images/can-lid-texture.png', () => {
      lidTexture!.colorSpace = THREE.SRGBColorSpace
    })

    const lidTopGeo = new THREE.CircleGeometry(lidRadius, 64)
    const lidTopMat = new THREE.MeshPhysicalMaterial({
      map: lidTexture,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
    })
    const lidTopMesh = new THREE.Mesh(lidTopGeo, lidTopMat)
    lidTopMesh.rotation.x = -Math.PI / 2
    lidTopMesh.position.y = canHeight / 2 + lidThickness
    canGroup.add(lidTopMesh)

    // Lid side (rim)
    const lidSideMat = new THREE.MeshPhysicalMaterial({
      color: rimColor,
      roughness: 0.3,
      metalness: 0.08,
      clearcoat: 0.5,
    })
    const lidSideMesh = new THREE.Mesh(lidGeo, lidSideMat)
    lidSideMesh.position.y = canHeight / 2 + lidThickness / 2
    canGroup.add(lidSideMesh)

    // === RIM RING (decorative ring where lid meets body) ===
    const rimGeo = new THREE.TorusGeometry(canRadius + 0.01, 0.02, 16, 64)
    const rimMat = new THREE.MeshPhysicalMaterial({
      color: rimColor,
      roughness: 0.2,
      metalness: 0.15,
    })
    const rimMesh = new THREE.Mesh(rimGeo, rimMat)
    rimMesh.rotation.x = Math.PI / 2
    rimMesh.position.y = canHeight / 2
    canGroup.add(rimMesh)

    // Slight tilt for more dynamic viewing angle
    canGroup.rotation.x = -0.15
    scene.add(canGroup)

    // === LIGHTING ===
    // Soft ambient
    const ambient = new THREE.AmbientLight(0xf0f4f8, 0.6)
    scene.add(ambient)

    // Key light (warm, from upper right)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    // Fill light (cool, from left)
    const fillLight = new THREE.DirectionalLight(0xe0eef6, 0.6)
    fillLight.position.set(-4, 2, 3)
    scene.add(fillLight)

    // Rim light (behind and above)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
    rimLight.position.set(0, 3, -4)
    scene.add(rimLight)

    // Subtle bottom bounce
    const bounceLight = new THREE.DirectionalLight(0xd0e0f0, 0.2)
    bounceLight.position.set(0, -2, 2)
    scene.add(bounceLight)

    // === MOUSE INTERACTION ===
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    mount.addEventListener('mousemove', handleMouseMove)

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth continuous rotation
      canGroup.rotation.y = elapsed * 0.4

      // Gentle floating motion
      canGroup.position.y = Math.sin(elapsed * 0.6) * 0.06

      // Mouse-responsive tilt (subtle)
      const targetTiltX = -0.15 + mouseY * 0.08
      const targetTiltZ = mouseX * -0.06
      canGroup.rotation.x += (targetTiltX - canGroup.rotation.x) * 0.03
      canGroup.rotation.z += (targetTiltZ - canGroup.rotation.z) * 0.03

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
      renderer.dispose()
      bodyGeo.dispose()
      bottomGeo.dispose()
      lidGeo.dispose()
      lidTopGeo.dispose()
      rimGeo.dispose()
      bodyMat.dispose()
      bottomMat.dispose()
      lidTopMat.dispose()
      lidSideMat.dispose()
      rimMat.dispose()
      bodyTexture?.dispose()
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

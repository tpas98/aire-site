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
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    // === STUDIO ENVIRONMENT MAP (for realistic reflections) ===
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    // Create a procedural studio HDRI environment
    const envScene = new THREE.Scene()
    // Soft gradient dome — warm top, cool bottom
    const envGeo = new THREE.SphereGeometry(50, 64, 32)
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0.95, 0.97, 1.0) },
        bottomColor: { value: new THREE.Color(0.85, 0.88, 0.92) },
        horizonColor: { value: new THREE.Color(1.0, 0.99, 0.97) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 horizonColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col;
          if (h > 0.0) {
            col = mix(horizonColor, topColor, smoothstep(0.0, 0.6, h));
          } else {
            col = mix(horizonColor, bottomColor, smoothstep(0.0, -0.4, h));
          }
          // Add subtle bright spots for studio softboxes
          float spot1 = smoothstep(0.7, 1.0, dot(normalize(vWorldPos), normalize(vec3(3.0, 4.0, 2.0))));
          float spot2 = smoothstep(0.8, 1.0, dot(normalize(vWorldPos), normalize(vec3(-2.0, 3.0, 4.0))));
          float spot3 = smoothstep(0.85, 1.0, dot(normalize(vWorldPos), normalize(vec3(0.0, 2.0, -4.0))));
          col += vec3(0.25) * spot1 + vec3(0.15) * spot2 + vec3(0.1) * spot3;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const envMesh = new THREE.Mesh(envGeo, envMat)
    envScene.add(envMesh)
    const envRT = pmremGenerator.fromScene(envScene, 0.04)
    const envMap = envRT.texture
    scene.environment = envMap

    // === TIN DIMENSIONS ===
    const tinRadius = 1.4
    const tinDepth = 0.602
    const lidThickness = 0.02
    const bevelRadius = 0.03  // Chamfer/bevel on edges

    const canGroup = new THREE.Group()

    const textureLoader = new THREE.TextureLoader()
    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    // === FRONT FACE (Aire branding) ===
    const frontTexture = textureLoader.load('/images/can-front-texture.png', onTextureLoad)
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter
    frontTexture.magFilter = THREE.LinearFilter
    frontTexture.anisotropy = Math.min(16, maxAniso)

    const faceSize = tinRadius * 2
    const frontGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.25,
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
    backTexture.anisotropy = Math.min(16, maxAniso)

    const backGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.25,
      transparent: true,
      side: THREE.FrontSide,
    })
    const backMesh = new THREE.Mesh(backGeo, backMat)
    backMesh.rotation.y = Math.PI
    backMesh.position.z = -(tinDepth / 2 + 0.001)
    canGroup.add(backMesh)

    // === EDGE / BODY (band texture) ===
    const edgeGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, tinDepth - bevelRadius * 2, 128, 1, true)
    const bandTexture = textureLoader.load('/images/can-band-texture.png', onTextureLoad)
    bandTexture.colorSpace = THREE.SRGBColorSpace
    bandTexture.wrapS = THREE.RepeatWrapping
    bandTexture.wrapT = THREE.ClampToEdgeWrapping
    bandTexture.minFilter = THREE.LinearMipmapLinearFilter
    bandTexture.magFilter = THREE.LinearFilter
    bandTexture.anisotropy = Math.min(16, maxAniso)

    const edgeMat = new THREE.MeshPhysicalMaterial({
      map: bandTexture,
      roughness: 0.25,
      metalness: 0.08,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.45,
      side: THREE.DoubleSide,
    })
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat)
    edgeMesh.rotation.x = Math.PI / 2
    canGroup.add(edgeMesh)

    // === BEVELED EDGES (smooth chamfer using lathe geometry) ===
    const bevelSegs = 12
    const metalColor = new THREE.Color(0.88, 0.91, 0.93)
    const bevelMat = new THREE.MeshPhysicalMaterial({
      color: metalColor,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.0,
    })

    // Front bevel (top edge torus)
    const frontBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, bevelSegs, 128, Math.PI * 2)
    const frontBevelMesh = new THREE.Mesh(frontBevelGeo, bevelMat)
    frontBevelMesh.position.z = tinDepth / 2 - bevelRadius
    canGroup.add(frontBevelMesh)

    // Back bevel (bottom edge torus)
    const backBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, bevelSegs, 128, Math.PI * 2)
    const backBevelMesh = new THREE.Mesh(backBevelGeo, bevelMat)
    backBevelMesh.position.z = -(tinDepth / 2 - bevelRadius)
    canGroup.add(backBevelMesh)

    // === LID RIM ===
    const lidRimGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, lidThickness, 128)
    const lidRimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.91, 0.93, 0.95),
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.9,
    })
    const lidRimMesh = new THREE.Mesh(lidRimGeo, lidRimMat)
    lidRimMesh.rotation.x = Math.PI / 2
    lidRimMesh.position.z = tinDepth / 2 + lidThickness / 2
    canGroup.add(lidRimMesh)

    // === SEAM RING (where lid meets body) ===
    const seamGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.01, 16, 128)
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.83, 0.86, 0.89),
      roughness: 0.15,
      metalness: 0.2,
      envMapIntensity: 1.2,
    })
    const seamMesh = new THREE.Mesh(seamGeo, seamMat)
    seamMesh.position.z = tinDepth / 2
    canGroup.add(seamMesh)

    // === BOTTOM RIM ===
    const bottomRimGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.008, 16, 128)
    const bottomRimMesh = new THREE.Mesh(bottomRimGeo, seamMat)
    bottomRimMesh.position.z = -tinDepth / 2
    canGroup.add(bottomRimMesh)

    // === BOTTOM CAP ===
    const bottomCapGeo = new THREE.CircleGeometry(tinRadius, 128)
    const bottomCapMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.91, 0.93),
      roughness: 0.3,
      metalness: 0.06,
      envMapIntensity: 0.5,
    })
    const bottomCapMesh = new THREE.Mesh(bottomCapGeo, bottomCapMat)
    bottomCapMesh.rotation.y = Math.PI
    bottomCapMesh.position.z = -tinDepth / 2
    canGroup.add(bottomCapMesh)

    // === OPENING NOTCH/TAB (small bump on bottom of lid) ===
    // The notch sits at the bottom of the lid (6 o'clock position)
    const notchWidth = 0.28
    const notchHeight = 0.08
    const notchDepth = lidThickness + 0.015
    const notchGeo = new THREE.BoxGeometry(notchWidth, notchHeight, notchDepth, 4, 4, 4)
    const notchMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.87, 0.90, 0.92),
      roughness: 0.2,
      metalness: 0.12,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.8,
    })
    const notchMesh = new THREE.Mesh(notchGeo, notchMat)
    // Position at 6 o'clock (bottom of circular lid face)
    notchMesh.position.set(0, -(tinRadius - notchHeight / 2 + 0.01), tinDepth / 2 + lidThickness / 2)
    canGroup.add(notchMesh)

    // Rounded notch accent — small half-cylinder for smooth look
    const notchRoundGeo = new THREE.CylinderGeometry(notchHeight / 2, notchHeight / 2, notchWidth, 16, 1, false, 0, Math.PI)
    const notchRoundMesh = new THREE.Mesh(notchRoundGeo, notchMat)
    notchRoundMesh.rotation.z = Math.PI / 2
    notchRoundMesh.rotation.y = Math.PI / 2
    notchRoundMesh.position.set(0, -(tinRadius + 0.01), tinDepth / 2 + lidThickness / 2)
    canGroup.add(notchRoundMesh)

    // Outer group holds the fixed tilt (product-shot angle)
    // Inner canGroup spins on its local Y axis within that tilt
    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.x = -0.55  // Looking slightly down at lid
    tiltGroup.rotation.z = -0.03
    tiltGroup.add(canGroup)

    scene.add(tiltGroup)

    // === LIGHTING — bright studio setup ===
    scene.add(new THREE.AmbientLight(0xf4f7fa, 0.5))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3)
    keyLight.position.set(4, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xeaf2f8, 0.7)
    fillLight.position.set(-4, 2, 4)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.65)
    rimLight.position.set(0, 2, -5)
    scene.add(rimLight)

    const topLight = new THREE.DirectionalLight(0xf8f8ff, 0.35)
    topLight.position.set(0, 6, 2)
    scene.add(topLight)

    const bounceLight = new THREE.DirectionalLight(0xe0ecf4, 0.25)
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
    const baseTiltX = -0.55
    const baseTiltZ = -0.03

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Eased spin on local Y axis (stays in tilted frame)
      const cycleTime = 6.0
      const progress = (t % cycleTime) / cycleTime
      const eased = progress - Math.sin(progress * Math.PI * 2) / (Math.PI * 2)
      const fullRotations = Math.floor(t / cycleTime)
      canGroup.rotation.y = (fullRotations + eased) * Math.PI * 2

      // Float and jiggle on the outer tilt group
      tiltGroup.position.y = Math.sin(t * 0.5) * 0.06
      tiltGroup.position.x = Math.sin(t * 0.3) * 0.015

      // Gentle rocking jiggle
      const jiggleX = Math.sin(t * 0.7) * 0.02
      const jiggleZ = Math.cos(t * 0.5) * 0.015

      // Mouse-responsive tilt on the outer group
      const targetTiltX = baseTiltX + mouseY * 0.12 + jiggleX
      const targetTiltZ = baseTiltZ + mouseX * -0.1 + jiggleZ
      tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.04
      tiltGroup.rotation.z += (targetTiltZ - tiltGroup.rotation.z) * 0.04

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
      pmremGenerator.dispose()
      envRT.dispose()
      envGeo.dispose()
      envMat.dispose()
      renderer.dispose()
      frontGeo.dispose()
      backGeo.dispose()
      edgeGeo.dispose()
      lidRimGeo.dispose()
      seamGeo.dispose()
      bottomRimGeo.dispose()
      bottomCapGeo.dispose()
      frontBevelGeo.dispose()
      backBevelGeo.dispose()
      notchGeo.dispose()
      notchRoundGeo.dispose()
      frontMat.dispose()
      backMat.dispose()
      edgeMat.dispose()
      lidRimMat.dispose()
      seamMat.dispose()
      bottomCapMat.dispose()
      bevelMat.dispose()
      notchMat.dispose()
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

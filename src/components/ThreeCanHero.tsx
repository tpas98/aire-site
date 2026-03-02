'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

// Each can's configuration: position, tilt, spin speed, spin easing, float offset
interface CanConfig {
  position: [number, number, number]
  tiltX: number
  tiltZ: number
  cycleTime: number
  easingStrength: number
  floatPhase: number  // offset so they don't bob in sync
  spinDirection: number // 1 or -1
}

export default function ThreeCanHero({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()

    const width = mount.clientWidth
    const height = mount.clientHeight

    // Wider FOV to fit 3 cans, pulled back further
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 10)
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
    renderer.toneMappingExposure = 0.92
    mount.appendChild(renderer.domElement)

    // === STUDIO ENVIRONMENT MAP ===
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    const envScene = new THREE.Scene()
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
    scene.environment = envRT.texture

    // === TIN DIMENSIONS ===
    const tinRadius = 1.4
    const tinDepth = 0.602
    const lidThickness = 0.02
    const bevelRadius = 0.03

    const maxAniso = renderer.capabilities.getMaxAnisotropy()
    const textureLoader = new THREE.TextureLoader()
    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    // === SHARED TEXTURES (loaded once, used by all 3 cans) ===
    const frontTexture = textureLoader.load('/images/can-front-texture.png', onTextureLoad)
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter
    frontTexture.magFilter = THREE.LinearFilter
    frontTexture.anisotropy = Math.min(16, maxAniso)

    const backTexture = textureLoader.load('/images/can-back-texture.png', onTextureLoad)
    backTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.minFilter = THREE.LinearMipmapLinearFilter
    backTexture.magFilter = THREE.LinearFilter
    backTexture.anisotropy = Math.min(16, maxAniso)

    const bandTexture = textureLoader.load('/images/can-band-texture.png', onTextureLoad)
    bandTexture.colorSpace = THREE.SRGBColorSpace
    bandTexture.wrapS = THREE.RepeatWrapping
    bandTexture.wrapT = THREE.ClampToEdgeWrapping
    bandTexture.minFilter = THREE.LinearMipmapLinearFilter
    bandTexture.magFilter = THREE.LinearFilter
    bandTexture.anisotropy = Math.min(16, maxAniso)

    // === SHARED GEOMETRIES ===
    const faceSize = tinRadius * 2
    const frontGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const backGeo = new THREE.PlaneGeometry(faceSize, faceSize)
    const edgeGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, tinDepth - bevelRadius * 2, 96, 1, true)
    const frontBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, 10, 96, Math.PI * 2)
    const backBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, 10, 96, Math.PI * 2)
    const lidRimGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, lidThickness, 96)
    const seamGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.01, 16, 96)
    const bottomRimGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.008, 16, 96)
    const bottomCapGeo = new THREE.CircleGeometry(tinRadius, 96)

    // === SHARED MATERIALS ===
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture, roughness: 0.32, metalness: 0.01,
      clearcoat: 0.45, clearcoatRoughness: 0.18, envMapIntensity: 0.2,
      transparent: true, side: THREE.FrontSide,
    })
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture, roughness: 0.32, metalness: 0.01,
      clearcoat: 0.45, clearcoatRoughness: 0.18, envMapIntensity: 0.2,
      transparent: true, side: THREE.FrontSide,
    })
    const edgeMat = new THREE.MeshPhysicalMaterial({
      map: bandTexture, roughness: 0.25, metalness: 0.08,
      clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.45,
      side: THREE.DoubleSide,
    })
    const bevelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.91, 0.93), roughness: 0.18, metalness: 0.12,
      clearcoat: 0.7, clearcoatRoughness: 0.1, envMapIntensity: 1.0,
    })
    const lidRimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.91, 0.93, 0.95), roughness: 0.18, metalness: 0.1,
      clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 0.9,
    })
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.83, 0.86, 0.89), roughness: 0.15, metalness: 0.2,
      envMapIntensity: 1.2,
    })
    const bottomCapMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.91, 0.93), roughness: 0.3, metalness: 0.06,
      envMapIntensity: 0.5,
    })

    const allMaterials = [frontMat, backMat, edgeMat, bevelMat, lidRimMat, seamMat, bottomCapMat]
    const allGeometries = [frontGeo, backGeo, edgeGeo, frontBevelGeo, backBevelGeo, lidRimGeo, seamGeo, bottomRimGeo, bottomCapGeo]

    // === BUILD A SINGLE CAN ===
    function buildCan(): THREE.Group {
      const group = new THREE.Group()

      const front = new THREE.Mesh(frontGeo, frontMat)
      front.position.z = tinDepth / 2 + lidThickness + 0.001
      group.add(front)

      const back = new THREE.Mesh(backGeo, backMat)
      back.rotation.y = Math.PI
      back.position.z = -(tinDepth / 2 + 0.001)
      group.add(back)

      const edge = new THREE.Mesh(edgeGeo, edgeMat)
      edge.rotation.x = Math.PI / 2
      group.add(edge)

      const fb = new THREE.Mesh(frontBevelGeo, bevelMat)
      fb.position.z = tinDepth / 2 - bevelRadius
      group.add(fb)

      const bb = new THREE.Mesh(backBevelGeo, bevelMat)
      bb.position.z = -(tinDepth / 2 - bevelRadius)
      group.add(bb)

      const lid = new THREE.Mesh(lidRimGeo, lidRimMat)
      lid.rotation.x = Math.PI / 2
      lid.position.z = tinDepth / 2 + lidThickness / 2
      group.add(lid)

      const seam = new THREE.Mesh(seamGeo, seamMat)
      seam.position.z = tinDepth / 2
      group.add(seam)

      const brim = new THREE.Mesh(bottomRimGeo, seamMat)
      brim.position.z = -tinDepth / 2
      group.add(brim)

      const cap = new THREE.Mesh(bottomCapGeo, bottomCapMat)
      cap.rotation.y = Math.PI
      cap.position.z = -tinDepth / 2
      group.add(cap)

      return group
    }

    // === 3 CAN CONFIGURATIONS (matching reference image layout) ===
    // Top center, bottom-left, bottom-right
    const configs: CanConfig[] = [
      {
        position: [0, 1.3, 0],          // Top center
        tiltX: -0.5,
        tiltZ: 0.05,
        cycleTime: 5.0,
        easingStrength: 1.4,
        floatPhase: 0,
        spinDirection: 1,
      },
      {
        position: [-2.0, -1.1, -0.3],   // Bottom left
        tiltX: -0.6,
        tiltZ: 0.1,
        cycleTime: 6.5,
        easingStrength: 1.6,
        floatPhase: 2.1,
        spinDirection: -1,
      },
      {
        position: [2.0, -1.1, -0.3],    // Bottom right
        tiltX: -0.45,
        tiltZ: -0.08,
        cycleTime: 5.5,
        easingStrength: 1.5,
        floatPhase: 4.2,
        spinDirection: 1,
      },
    ]

    // Build all 3 cans with their tilt wrappers
    const canSpinGroups: THREE.Group[] = []
    const tiltGroups: THREE.Group[] = []

    configs.forEach((cfg) => {
      const spinGroup = buildCan()
      const tiltGroup = new THREE.Group()
      tiltGroup.rotation.x = cfg.tiltX
      tiltGroup.rotation.z = cfg.tiltZ
      tiltGroup.add(spinGroup)
      tiltGroup.position.set(...cfg.position)
      scene.add(tiltGroup)
      canSpinGroups.push(spinGroup)
      tiltGroups.push(tiltGroup)
    })

    // === LIGHTING ===
    scene.add(new THREE.AmbientLight(0xf5f3f0, 0.45))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0)
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
    const handleMouseLeave = () => { mouseX = 0; mouseY = 0 }
    mount.addEventListener('mousemove', handleMouseMove)
    mount.addEventListener('mouseleave', handleMouseLeave)

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      configs.forEach((cfg, i) => {
        const spinGroup = canSpinGroups[i]
        const tiltGroup = tiltGroups[i]

        // Eased spin — each can at its own speed/direction
        const progress = (t % cfg.cycleTime) / cfg.cycleTime
        const eased = progress - Math.sin(progress * Math.PI * 2) / (Math.PI * cfg.easingStrength)
        const fullRotations = Math.floor(t / cfg.cycleTime)
        spinGroup.rotation.y = cfg.spinDirection * (fullRotations + eased) * Math.PI * 2

        // Staggered float
        const phase = t + cfg.floatPhase
        tiltGroup.position.y = cfg.position[1] + Math.sin(phase * 0.5) * 0.06
        tiltGroup.position.x = cfg.position[0] + Math.sin(phase * 0.3) * 0.015

        // Gentle jiggle
        const jiggleX = Math.sin(phase * 0.7) * 0.015
        const jiggleZ = Math.cos(phase * 0.5) * 0.01

        // Mouse-responsive tilt
        const targetTiltX = cfg.tiltX + mouseY * 0.08 + jiggleX
        const targetTiltZ = cfg.tiltZ + mouseX * -0.06 + jiggleZ
        tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.03
        tiltGroup.rotation.z += (targetTiltZ - tiltGroup.rotation.z) * 0.03
      })

      renderer.render(scene, camera)
    }
    animate()

    // === RESIZE ===
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
      allGeometries.forEach(g => g.dispose())
      allMaterials.forEach(m => m.dispose())
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

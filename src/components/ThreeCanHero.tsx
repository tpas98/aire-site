'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

// Each can's configuration
interface CanConfig {
  position: [number, number, number]
  tiltX: number
  tiltZ: number
  floatPhase: number  // offset so they don't bob in sync
  // Motion type: 'showcase' = gentle oscillating rock (brand always visible)
  //              'turntable' = full eased rotation
  motionType: 'showcase' | 'turntable'
  // Turntable settings (only used when motionType === 'turntable')
  cycleTime?: number
  easingStrength?: number
  spinDirection?: number // 1 or -1
  // Showcase settings (only used when motionType === 'showcase')
  oscillateSpeed?: number    // how fast the gentle rock cycles (lower = slower, more luxurious)
  oscillateAmplitude?: number // max angle in radians (~0.45 = ±26°)
}

export default function ThreeCanHero({ className = '', ...rest }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
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
    const labelRadius = tinRadius - 0.14
    const labelGrooveOuterRadius = labelRadius + 0.032
    const labelSeatOuterRadius = tinRadius - 0.06
    const labelTextureZoom = 0.84

    const maxAniso = renderer.capabilities.getMaxAnisotropy()
    const textureLoader = new THREE.TextureLoader()
    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    // === SHARED TEXTURES (loaded once, used by all 3 cans) ===
    const frontTexture = textureLoader.load('/images/can-front-texture-2026.png', onTextureLoad)
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter
    frontTexture.magFilter = THREE.LinearFilter
    frontTexture.anisotropy = Math.min(16, maxAniso)
    frontTexture.repeat.set(labelTextureZoom, labelTextureZoom)
    frontTexture.offset.set((1 - labelTextureZoom) / 2, (1 - labelTextureZoom) / 2)

    const backTexture = textureLoader.load('/images/can-back-texture-2026.png', onTextureLoad)
    backTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.minFilter = THREE.LinearMipmapLinearFilter
    backTexture.magFilter = THREE.LinearFilter
    backTexture.anisotropy = Math.min(16, maxAniso)
    backTexture.repeat.set(labelTextureZoom, labelTextureZoom)
    backTexture.offset.set((1 - labelTextureZoom) / 2, (1 - labelTextureZoom) / 2)

    const bandTexture = textureLoader.load('/images/can-band-texture-2026.png', onTextureLoad)
    bandTexture.colorSpace = THREE.SRGBColorSpace
    bandTexture.wrapS = THREE.RepeatWrapping
    bandTexture.wrapT = THREE.ClampToEdgeWrapping
    bandTexture.minFilter = THREE.LinearMipmapLinearFilter
    bandTexture.magFilter = THREE.LinearFilter
    bandTexture.anisotropy = Math.min(16, maxAniso)

    // === SHARED GEOMETRIES ===
    const frontGeo = new THREE.CircleGeometry(labelRadius, 96)
    const backGeo = new THREE.CircleGeometry(labelRadius, 96)
    const labelGrooveGeo = new THREE.RingGeometry(labelRadius, labelGrooveOuterRadius, 96)
    const labelSeatGeo = new THREE.RingGeometry(labelGrooveOuterRadius, labelSeatOuterRadius, 96)
    const edgeGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, tinDepth - bevelRadius * 2, 96, 1, true)
    const frontBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, 10, 96, Math.PI * 2)
    const backBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, 10, 96, Math.PI * 2)
    const lidRimGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, lidThickness, 96)
    const seamGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.01, 16, 96)
    const bottomRimGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.008, 16, 96)
    const bottomCapGeo = new THREE.CircleGeometry(tinRadius, 96)

    // === SHARED MATERIALS ===
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture, roughness: 0.42, metalness: 0.01,
      clearcoat: 0.18, clearcoatRoughness: 0.3, envMapIntensity: 0.08,
      transparent: true, side: THREE.FrontSide,
    })
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture, roughness: 0.42, metalness: 0.01,
      clearcoat: 0.18, clearcoatRoughness: 0.3, envMapIntensity: 0.08,
      transparent: true, side: THREE.FrontSide,
    })
    const edgeMat = new THREE.MeshPhysicalMaterial({
      map: bandTexture, roughness: 0.32, metalness: 0.05,
      clearcoat: 0.24, clearcoatRoughness: 0.28, envMapIntensity: 0.24,
      side: THREE.DoubleSide,
    })
    const labelGrooveMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.93, 0.93, 0.94), roughness: 0.84, metalness: 0.02,
      clearcoat: 0.04, clearcoatRoughness: 0.62, envMapIntensity: 0.08,
      side: THREE.DoubleSide,
    })
    const labelSeatMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.96, 0.96, 0.96), roughness: 0.62, metalness: 0.02,
      clearcoat: 0.08, clearcoatRoughness: 0.48, envMapIntensity: 0.12,
      side: THREE.DoubleSide,
    })
    const bevelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.9, 0.88, 0.85), roughness: 0.3, metalness: 0.05,
      clearcoat: 0.28, clearcoatRoughness: 0.22, envMapIntensity: 0.48,
    })
    const lidRimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.96, 0.94, 0.92), roughness: 0.36, metalness: 0.03,
      clearcoat: 0.28, clearcoatRoughness: 0.22, envMapIntensity: 0.38,
    })
    const seamMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.22, 0.26, 0.36), roughness: 0.28, metalness: 0.08,
      envMapIntensity: 0.58,
    })
    const bottomCapMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.88, 0.91, 0.93), roughness: 0.3, metalness: 0.06,
      envMapIntensity: 0.5,
    })

    const allMaterials = [frontMat, backMat, edgeMat, labelGrooveMat, labelSeatMat, bevelMat, lidRimMat, seamMat, bottomCapMat]
    const allGeometries = [frontGeo, backGeo, labelGrooveGeo, labelSeatGeo, edgeGeo, frontBevelGeo, backBevelGeo, lidRimGeo, seamGeo, bottomRimGeo, bottomCapGeo]

    // === BUILD A SINGLE CAN ===
    function buildCan(): THREE.Group {
      const group = new THREE.Group()

      const frontGroove = new THREE.Mesh(labelGrooveGeo, labelGrooveMat)
      frontGroove.position.z = tinDepth / 2 + lidThickness + 0.001
      group.add(frontGroove)

      const frontSeat = new THREE.Mesh(labelSeatGeo, labelSeatMat)
      frontSeat.position.z = tinDepth / 2 + lidThickness + 0.001
      group.add(frontSeat)

      const front = new THREE.Mesh(frontGeo, frontMat)
      front.position.z = tinDepth / 2 + lidThickness + 0.0002
      group.add(front)

      const backGroove = new THREE.Mesh(labelGrooveGeo, labelGrooveMat)
      backGroove.rotation.y = Math.PI
      backGroove.position.z = -(tinDepth / 2 + 0.001)
      group.add(backGroove)

      const backSeat = new THREE.Mesh(labelSeatGeo, labelSeatMat)
      backSeat.rotation.y = Math.PI
      backSeat.position.z = -(tinDepth / 2 + 0.001)
      group.add(backSeat)

      const back = new THREE.Mesh(backGeo, backMat)
      back.rotation.y = Math.PI
      back.position.z = -(tinDepth / 2 + 0.0002)
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

    // === 3 CAN CONFIGURATIONS ===
    // Top center = showcase (gentle oscillating rock, brand always visible)
    // Bottom two = turntable spins in opposite directions
    const configs: CanConfig[] = [
      {
        position: [0, 1.3, 0],          // Top center — the hero
        tiltX: -0.5,
        tiltZ: 0.05,
        floatPhase: 0,
        motionType: 'showcase',
        oscillateSpeed: 0.35,            // Very slow, luxurious rock
        oscillateAmplitude: 0.45,        // ±26° — shows depth without losing the brand
      },
      {
        position: [-2.0, -1.1, -0.3],   // Bottom left — full spin, counter-clockwise
        tiltX: -0.6,
        tiltZ: 0.1,
        floatPhase: 2.1,
        motionType: 'turntable',
        cycleTime: 6.0,
        easingStrength: 1.6,
        spinDirection: -1,
      },
      {
        position: [2.0, -1.1, -0.3],    // Bottom right — full spin, clockwise
        tiltX: -0.45,
        tiltZ: -0.08,
        floatPhase: 4.2,
        motionType: 'turntable',
        cycleTime: 5.0,
        easingStrength: 1.4,
        spinDirection: 1,
      },
    ]

    // Build all 3 cans with their tilt wrappers inside a responsive parent group
    const canSpinGroups: THREE.Group[] = []
    const tiltGroups: THREE.Group[] = []
    const sceneGroup = new THREE.Group()  // Parent group for responsive scaling

    configs.forEach((cfg) => {
      const spinGroup = buildCan()
      const tiltGroup = new THREE.Group()
      tiltGroup.rotation.x = cfg.tiltX
      tiltGroup.rotation.z = cfg.tiltZ
      tiltGroup.add(spinGroup)
      tiltGroup.position.set(...cfg.position)
      sceneGroup.add(tiltGroup)
      canSpinGroups.push(spinGroup)
      tiltGroups.push(tiltGroup)
    })
    scene.add(sceneGroup)

    // === RESPONSIVE: adjust scale + camera for narrow/mobile viewports ===
    function updateResponsiveLayout() {
      const aspect = mount!.clientWidth / mount!.clientHeight
      if (aspect < 0.75) {
        // Very narrow (phone portrait) — scale down significantly, pull camera back
        const s = 0.62
        sceneGroup.scale.set(s, s, s)
        camera.position.z = 12.5
        camera.position.y = 0.1
      } else if (aspect < 1.1) {
        // Tablet / narrow — moderate scale down
        const s = 0.78
        sceneGroup.scale.set(s, s, s)
        camera.position.z = 11
        camera.position.y = 0.15
      } else {
        // Desktop — full size
        sceneGroup.scale.set(1, 1, 1)
        camera.position.z = 10
        camera.position.y = 0.2
      }
      camera.updateProjectionMatrix()
    }
    updateResponsiveLayout()

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
        const phase = t + cfg.floatPhase

        if (cfg.motionType === 'showcase') {
          // === SHOWCASE: gentle oscillating rock ===
          // Primary Y oscillation — slow sine wave, brand stays mostly front-facing
          const speed = cfg.oscillateSpeed ?? 0.35
          const amp = cfg.oscillateAmplitude ?? 0.45
          spinGroup.rotation.y = Math.sin(t * speed) * amp

          // Secondary subtle X-axis breathing — gives a "being examined" feel
          spinGroup.rotation.x = Math.sin(t * speed * 0.7) * 0.04

          // Very subtle Z tilt for organic, living motion
          spinGroup.rotation.z = Math.sin(t * speed * 0.5 + 1.0) * 0.02

        } else {
          // === TURNTABLE: full eased rotation ===
          const cycleTime = cfg.cycleTime ?? 5.0
          const easeStr = cfg.easingStrength ?? 1.4
          const dir = cfg.spinDirection ?? 1
          const progress = (t % cycleTime) / cycleTime
          const eased = progress - Math.sin(progress * Math.PI * 2) / (Math.PI * easeStr)
          const fullRotations = Math.floor(t / cycleTime)
          spinGroup.rotation.y = dir * (fullRotations + eased) * Math.PI * 2
        }

        // Staggered float (all cans)
        tiltGroup.position.y = cfg.position[1] + Math.sin(phase * 0.5) * 0.06
        tiltGroup.position.x = cfg.position[0] + Math.sin(phase * 0.3) * 0.015

        // Gentle jiggle (all cans)
        const jiggleX = Math.sin(phase * 0.7) * 0.015
        const jiggleZ = Math.cos(phase * 0.5) * 0.01

        // Mouse-responsive tilt (all cans)
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
      updateResponsiveLayout()
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
      role="img"
      aria-label="Aire nicotine-free wellness pouch tins rendered in 3D"
      className={`w-full h-full ${className}`}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
        cursor: 'grab',
      }}
      {...rest}
    />
  )
}

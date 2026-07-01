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
  showcaseRock,
} from './three/canFactory'

// Each can's configuration. motionType 'showcase' = gentle oscillating rock
// (brand always visible); 'turntable' = full eased rotation.
interface CanConfig {
  position: [number, number, number]
  tiltX: number
  tiltZ: number
  floatPhase: number // offset so they don't bob in sync
  motionType: 'showcase' | 'turntable'
  cycleTime?: number       // turntable only
  easingStrength?: number  // turntable only
  spinDirection?: number   // turntable only, 1 or -1
  oscillateSpeed?: number     // showcase only
  oscillateAmplitude?: number // showcase only, radians (~0.45 = ±26°)
}

// 3 can configs verbatim from the original ThreeCanHero: top center is the
// showcase can, bottom two are turntables spinning opposite directions.
const CONFIGS: CanConfig[] = [
  { position: [0, 1.3, 0], tiltX: -0.5, tiltZ: 0.05, floatPhase: 0, motionType: 'showcase', oscillateSpeed: 0.35, oscillateAmplitude: 0.45 },
  { position: [-2.0, -1.1, -0.3], tiltX: -0.6, tiltZ: 0.1, floatPhase: 2.1, motionType: 'turntable', cycleTime: 6.0, easingStrength: 1.6, spinDirection: -1 },
  { position: [2.0, -1.1, -0.3], tiltX: -0.45, tiltZ: -0.08, floatPhase: 4.2, motionType: 'turntable', cycleTime: 5.0, easingStrength: 1.4, spinDirection: 1 },
]

// === SCROLL-DRIVE DEFAULTS ===
// Applied on top of base motion when scrollProgressRef is provided.
// progress is read fresh each frame (0-1), no React re-renders.
export interface ScrollFxConfig {
  sceneRotationY: number    // rotation.y added, scaled by progress (rad)
  sceneTranslateY: number   // position.y subtracted, scaled by progress
  sideSpreadX: number       // side-can groups spread outward by this much * progress
  sideDropY: number         // side-can groups drop down by this much * progress
  centerScaleBoost: number  // center can scale multiplier: 1 + progress * this
}

export const DEFAULT_SCROLL_FX: ScrollFxConfig = {
  sceneRotationY: 0.6,
  sceneTranslateY: 0.9,
  sideSpreadX: 1.2,
  sideDropY: 1.4,
  centerScaleBoost: 0.12,
}

export interface ThreeCanHeroProps {
  className?: string
  /** RAF loop reads `.current` (0-1) each frame with no React re-renders. */
  scrollProgressRef?: React.MutableRefObject<number>
  /** Overrides for the scroll-drive effect magnitudes. */
  scrollFx?: Partial<ScrollFxConfig>
  /** When true: render one static frame at rest pose, no RAF loop, no mouse-tilt. */
  reducedMotion?: boolean
}

export default function ThreeCanHero({ className = '', scrollProgressRef, scrollFx, reducedMotion = false, ...rest }: ThreeCanHeroProps & React.HTMLAttributes<HTMLDivElement>) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const fx: ScrollFxConfig = { ...DEFAULT_SCROLL_FX, ...scrollFx }

    const scene = new THREE.Scene()

    const width = mount.clientWidth
    const height = mount.clientHeight

    // Wider FOV to fit 3 cans, pulled back further
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 10)
    camera.lookAt(0, 0, 0)

    const renderer = createRenderer(mount)

    // === STUDIO ENVIRONMENT MAP ===
    const studioEnv = createStudioEnvironment(renderer)
    scene.environment = studioEnv.envMap

    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    // === SHARED TEXTURES (loaded once, used by all 3 cans) ===
    const textures = loadCanTextures(renderer, onTextureLoad)

    // === SHARED GEOMETRIES + MATERIALS (ThreeCanHero uses 96 segments, bevel radial 10) ===
    const canResources = createCanResources(textures, { segments: 96, bevelRadialSegments: 10 })

    // Build all 3 cans with their tilt wrappers inside a responsive parent group
    const canSpinGroups: THREE.Group[] = []
    const tiltGroups: THREE.Group[] = []
    const sceneGroup = new THREE.Group()  // Parent group for responsive scaling

    CONFIGS.forEach((cfg) => {
      const spinGroup = canResources.buildCan()
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

    let baseSceneScale = 1
    let baseCameraZ = 10
    let baseCameraY = 0.2

    // === RESPONSIVE: adjust scale + camera for narrow/mobile viewports ===
    function updateResponsiveLayout() {
      const aspect = mount!.clientWidth / mount!.clientHeight
      if (aspect < 0.75) {
        // Very narrow (phone portrait) — scale down significantly, pull camera back
        baseSceneScale = 0.62
        baseCameraZ = 12.5
        baseCameraY = 0.1
      } else if (aspect < 1.1) {
        // Tablet / narrow — moderate scale down
        baseSceneScale = 0.78
        baseCameraZ = 11
        baseCameraY = 0.15
      } else {
        // Desktop — full size
        baseSceneScale = 1
        baseCameraZ = 10
        baseCameraY = 0.2
      }
      sceneGroup.scale.set(baseSceneScale, baseSceneScale, baseSceneScale)
      camera.position.z = baseCameraZ
      camera.position.y = baseCameraY
      camera.updateProjectionMatrix()
    }
    updateResponsiveLayout()

    // === LIGHTING ===
    addStudioLighting(scene)

    // === MOUSE INTERACTION ===
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const handleMouseLeave = () => { mouseX = 0; mouseY = 0 }
    if (!reducedMotion) {
      mount.addEventListener('mousemove', handleMouseMove)
      mount.addEventListener('mouseleave', handleMouseLeave)
    }

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    function applyScrollFx(progress: number) {
      if (progress <= 0) return
      sceneGroup.rotation.y = progress * fx.sceneRotationY
      sceneGroup.position.y = -progress * fx.sceneTranslateY

      CONFIGS.forEach((cfg, i) => {
        const tiltGroup = tiltGroups[i]
        if (cfg.motionType === 'showcase') {
          const s = baseSceneScale * (1 + progress * fx.centerScaleBoost)
          tiltGroup.scale.set(s / baseSceneScale, s / baseSceneScale, s / baseSceneScale)
        } else {
          const sideSign = cfg.position[0] < 0 ? -1 : 1
          tiltGroup.position.x = cfg.position[0] + sideSign * progress * fx.sideSpreadX
          tiltGroup.position.y = cfg.position[1] - progress * fx.sideDropY
        }
      })
    }

    const renderStaticFrame = () => {
      // Reduced motion: showcase can front-facing at rest pose, turntable cans at rotation.y = 0
      CONFIGS.forEach((cfg, i) => {
        const spinGroup = canSpinGroups[i]
        const tiltGroup = tiltGroups[i]
        spinGroup.rotation.set(0, 0, 0)
        tiltGroup.rotation.x = cfg.tiltX
        tiltGroup.rotation.z = cfg.tiltZ
        tiltGroup.position.set(...cfg.position)
      })
      if (scrollProgressRef) applyScrollFx(scrollProgressRef.current)
      renderer.render(scene, camera)
    }

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      CONFIGS.forEach((cfg, i) => {
        const spinGroup = canSpinGroups[i]
        const tiltGroup = tiltGroups[i]
        const phase = t + cfg.floatPhase

        if (cfg.motionType === 'showcase') {
          // === SHOWCASE: gentle oscillating rock ===
          const speed = cfg.oscillateSpeed ?? 0.35
          const amp = cfg.oscillateAmplitude ?? 0.45
          const rock = showcaseRock(t, speed, amp)
          spinGroup.rotation.y = rock.y
          spinGroup.rotation.x = rock.x
          spinGroup.rotation.z = rock.z
        } else {
          // === TURNTABLE: full eased rotation ===
          const cycleTime = cfg.cycleTime ?? 5.0
          const easeStr = cfg.easingStrength ?? 1.4
          const dir = cfg.spinDirection ?? 1
          spinGroup.rotation.y = easedTurntable(t, cycleTime, easeStr, dir)
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

      if (scrollProgressRef) applyScrollFx(scrollProgressRef.current)

      renderer.render(scene, camera)
    }

    if (reducedMotion) {
      renderStaticFrame()
    } else {
      animate()
    }

    // === RESIZE ===
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      updateResponsiveLayout()
      if (reducedMotion) renderStaticFrame()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (!reducedMotion) cancelAnimationFrame(animId)
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
  }, [reducedMotion])

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

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
} from './three/canFactory'

const BASE_TILT_X = -0.55
const BASE_TILT_Z = -0.03
const CYCLE_TIME = 4.5
const EASING_STRENGTH = 1.4

export interface SpinningCanProps {
  className?: string
  /**
   * RAF loop reads `.current` (0-1) each frame with no React re-renders.
   * Mapping (simple, documented): rotation.y += progress * 0.6 rad on top of
   * the base spin, tiltGroup.position.y -= progress * 0.5 (drifts the can
   * down slightly as you scroll past it).
   */
  scrollProgressRef?: React.MutableRefObject<number>
  /** When true: render one static frame at rest pose, no RAF loop, no mouse-tilt. */
  reducedMotion?: boolean
}

export default function SpinningCan({ className = '', scrollProgressRef, reducedMotion = false }: SpinningCanProps) {
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

    const renderer = createRenderer(mount)

    // === STUDIO ENVIRONMENT MAP (for realistic reflections) ===
    const studioEnv = createStudioEnvironment(renderer)
    scene.environment = studioEnv.envMap

    let texturesLoaded = 0
    const totalTextures = 3
    const onTextureLoad = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) setLoaded(true)
    }

    const textures = loadCanTextures(renderer, onTextureLoad)

    // SpinningCan uses 128 segments everywhere, bevel radial segments 12
    const canResources = createCanResources(textures, { segments: 128, bevelRadialSegments: 12 })
    const canGroup = canResources.buildCan()

    // Outer group holds the fixed tilt (product-shot angle)
    // Inner canGroup spins on its local Y axis within that tilt
    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.x = BASE_TILT_X
    tiltGroup.rotation.z = BASE_TILT_Z
    tiltGroup.add(canGroup)

    scene.add(tiltGroup)

    // === LIGHTING — bright studio setup ===
    addStudioLighting(scene)

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
    if (!reducedMotion) {
      mount.addEventListener('mousemove', handleMouseMove)
      mount.addEventListener('mouseleave', handleMouseLeave)
    }

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    const renderStaticFrame = () => {
      // Reduced motion: front-facing at rest pose
      canGroup.rotation.set(0, 0, 0)
      tiltGroup.position.set(0, 0, 0)
      tiltGroup.rotation.x = BASE_TILT_X
      tiltGroup.rotation.z = BASE_TILT_Z
      if (scrollProgressRef) {
        const progress = scrollProgressRef.current
        canGroup.rotation.y = progress * 0.6
        tiltGroup.position.y = -progress * 0.5
      }
      renderer.render(scene, camera)
    }

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Eased spin on local Y axis (stays in tilted frame)
      canGroup.rotation.y = easedTurntable(t, CYCLE_TIME, EASING_STRENGTH, 1)

      // Float and jiggle on the outer tilt group
      tiltGroup.position.y = Math.sin(t * 0.5) * 0.06
      tiltGroup.position.x = Math.sin(t * 0.3) * 0.015

      // Gentle rocking jiggle
      const jiggleX = Math.sin(t * 0.7) * 0.02
      const jiggleZ = Math.cos(t * 0.5) * 0.015

      // Mouse-responsive tilt on the outer group
      const targetTiltX = BASE_TILT_X + mouseY * 0.12 + jiggleX
      const targetTiltZ = BASE_TILT_Z + mouseX * -0.1 + jiggleZ
      tiltGroup.rotation.x += (targetTiltX - tiltGroup.rotation.x) * 0.04
      tiltGroup.rotation.z += (targetTiltZ - tiltGroup.rotation.z) * 0.04

      if (scrollProgressRef) {
        const progress = scrollProgressRef.current
        canGroup.rotation.y += progress * 0.6
        tiltGroup.position.y -= progress * 0.5
      }

      renderer.render(scene, camera)
    }

    if (reducedMotion) {
      renderStaticFrame()
    } else {
      animate()
    }

    // === RESIZE HANDLER ===
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
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
      className={`w-full h-full ${className}`}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
        cursor: 'grab',
      }}
    />
  )
}

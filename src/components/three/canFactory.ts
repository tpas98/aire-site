import * as THREE from 'three'

// ============================================================================
// Shared Three.js factory for the Aire spinning-can renders.
//
// Both ThreeCanHero.tsx (3-can hero) and SpinningCan.tsx (single "Our Story"
// can) build visually-identical can geometry/materials/lighting/environment.
// This module centralizes that shared code so both components stay in sync.
//
// IMPORTANT: every numeric value below was copied verbatim from the current
// ThreeCanHero.tsx / SpinningCan.tsx source (not from CLAUDE.md, which is
// stale). Where the two components genuinely differ (segment counts, bevel
// segments, FOV, mouse-tilt responsiveness, cycle times) that is preserved by
// letting each caller pass its own config rather than hardcoding one value.
// ============================================================================

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export function createRenderer(mount: HTMLElement): THREE.WebGLRenderer {
  const width = mount.clientWidth
  const height = mount.clientHeight

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

  return renderer
}

// ---------------------------------------------------------------------------
// Studio environment map (procedural PMREM HDRI, verbatim from ThreeCanHero)
// ---------------------------------------------------------------------------

export interface StudioEnvironment {
  envMap: THREE.Texture
  dispose: () => void
}

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): StudioEnvironment {
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

  return {
    envMap: envRT.texture,
    dispose: () => {
      pmremGenerator.dispose()
      envRT.dispose()
      envGeo.dispose()
      envMat.dispose()
    },
  }
}

// ---------------------------------------------------------------------------
// Lighting rig (verbatim, identical in both components)
// ---------------------------------------------------------------------------

export function addStudioLighting(scene: THREE.Scene): void {
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
}

// ---------------------------------------------------------------------------
// Textures
// ---------------------------------------------------------------------------

export interface CanTextures {
  frontTexture: THREE.Texture
  backTexture: THREE.Texture
  bandTexture: THREE.Texture
  labelTextureZoom: number
}

// tinRadius/labelRadius are needed here only to compute labelTextureZoom's
// repeat/offset math (0.84 verbatim from both components).
export function loadCanTextures(renderer: THREE.WebGLRenderer, onLoad: () => void): CanTextures {
  const labelTextureZoom = 0.84
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const textureLoader = new THREE.TextureLoader()

  const frontTexture = textureLoader.load('/images/can-front-texture-2026.png', onLoad)
  frontTexture.colorSpace = THREE.SRGBColorSpace
  frontTexture.minFilter = THREE.LinearMipmapLinearFilter
  frontTexture.magFilter = THREE.LinearFilter
  frontTexture.anisotropy = Math.min(16, maxAniso)
  frontTexture.repeat.set(labelTextureZoom, labelTextureZoom)
  frontTexture.offset.set((1 - labelTextureZoom) / 2, (1 - labelTextureZoom) / 2)

  const backTexture = textureLoader.load('/images/can-back-texture-2026.png', onLoad)
  backTexture.colorSpace = THREE.SRGBColorSpace
  backTexture.minFilter = THREE.LinearMipmapLinearFilter
  backTexture.magFilter = THREE.LinearFilter
  backTexture.anisotropy = Math.min(16, maxAniso)
  backTexture.repeat.set(labelTextureZoom, labelTextureZoom)
  backTexture.offset.set((1 - labelTextureZoom) / 2, (1 - labelTextureZoom) / 2)

  const bandTexture = textureLoader.load('/images/can-band-texture-2026.png', onLoad)
  bandTexture.colorSpace = THREE.SRGBColorSpace
  bandTexture.wrapS = THREE.RepeatWrapping
  bandTexture.wrapT = THREE.ClampToEdgeWrapping
  bandTexture.minFilter = THREE.LinearMipmapLinearFilter
  bandTexture.magFilter = THREE.LinearFilter
  bandTexture.anisotropy = Math.min(16, maxAniso)

  return { frontTexture, backTexture, bandTexture, labelTextureZoom }
}

// ---------------------------------------------------------------------------
// Can geometry + materials
// ---------------------------------------------------------------------------

export interface CanResourcesOptions {
  // Segment counts differ between the two original components:
  // ThreeCanHero used 96 everywhere (and bevel radial segments of 10),
  // SpinningCan used 128 everywhere (and bevel radial segments of 12).
  // Default to ThreeCanHero's values (96 / 10) — SpinningCan passes its own.
  segments?: number
  bevelRadialSegments?: number
}

export interface CanResources {
  buildCan: () => THREE.Group
  dispose: () => void
}

export function createCanResources(textures: CanTextures, options: CanResourcesOptions = {}): CanResources {
  const segments = options.segments ?? 96
  const bevelRadialSegments = options.bevelRadialSegments ?? 10

  // === TIN DIMENSIONS (verbatim, identical in both components) ===
  const tinRadius = 1.4
  const tinDepth = 0.602
  const lidThickness = 0.02
  const bevelRadius = 0.03
  const labelRadius = tinRadius - 0.14
  const labelGrooveOuterRadius = labelRadius + 0.032
  const labelSeatOuterRadius = tinRadius - 0.06

  const { frontTexture, backTexture, bandTexture } = textures

  // === GEOMETRIES (shared across all can instances) ===
  const frontGeo = new THREE.CircleGeometry(labelRadius, segments)
  const backGeo = new THREE.CircleGeometry(labelRadius, segments)
  const labelGrooveGeo = new THREE.RingGeometry(labelRadius, labelGrooveOuterRadius, segments)
  const labelSeatGeo = new THREE.RingGeometry(labelGrooveOuterRadius, labelSeatOuterRadius, segments)
  const edgeGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, tinDepth - bevelRadius * 2, segments, 1, true)
  const frontBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, bevelRadialSegments, segments, Math.PI * 2)
  const backBevelGeo = new THREE.TorusGeometry(tinRadius - bevelRadius, bevelRadius, bevelRadialSegments, segments, Math.PI * 2)
  const lidRimGeo = new THREE.CylinderGeometry(tinRadius, tinRadius, lidThickness, segments)
  const seamGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.01, 16, segments)
  const bottomRimGeo = new THREE.TorusGeometry(tinRadius - 0.005, 0.008, 16, segments)
  const bottomCapGeo = new THREE.CircleGeometry(tinRadius, segments)

  // === MATERIALS (shared across all can instances, verbatim values) ===
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

  function dispose() {
    allGeometries.forEach((g) => g.dispose())
    allMaterials.forEach((m) => m.dispose())
  }

  return { buildCan, dispose }
}

export function disposeCanTextures(textures: CanTextures): void {
  textures.frontTexture?.dispose()
  textures.backTexture?.dispose()
  textures.bandTexture?.dispose()
}

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

/**
 * Full eased rotation ("turntable") — matches:
 *   const progress = (t % cycleTime) / cycleTime
 *   const eased = progress - Math.sin(progress * Math.PI * 2) / (Math.PI * easingStrength)
 *   const fullRotations = Math.floor(t / cycleTime)
 *   rotation.y = direction * (fullRotations + eased) * Math.PI * 2
 * verbatim from both components (SpinningCan always uses direction = 1).
 */
export function easedTurntable(elapsed: number, cycleTime: number, easingStrength: number, direction = 1): number {
  const progress = (elapsed % cycleTime) / cycleTime
  const eased = progress - Math.sin(progress * Math.PI * 2) / (Math.PI * easingStrength)
  const fullRotations = Math.floor(elapsed / cycleTime)
  return direction * (fullRotations + eased) * Math.PI * 2
}

export interface ShowcaseRockRotation {
  x: number
  y: number
  z: number
}

/**
 * Showcase "gentle oscillating rock" — matches ThreeCanHero's showcase
 * motionType verbatim:
 *   rotation.y = sin(t * speed) * amp
 *   rotation.x = sin(t * speed * 0.7) * 0.04   (subtle breathing)
 *   rotation.z = sin(t * speed * 0.5 + 1.0) * 0.02   (organic sway)
 */
export function showcaseRock(elapsed: number, speed: number, amplitude: number): ShowcaseRockRotation {
  return {
    x: Math.sin(elapsed * speed * 0.7) * 0.04,
    y: Math.sin(elapsed * speed) * amplitude,
    z: Math.sin(elapsed * speed * 0.5 + 1.0) * 0.02,
  }
}

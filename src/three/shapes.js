// ─────────────────────────────────────────────────────────────────────────────
//  Particle target shapes. Each returns a Float32Array of length N*3.
//  Sequence (faithful to the reference video, two-colour palette):
//    0 SPHERE (ball, name inside) → 1 BLACK HOLE → 2/3/4 DNA HELIX (info cards)
//    → 5 WAVE (lane) → 6 STARFIELD (white spark) → 7 GALAXY
//  The funnel/cylinder + thin spiral were removed (looked wrong).
// ─────────────────────────────────────────────────────────────────────────────

const TAU = Math.PI * 2

// LUMINOUS RING — wispy filamentary torus facing the camera (New Era hero).
// Dense braided core with soft smoky halo; orange top / blue bottom comes
// from the material's y-gradient.
export function luminousRing(N, radius = 9.2) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const ang = Math.random() * TAU
    // braided filaments: several sine harmonics wobble the ring radius
    const braid =
      Math.sin(ang * 7 + 1.3) * 0.42 +
      Math.sin(ang * 13 + 4.1) * 0.26 +
      Math.sin(ang * 23) * 0.14
    // most particles hug the core, a smoky fraction drifts outward
    const smoky = Math.random() < 0.22
    const spread = smoky ? Math.pow(Math.random(), 1.6) * 3.4 : Math.pow(Math.random(), 2.2) * 1.1
    const dir = Math.random() * TAU
    const r = radius + braid + Math.cos(dir) * spread
    a[i * 3] = Math.cos(ang) * r
    a[i * 3 + 1] = Math.sin(ang) * r + Math.sin(dir) * spread * 0.7
    a[i * 3 + 2] = (Math.random() - 0.5) * (smoky ? 3.2 : 1.2)
  }
  return a
}

// BLACK HOLE — dark void centre, dense swirling accretion ring.
export function blackHole(N, hole = 4.2, reach = 13) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const r = hole + Math.pow(Math.random(), 2.4) * reach
    const ang = Math.random() * TAU + r * 0.42 // swirl
    a[i * 3] = Math.cos(ang) * r
    a[i * 3 + 1] = Math.sin(ang) * r
    a[i * 3 + 2] = (Math.random() - 0.5) * 1.1
  }
  return a
}

// DNA HELIX — vertical double helix (the "colossal that rolls into DNA").
export function dnaHelix(N, turns = 5, radius = 4.4) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const t = i / N
    const y = (t - 0.5) * 23
    const ang = t * TAU * turns
    const strand = (i % 2) * Math.PI
    const r = radius + (Math.random() - 0.5) * 0.8
    a[i * 3] = Math.cos(ang + strand) * r
    a[i * 3 + 1] = y
    a[i * 3 + 2] = Math.sin(ang + strand) * r
  }
  return a
}

// WAVE — luminous ribbon low across the frame, edges receding (dark top for copy).
export function horizonWave(N) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const u = Math.random() * 2 - 1
    const w = Math.pow(Math.random(), 2)
    const down = Math.random() < 0.82 ? 1 : -0.35
    const crest = -7 + Math.sin(u * 2.3) * 2.0 + Math.sin(u * 5.1 + 1) * 0.6
    a[i * 3] = u * 24
    a[i * 3 + 1] = crest - w * down * 8
    a[i * 3 + 2] = -2 - Math.abs(u) * 6 + (Math.random() - 0.5) * 3
  }
  return a
}

// STARFIELD — scattered cloud (the "white spark" before the galaxy).
export function starfield(N) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    a[i * 3] = (Math.random() - 0.5) * 52
    a[i * 3 + 1] = (Math.random() - 0.5) * 42
    a[i * 3 + 2] = (Math.random() - 0.5) * 52
  }
  return a
}

// GALAXY — full spiral, dense bright core, four soft arms (the finale).
export function galaxy(N, arms = 4, twist = 0.3, spread = 17) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const r = Math.pow(Math.random(), 1.9) * spread // strong core concentration
    const arm = Math.floor(Math.random() * arms) * (TAU / arms)
    const scatter = (Math.random() - 0.5) * (0.5 + r * 0.03)
    const ang = arm + r * twist + scatter
    a[i * 3] = Math.cos(ang) * r
    a[i * 3 + 1] = Math.sin(ang) * r
    a[i * 3 + 2] = (Math.random() - 0.5) * (0.4 + r * 0.03)
  }
  return a
}

// SPHERE SWARM — wispy noisy shell, same filamentary language as the ring.
export function sphereSwarm(N, radius = 8.6) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const theta = Math.random() * TAU
    const phi = Math.acos(2 * Math.random() - 1)
    const smoky = Math.random() < 0.2
    const r = radius + (smoky ? Math.pow(Math.random(), 1.5) * 3.4 : (Math.random() - 0.5) * 1.4)
    a[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    a[i * 3 + 1] = r * Math.cos(phi)
    a[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return a
}

// TORUS KNOT swarm — braided loop, the ring's dramatic sibling.
export function torusKnotSwarm(N, p = 2, q = 3, R = 7.2, tube = 2.1) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const t = Math.random() * TAU
    const r = R + tube * Math.cos(q * t)
    const smoke = Math.pow(Math.random(), 2) * 1.3
    const dir = Math.random() * TAU
    a[i * 3] = (r + Math.cos(dir) * smoke) * Math.cos(p * t)
    a[i * 3 + 1] = (r + Math.sin(dir) * smoke) * Math.sin(p * t) * 0.85
    a[i * 3 + 2] = tube * Math.sin(q * t) * 1.6 + (Math.random() - 0.5) * smoke
  }
  return a
}

// Build all eight, in scroll order (matched to the 8 content sections).
// Every shape stays in the same luminous-swarm family so the orange↔blue
// grade and grain feel continuous while scrolling (New Era language).
export function buildShapes(N) {
  return [
    luminousRing(N),         // 0 Hero        — luminous ring + name
    blackHole(N),            // 1 Capabilities— vortex disc + skill cards
    sphereSwarm(N),          // 2 Core        — wispy sphere shell
    luminousRing(N, 7.6),    // 3 IRIS        — tighter iris ring + metric cards
    dnaHelix(N, 5, 4.7),     // 4 Work        — helix + role cards
    torusKnotSwarm(N),       // 5 Principles  — braided knot
    galaxy(N, 3, 0.34, 15),  // 6 Proof       — spiral
    luminousRing(N, 10.4),   // 7 Contact     — wide ring finale
  ]
}

// Per-scene whole-cloud X-tilt.
export const SCENE_ROT_X = [0.0, -0.55, 0.0, 0.0, 0.0, 0.15, -0.5, 0.0]

// Per-scene continuous-spin behaviour.
export const SCENE_SPIN = ['damp', 'spinZ', 'hyperspin', 'spinZ', 'spinY', 'breathe', 'spinZ', 'damp']

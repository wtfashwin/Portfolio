import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildShapes, SCENE_ROT_X, SCENE_SPIN } from './shapes'
import { scrollStore } from '../scrollStore.js'

const N = 11000

// Simplex noise (Ashima) — subtle organic drift in the vertex shader.
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x/289.)*289.;}
vec4 mod289(vec4 x){return x-floor(x/289.)*289.;}
vec4 permute(vec4 x){return mod289((x*34.+1.)*x);}
vec4 tI(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);vec3 i=floor(v+dot(v,C.yyy)),x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz),l=1.-g,i1=min(g,l.zxy),i2=max(g,l.zxy);vec3 x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-.5;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0,i1.z,i2.z,1))+i.y+vec4(0,i1.y,i2.y,1))+i.x+vec4(0,i1.x,i2.x,1));vec4 j=p-49.*floor(p/49.);vec4 x_=floor(j/7.),y_=j-7.*x_;vec4 x=x_/7.-.5,y=y_/7.-.5;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 g0=vec3(a0.xy,h.x),g1=vec3(a0.zw,h.y),g2=vec3(a1.xy,h.z),g3=vec3(a1.zw,h.w);vec4 nm=tI(vec4(dot(g0,g0),dot(g1,g1),dot(g2,g2),dot(g3,g3)));g0*=nm.x;g1*=nm.y;g2*=nm.z;g3*=nm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m*=m;return 42.*dot(m*m,vec4(dot(g0,x0),dot(g1,x1),dot(g2,x2),dot(g3,x3)));}
`

const smoothstep01 = (x) => x * x * (3 - 2 * x)

export default function ParticleField() {
  const shapes = useMemo(() => buildShapes(N), [])

  // Build geometry + material once.
  const { points, geo, mat, haloMat } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const sizes = new Float32Array(N)
    pos.set(shapes[0])
    for (let i = 0; i < N; i++) sizes[i] = Math.pow(Math.random(), 1.8) * 1.1 + 0.22

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio, 2) } },
      vertexShader:
        NOISE_GLSL +
        /* glsl */ `
        attribute float size; uniform float uTime; uniform float uPixelRatio;
        varying vec3 vC; varying float vA;
        void main(){
          vec3 p = position;
          // pseudo-curl drift: two offset noise fields displace on different axes
          float n1 = snoise(vec3(p.x*.12 + uTime*.06, p.y*.12, p.z*.12));
          float n2 = snoise(vec3(p.y*.14 - uTime*.05, p.z*.14, p.x*.14 + 7.3));
          p.x += n1*.34; p.y += n2*.30; p.z += (n1-n2)*.2;
          // per-particle ember twinkle (phase from size attribute)
          float tw = .72 + .28*sin(uTime*2.1 + size*57.0);
          // NEW ERA two-tone: ember orange above ↔ electric blue below.
          float warmth = smoothstep(-11., 11., position.y*.85 + position.x*.18);
          vec3 cool = vec3(.07, .32, 1.0);   // electric blue
          vec3 warm = vec3(1.0, .30, .03);   // ember orange
          vec3 c = mix(cool, warm, warmth) ; // pure hues — NoToneMapping keeps them saturated
          float core = smoothstep(5.0, 0., length(position.xy));
          c = mix(c, vec3(1.5, 1.25, 1.0), core*.15); // faint warm-white glow at core
          vC = c;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_PointSize = size * uPixelRatio * (95. / -mv.z);
          gl_Position = projectionMatrix * mv;
          vA = smoothstep(140., 1., -mv.z) * .95 * tw;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vC; varying float vA;
        void main(){
          float d = length(gl_PointCoord - .5);
          if (d > .5) discard;
          float glow = smoothstep(.5, .0, d);
          float core = smoothstep(.16, .0, d);
          // hot centre pushes into bloom; halo keeps the hue
          vec3 col = vC * (1.0 + core * 2.2);
          gl_FragColor = vec4(col, (glow * .85 + core * .6) * vA);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false

    // Halo layer: same positions, huge soft sprites at whisper alpha → nebula glow.
    const haloMat = mat.clone()
    haloMat.vertexShader = mat.vertexShader.replace(
      'gl_PointSize = size * uPixelRatio * (95. / -mv.z);',
      'gl_PointSize = size * uPixelRatio * (620. / -mv.z);'
    )
    haloMat.fragmentShader = /* glsl */ `
      varying vec3 vC; varying float vA;
      void main(){
        float d = length(gl_PointCoord - .5);
        if (d > .5) discard;
        gl_FragColor = vec4(vC, smoothstep(.5, .0, d) * vA * .05);
      }`
    const halo = new THREE.Points(geo, haloMat)
    halo.frustumCulled = false

    const group = new THREE.Group()
    group.add(points, halo)
    return { points: group, geo, mat, haloMat }
  }, [shapes])

  const rotX = useRef(SCENE_ROT_X[0])
  const spinZ = useRef(0)
  const spinY = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    mat.uniforms.uTime.value = t
    haloMat.uniforms.uTime.value = t

    // Map scroll progress → shape segment so each scene "settles" when centered.
    // 8 scenes over 7 gaps, so seg = progress*7 puts shape i at section i.
    const offset = scrollStore.progress
    const seg = THREE.MathUtils.clamp(offset * 7, 0, 7)
    const idx = Math.min(Math.floor(seg), 6)
    const local = seg - idx
    const mix = smoothstep01(THREE.MathUtils.clamp(local, 0, 1))
    const from = shapes[idx]
    const to = shapes[idx + 1]

    // Ease current positions toward the morph target (frame-rate independent).
    const arr = geo.attributes.position.array
    const k = 1 - Math.pow(0.0001, delta) // ~0.08 @ 60fps, scaled by delta
    for (let i = 0; i < N * 3; i++) {
      const target = from[i] + (to[i] - from[i]) * mix
      arr[i] += (target - arr[i]) * k
    }
    geo.attributes.position.needsUpdate = true

    // Whole-cloud rotation per nearest scene.
    const scene = Math.round(seg)
    const targetRotX = SCENE_ROT_X[scene]
    rotX.current += (targetRotX - rotX.current) * (1 - Math.pow(0.05, delta))
    points.rotation.x = rotX.current

    const spin = SCENE_SPIN[scene]
    if (spin === 'spinZ') { spinZ.current = t * 0.03; points.rotation.z = spinZ.current }
    else if (spin === 'spinY') { spinY.current = t * 0.08; points.rotation.y = spinY.current }
    else if (spin === 'breathe') { points.rotation.y = t * 0.04; points.rotation.x = rotX.current + Math.sin(t * 0.1) * 0.1 }
    else { points.rotation.z *= 0.98; points.rotation.y *= 0.98 }
  })

  // Keep pixel ratio uniform in sync if the canvas changes.
  return <primitive object={points} />
}

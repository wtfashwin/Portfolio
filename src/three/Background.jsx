import { useMemo } from 'react'
import * as THREE from 'three'

// Far, faint, always-present stars behind the morphing cloud.
export default function Background() {
  const points = useMemo(() => {
    const n = 2400
    const pos = new Float32Array(n * 3)
    const size = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200
      pos[i * 3 + 2] = -50 - Math.random() * 150
      size[i] = Math.random() * 0.8 + 0.1
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: Math.min(devicePixelRatio, 2) } },
      vertexShader: /* glsl */ `
        attribute float size; uniform float uPixelRatio; varying float vA;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_PointSize = size * uPixelRatio * (100. / -mv.z);
          gl_Position = projectionMatrix * mv;
          vA = .18;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - .5);
          if (d > .5) discard;
          gl_FragColor = vec4(.7, .75, .85, smoothstep(.5, .0, d) * vA);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const p = new THREE.Points(geo, mat)
    p.frustumCulled = false
    return p
  }, [])

  return <primitive object={points} />
}

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

import ParticleField from './three/ParticleField.jsx'
import Background from './three/Background.jsx'
import Overlay from './ui/Overlay.jsx'
import Nav from './ui/Nav.jsx'
import Loader from './ui/Loader.jsx'
import { scrollStore } from './scrollStore.js'

// Gentle mouse parallax on the camera (subtle, like the reference).
function CameraRig() {
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  useFrame((state, delta) => {
    const k = 1 - Math.pow(0.02, delta)
    const p = scrollStore.progress
    // dolly the camera in toward the finale ("the object comes closer")
    const t = Math.min(Math.max((p - 0.62) / 0.38, 0), 1)
    const baseZ = 20 - 6 * (t * t * (3 - 2 * t))
    state.camera.position.x += (target.current.x * 1.6 - state.camera.position.x) * k
    state.camera.position.y += (target.current.y * -1.1 - state.camera.position.y) * k
    state.camera.position.z += (baseZ - state.camera.position.z) * k
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function App() {
  const [ready, setReady] = useState(false)

  // Native scroll → normalized progress (the canvas is fixed behind content).
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { scrollStore.update(); raf = 0 })
    }
    scrollStore.update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <Loader done={ready} />
      <Nav />
      <Canvas
        className="r3f-canvas"
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.NoToneMapping }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 20], fov: 55, near: 0.1, far: 300 }}
        onCreated={({ gl }) => { setTimeout(() => setReady(true), 600) }}
      >
        <color attach="background" args={['#050505']} />
        <Suspense fallback={null}>
          <Background />
          <ParticleField />
          <CameraRig />
          <EffectComposer disableNormalPass>
            <Bloom intensity={1.25} luminanceThreshold={0.22} luminanceSmoothing={0.4} mipmapBlur radius={0.75} />
            <Vignette eskil={false} offset={0.2} darkness={0.95} />
          </EffectComposer>
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
      <Overlay />
    </>
  )
}

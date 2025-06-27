"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

function Stars(props: any) {
  const ref = useRef<any>()

  // Generate valid particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(1500) // 500 particles * 3 coordinates
    for (let i = 0; i < 1500; i += 3) {
      // Generate random positions within a sphere
      const radius = Math.random() * 2 + 1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i] = radius * Math.sin(phi) * Math.cos(theta) // x
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) // y
      positions[i + 2] = radius * Math.cos(phi) // z
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#3b82f6" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

function FloatingGeometry() {
  const meshRef = useRef<any>()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, -5]}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} />
    </mesh>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
        <FloatingGeometry />
      </Canvas>
    </div>
  )
}

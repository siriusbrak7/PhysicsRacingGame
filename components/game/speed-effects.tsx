'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Vector3 } from 'three'

interface SpeedEffectsProps {
    speed: number // 0 to 1 (max speed)
}

export function SpeedEffects({ speed }: SpeedEffectsProps) {
    const meshRef = useRef<InstancedMesh>(null)
    const count = 200
    const dummy = useMemo(() => new Object3D(), [])

    // Create random initial positions
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50
            const y = (Math.random() - 0.5) * 30
            const z = -Math.random() * 100
            const length = Math.random() * 5 + 5
            temp.push({ x, y, z, length, speed: Math.random() * 0.5 + 0.5 })
        }
        return temp
    }, [])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        // Animate particles
        particles.forEach((particle, i) => {
            // Move towards camera (positive Z) based on car speed
            // Base movement + Car Speed Boost
            const moveSpeed = 10 + (speed * 80)

            particle.z += moveSpeed * delta

            // Reset if behind camera
            if (particle.z > 10) {
                particle.z = -100
                particle.x = (Math.random() - 0.5) * 50
                particle.y = (Math.random() - 0.5) * 30
            }

            // Update Instance Matrix
            dummy.position.set(particle.x, particle.y, particle.z)

            // Stretch based on speed (simulated motion blur)
            const stretch = 1 + (speed * 10)
            dummy.scale.set(0.05, 0.05, particle.length * stretch)

            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    // Only render if speed > 0.1 to save performance
    if (speed < 0.1) return null

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
        </instancedMesh>
    )
}

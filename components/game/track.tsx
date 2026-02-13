'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function Track() {
    const gridRef = useRef<Mesh>(null)

    useFrame((state, delta) => {
        if (gridRef.current) {
            // Move the grid backwards to simulate forward speed
            // Speed = 20 units per second
            const speed = 20
            gridRef.current.position.z = (gridRef.current.position.z + speed * delta) % 10
        }
    })

    return (
        <group>
            {/* Main Road */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]} receiveShadow>
                <planeGeometry args={[20, 200]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Neon Edges */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10.1, 0.1, -50]}>
                <planeGeometry args={[0.5, 200]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10.1, 0.1, -50]}>
                <planeGeometry args={[0.5, 200]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>

            {/* Lane Markers */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.3, 0.05, -50]}>
                <planeGeometry args={[0.2, 200]} />
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.3, 0.05, -50]}>
                <planeGeometry args={[0.2, 200]} />
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>

            {/* Moving Grid Floor (Synthwave style) */}
            <gridHelper args={[200, 50, 0xff00ff, 0x220022]} position={[0, -0.1, 0]} />
        </group>
    )
}

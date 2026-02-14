'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import { Color, BoxGeometry } from 'three'

interface AnswerGateProps {
    position: [number, number, number]
    text: string
    color: string
    isCorrect: boolean
    speed: number
    playerLane: number
    onPass: (isCorrect: boolean) => void
}

export function AnswerGate({ position, text, color, isCorrect, speed, playerLane, onPass }: AnswerGateProps) {
    const gateRef = useRef<any>(null)
    const passedRef = useRef(false)

    useFrame((state, delta) => {
        if (gateRef.current) {
            // Move gate towards player (+Z)
            // Speed scaling: 500 game speed ~ 50 units/sec
            const moveSpeed = speed * 0.1
            gateRef.current.position.z += moveSpeed * delta

            const z = gateRef.current.position.z

            // Check collision when passing player (approx Z=0 to Z=5)
            // Player is typically at 0 or slightly positive Z depending on camera.
            // Let's assume activation window is small.
            if (z > 0 && z < 5 && !passedRef.current) {
                // Determine gate lane from X position
                // Lanes are -10, 0, 10
                const gateLane = position[0] < -5 ? -1 : position[0] > 5 ? 1 : 0

                if (gateLane === playerLane) {
                    onPass(isCorrect)
                    passedRef.current = true
                }
            }
        }
    })

    return (
        <group position={position} ref={gateRef}>
            {/* Holographic Frame */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[3, 3, 0.1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.2}
                    toneMapped={false}
                />
            </mesh>

            {/* Glowing Edges */}
            <lineSegments>
                <edgesGeometry args={[new BoxGeometry(3, 3, 0.1)]} />
                <lineBasicMaterial color={color} toneMapped={false} linewidth={2} />
            </lineSegments>

            {/* Answer Text */}
            <Text
                position={[0, 1.5, 0.2]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor={color}
            >
                {text}
            </Text>

            {/* Particle Effects (Simplified for now) */}
            <pointLight position={[0, 1.5, 1]} distance={5} intensity={2} color={color} />
        </group>
    )
}

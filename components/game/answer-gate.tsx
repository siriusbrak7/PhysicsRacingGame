'use client'

import { useRef } from 'react'
import { Html, Text } from '@react-three/drei'
import { Color, BoxGeometry } from 'three'

interface AnswerGateProps {
    position: [number, number, number]
    text: string
    color: string
    isCorrect: boolean
}

export function AnswerGate({ position, text, color, isCorrect }: AnswerGateProps) {
    const gateRef = useRef<any>(null)
    const speed = 20 // Match track speed

    useFrame((state, delta) => {
        if (gateRef.current) {
            gateRef.current.position.z += speed * delta

            // Loop for testing purposes (reset when behind camera)
            if (gateRef.current.position.z > 10) {
                gateRef.current.position.z = -100
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

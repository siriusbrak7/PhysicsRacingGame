'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Group } from 'three'

interface PlayerVehicleProps {
    lane: number
    onLaneChange: (lane: number) => void
}

export function PlayerVehicle({ lane, onLaneChange }: PlayerVehicleProps) {
    const vehicleRef = useRef<Group>(null)

    // Basic movement state
    // Lane is now controlled by parent
    const laneWidth = 3.5

    useFrame((state, delta) => {
        if (!vehicleRef.current) return

        // Smooth lane switching lerp
        const targetX = lane * laneWidth
        vehicleRef.current.position.x += (targetX - vehicleRef.current.position.x) * 5 * delta

        // Simulated engine vibration
        vehicleRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 20) * 0.02

        // Dynamic tilt based on steering
        const tilt = (vehicleRef.current.position.x - targetX) * 0.1
        vehicleRef.current.rotation.z = tilt
    })

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') onLaneChange(Math.max(lane - 1, -1))
            if (e.key === 'ArrowRight') onLaneChange(Math.min(lane + 1, 1))
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [lane, onLaneChange])

    // Keyboard controls would go here (hooking into global input state or event listeners)

    return (
        <group ref={vehicleRef}>
            {/* Car Body Placeholder */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[2, 1, 4]} />
                <meshStandardMaterial color="#ff0055" metalness={0.6} roughness={0.2} />
            </mesh>

            {/* Glowing Tail Lights */}
            <mesh position={[-0.8, 0, 2.01]}>
                <planeGeometry args={[0.5, 0.2]} />
                <meshBasicMaterial color="#ff0000" toneMapped={false} />
            </mesh>
            <mesh position={[0.8, 0, 2.01]}>
                <planeGeometry args={[0.5, 0.2]} />
                <meshBasicMaterial color="#ff0000" toneMapped={false} />
            </mesh>

            {/* Headlights Light Source */}
            <spotLight
                position={[0, 0.5, -2]}
                target-position={[0, 0, -20]}
                angle={0.5}
                penumbra={0.5}
                intensity={2}
                distance={50}
                color="#ffffff"
            />
        </group>
    )
}

'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import { Track } from './track'
import { PlayerVehicle } from './player-vehicle'
import { AnswerGate } from './answer-gate'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

export default function Scene3D() {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />

                    {/* Environment & Lighting */}
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 10, 50]} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Game Objects */}
                    <Track />
                    <PlayerVehicle />

                    {/* Test Gates */}
                    <AnswerGate position={[0, 0, -30]} text="F = m * a" color="#00ffff" isCorrect={true} />
                    <AnswerGate position={[-10, 0, -30]} text="F = m / a" color="#ff0055" isCorrect={false} />
                    <AnswerGate position={[10, 0, -30]} text="F = m + a" color="#ff0055" isCorrect={false} />

                    {/* Post Processing */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                        <ChromaticAberration offset={[0.002, 0.002]} />
                    </EffectComposer>

                    {/* Controls - For Debugging */}
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
                </Suspense>
            </Canvas>
        </div>
    )
}

import { useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Stars, CameraShake, PerformanceMonitor } from '@react-three/drei'
import { Suspense } from 'react'
import { Track } from './track'
import { PlayerVehicle } from './player-vehicle'
import { AnswerGate } from './answer-gate'
import { SpeedEffects } from './speed-effects'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { PhysicsQuestion } from '@/lib/physics-questions'

interface Scene3DProps {
    speed: number
    phase: 'countdown' | 'racing' | 'question' | 'finished'
    question: PhysicsQuestion | null
    onGatePass: (isCorrect: boolean) => void
}

export default function Scene3D({ speed, phase, question, onGatePass }: Scene3DProps) {
    // Quality State for Optimization (1 = High/PS5, 0.5 = Low/Mobile 2012)
    const [dpr, setDpr] = useState(1.5)
    const [effectsEnabled, setEffectsEnabled] = useState(true)

    // Player Lane State (-1, 0, 1)
    const [lane, setLane] = useState(0)

    return (
        <div className="w-full h-full bg-black">
            <Canvas shadows dpr={dpr}>
                {/* Performance Monitor downgrade logic */}
                <PerformanceMonitor
                    onDecline={() => {
                        setDpr(1) // Drop resolution
                        setEffectsEnabled(false) // Kill expensive effects
                    }}
                    onIncline={() => {
                        setDpr(1.5) // Restore resolution
                        setEffectsEnabled(true)
                    }}
                />

                <Suspense fallback={null}>
                    {/* Dynamic Camera with Shake */}
                    <PerspectiveCamera makeDefault position={[0, 3, 6]} fov={75 + (speed * 0.1)} />
                    <CameraShake
                        maxPitch={0.02 * (speed / 100)}
                        maxRoll={0.02 * (speed / 100)}
                        maxYaw={0.02 * (speed / 100)}
                        intensity={speed / 200}
                    />

                    {/* Environment & Lighting */}
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 10, 60]} />
                    <ambientLight intensity={0.5} />
                    {effectsEnabled && (
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    )}
                    <Stars radius={100} depth={50} count={effectsEnabled ? 5000 : 1000} factor={4} saturation={0} fade speed={1} />

                    {/* "Warp Speed" Lines */}
                    {effectsEnabled && <SpeedEffects speed={speed / 200} />}

                    {/* Game Objects */}
                    <Track speed={speed} />
                    <PlayerVehicle lane={lane} onLaneChange={setLane} />

                    {/* Answer Gates - Only Show if Question Active */}
                    {question && question.options.map((answer, index) => {
                        // Map 4 options to Left (-1.5), Center-Left (-0.5), Center-Right (0.5), Right (1.5)?
                        // Racing game usually has 3 lanes.
                        // If we have 4 options, maybe we only show 3? Or utilize 4 lanes?
                        // The game supports lanes -1, 0, 1.
                        // Let's just show the first 3 options for now to fit the 3-lane system.
                        if (index > 2) return null

                        const gateLane = index - 1
                        const position: [number, number, number] = [gateLane * 10, 0, -100] // Start far back? No, start far forward (-Z)

                        // Wait, gates move +Z towards camera. So start at -100?
                        // If they move +Z, and camera is at +5.
                        // AnswerGate component updates Z += speed. 
                        // So spawn at -100 is correct.

                        return (
                            <AnswerGate
                                key={index}
                                position={position}
                                text={answer}
                                color={index === question.correctAnswer ? "#00ffff" : "#ff0055"}
                                isCorrect={index === question.correctAnswer}
                                speed={speed}
                                playerLane={lane}
                                onPass={onGatePass}
                            />
                        )
                    })}

                    {/* Post Processing - Only on High End */}
                    {effectsEnabled && (
                        <EffectComposer disableNormalPass>
                            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                            <ChromaticAberration offset={[0.0005 * (speed / 100), 0.0005 * (speed / 100)]} />
                        </EffectComposer>
                    )}
                </Suspense>
            </Canvas>

            {/* Optimization Indicator (Dev only) */}
            <div className="absolute bottom-4 right-4 text-xs text-white opacity-50 font-mono pointer-events-none">
                Running at DPR: {dpr} | Effects: {effectsEnabled ? 'ON' : 'OFF'}
            </div>
        </div>
    )
}



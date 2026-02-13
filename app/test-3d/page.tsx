import Scene3D from '@/components/game/scene-3d'

export default function Test3DPage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-black">
            <Scene3D />

            <div className="absolute top-4 left-4 z-10 p-4 bg-black/50 backdrop-blur text-white rounded pointer-events-none">
                <h1 className="font-bold text-xl">Quantum Velocity 3D Engine Test</h1>
                <p className="text-sm opacity-70">R3F Canvas Active</p>
            </div>
        </main>
    )
}

'use client'

import { CarConfig } from '@/lib/game-types'
import { RaceCar } from './race-car'
import {
  Trophy,
  Target,
  RotateCcw,
  Flame,
  Medal,
  Brain,
} from 'lucide-react'

interface ResultsScreenProps {
  car: CarConfig
  result: 'win' | 'lose'
  correctAnswers: number
  totalQuestions: number
  quizScore: number
  onPlayAgain: () => void
}

export function ResultsScreen({
  car,
  result,
  correctAnswers,
  totalQuestions,
  quizScore,
  onPlayAgain,
}: ResultsScreenProps) {
  const isWin = result === 'win'
  const raceAccuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 ${isWin
            ? 'bg-[radial-gradient(ellipse_at_center,_hsl(187_100%_50%_/_0.06)_0%,_transparent_60%)]'
            : 'bg-[radial-gradient(ellipse_at_center,_hsl(345_100%_60%_/_0.06)_0%,_transparent_60%)]'
          }`}
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Trophy / Result */}
        <div className="mb-6">
          {isWin ? (
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          ) : (
            <Medal className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
          )}
          <h1
            className={`font-display text-6xl md:text-8xl font-black mb-2 tracking-tighter ${isWin ? 'text-primary neon-glow-cyan animate-pulse' : 'text-accent neon-glow-red'
              }`}
          >
            {isWin ? 'P1' : 'P2'}
          </h1>
          <div className="font-display text-sm tracking-[0.4em] uppercase text-muted-foreground mb-4">
            {isWin ? 'Podium Finish' : 'Defeated on the Strip'}
          </div>
          <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed italic">
            {isWin
              ? "Your synchronization of Newton's Laws was flawless. The horsepower was in the mind."
              : "Torque was insufficient. Friction and drag dominated the final quarter mile."}
          </p>
        </div>

        {/* Car */}
        <div className="flex justify-center mb-8">
          <RaceCar car={car} size="medium" />
        </div>

        {/* Telemetry Report */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Brain className="w-12 h-12" />
          </div>

          <h3 className="font-display text-[10px] tracking-[0.2em] uppercase text-primary mb-4">
            Post-Race Telemetry Report
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[10px] text-muted-foreground uppercase">Knowledge Thrust</span>
              <span className="font-display text-sm text-foreground">{quizScore * 20}%</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[10px] text-muted-foreground uppercase">Shift Accuracy</span>
              <span className="font-display text-sm text-foreground">{raceAccuracy}%</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[10px] text-muted-foreground uppercase">Drag Coefficient</span>
              <span className="font-display text-sm text-accent">{(1 - (correctAnswers / totalQuestions || 0)).toFixed(2)} Cd</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[10px] text-muted-foreground uppercase">Peak G-Force</span>
              <span className="font-display text-sm text-primary">{(1.2 + (quizScore / 5)).toFixed(1)} G</span>
            </div>
          </div>
        </div>

        {/* Play Again */}
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-display font-bold text-lg tracking-wider uppercase rounded-lg neon-box-cyan transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Race Again
        </button>
      </div>
    </div>
  )
}

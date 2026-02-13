'use client'

import { useState, useEffect } from 'react'
import { CarConfig } from '@/lib/game-types'
import { RaceCar } from './race-car'
import { Gauge, Zap, Flame, Shield, Trophy } from 'lucide-react'

interface CarRevealScreenProps {
  car: CarConfig
  score: number
  onStartRace: () => void
}

const tierColors: Record<string, string> = {
  bronze: 'text-orange-400',
  silver: 'text-gray-300',
  gold: 'text-yellow-400',
  platinum: 'text-blue-200',
  diamond: 'text-primary',
}

const tierLabels: Record<string, string> = {
  bronze: 'BRONZE TIER',
  silver: 'SILVER TIER',
  gold: 'GOLD TIER',
  platinum: 'PLATINUM TIER',
  diamond: 'DIAMOND TIER',
}

export function CarRevealScreen({
  car,
  score,
  onStartRace,
}: CarRevealScreenProps) {
  const [revealed, setRevealed] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 500)
    const statsTimer = setTimeout(() => setShowStats(true), 1200)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(statsTimer)
    }
  }, [])

  const stats = [
    {
      icon: Gauge,
      label: 'Top Speed',
      value: car.stats.topSpeed,
      color: 'text-primary',
    },
    {
      icon: Zap,
      label: 'Acceleration',
      value: car.stats.acceleration,
      color: 'text-yellow-400',
    },
    {
      icon: Shield,
      label: 'Handling',
      value: car.stats.handling,
      color: 'text-green-400',
    },
    {
      icon: Flame,
      label: 'Nitro',
      value: car.stats.nitro,
      color: 'text-accent',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(187_100%_50%_/_0.06)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Score */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-display text-sm tracking-wider uppercase text-muted-foreground">
            Quiz Score: {score}/5
          </span>
        </div>

        {/* Tier Badge */}
        <div
          className={`mb-2 transition-all duration-700 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className={`font-display text-sm tracking-[0.3em] uppercase ${tierColors[car.tier]}`}
          >
            {tierLabels[car.tier]}
          </span>
        </div>

        {/* Car Name */}
        <h1
          className={`font-display text-4xl md:text-6xl font-bold mb-2 transition-all duration-700 delay-200 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ color: car.color }}
        >
          {car.name}
        </h1>
        <p
          className={`text-muted-foreground mb-10 text-lg transition-all duration-700 delay-300 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {car.description}
        </p>

        {/* Car Visual */}
        <div
          className={`flex justify-center mb-10 transition-all duration-1000 delay-500 ${
            revealed
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 -translate-x-20 scale-90'
          }`}
        >
          <RaceCar car={car} size="large" />
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 transition-all duration-700 ${
            showStats
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {stat.label}
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-1">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: showStats ? `${stat.value}%` : '0%',
                    backgroundColor: car.accentColor,
                  }}
                />
              </div>
              <div className="font-display text-sm text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Race Button */}
        <button
          onClick={onStartRace}
          className={`inline-flex items-center gap-3 px-10 py-4 bg-accent text-accent-foreground font-display font-bold text-lg tracking-wider uppercase rounded-lg neon-box-red transition-all duration-300 hover:scale-105 active:scale-95 ${
            showStats
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: showStats ? '200ms' : '0ms' }}
        >
          <Flame className="w-5 h-5" />
          Enter the Race
          <Flame className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

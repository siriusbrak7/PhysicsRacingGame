'use client'

import { Zap } from 'lucide-react'
import { RaceCar } from './race-car'
import { CAR_CONFIGS } from '@/lib/game-types'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(187_100%_50%_/_0.05)_0%,_transparent_70%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      {/* Animated Road Lines */}
      <div className="absolute bottom-20 left-0 right-0 h-px bg-border opacity-20" />
      <div className="absolute bottom-40 left-0 right-0 h-px bg-border opacity-10" />

      <div className="relative z-10 text-center px-4">
        {/* Title */}
        <div className="mb-2">
          <span className="text-sm font-semibold tracking-[0.3em] uppercase text-muted-foreground">
            Welcome to
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-2">
          <span className="text-primary neon-glow-cyan">PHYSICS</span>
        </h1>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-accent neon-glow-red">RACER</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed">
          Answer physics questions to earn your car. Race smarter, drive faster.
          Your knowledge is your horsepower.
        </p>

        {/* Car showcase with scanner effect */}
        <div className="relative group mb-12 flex justify-center">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

          <div className="relative p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden group-hover:border-primary/20 transition-colors duration-500">
            {/* Holographic grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none racing-stripes" />

            {/* Scanner line */}
            <div className="absolute inset-x-0 h-0.5 bg-primary/60 shadow-[0_0_15px_hsl(187,100%,50%)] z-20 animate-scanner pointer-events-none" />

            <RaceCar car={CAR_CONFIGS[4]} size="large" isMoving />

            {/* Tech callouts */}
            <div className="absolute top-4 left-4 flex flex-col items-start gap-1 font-display text-[8px] text-primary/60 uppercase tracking-widest">
              <span>System: ONLINE</span>
              <span>Propulsion: ION-DRIVE</span>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 font-display text-[8px] text-accent/60 uppercase tracking-widest">
              <span>Model: NEBULA-9</span>
              <span>Tier: PLATINUM</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-transparent border-2 border-primary text-primary font-display font-black text-xl tracking-[0.2em] uppercase rounded-none overflow-hidden transition-all duration-300 hover:text-background"
        >
          {/* Fill effect */}
          <div className="absolute inset-x-0 bottom-0 h-0 bg-primary transition-all duration-300 group-hover:h-full -z-10" />

          <Zap className="w-6 h-6 transition-transform group-hover:rotate-12" />
          ENTER RACE
          <Zap className="w-6 h-6 transition-transform group-hover:-rotate-12" />
        </button>

        <div className="mt-8 flex items-center justify-center gap-8 text-[10px] text-muted-foreground font-display uppercase tracking-[0.3em]">
          <span className="hover:text-primary transition-colors cursor-default">5 Questions</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="hover:text-primary transition-colors cursor-default">Earn Horsepower</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="hover:text-primary transition-colors cursor-default">Rule the Track</span>
        </div>
      </div>
    </div>
  )
}

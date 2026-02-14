'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { CarConfig, RACE_DISTANCE, BOOST_DURATION, BOOST_MULTIPLIER } from '@/lib/game-types'
import { getRandomRaceQuestions, PhysicsQuestion } from '@/lib/physics-questions'
import { RaceCarRear, OpponentCarRear } from './race-car'
import {
  Gauge,
  Zap,
  Timer,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface RaceScreenProps {
  car: CarConfig
  onFinish: (result: 'win' | 'lose', correctAnswers: number, totalQuestions: number) => void
}

type Phase = 'countdown' | 'racing' | 'question' | 'finished'
type ShiftQuality = 'perfect' | 'good' | 'early' | 'late' | 'none'
type Lane = -1 | 0 | 1 // -1: Left, 0: Center, 1: Right

import Scene3D from '@/components/game/scene-3d'

/* ====== SCENE CONTAINER ====== */
// Replaces RoadScene with the 3D Engine
function GameScene({ speed, phase, question, onGatePass }: { speed: number; phase: 'countdown' | 'racing' | 'question' | 'finished'; question: PhysicsQuestion | null; onGatePass: (isCorrect: boolean) => void }) {
  return (
    <div className="absolute inset-0 z-0">
      <Scene3D speed={speed} phase={phase} question={question} onGatePass={onGatePass} />
    </div>
  )
}

/* ====== FINISH LINE ====== */
function FinishLine({ progress }: { progress: number }) {
  if (progress < 80) return null

  const visibility = Math.min((progress - 80) / 15, 1)
  const scale = 0.3 + visibility * 0.7
  const yPos = 44 - visibility * 10

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      style={{
        top: `${yPos}%`,
        opacity: visibility,
        transform: `translateX(-50%) scale(${scale})`,
      }}
    >
      <div className="relative w-64 h-10 overflow-hidden rounded-sm">
        <div
          className="w-full h-full"
          style={{
            background: `repeating-conic-gradient(#fff 0% 25%, #111 0% 50%) 0 0 / 20px 20px`,
          }}
        />
      </div>
      <span className="font-display text-xs tracking-widest text-foreground/60 mt-1">FINISH</span>
    </div>
  )
}

/* ====== TRAFFIC LIGHT COUNTDOWN ====== */
function TrafficLight({ countdown }: { countdown: number }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Traffic light housing */}
      <div className="bg-card border-2 border-border rounded-2xl p-5 flex flex-col items-center gap-4">
        {/* Red light */}
        <div
          className="w-20 h-20 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: countdown >= 3 ? '#ff1744' : '#333',
            background: countdown >= 3 ? 'radial-gradient(circle, #ff4444 0%, #ff1744 50%, #aa0022 100%)' : '#111',
            boxShadow: countdown >= 3 ? '0 0 30px #ff1744, 0 0 60px #ff174488, inset 0 0 15px #ff6666' : 'none',
          }}
        />
        {/* Yellow light */}
        <div
          className="w-20 h-20 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: countdown === 2 ? '#ffcc00' : '#333',
            background: countdown === 2 ? 'radial-gradient(circle, #ffee44 0%, #ffcc00 50%, #cc9900 100%)' : '#111',
            boxShadow: countdown === 2 ? '0 0 30px #ffcc00, 0 0 60px #ffcc0088, inset 0 0 15px #ffee88' : 'none',
          }}
        />
        {/* Green light */}
        <div
          className="w-20 h-20 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: countdown <= 1 ? '#00e676' : '#333',
            background: countdown <= 1 ? 'radial-gradient(circle, #44ff88 0%, #00e676 50%, #00aa44 100%)' : '#111',
            boxShadow: countdown <= 1 ? '0 0 30px #00e676, 0 0 60px #00e67688, inset 0 0 15px #66ffaa' : 'none',
          }}
        />
      </div>
      <div
        key={countdown}
        className="font-display text-6xl font-bold animate-countdown-pop"
        style={{
          color: countdown >= 3 ? '#ff1744' : countdown === 2 ? '#ffcc00' : '#00e676',
          textShadow: countdown >= 3
            ? '0 0 20px #ff1744'
            : countdown === 2
              ? '0 0 20px #ffcc00'
              : '0 0 20px #00e676',
        }}
      >
        {countdown <= 0 ? 'GO!' : countdown}
      </div>
    </div>
  )
}

/* ====== SPEEDOMETER GAUGE ====== */
function SpeedGauge({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  const speedKmh = Math.round(speed * 0.8)
  const pct = Math.min(speed / maxSpeed, 1)
  const angle = -135 + pct * 270
  const r = 50
  const cx = 60
  const cy = 60

  // Arc path for the gauge background
  const arcStart = -135
  const arcEnd = 135
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const startX = cx + r * Math.cos(toRad(arcStart))
  const startY = cy + r * Math.sin(toRad(arcStart))
  const endX = cx + r * Math.cos(toRad(arcEnd))
  const endY = cy + r * Math.sin(toRad(arcEnd))
  const needleX = cx + (r - 10) * Math.cos(toRad(angle))
  const needleY = cy + (r - 10) * Math.sin(toRad(angle))

  // Color arc endpoint
  const colorEndX = cx + r * Math.cos(toRad(angle))
  const colorEndY = cy + r * Math.sin(toRad(angle))
  const largeArcFill = pct * 270 > 180 ? 1 : 0

  return (
    <div className="relative">
      <svg width="120" height="90" viewBox="0 0 120 90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="60%" stopColor="#ffcc00" />
            <stop offset="100%" stopColor="#ff1744" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`}
          fill="none"
          stroke="hsl(240 10% 18%)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {pct > 0.01 && (
          <path
            d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFill} 1 ${colorEndX} ${colorEndY}`}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
          />
        )}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill="#ffffff" />

        {/* Speed text */}
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold" fontFamily="var(--font-orbitron)">
          {speedKmh}
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="hsl(240 5% 55%)" fontSize="7" fontFamily="var(--font-orbitron)">
          {'KM/H'}
        </text>
      </svg>
    </div>
  )
}

/* ====== TACHOMETER / RPM GAUGE ====== */
function Tachometer({ rpm, gear, shiftQuality }: { rpm: number; gear: number; shiftQuality: ShiftQuality }) {
  const maxRpm = 8000
  const pct = Math.min(rpm / maxRpm, 1)

  const isRedline = rpm > 7000

  // Quality color mapping
  const qualityStyles: Record<ShiftQuality, string> = {
    perfect: 'text-cyan-400 neon-glow-cyan',
    good: 'text-green-400',
    early: 'text-red-400',
    late: 'text-red-600',
    none: 'hidden'
  }

  return (
    <div className="relative flex flex-col items-center">
      <svg width="120" height="90" viewBox="0 0 120 90">
        <defs>
          <linearGradient id="tachGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="70%" stopColor="#ffcc00" />
            <stop offset="100%" stopColor="#ff1744" />
          </linearGradient>
        </defs>

        {/* Gauge Background */}
        <path
          d="M 25 75 A 50 50 0 1 1 95 75"
          fill="none"
          stroke="hsl(240 10% 15%)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* RPM Fill */}
        <path
          d={`M 25 75 A 50 50 0 ${pct * 270 > 180 ? 1 : 0} 1 ${60 + 50 * Math.cos(((-225 + pct * 270) * Math.PI) / 180)} ${45 + 50 * Math.sin(((-225 + pct * 270) * Math.PI) / 180)}`}
          fill="none"
          stroke="url(#tachGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          className="transition-all duration-100"
        />

        {/* Center Gear Info */}
        <text x="60" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="var(--font-orbitron)">
          {gear}
        </text>
        <text x="60" y="62" textAnchor="middle" fill="hsl(240 5% 60%)" fontSize="6" fontFamily="var(--font-orbitron)">
          GEAR
        </text>

        <text x="60" y="82" textAnchor="middle" fill={isRedline ? '#ff1744' : 'white'} fontSize="8" fontWeight="bold">
          {Math.round(rpm)}
        </text>
      </svg>

      {/* Shift Quality Feedback */}
      {shiftQuality !== 'none' && (
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold uppercase tracking-[0.2em] animate-bounce-fade-out ${qualityStyles[shiftQuality]}`}>
          {shiftQuality}
        </div>
      )}
    </div>
  )
}

/* ====== MAIN RACE SCREEN ====== */
export function RaceScreen({ car, onFinish }: RaceScreenProps) {
  const [phase, setPhase] = useState<Phase>('countdown')
  const [countdown, setCountdown] = useState(3)
  const [playerPos, setPlayerPos] = useState(0)
  const [opponentPos, setOpponentPos] = useState(0)
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const [opponentSpeed, setOpponentSpeed] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [boostActive, setBoostActive] = useState(false)
  const [boostTimeLeft, setBoostTimeLeft] = useState(0)
  const [penaltyActive, setPenaltyActive] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<PhysicsQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [questions] = useState(() => getRandomRaceQuestions(8))

  // New State for Controls
  const [lane, setLane] = useState<Lane>(0)
  const [gear, setGear] = useState(1)
  const [rpm, setRpm] = useState(0)
  const [lastShiftQuality, setLastShiftQuality] = useState<ShiftQuality>('none')
  const [shiftBoost, setShiftBoost] = useState(0)

  const questionIndexRef = useRef(0)
  const nextQuestionTimeRef = useRef(4000)
  const raceFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const finishedRef = useRef(false)

  // Refs for animation loop values
  const boostRef = useRef(boostActive)
  const penaltyRef = useRef(penaltyActive)
  const playerSpeedRef = useRef(0)
  const opponentSpeedRef = useRef(0)
  const playerPosRef = useRef(0)
  const opponentPosRef = useRef(0)
  const timeRef = useRef(0)

  const gearRef = useRef(1)
  const rpmRef = useRef(0)
  const shiftBoostRef = useRef(0)

  useEffect(() => { boostRef.current = boostActive }, [boostActive])
  useEffect(() => { penaltyRef.current = penaltyActive }, [penaltyActive])

  const maxSpeed = (car.stats.topSpeed / 100) * 520

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('racing')
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, countdown])

  // Gear Ratios (simplified)
  const GEAR_RATIOS = [0, 4.0, 2.5, 1.8, 1.3, 1.0, 0.8]
  const REDLINE = 7500

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'racing') return

      if (e.key === 'ArrowLeft') {
        setLane(prev => Math.max(-1, prev - 1) as Lane)
      } else if (e.key === 'ArrowRight') {
        setLane(prev => Math.min(1, prev + 1) as Lane)
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        // Shift Up mechanic
        if (gear < 6) {
          const currentRpm = rpmRef.current
          let quality: ShiftQuality = 'none'

          if (currentRpm >= 6200 && currentRpm <= 6800) {
            quality = 'perfect'
            shiftBoostRef.current = 1.0
          } else if (currentRpm >= 5500 && currentRpm < 6200) {
            quality = 'good'
            shiftBoostRef.current = 0.5
          } else if (currentRpm > 6800) {
            quality = 'late'
            shiftBoostRef.current = -0.2
          } else {
            quality = 'early'
            shiftBoostRef.current = -0.5
          }

          setLastShiftQuality(quality)
          setGear(prev => {
            const next = prev + 1
            gearRef.current = next
            return next
          })

          // Clear quality after a bit
          setTimeout(() => setLastShiftQuality('none'), 1000)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, gear])

  // Race loop
  useEffect(() => {
    if (phase !== 'racing') return

    lastTimeRef.current = performance.now()

    const loop = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      if (dt > 0.1) {
        raceFrameRef.current = requestAnimationFrame(loop)
        return
      }

      // Update time
      timeRef.current += dt * 1000
      setTimeElapsed(timeRef.current)

      // Check if should show question
      if (
        timeRef.current > nextQuestionTimeRef.current &&
        questionIndexRef.current < questions.length
      ) {
        nextQuestionTimeRef.current = timeRef.current + 6500 + Math.random() * 3500
        setCurrentQuestion(questions[questionIndexRef.current])
        questionIndexRef.current++
        setPhase('question')
        raceFrameRef.current = requestAnimationFrame(loop)
        return
      }

      // Player physics with RPM and Gears
      const baseAccel = (car.stats.acceleration / 100) * 350
      const topSpeed = (car.stats.topSpeed / 100) * 580
      const isBoosted = boostRef.current
      const isPenalized = penaltyRef.current

      // RPM Logic: RPM = Speed * Constant / GearRatio
      // Max speed in gear 1 is approx topSpeed / 3
      const gearRatio = GEAR_RATIOS[gearRef.current]
      const targetRpm = (playerSpeedRef.current * 80) / gearRatio

      // RPM Smoothing
      rpmRef.current += (targetRpm - rpmRef.current) * 0.1
      setRpm(rpmRef.current)

      // Power Band: Max torque between 5000 and 7000 RPM
      let torqueFactor = 1.0
      if (rpmRef.current < 3000) torqueFactor = 0.6 + (rpmRef.current / 3000) * 0.4
      else if (rpmRef.current > 7000) torqueFactor = 1.0 - ((rpmRef.current - 7000) / 1000) * 0.5

      let currentAccel = baseAccel * torqueFactor * (1.0 / gearRatio)

      // Apply Shift Boost
      if (shiftBoostRef.current > 0) {
        currentAccel *= (1 + shiftBoostRef.current)
        shiftBoostRef.current -= dt * 2 // Bleed off boost
      } else if (shiftBoostRef.current < 0) {
        currentAccel *= (1 + shiftBoostRef.current) // Penalty
        shiftBoostRef.current += dt * 1
      }

      if (isBoosted) currentAccel *= BOOST_MULTIPLIER
      if (isPenalized) currentAccel *= 0.3

      const maxSpd = topSpeed * (isBoosted ? 1.2 : 1) * (isPenalized ? 0.5 : 1)

      // Friction / Drag increases with speed squared
      const drag = (playerSpeedRef.current / topSpeed) ** 2 * 0.2 * baseAccel

      playerSpeedRef.current = Math.min(playerSpeedRef.current + (currentAccel - drag) * dt, maxSpd)
      playerPosRef.current = Math.min(playerPosRef.current + playerSpeedRef.current * dt, RACE_DISTANCE)

      // Opponent physics (remains simple but slightly faster to challenge player)
      const oppTopSpeed = 440
      const oppAccel = 210
      opponentSpeedRef.current = Math.min(opponentSpeedRef.current + oppAccel * dt, oppTopSpeed)
      opponentPosRef.current = Math.min(opponentPosRef.current + opponentSpeedRef.current * dt, RACE_DISTANCE)

      // Sync to React state
      setPlayerSpeed(playerSpeedRef.current)
      setOpponentSpeed(opponentSpeedRef.current)
      setPlayerPos(playerPosRef.current)
      setOpponentPos(opponentPosRef.current)

      // Check finish
      if (
        (playerPosRef.current >= RACE_DISTANCE || opponentPosRef.current >= RACE_DISTANCE) &&
        !finishedRef.current
      ) {
        finishedRef.current = true
        setPhase('finished')
        return
      }

      raceFrameRef.current = requestAnimationFrame(loop)
    }

    raceFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (raceFrameRef.current) cancelAnimationFrame(raceFrameRef.current)
    }
  }, [phase, car, questions, gear])

  // Boost timer
  useEffect(() => {
    if (!boostActive) return
    const timer = setTimeout(() => {
      setBoostActive(false)
      setBoostTimeLeft(0)
    }, BOOST_DURATION)
    const interval = setInterval(() => {
      setBoostTimeLeft((t) => Math.max(0, t - 100))
    }, 100)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [boostActive])

  // Penalty timer
  useEffect(() => {
    if (!penaltyActive) return
    const timer = setTimeout(() => setPenaltyActive(false), 1500)
    return () => clearTimeout(timer)
  }, [penaltyActive])

  // Handle question answer
  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || selectedAnswer !== null) return
      setSelectedAnswer(answerIndex)
      setShowExplanation(true)
      setTotalAnswered((t) => t + 1)

      const isCorrect = answerIndex === currentQuestion.correctAnswer
      if (isCorrect) {
        setCorrectAnswers((c) => c + 1)
        setBoostActive(true)
        setBoostTimeLeft(BOOST_DURATION)
      } else {
        setPenaltyActive(true)
      }

      setTimeout(() => {
        setCurrentQuestion(null)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setPhase('racing')
      }, 2000)
    },
    [currentQuestion, selectedAnswer]
  )

  // Handle finish
  useEffect(() => {
    if (phase !== 'finished') return
    const result = playerPos >= opponentPos ? 'win' : 'lose'
    const timer = setTimeout(() => {
      onFinish(result, correctAnswers, totalAnswered)
    }, 2500)
    return () => clearTimeout(timer)
  }, [phase, playerPos, opponentPos, onFinish, correctAnswers, totalAnswered])

  // Bridge 3D Gate Logic to Game State
  const handleGatePass = useCallback((isCorrect: boolean) => {
    if (!currentQuestion) return
    const idx = isCorrect ? currentQuestion.correctAnswer : (currentQuestion.correctAnswer + 1) % 3
    handleAnswer(idx)
  }, [currentQuestion, handleAnswer])

  const playerProgress = Math.min((playerPos / RACE_DISTANCE) * 100, 100)
  const opponentProgress = Math.min((opponentPos / RACE_DISTANCE) * 100, 100)

  // Opponent visual position: how far ahead/behind relative to player
  const posDelta = opponentPos - playerPos
  // Normalize: positive means opponent is ahead, negative means behind
  const normalizedDelta = Math.max(-300, Math.min(300, posDelta))
  // Map to vertical position: ahead = higher on screen (closer to vanishing point), behind = lower
  const opponentY = 30 + ((300 - normalizedDelta) / 600) * 45
  // Scale: ahead = smaller, behind = larger
  const opponentScale = Math.max(0.25, Math.min(1.4, 1 - normalizedDelta / 600))

  const isRacing = phase === 'racing' || phase === 'question'

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      {/* 3D Game Scene */}
      <GameScene
        speed={playerSpeed}
        phase={phase}
        question={currentQuestion}
        onGatePass={handleGatePass}
      />

      {/* Finish Line (Overlay for now, could be 3D later) */}
      <FinishLine progress={playerProgress} />

      {/* Opponent Car (2D Overlay preserved for now) */}
      {isRacing && (
        <div
          className="absolute left-1/2 transition-all duration-100 ease-linear"
          style={{
            top: `${opponentY}%`,
            transform: `translateX(${normalizedDelta > 0 ? '-70%' : '-30%'})`,
            zIndex: 10 // Ensure it's above 3D canvas? No, canvas is z-0.
          }}
        >
          <OpponentCarRear scale={opponentScale} />
        </div>
      )}

      {/* 2D Player Car REMOVED - Replaced by 3D PlayerVehicle */}\


      {/* === HUD OVERLAY === */}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 md:px-6 py-2 bg-background/40 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <Timer className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-display text-xs text-muted-foreground tabular-nums">
            {(timeElapsed / 1000).toFixed(1)}s
          </span>
        </div>
        <div className="font-display text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Quarter Mile Drag Race
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-xs text-primary tabular-nums">
            {correctAnswers}/{totalAnswered}
          </span>
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      {/* Progress bars */}
      <div className="absolute top-10 left-3 right-3 md:left-6 md:right-6 z-30 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-[10px] text-primary w-8">YOU</span>
          <div className="flex-1 bg-secondary/40 rounded-full h-1.5 backdrop-blur">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-100"
              style={{ width: `${playerProgress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-[10px] text-accent w-8">OPP</span>
          <div className="flex-1 bg-secondary/40 rounded-full h-1.5 backdrop-blur">
            <div
              className="h-1.5 rounded-full bg-accent transition-all duration-100"
              style={{ width: `${opponentProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Speedometer & Tachometer - bottom left/right */}
      <div className="absolute bottom-40 left-2 md:left-4 z-30 flex items-end gap-2">
        <SpeedGauge speed={playerSpeed} maxSpeed={maxSpeed} />
        <Tachometer rpm={rpm} gear={gear} shiftQuality={lastShiftQuality} />
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-8 left-4 z-30 opacity-40 hidden md:block">
        <div className="flex flex-col gap-1 font-display text-[10px] text-white">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 border border-white rounded">SPACE</span>
            <span>SHIFT UP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 border border-white rounded">← →</span>
            <span>STEER</span>
          </div>
        </div>
      </div>

      {/* Boost / Penalty indicators - bottom right */}
      <div className="absolute bottom-48 right-2 md:right-4 z-30 flex flex-col gap-2 items-end">
        {boostActive && (
          <div className="bg-green-500/15 backdrop-blur border border-green-500/40 rounded-lg px-3 py-2 neon-box-cyan">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="font-display text-xs text-green-400 uppercase tracking-wider">
                Nitro
              </span>
            </div>
            <div className="w-24 bg-secondary/50 rounded-full h-1.5 mt-1.5">
              <div
                className="h-1.5 rounded-full bg-green-500 transition-all duration-100"
                style={{ width: `${(boostTimeLeft / BOOST_DURATION) * 100}%` }}
              />
            </div>
          </div>
        )}
        {penaltyActive && (
          <div className="bg-red-500/15 backdrop-blur border border-red-500/40 rounded-lg px-3 py-2 neon-box-red">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="font-display text-xs text-red-400 uppercase tracking-wider">
                Drag
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gear / car name indicator */}
      <div className="absolute bottom-52 left-1/2 -translate-x-1/2 z-20">
        <span className="font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
          {car.name}
        </span>
      </div>

      {/* === COUNTDOWN OVERLAY === */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <TrafficLight countdown={countdown} />
        </div>
      )}

      {/* === QUESTION OVERLAY === */}
      {(phase === 'question') && currentQuestion && (
        <div className="absolute inset-x-0 bottom-52 z-40 px-3 md:px-6">
          <div className="max-w-xl mx-auto bg-card/90 backdrop-blur-md border border-primary/30 rounded-xl p-4 neon-box-cyan">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="font-display text-[10px] tracking-[0.15em] uppercase text-primary">
                Answer for Nitro Boost
              </span>
            </div>
            <h3 className="font-display text-sm md:text-base font-bold text-foreground mb-3 leading-relaxed">
              {currentQuestion.question}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.options.map((option, index) => {
                let classes =
                  'p-2.5 rounded-lg border-2 text-xs md:text-sm font-semibold transition-all duration-200 text-left '

                if (showExplanation) {
                  if (index === currentQuestion.correctAnswer) {
                    classes += 'border-green-500 bg-green-500/10 text-green-300'
                  } else if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
                    classes += 'border-red-500 bg-red-500/10 text-red-300'
                  } else {
                    classes += 'border-border bg-secondary/30 text-muted-foreground opacity-50'
                  }
                } else {
                  classes += 'border-border bg-secondary/30 text-foreground hover:border-primary cursor-pointer active:scale-[0.97]'
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={classes}
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                      {showExplanation && index === currentQuestion.correctAnswer && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto shrink-0" />
                      )}
                      {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <XCircle className="w-3.5 h-3.5 text-red-500 ml-auto shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            {showExplanation && (
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* === FINISH OVERLAY === */}
      {phase === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="text-center">
            <Trophy
              className={`w-14 h-14 mx-auto mb-3 ${playerPos >= opponentPos ? 'text-yellow-400' : 'text-muted-foreground'
                }`}
            />
            <h2
              className={`font-display text-4xl md:text-6xl font-bold mb-2 ${playerPos >= opponentPos
                ? 'text-primary neon-glow-cyan'
                : 'text-accent neon-glow-red'
                }`}
            >
              {playerPos >= opponentPos ? 'YOU WIN!' : 'YOU LOSE!'}
            </h2>
            <p className="text-sm text-muted-foreground font-display tracking-wider">
              {(timeElapsed / 1000).toFixed(2)}s &middot; {Math.round(playerSpeed * 0.8)} km/h top speed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

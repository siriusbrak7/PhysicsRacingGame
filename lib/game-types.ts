export type CarTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface CarStats {
  topSpeed: number
  acceleration: number
  handling: number
  nitro: number
}

export interface CarConfig {
  id: string
  name: string
  tier: CarTier
  color: string
  accentColor: string
  // 3D Specific Properties
  modelColor: string
  emissiveColor: string
  physics: {
    mass: number
    friction: number
    drag: number
  }
  stats: CarStats
  description: string
  minScore: number
}

export interface RaceState {
  phase: 'countdown' | 'racing' | 'question' | 'finished'
  playerPosition: number
  opponentPosition: number
  playerSpeed: number
  opponentSpeed: number
  playerAcceleration: number
  distance: number
  timeElapsed: number
  questionsAnswered: number
  correctAnswers: number
  boostActive: boolean
  boostTimeRemaining: number
}

export interface GameState {
  screen: 'start' | 'quiz' | 'car-reveal' | 'race' | 'results'
  quizScore: number
  currentQuestion: number
  selectedCar: CarConfig | null
  raceResult: 'win' | 'lose' | null
}

export const CAR_CONFIGS: CarConfig[] = [
  {
    id: 'streetrunner',
    name: 'Street Runner MK-I',
    tier: 'bronze',
    color: '#8B7355',
    accentColor: '#CD853F',
    modelColor: '#8B7355',
    emissiveColor: '#CD853F',
    physics: { mass: 1200, friction: 0.8, drag: 0.35 },
    stats: { topSpeed: 65, acceleration: 55, handling: 60, nitro: 40 },
    description: 'A reliable starter. Gets the job done, but nothing fancy.',
    minScore: 0,
  },
  {
    id: 'thunderbolt',
    name: 'Thunderbolt V6',
    tier: 'silver',
    color: '#A8A8A8',
    accentColor: '#00e5ff',
    modelColor: '#A8A8A8',
    emissiveColor: '#00e5ff',
    physics: { mass: 1100, friction: 0.85, drag: 0.32 },
    stats: { topSpeed: 72, acceleration: 65, handling: 68, nitro: 55 },
    description: 'Balanced performance with a kick of turbo when you need it.',
    minScore: 2,
  },
  {
    id: 'phantom',
    name: 'Phantom GT-R',
    tier: 'gold',
    color: '#FFD700',
    accentColor: '#FF8C00',
    modelColor: '#FFD700',
    emissiveColor: '#FF8C00',
    physics: { mass: 1000, friction: 0.9, drag: 0.3 },
    stats: { topSpeed: 80, acceleration: 75, handling: 78, nitro: 65 },
    description: 'A golden beast that dominates the quarter mile.',
    minScore: 3,
  },
  {
    id: 'vortex',
    name: 'Vortex X-9',
    tier: 'platinum',
    color: '#E5E4E2',
    accentColor: '#ff1744',
    modelColor: '#E5E4E2',
    emissiveColor: '#ff1744',
    physics: { mass: 900, friction: 0.95, drag: 0.28 },
    stats: { topSpeed: 88, acceleration: 85, handling: 82, nitro: 80 },
    description: 'Cutting-edge engineering. Feels like driving the future.',
    minScore: 4,
  },
  {
    id: 'nebula',
    name: 'Nebula Hyperion',
    tier: 'diamond',
    color: '#00e5ff',
    accentColor: '#ff1744',
    modelColor: '#00e5ff',
    emissiveColor: '#ff1744',
    physics: { mass: 800, friction: 1.0, drag: 0.25 },
    stats: { topSpeed: 95, acceleration: 92, handling: 90, nitro: 95 },
    description: 'The ultimate machine. Pure velocity incarnate.',
    minScore: 5,
  },
]

export function getCarByScore(score: number): CarConfig {
  const sorted = [...CAR_CONFIGS].sort((a, b) => b.minScore - a.minScore)
  return sorted.find((car) => score >= car.minScore) || CAR_CONFIGS[0]
}

export const RACE_DISTANCE = 1000
export const QUESTION_INTERVAL = 3500
export const BOOST_DURATION = 2000
export const BOOST_MULTIPLIER = 1.6

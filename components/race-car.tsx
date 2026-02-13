'use client'

import { CarConfig } from '@/lib/game-types'

interface RaceCarProps {
  car: CarConfig
  size?: 'small' | 'medium' | 'large'
  isMoving?: boolean
  boostActive?: boolean
  className?: string
}

/* ===== SIDE-VIEW CAR (used in quiz/reveal/results screens) ===== */
export function RaceCar({
  car,
  size = 'medium',
  isMoving = false,
  boostActive = false,
  className = '',
}: RaceCarProps) {
  const dimensions = {
    small: { width: 120, height: 40 },
    medium: { width: 220, height: 70 },
    large: { width: 360, height: 115 },
  }
  const { width, height } = dimensions[size]

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isMoving ? 'animate-shake' : ''}
      >
        <defs>
          <linearGradient id={`bodyGrad-${car.id}`} x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={car.color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={car.color} />
            <stop offset="100%" stopColor={car.color} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`glassGrad-${car.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a4a" />
            <stop offset="100%" stopColor="#0a1520" />
          </linearGradient>
          <filter id={`neonGlow-${car.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`boostGlow-${car.id}`}>
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Body */}
        <path
          d="M 30 75 L 15 68 L 8 60 Q 5 55 10 50 L 45 42 L 80 30 Q 100 22 130 20 L 175 18 Q 195 17 210 20 L 250 28 Q 275 32 290 38 L 320 48 Q 340 54 345 60 L 348 65 Q 350 70 345 75 L 30 75 Z"
          fill={`url(#bodyGrad-${car.id})`}
          stroke={car.accentColor}
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />
        <path d="M 115 30 Q 120 18 145 15 L 195 14 Q 215 14 225 18 L 245 28 Q 235 24 210 22 L 150 20 Q 130 20 120 26 Z" fill={car.color} opacity="0.6" />
        <path d="M 110 38 L 135 20 Q 145 15 165 15 L 190 15 Q 195 15 198 17 L 205 22 L 140 35 Z" fill={`url(#glassGrad-${car.id})`} stroke={car.accentColor} strokeWidth="0.8" strokeOpacity="0.6" />
        <path d="M 210 22 L 250 30 L 240 35 L 207 26 Z" fill={`url(#glassGrad-${car.id})`} stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.4" />
        <path d="M 142 34 L 205 24 L 237 33 L 135 38 Z" fill="#0d2030" opacity="0.8" />
        <path d="M 55 48 L 95 34 L 105 34 L 68 48 Z" fill={car.accentColor} opacity="0.4" />
        <path d="M 70 55 L 100 45 L 108 45 L 80 55 Z" fill="#080808" stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.3" />
        {[0, 1, 2].map((i) => (
          <line key={`vent-${i}`} x1={58 + i * 12} y1={52 - i * 2} x2={65 + i * 12} y2={48 - i * 2} stroke={car.accentColor} strokeWidth="0.8" strokeOpacity="0.5" />
        ))}
        <path d="M 285 55 L 340 60 L 345 68 L 340 72 L 290 72 L 285 65 Z" fill="#1a1a1a" stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.3" />
        <path d="M 265 25 L 310 35 L 325 42 L 330 38 L 315 30 L 270 20 Z" fill={car.color} stroke={car.accentColor} strokeWidth="0.8" opacity="0.9" />
        <line x1="280" y1="28" x2="285" y2="45" stroke={car.color} strokeWidth="2.5" />
        <line x1="310" y1="35" x2="312" y2="50" stroke={car.color} strokeWidth="2.5" />
        <ellipse cx="22" cy="58" rx="8" ry="5" fill="#ffffff" opacity="0.9" filter={`url(#neonGlow-${car.id})`} />
        <ellipse cx="22" cy="58" rx="4" ry="2.5" fill={car.accentColor} opacity="0.8" />
        <path d="M 8 68 L 5 75 L 50 78 L 50 72 Z" fill="#1a1a1a" stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.4" />
        <rect x="338" y="58" width="8" height="4" rx="1" fill="#ff1744" filter={`url(#neonGlow-${car.id})`} opacity="0.9" />
        <rect x="338" y="64" width="8" height="4" rx="1" fill="#ff1744" filter={`url(#neonGlow-${car.id})`} opacity="0.7" />
        <line x1="40" y1="77" x2="330" y2="77" stroke={car.accentColor} strokeWidth="2" strokeOpacity={isMoving ? 0.8 : 0.4} filter={`url(#neonGlow-${car.id})`} className="animate-neon-pulse" />
        <path d="M 20 58 L 80 35 L 85 35 L 25 58 Z" fill={car.accentColor} opacity="0.3" />
        <path d="M 20 62 L 80 39 L 85 39 L 25 62 Z" fill={car.accentColor} opacity="0.2" />

        {/* Front Wheel */}
        <g>
          <circle cx="75" cy="78" r="15" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="2" />
          <circle cx="75" cy="78" r="11" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
          <circle cx="75" cy="78" r="5" fill="#444" />
          <circle cx="75" cy="78" r="2" fill="#666" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line key={`fspoke-${angle}`} x1={75 + 5 * Math.cos((angle * Math.PI) / 180)} y1={78 + 5 * Math.sin((angle * Math.PI) / 180)} x2={75 + 10 * Math.cos((angle * Math.PI) / 180)} y2={78 + 10 * Math.sin((angle * Math.PI) / 180)} stroke="#555" strokeWidth="1.5" />
          ))}
          <circle cx="75" cy="78" r="14" fill="none" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* Rear Wheel */}
        <g>
          <circle cx="285" cy="78" r="16" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="2" />
          <circle cx="285" cy="78" r="12" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
          <circle cx="285" cy="78" r="5" fill="#444" />
          <circle cx="285" cy="78" r="2" fill="#666" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line key={`rspoke-${angle}`} x1={285 + 5 * Math.cos((angle * Math.PI) / 180)} y1={78 + 5 * Math.sin((angle * Math.PI) / 180)} x2={285 + 11 * Math.cos((angle * Math.PI) / 180)} y2={78 + 11 * Math.sin((angle * Math.PI) / 180)} stroke="#555" strokeWidth="1.5" />
          ))}
          <circle cx="285" cy="78" r="15" fill="none" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        <ellipse cx="348" cy="72" rx="4" ry="3" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />

        {/* Boost Flames */}
        {boostActive && (
          <g filter={`url(#boostGlow-${car.id})`}>
            <path d="M 350 68 L 380 70 L 370 72 L 395 72 L 365 74 L 350 76" fill="#ff6600" opacity="0.9">
              <animate attributeName="d" dur="0.15s" repeatCount="indefinite" values="M 350 68 L 380 70 L 370 72 L 395 72 L 365 74 L 350 76;M 350 68 L 375 69 L 365 72 L 385 71 L 370 74 L 350 76;M 350 68 L 380 70 L 370 72 L 395 72 L 365 74 L 350 76" />
            </path>
            <path d="M 350 69 L 370 71 L 362 72 L 378 72 L 360 73 L 350 75" fill="#ffcc00" opacity="0.9">
              <animate attributeName="d" dur="0.1s" repeatCount="indefinite" values="M 350 69 L 370 71 L 362 72 L 380 72 L 360 73 L 350 75;M 350 69 L 365 70 L 358 72 L 375 71 L 363 73 L 350 75;M 350 69 L 370 71 L 362 72 L 380 72 L 360 73 L 350 75" />
            </path>
          </g>
        )}

        {/* Speed lines */}
        {isMoving && (
          <g opacity="0.4">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`speedline-${i}`} x1={-10 - i * 15} y1={45 + i * 8} x2={-25 - i * 15} y2={45 + i * 8} stroke={car.accentColor} strokeWidth="1.5" opacity={0.6 - i * 0.1}>
                <animate attributeName="x1" from={-5 - i * 10} to={-40 - i * 10} dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
                <animate attributeName="x2" from={-15 - i * 10} to={-55 - i * 10} dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

/* ===== SIDE-VIEW OPPONENT CAR ===== */
interface OpponentCarProps {
  size?: 'small' | 'medium' | 'large'
  isMoving?: boolean
  className?: string
}

export function OpponentCar({ size = 'medium', isMoving = false, className = '' }: OpponentCarProps) {
  const dimensions = { small: { width: 120, height: 40 }, medium: { width: 220, height: 70 }, large: { width: 360, height: 115 } }
  const { width, height } = dimensions[size]
  const color = '#ff1744'
  const accent = '#ff6600'

  return (
    <div className={`relative inline-block ${className}`}>
      <svg width={width} height={height} viewBox="0 0 360 115" fill="none" xmlns="http://www.w3.org/2000/svg" className={isMoving ? 'animate-shake' : ''}>
        <defs>
          <linearGradient id="oppBodyGrad" x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.9" />
          </linearGradient>
          <filter id="oppGlow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M 30 75 L 15 68 L 8 60 Q 5 55 10 50 L 45 42 L 80 30 Q 100 22 130 20 L 175 18 Q 195 17 210 20 L 250 28 Q 275 32 290 38 L 320 48 Q 340 54 345 60 L 348 65 Q 350 70 345 75 L 30 75 Z" fill="url(#oppBodyGrad)" stroke={accent} strokeWidth="0.5" strokeOpacity="0.5" />
        <path d="M 110 38 L 135 20 Q 145 15 165 15 L 190 15 Q 195 15 198 17 L 205 22 L 140 35 Z" fill="#200808" stroke={accent} strokeWidth="0.8" strokeOpacity="0.6" />
        <path d="M 210 22 L 250 30 L 240 35 L 207 26 Z" fill="#200808" />
        <path d="M 142 34 L 205 24 L 237 33 L 135 38 Z" fill="#200808" opacity="0.8" />
        <path d="M 265 25 L 310 35 L 325 42 L 330 38 L 315 30 L 270 20 Z" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.9" />
        <line x1="280" y1="28" x2="285" y2="45" stroke={color} strokeWidth="2.5" />
        <line x1="310" y1="35" x2="312" y2="50" stroke={color} strokeWidth="2.5" />
        <ellipse cx="22" cy="58" rx="8" ry="5" fill="#ffffff" opacity="0.9" filter="url(#oppGlow)" />
        <ellipse cx="22" cy="58" rx="4" ry="2.5" fill={accent} opacity="0.8" />
        <line x1="40" y1="77" x2="330" y2="77" stroke={accent} strokeWidth="2" strokeOpacity={isMoving ? 0.8 : 0.4} filter="url(#oppGlow)" className="animate-neon-pulse" />
        <rect x="338" y="58" width="8" height="4" rx="1" fill="#ff1744" filter="url(#oppGlow)" opacity="0.9" />
        <rect x="338" y="64" width="8" height="4" rx="1" fill="#ff1744" filter="url(#oppGlow)" opacity="0.7" />
        <circle cx="75" cy="78" r="15" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="2" />
        <circle cx="75" cy="78" r="11" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
        <circle cx="75" cy="78" r="5" fill="#444" />
        <circle cx="285" cy="78" r="16" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="2" />
        <circle cx="285" cy="78" r="12" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
        <circle cx="285" cy="78" r="5" fill="#444" />
        <ellipse cx="348" cy="72" rx="4" ry="3" fill="#2a2a2a" />
        {isMoving && (
          <g opacity="0.4">
            {[0, 1, 2, 3].map((i) => (
              <line key={`ospeed-${i}`} x1={-10 - i * 15} y1={50 + i * 8} x2={-25 - i * 15} y2={50 + i * 8} stroke={accent} strokeWidth="1.5">
                <animate attributeName="opacity" from="0.5" to="0" dur={`${0.35 + i * 0.05}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

/* ===== REAR-VIEW PLAYER CAR (first-person perspective) ===== */
interface RaceCarRearProps {
  car: CarConfig
  boostActive?: boolean
  speed?: number
  className?: string
}

export function RaceCarRear({ car, boostActive = false, speed = 0, className = '' }: RaceCarRearProps) {
  const shakeIntensity = Math.min(speed / 500, 1)

  return (
    <div
      className={`relative ${className}`}
      style={{
        animation: speed > 50 ? `shake ${Math.max(0.05, 0.15 - shakeIntensity * 0.1)}s ease-in-out infinite` : 'none',
      }}
    >
      <svg
        width="280"
        height="200"
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rearBodyGrad" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={car.color} stopOpacity="0.7" />
            <stop offset="30%" stopColor={car.color} />
            <stop offset="70%" stopColor={car.color} />
            <stop offset="100%" stopColor={car.color} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="rearGlassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a4a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0a1520" stopOpacity="0.9" />
          </linearGradient>
          <filter id="rearNeonGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rearBoostGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tailLightGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rear Spoiler - top element */}
        <path
          d="M 35 48 L 55 40 L 225 40 L 245 48 L 240 52 L 40 52 Z"
          fill={car.color}
          stroke={car.accentColor}
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        {/* Spoiler Endplates */}
        <rect x="38" y="42" width="6" height="22" rx="1" fill={car.color} stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.4" />
        <rect x="236" y="42" width="6" height="22" rx="1" fill={car.color} stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Spoiler Supports */}
        <rect x="85" y="52" width="4" height="16" rx="1" fill="#333" />
        <rect x="191" y="52" width="4" height="16" rx="1" fill="#333" />

        {/* Rear Window */}
        <path
          d="M 68 68 L 80 52 L 200 52 L 212 68 Z"
          fill="url(#rearGlassGrad)"
          stroke={car.accentColor}
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Main Body */}
        <path
          d="M 25 130 L 18 105 L 22 75 Q 24 68 35 65 L 62 65 L 218 65 L 245 65 Q 256 68 258 75 L 262 105 L 255 130 Z"
          fill="url(#rearBodyGrad)"
          stroke={car.accentColor}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />

        {/* Body panel lines */}
        <line x1="60" y1="68" x2="25" y2="128" stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="220" y1="68" x2="255" y2="128" stroke={car.accentColor} strokeWidth="0.5" strokeOpacity="0.15" />

        {/* Rear Diffuser */}
        <path
          d="M 35 130 L 245 130 L 255 140 L 248 148 L 32 148 L 25 140 Z"
          fill="#111"
          stroke="#333"
          strokeWidth="0.8"
        />
        {/* Diffuser Fins */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`fin-${i}`}
            x1={60 + i * 25}
            y1="131"
            x2={58 + i * 25}
            y2="146"
            stroke="#444"
            strokeWidth="1.5"
          />
        ))}

        {/* Tail Lights - Left cluster */}
        <rect x="28" y="85" width="30" height="8" rx="2" fill="#ff1744" opacity="0.9" filter="url(#tailLightGlow)" />
        <rect x="28" y="96" width="30" height="8" rx="2" fill="#ff1744" opacity="0.7" filter="url(#tailLightGlow)" />
        <rect x="28" y="107" width="30" height="5" rx="1" fill="#ff8800" opacity="0.6" />

        {/* Tail Lights - Right cluster */}
        <rect x="222" y="85" width="30" height="8" rx="2" fill="#ff1744" opacity="0.9" filter="url(#tailLightGlow)" />
        <rect x="222" y="96" width="30" height="8" rx="2" fill="#ff1744" opacity="0.7" filter="url(#tailLightGlow)" />
        <rect x="222" y="107" width="30" height="5" rx="1" fill="#ff8800" opacity="0.6" />

        {/* Center light bar */}
        <rect x="68" y="88" width="144" height="3" rx="1" fill="#ff1744" opacity="0.4" />

        {/* Exhaust Pipes */}
        <ellipse cx="90" cy="143" rx="12" ry="6" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <ellipse cx="90" cy="143" rx="8" ry="4" fill="#0a0a0a" />
        <ellipse cx="190" cy="143" rx="12" ry="6" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <ellipse cx="190" cy="143" rx="8" ry="4" fill="#0a0a0a" />

        {/* License Plate area */}
        <rect x="112" y="117" width="56" height="18" rx="2" fill="#1a1a1a" stroke="#444" strokeWidth="0.8" />
        <text x="140" y="130" textAnchor="middle" fill={car.accentColor} fontSize="8" fontFamily="monospace" opacity="0.8">
          {car.name.substring(0, 8).toUpperCase()}
        </text>

        {/* Neon Underglow */}
        <line
          x1="35"
          y1="150"
          x2="245"
          y2="150"
          stroke={car.accentColor}
          strokeWidth="3"
          strokeOpacity="0.7"
          filter="url(#rearNeonGlow)"
          className="animate-neon-pulse"
        />

        {/* Left Wheel (partial view from behind) */}
        <ellipse cx="15" cy="130" rx="15" ry="28" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="15" cy="130" rx="10" ry="20" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
        <ellipse cx="15" cy="130" rx="5" ry="10" fill="#333" />

        {/* Right Wheel */}
        <ellipse cx="265" cy="130" rx="15" ry="28" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="265" cy="130" rx="10" ry="20" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
        <ellipse cx="265" cy="130" rx="5" ry="10" fill="#333" />

        {/* Boost flames from exhausts */}
        {boostActive && (
          <g filter="url(#rearBoostGlow)">
            {/* Left exhaust flame */}
            <ellipse cx="90" cy="160" rx="10" ry="18" fill="#ff6600" opacity="0.9">
              <animate attributeName="ry" values="18;22;16;20;18" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="90" cy="158" rx="6" ry="12" fill="#ffcc00" opacity="0.9">
              <animate attributeName="ry" values="12;15;10;14;12" dur="0.15s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="90" cy="156" rx="3" ry="7" fill="#ffffff" opacity="0.8">
              <animate attributeName="ry" values="7;9;5;8;7" dur="0.12s" repeatCount="indefinite" />
            </ellipse>

            {/* Right exhaust flame */}
            <ellipse cx="190" cy="160" rx="10" ry="18" fill="#ff6600" opacity="0.9">
              <animate attributeName="ry" values="16;20;18;22;16" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="190" cy="158" rx="6" ry="12" fill="#ffcc00" opacity="0.9">
              <animate attributeName="ry" values="10;14;12;15;10" dur="0.15s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="190" cy="156" rx="3" ry="7" fill="#ffffff" opacity="0.8">
              <animate attributeName="ry" values="5;8;7;9;5" dur="0.12s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}
      </svg>
    </div>
  )
}

/* ===== REAR-VIEW OPPONENT CAR ===== */
interface OpponentCarRearProps {
  scale?: number
  className?: string
}

export function OpponentCarRear({ scale = 1, className = '' }: OpponentCarRearProps) {
  const color = '#ff1744'
  const accent = '#ff6600'

  return (
    <div className={`${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
      <svg
        width="200"
        height="150"
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oppRearBody" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
          <filter id="oppTailGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Spoiler */}
        <path d="M 25 35 L 40 28 L 160 28 L 175 35 L 172 38 L 28 38 Z" fill={color} stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
        <rect x="27" y="30" width="4" height="16" rx="1" fill={color} />
        <rect x="169" y="30" width="4" height="16" rx="1" fill={color} />
        <rect x="62" y="38" width="3" height="12" fill="#333" />
        <rect x="135" y="38" width="3" height="12" fill="#333" />

        {/* Rear Window */}
        <path d="M 50 50 L 58 38 L 142 38 L 150 50 Z" fill="#150808" strokeOpacity="0.3" />

        {/* Body */}
        <path d="M 18 95 L 13 75 L 16 55 Q 17 50 25 48 L 175 48 Q 183 50 184 55 L 187 75 L 182 95 Z" fill="url(#oppRearBody)" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Diffuser */}
        <path d="M 25 95 L 175 95 L 182 103 L 178 108 L 22 108 L 18 103 Z" fill="#111" stroke="#333" strokeWidth="0.5" />

        {/* Tail lights */}
        <rect x="20" y="62" width="22" height="6" rx="1.5" fill="#ff1744" opacity="0.9" filter="url(#oppTailGlow)" />
        <rect x="20" y="70" width="22" height="6" rx="1.5" fill="#ff1744" opacity="0.7" filter="url(#oppTailGlow)" />
        <rect x="158" y="62" width="22" height="6" rx="1.5" fill="#ff1744" opacity="0.9" filter="url(#oppTailGlow)" />
        <rect x="158" y="70" width="22" height="6" rx="1.5" fill="#ff1744" opacity="0.7" filter="url(#oppTailGlow)" />

        {/* Center strip */}
        <rect x="48" y="64" width="104" height="2" rx="1" fill="#ff1744" opacity="0.3" />

        {/* Exhaust */}
        <ellipse cx="65" cy="104" rx="8" ry="4" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
        <ellipse cx="135" cy="104" rx="8" ry="4" fill="#1a1a1a" stroke="#444" strokeWidth="1" />

        {/* Underglow */}
        <line x1="25" y1="110" x2="175" y2="110" stroke={accent} strokeWidth="2.5" strokeOpacity="0.6" filter="url(#oppTailGlow)" className="animate-neon-pulse" />

        {/* Wheels */}
        <ellipse cx="10" cy="95" rx="10" ry="20" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <ellipse cx="190" cy="95" rx="10" ry="20" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  )
}

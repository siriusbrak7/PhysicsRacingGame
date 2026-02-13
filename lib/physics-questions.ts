export interface PhysicsQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
}

export const initialQuestions: PhysicsQuestion[] = [
  {
    id: 1,
    question: "What is Newton's Second Law of Motion?",
    options: ['F = mv', 'F = ma', 'F = m/a', 'F = a/m'],
    correctAnswer: 1,
    explanation:
      'Force equals mass times acceleration. This fundamental law governs how objects move under applied forces.',
    difficulty: 'easy',
    topic: 'Mechanics',
  },
  {
    id: 2,
    question: 'What is the SI unit of power?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 2,
    explanation:
      'The Watt (W) is the SI unit of power, equal to one joule per second.',
    difficulty: 'easy',
    topic: 'Energy',
  },
  {
    id: 3,
    question:
      'A car accelerates from 0 to 60 m/s in 5 seconds. What is its acceleration?',
    options: ['10 m/s^2', '12 m/s^2', '15 m/s^2', '300 m/s^2'],
    correctAnswer: 1,
    explanation:
      'Acceleration = change in velocity / time = 60/5 = 12 m/s^2.',
    difficulty: 'medium',
    topic: 'Kinematics',
  },
  {
    id: 4,
    question: 'Which force opposes the motion of a car on a road?',
    options: ['Gravity', 'Normal force', 'Friction', 'Centripetal force'],
    correctAnswer: 2,
    explanation:
      'Friction between the tires and road surface opposes the forward motion of a vehicle.',
    difficulty: 'easy',
    topic: 'Forces',
  },
  {
    id: 5,
    question: 'What is the kinetic energy of a 1000 kg car moving at 20 m/s?',
    options: ['100,000 J', '200,000 J', '400,000 J', '20,000 J'],
    correctAnswer: 1,
    explanation:
      'KE = 0.5 * m * v^2 = 0.5 * 1000 * 400 = 200,000 J (200 kJ).',
    difficulty: 'medium',
    topic: 'Energy',
  },
]

export const raceQuestions: PhysicsQuestion[] = [
  {
    id: 101,
    question: 'What happens to kinetic energy when velocity doubles?',
    options: [
      'It doubles',
      'It triples',
      'It quadruples',
      'It stays the same',
    ],
    correctAnswer: 2,
    explanation: 'KE = 0.5mv^2. Since KE is proportional to v^2, doubling velocity quadruples kinetic energy.',
    difficulty: 'medium',
    topic: 'Energy',
  },
  {
    id: 102,
    question: 'What is the formula for momentum?',
    options: ['p = mv', 'p = ma', 'p = Ft', 'p = mv^2'],
    correctAnswer: 0,
    explanation: 'Momentum (p) is the product of mass and velocity: p = mv.',
    difficulty: 'easy',
    topic: 'Momentum',
  },
  {
    id: 103,
    question: 'Air resistance on a car increases with:',
    options: [
      'Mass only',
      'Speed squared',
      'Speed linearly',
      'Wheel size',
    ],
    correctAnswer: 1,
    explanation:
      'Air drag force is proportional to the square of velocity: F_drag = 0.5 * C_d * A * rho * v^2.',
    difficulty: 'medium',
    topic: 'Aerodynamics',
  },
  {
    id: 104,
    question: 'What is the unit of impulse?',
    options: ['Newton', 'Joule', 'Newton-second', 'Watt'],
    correctAnswer: 2,
    explanation:
      'Impulse equals force times time (N*s), which is also equal to the change in momentum.',
    difficulty: 'easy',
    topic: 'Momentum',
  },
  {
    id: 105,
    question:
      'A car engine produces 150 kW. If the car moves at 30 m/s, what is the driving force?',
    options: ['4,500 N', '5,000 N', '5,500 N', '6,000 N'],
    correctAnswer: 1,
    explanation: 'Power = Force * velocity. F = P/v = 150,000/30 = 5,000 N.',
    difficulty: 'hard',
    topic: 'Energy',
  },
  {
    id: 106,
    question: 'Which law explains why you feel pushed back when a car accelerates?',
    options: [
      "Newton's First Law",
      "Newton's Second Law",
      "Newton's Third Law",
      "Law of Conservation of Energy",
    ],
    correctAnswer: 0,
    explanation:
      "Newton's First Law (inertia) explains that your body resists the change in motion when the car accelerates.",
    difficulty: 'easy',
    topic: 'Mechanics',
  },
  {
    id: 107,
    question: 'What is the terminal velocity condition?',
    options: [
      'Acceleration = gravity',
      'Drag = weight',
      'Drag = 0',
      'Speed = speed of sound',
    ],
    correctAnswer: 1,
    explanation:
      'Terminal velocity occurs when the drag force equals the weight, so net force and acceleration are zero.',
    difficulty: 'medium',
    topic: 'Aerodynamics',
  },
  {
    id: 108,
    question:
      'If a 2000 kg car decelerates from 30 m/s to 0 in 3 seconds, what is the braking force?',
    options: ['10,000 N', '20,000 N', '30,000 N', '60,000 N'],
    correctAnswer: 1,
    explanation:
      'F = ma. a = (0-30)/3 = -10 m/s^2. F = 2000 * 10 = 20,000 N.',
    difficulty: 'hard',
    topic: 'Mechanics',
  },
  {
    id: 109,
    question: 'What does a lower drag coefficient mean for a race car?',
    options: [
      'More fuel consumption',
      'Less aerodynamic efficiency',
      'Better aerodynamic efficiency',
      'Higher weight',
    ],
    correctAnswer: 2,
    explanation:
      'A lower drag coefficient means the car cuts through air more efficiently, reducing air resistance.',
    difficulty: 'easy',
    topic: 'Aerodynamics',
  },
  {
    id: 110,
    question: 'The work-energy theorem states that:',
    options: [
      'Work = change in potential energy',
      'Work = change in kinetic energy',
      'Work = force / distance',
      'Work = power * velocity',
    ],
    correctAnswer: 1,
    explanation:
      'The work-energy theorem states that the net work done on an object equals its change in kinetic energy.',
    difficulty: 'medium',
    topic: 'Energy',
  },
  {
    id: 111,
    question: 'What provides the centripetal force for a car turning on a flat road?',
    options: ['Engine power', 'Friction', 'Gravity', 'Normal force'],
    correctAnswer: 1,
    explanation:
      'On a flat road, friction between the tires and the road provides the centripetal force needed for turning.',
    difficulty: 'medium',
    topic: 'Forces',
  },
  {
    id: 112,
    question: 'A turbocharger increases engine power by:',
    options: [
      'Adding more fuel',
      'Compressing intake air for more oxygen',
      'Reducing exhaust',
      'Decreasing friction',
    ],
    correctAnswer: 1,
    explanation:
      'A turbocharger compresses air entering the engine, increasing oxygen density and allowing more fuel to burn.',
    difficulty: 'medium',
    topic: 'Thermodynamics',
  },
]

export function getRandomRaceQuestions(count: number): PhysicsQuestion[] {
  const shuffled = [...raceQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

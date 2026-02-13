'use client'

import { useState, useCallback } from 'react'
import { GameState, getCarByScore } from '@/lib/game-types'
import { StartScreen } from '@/components/start-screen'
import { QuizScreen } from '@/components/quiz-screen'
import { CarRevealScreen } from '@/components/car-reveal-screen'
import { RaceScreen } from '@/components/race-screen'
import { ResultsScreen } from '@/components/results-screen'

export default function PhysicsRacerPage() {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'start',
    quizScore: 0,
    currentQuestion: 0,
    selectedCar: null,
    raceResult: null,
  })

  const [raceStats, setRaceStats] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
  })

  const handleStartQuiz = useCallback(() => {
    setGameState((prev) => ({ ...prev, screen: 'quiz' }))
  }, [])

  const handleQuizComplete = useCallback((score: number) => {
    const car = getCarByScore(score)
    setGameState((prev) => ({
      ...prev,
      screen: 'car-reveal',
      quizScore: score,
      selectedCar: car,
    }))
  }, [])

  const handleStartRace = useCallback(() => {
    setGameState((prev) => ({ ...prev, screen: 'race' }))
  }, [])

  const handleRaceFinish = useCallback(
    (result: 'win' | 'lose', correctAnswers: number, totalQuestions: number) => {
      setRaceStats({ correctAnswers, totalQuestions })
      setGameState((prev) => ({
        ...prev,
        screen: 'results',
        raceResult: result,
      }))
    },
    []
  )

  const handlePlayAgain = useCallback(() => {
    setGameState({
      screen: 'start',
      quizScore: 0,
      currentQuestion: 0,
      selectedCar: null,
      raceResult: null,
    })
    setRaceStats({ correctAnswers: 0, totalQuestions: 0 })
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {gameState.screen === 'start' && (
        <StartScreen onStart={handleStartQuiz} />
      )}
      {gameState.screen === 'quiz' && (
        <QuizScreen onComplete={handleQuizComplete} />
      )}
      {gameState.screen === 'car-reveal' && gameState.selectedCar && (
        <CarRevealScreen
          car={gameState.selectedCar}
          score={gameState.quizScore}
          onStartRace={handleStartRace}
        />
      )}
      {gameState.screen === 'race' && gameState.selectedCar && (
        <RaceScreen
          car={gameState.selectedCar}
          onFinish={handleRaceFinish}
        />
      )}
      {gameState.screen === 'results' &&
        gameState.selectedCar &&
        gameState.raceResult && (
          <ResultsScreen
            car={gameState.selectedCar}
            result={gameState.raceResult}
            correctAnswers={raceStats.correctAnswers}
            totalQuestions={raceStats.totalQuestions}
            quizScore={gameState.quizScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
    </main>
  )
}

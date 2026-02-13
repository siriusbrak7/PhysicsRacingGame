'use client'

import { useState, useCallback } from 'react'
import { initialQuestions, PhysicsQuestion } from '@/lib/physics-questions'
import { CheckCircle2, XCircle, ArrowRight, Brain } from 'lucide-react'

interface QuizScreenProps {
  onComplete: (score: number) => void
}

export function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const question: PhysicsQuestion = initialQuestions[currentIndex]
  const isCorrect = selectedAnswer === question.correctAnswer
  const isLastQuestion = currentIndex === initialQuestions.length - 1

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showResult) return
      setSelectedAnswer(answerIndex)
      setShowResult(true)
      if (answerIndex === question.correctAnswer) {
        setScore((prev) => prev + 1)
      }
    },
    [showResult, question.correctAnswer]
  )

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      const finalScore = score + (isCorrect ? 0 : 0)
      onComplete(selectedAnswer === question.correctAnswer ? score : score)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowResult(false)
  }, [isLastQuestion, score, isCorrect, onComplete, selectedAnswer, question.correctAnswer])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(187_100%_50%_/_0.03)_0%,_transparent_50%)]" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-display text-sm tracking-wider uppercase text-muted-foreground">
                Physics Challenge
              </span>
            </div>
            <span className="font-display text-sm text-primary">
              {score}/{currentIndex + (showResult ? 1 : 0)} Correct
            </span>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {initialQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < currentIndex
                    ? 'bg-primary'
                    : i === currentIndex
                      ? 'bg-primary animate-neon-pulse'
                      : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 neon-box-cyan mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-secondary text-xs font-display uppercase tracking-wider text-muted-foreground">
              {question.topic}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider ${
                question.difficulty === 'easy'
                  ? 'bg-green-500/10 text-green-400'
                  : question.difficulty === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-relaxed mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="grid gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectOption = index === question.correctAnswer
              let optionClasses =
                'w-full text-left p-4 rounded-lg border-2 transition-all duration-300 font-semibold text-base '

              if (showResult) {
                if (isCorrectOption) {
                  optionClasses +=
                    'border-green-500 bg-green-500/10 text-green-300'
                } else if (isSelected && !isCorrectOption) {
                  optionClasses += 'border-red-500 bg-red-500/10 text-red-300'
                } else {
                  optionClasses +=
                    'border-border bg-secondary/30 text-muted-foreground opacity-50'
                }
              } else {
                optionClasses +=
                  'border-border bg-secondary/30 text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer active:scale-[0.98]'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={optionClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-display shrink-0 border border-border">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation & Next */}
        {showResult && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                isCorrect
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display font-bold text-base tracking-wider uppercase rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLastQuestion ? 'See Your Car' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Question Counter */}
        <div className="text-center mt-6">
          <span className="font-display text-xs tracking-widest uppercase text-muted-foreground">
            Question {currentIndex + 1} of {initialQuestions.length}
          </span>
        </div>
      </div>
    </div>
  )
}

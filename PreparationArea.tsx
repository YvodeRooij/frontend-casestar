import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PreparationAreaProps {
  id: string
  title: string
  content: {
    text: string
    quiz: {
      question: string
      options: string[]
      correctAnswer: string
    }
    exercise: {
      instruction: string
      hint: string
    }
  }
}

export function PreparationArea({ id, title, content }: PreparationAreaProps) {
  const [activeTab, setActiveTab] = useState('learn')
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch the progress from an API or local storage
    const savedProgress = localStorage.getItem(`preparationProgress_${id}`)
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10))
    }
  }, [id])

  const updateProgress = (increment: number) => {
    const newProgress = Math.min(progress + increment, 100)
    setProgress(newProgress)
    localStorage.setItem(`preparationProgress_${id}`, newProgress.toString())
  }

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer)
    if (answer === content.quiz.correctAnswer && quizAnswer !== answer) {
      updateProgress(25)
    }
  }

  const handleExerciseComplete = () => {
    if (!exerciseCompleted) {
      setExerciseCompleted(true)
      updateProgress(25)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <Progress value={progress} className="h-2 mb-4" />
      <p className="text-lg mb-6">Progress: {progress}% Complete</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn">
          <Card>
            <CardHeader>
              <CardTitle>Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{content.text}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">{content.quiz.question}</h3>
              <div className="space-y-2">
                {content.quiz.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    variant={quizAnswer === option ? 'default' : 'outline'}
                    className="w-full justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {quizAnswer === content.quiz.correctAnswer && (
                <p className="text-green-600 mt-4">Correct! Great job.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle>Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{content.exercise.instruction}</p>
              <p className="text-sm text-gray-600 mb-4">Hint: {content.exercise.hint}</p>
              <Button 
                onClick={handleExerciseComplete}
                disabled={exerciseCompleted}
              >
                {exerciseCompleted ? "Completed" : "Mark as Complete"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/')}>
          Back to Overview
        </Button>
        <Button 
          onClick={() => router.push('/')} 
          disabled={progress < 100}
        >
          {progress < 100 ? "Complete All Sections" : "Return to Case Prep"}
        </Button>
      </div>
    </div>
  )
}


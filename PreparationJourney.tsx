import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CaseType } from '@/types/journey'
import { Book, Calculator, MessageSquare, TrendingUp, Brain, CheckCircle } from 'lucide-react'

interface PreparationJourneyProps {
  caseType: CaseType
  onStartCase: (caseType: CaseType) => void
}

const caseNames: Record<CaseType, string> = {
  personal_experience: "Personal Experience",
  case_1: "First Round",
  case_2: "Second Round",
  case_3: "Third Round",
  final_round: "Final Round"
}

const preparationAreas = [
  {
    id: 'frameworks',
    title: 'Business Frameworks',
    icon: Book,
    color: 'text-blue-500',
    content: [
      {
        type: 'text',
        value: 'Master key business frameworks to structure your approach to case interviews.'
      },
      {
        type: 'quiz',
        question: 'Which framework would you use to analyze a company\'s competitive position?',
        options: ['SWOT Analysis', 'Porter\'s Five Forces', '4Ps of Marketing', 'BCG Matrix'],
        correctAnswer: 'Porter\'s Five Forces'
      },
      {
        type: 'exercise',
        instruction: 'Apply the MECE principle to categorize the following list of fruits: Apple, Banana, Orange, Grape, Watermelon, Strawberry, Blueberry, Mango.',
        hint: 'Consider categories like color, size, or type of fruit.'
      }
    ]
  },
  {
    id: 'mentalMath',
    title: 'Mental Math',
    icon: Calculator,
    color: 'text-green-500',
    content: [
      {
        type: 'text',
        value: 'Sharpen your mental math skills for quick calculations during case interviews.'
      },
      {
        type: 'quiz',
        question: 'What is 15% of 80?',
        options: ['10', '12', '15', '18'],
        correctAnswer: '12'
      },
      {
        type: 'exercise',
        instruction: 'Estimate the result of 38 x 42 without using a calculator.',
        hint: 'Round to nearby numbers and adjust: (40 x 40) - (2 x 40) + (38 x 2)'
      }
    ]
  },
  {
    id: 'structuredResponses',
    title: 'Structured Communication',
    icon: MessageSquare,
    color: 'text-purple-500',
    content: [
      {
        type: 'text',
        value: 'Learn to communicate your thoughts clearly and concisely using structured approaches.'
      },
      {
        type: 'quiz',
        question: 'What is the first step in the Pyramid Principle?',
        options: ['Start with details', 'Begin with the conclusion', 'List all options', 'Describe the problem'],
        correctAnswer: 'Begin with the conclusion'
      },
      {
        type: 'exercise',
        instruction: 'Structure a response to the question: "Why should our company expand into the Asian market?"',
        hint: 'Use the Pyramid Principle: Start with your recommendation, then provide 2-3 supporting arguments.'
      }
    ]
  },
  {
    id: 'industryTrends',
    title: 'Industry Knowledge',
    icon: TrendingUp,
    color: 'text-red-500',
    content: [
      {
        type: 'text',
        value: 'Stay updated on current business trends and industry-specific knowledge.'
      },
      {
        type: 'quiz',
        question: 'Which of these is NOT a current trend in the tech industry?',
        options: ['Artificial Intelligence', 'Blockchain', 'Floppy Disk Storage', 'Internet of Things'],
        correctAnswer: 'Floppy Disk Storage'
      },
      {
        type: 'exercise',
        instruction: 'Research and summarize a recent development in an industry of your choice.',
        hint: 'Consider recent news in industries like healthcare, finance, or technology.'
      }
    ]
  }
]

export function PreparationJourney({ caseType, onStartCase }: PreparationJourneyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeArea, setActiveArea] = useState(preparationAreas[0].id)
  const [progress, setProgress] = useState<Record<string, number>>({})

  const handleStartCase = () => {
    setIsOpen(false)
    onStartCase(caseType)
  }

  const updateProgress = (areaId: string, increment: number) => {
    setProgress(prev => ({
      ...prev,
      [areaId]: Math.min((prev[areaId] || 0) + increment, 100)
    }))
  }

  const overallProgress = Object.values(progress).reduce((sum, value) => sum + value, 0) / (preparationAreas.length * 100) * 100

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Prepare for {caseNames[caseType]}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preparing for {caseNames[caseType]}</DialogTitle>
            <DialogDescription>
              Master these key areas to excel in your case interview
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-primary">Overall Progress</h4>
              <span className="text-sm font-medium">{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <Tabs value={activeArea} onValueChange={setActiveArea}>
            <TabsList className="grid w-full grid-cols-4">
              {preparationAreas.map(area => (
                <TabsTrigger key={area.id} value={area.id} className="flex flex-col items-center">
                  <area.icon className={`w-5 h-5 ${area.color}`} />
                  <span className="mt-1 text-xs">{area.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {preparationAreas.map(area => (
              <TabsContent key={area.id} value={area.id}>
                <PreparationArea 
                  area={area} 
                  progress={progress[area.id] || 0} 
                  updateProgress={(increment) => updateProgress(area.id, increment)} 
                />
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Save Progress
            </Button>
            <Button onClick={handleStartCase} disabled={overallProgress < 100}>
              {overallProgress < 100 ? `${Math.round(overallProgress)}% Prepared` : "Start Case Interview"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface PreparationAreaProps {
  area: typeof preparationAreas[0]
  progress: number
  updateProgress: (increment: number) => void
}

function PreparationArea({ area, progress, updateProgress }: PreparationAreaProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [exerciseCompleted, setExerciseCompleted] = useState(false)

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [area.id]: answer }))
    if (answer === area.content.find(c => c.type === 'quiz')?.correctAnswer) {
      updateProgress(25)
    }
  }

  const handleExerciseComplete = () => {
    setExerciseCompleted(true)
    updateProgress(25)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <area.icon className={`w-6 h-6 ${area.color} mr-2`} />
          {area.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        {area.content.map((content, index) => {
          switch (content.type) {
            case 'text':
              return <p key={index} className="text-gray-600">{content.value}</p>
            case 'quiz':
              return (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold">{content.question}</h4>
                  {content.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant={quizAnswers[area.id] === option ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleQuizAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                  {quizAnswers[area.id] === content.correctAnswer && (
                    <p className="text-green-500 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Correct! Great job.
                    </p>
                  )}
                </div>
              )
            case 'exercise':
              return (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold">Exercise</h4>
                  <p>{content.instruction}</p>
                  <p className="text-sm text-gray-500">Hint: {content.hint}</p>
                  <Button 
                    onClick={handleExerciseComplete} 
                    disabled={exerciseCompleted}
                  >
                    {exerciseCompleted ? "Completed" : "Mark as Complete"}
                  </Button>
                </div>
              )
            default:
              return null
          }
        })}
      </CardContent>
    </Card>
  )
}


import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { CaseType } from "@/types/journey"
import { Book, Calculator, MessageSquare, TrendingUp, CheckCircle } from "lucide-react"

interface PreparationOverviewProps {
  caseType: CaseType
  onStartCase: (caseType: CaseType) => void
}

const caseNames: Record<CaseType, string> = {
  personal_experience: "Personal Experience",
  case_1: "First Round",
  case_2: "Second Round",
  case_3: "Third Round",
  final_round: "Final Round",
}

const preparationAreas = [
  {
    id: "frameworks",
    title: "Business Frameworks",
    icon: Book,
    color: "text-blue-500",
    route: "/preparation/frameworks",
  },
  {
    id: "mentalMath",
    title: "Mental Math",
    icon: Calculator,
    color: "text-green-500",
    route: "/preparation/mental-math",
  },
  {
    id: "structuredResponses",
    title: "Structured Communication",
    icon: MessageSquare,
    color: "text-purple-500",
    route: "/preparation/structured-communication",
  },
  {
    id: "industryTrends",
    title: "Industry Knowledge",
    icon: TrendingUp,
    color: "text-red-500",
    route: "/preparation/industry-knowledge",
  },
]

export function PreparationOverview({ caseType, onStartCase }: PreparationOverviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch the progress from an API or local storage
    const savedProgress = localStorage.getItem(`preparationProgress_${caseType}`)
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [caseType])

  const handleStartCase = () => {
    setIsOpen(false)
    onStartCase(caseType)
  }

  const handleAreaClick = (route: string) => {
    setIsOpen(false)
    router.push(route)
  }

  const overallProgress =
    (Object.values(progress).reduce((sum, value) => sum + value, 0) / (preparationAreas.length * 100)) * 100

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Prepare for {caseNames[caseType]}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Preparing for {caseNames[caseType]}</DialogTitle>
            <DialogDescription>Master these key areas to excel in your case interview</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Overall Progress</h4>
              <Progress value={overallProgress} className="h-2 mb-1" />
              <p className="text-sm text-gray-600">{Math.round(overallProgress)}% Complete</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {preparationAreas.map((area) => (
                <Card
                  key={area.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAreaClick(area.route)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center">
                      <area.icon className={`w-5 h-5 ${area.color} mr-2`} />
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Progress value={progress[area.id] || 0} className="h-2 mb-1" />
                    <p className="text-sm text-gray-600">{Math.round(progress[area.id] || 0)}% Complete</p>
                    {progress[area.id] === 100 && (
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 mr-1" /> Completed
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => router.push("/preparation/case-interview")} className="mt-4 w-full">
              Start Case Interview Practice
            </Button>
          </div>
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
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


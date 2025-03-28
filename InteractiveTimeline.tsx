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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CaseType, CaseResult, Skill } from '@/types/journey'
import { CheckCircle, XCircle, Circle, Trophy, Book, Activity } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreparationJourney } from './PreparationJourney'
import { PreparationOverview } from './PreparationOverview'

interface InteractiveTimelineProps {
  caseResults: CaseResult[]
  currentCase: CaseType | null
  onStartCase: (caseType: CaseType) => void
  onPracticeSkill: (skill: string) => void
}

const caseOrder: CaseType[] = ["personal_experience", "case_1", "case_2", "case_3", "final_round"]
const caseNames: Record<CaseType, string> = {
  personal_experience: "Personal Experience",
  case_1: "First Round",
  case_2: "Second Round",
  case_3: "Third Round",
  final_round: "Final Round"
}

export function InteractiveTimeline({ caseResults, currentCase, onStartCase, onPracticeSkill }: InteractiveTimelineProps) {
  const [focusedCase, setFocusedCase] = useState<CaseType | null>(null)
  const completedCases = caseResults.filter(result => result.passed).length

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-2xl text-primary">Your Interview Journey</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Overall Progress</h3>
          <Progress value={(completedCases / caseOrder.length) * 100} className="h-2 mb-2" />
          <p className="text-sm text-gray-600">
            {completedCases === 0 
              ? "Start your journey by completing your first case!"
              : `You've completed ${completedCases} out of ${caseOrder.length} stages. Keep pushing forward!`
            }
          </p>
        </div>
        <div className="relative">
          <TimelineLine caseResults={caseResults} currentCase={currentCase} />
          <div className="flex justify-between items-center">
            {caseOrder.map((caseType, index) => (
              <TimelineNode
                key={caseType}
                caseType={caseType}
                caseResults={caseResults}
                currentCase={currentCase}
                isFocused={focusedCase === caseType}
                setFocusedCase={setFocusedCase}
                onStartCase={onStartCase}
                onPracticeSkill={onPracticeSkill}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TimelineLine({ caseResults, currentCase }: InteractiveTimelineProps) {
  const completedCases = caseResults.filter(result => result.passed).length
  const progress = (completedCases / caseOrder.length) * 100

  return (
    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2">
      <div 
        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

interface TimelineNodeProps {
  caseType: CaseType
  caseResults: CaseResult[]
  currentCase: CaseType | null
  isFocused: boolean
  setFocusedCase: (caseType: CaseType | null) => void
  onStartCase: (caseType: CaseType) => void
  onPracticeSkill: (skill: string) => void
}

function TimelineNode({ caseType, caseResults, currentCase, isFocused, setFocusedCase, onStartCase, onPracticeSkill }: TimelineNodeProps) {
  const result = caseResults.find(r => r.caseType === caseType)
  const isCompleted = result && result.passed
  const isCurrent = caseType === currentCase
  const isUnlocked = isCompleted || isCurrent || caseResults.some(r => r.caseType === getPreviousCase(caseType) && r.passed)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "flex flex-col items-center transition-all duration-300",
              isFocused && "scale-110"
            )}
            onMouseEnter={() => setFocusedCase(caseType)}
            onMouseLeave={() => setFocusedCase(null)}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-16 h-16 rounded-full border-4 z-10 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    getNodeColor(isCompleted, isCurrent, isUnlocked)
                  )}
                >
                  {getNodeIcon(isCompleted, isCurrent, caseType)}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary">{caseNames[caseType]}</DialogTitle>
                  <DialogDescription>
                    {getCaseDescription(caseType, isCompleted, isCurrent, isUnlocked)}
                  </DialogDescription>
                </DialogHeader>
                <CaseDetails 
                  caseType={caseType} 
                  result={result} 
                  isCompleted={isCompleted} 
                  isCurrent={isCurrent} 
                  isUnlocked={isUnlocked}
                  onStartCase={onStartCase}
                  onPracticeSkill={onPracticeSkill}
                />
              </DialogContent>
            </Dialog>
            <span className="mt-4 text-sm font-medium text-gray-600 text-center">
              {caseNames[caseType]}
            </span>
            {getStatusLabel(isCompleted, isCurrent, isUnlocked)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent(caseType, isCompleted, isCurrent, isUnlocked)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getNodeColor(isCompleted: boolean, isCurrent: boolean, isUnlocked: boolean): string {
  if (isCompleted) return 'bg-green-500 border-green-600'
  if (isCurrent) return 'bg-blue-500 border-blue-600'
  if (isUnlocked) return 'bg-yellow-500 border-yellow-600'
  return 'bg-gray-300 border-gray-400'
}

function getNodeIcon(isCompleted: boolean, isCurrent: boolean, caseType: CaseType) {
  if (isCompleted) return <CheckCircle className="w-6 h-6 text-white" />
  if (isCurrent) return <Activity className="w-6 h-6 text-white" />
  if (caseType === 'final_round') return <Trophy className="w-6 h-6 text-white" />
  return <Circle className="w-6 h-6 text-white" />
}

function getStatusLabel(isCompleted: boolean, isCurrent: boolean, isUnlocked: boolean) {
  if (isCompleted) return <span className="mt-1 text-xs font-medium text-green-600">Completed</span>
  if (isCurrent) return <span className="mt-1 text-xs font-medium text-blue-600">In Progress</span>
  if (isUnlocked) return <span className="mt-1 text-xs font-medium text-yellow-600">Unlocked</span>
  return <span className="mt-1 text-xs font-medium text-gray-400">Locked</span>
}

function getCaseDescription(caseType: CaseType, isCompleted: boolean, isCurrent: boolean, isUnlocked: boolean): string {
  if (isCompleted) return "Great job! You've successfully completed this stage."
  if (isCurrent) return "This is your current challenge. Good luck!"
  if (isUnlocked) return "You've unlocked this stage. Are you ready for the challenge?"
  if (caseType === 'final_round') return "The final challenge awaits. Complete previous stages to unlock."
  return "Complete previous stages to unlock this challenge."
}

function getTooltipContent(caseType: CaseType, isCompleted: boolean, isCurrent: boolean, isUnlocked: boolean): string {
  if (isCompleted) return "Click to review your performance and key learnings"
  if (isCurrent) return "Click to continue your current case or review progress"
  if (isUnlocked) return "Click to start this case and continue your journey"
  return "Complete previous stages to unlock this challenge"
}

function getPreviousCase(caseType: CaseType): CaseType | null {
  const index = caseOrder.indexOf(caseType)
  return index > 0 ? caseOrder[index - 1] : null
}

interface CaseDetailsProps {
  caseType: CaseType
  result: CaseResult | undefined
  isCompleted: boolean
  isCurrent: boolean
  isUnlocked: boolean
  onStartCase: (caseType: CaseType) => void
  onPracticeSkill: (skill: string) => void
}

function CaseDetails({ caseType, result, isCompleted, isCurrent, isUnlocked, onStartCase, onPracticeSkill }: CaseDetailsProps) {
  if (isCompleted && result) {
    return <CompletedCaseDetails result={result} onPracticeSkill={onPracticeSkill} />
  }

  if (isCurrent || isUnlocked) {
    return <UpcomingCaseDetails caseType={caseType} onStartCase={onStartCase} />
  }

  return <LockedCaseDetails />
}

function CompletedCaseDetails({ result, onPracticeSkill }: { result: CaseResult, onPracticeSkill: (skill: string) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-700">{result.feedback}</p>
      <SkillAssessment skills={result.skills} />
      <div className="mt-4">
        <h4 className="font-semibold mb-2 text-primary">Recommended Practice:</h4>
        <div className="grid grid-cols-2 gap-2">
          {result.skills.slice(0, 2).map((skill) => (
            <Button key={skill.category} onClick={() => onPracticeSkill(skill.category)} className="w-full">
              Practice {skill.category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function UpcomingCaseDetails({ caseType, onStartCase }: { caseType: CaseType, onStartCase: (caseType: CaseType) => void }) {
  return (
    <PreparationOverview caseType={caseType} onStartCase={onStartCase} />
  )
}

function LockedCaseDetails() {
  return (
    <div className="text-center">
      <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">
        This stage is currently locked. Complete the previous stages to unlock this challenge.
      </p>
    </div>
  )
}

function SkillAssessment({ skills }: { skills: Skill[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-primary">Skills Assessed:</h4>
      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill.category}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">{skill.category}</span>
              <span className="text-sm font-medium text-primary">{skill.score}%</span>
            </div>
            <Progress value={skill.score} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

function PreparationModal({ caseType, onStartCase }: { caseType: CaseType, onStartCase: (caseType: CaseType) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("checklist")
  const [checklist, setChecklist] = useState({
    frameworks: false,
    mentalMath: false,
    structuredResponses: false,
    industryTrends: false
  })

  const handleStartCase = () => {
    setIsOpen(false)
    onStartCase(caseType)
  }

  const allChecked = Object.values(checklist).every(Boolean)
  const progress = (Object.values(checklist).filter(Boolean).length / Object.values(checklist).length) * 100

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Prepare for {caseNames[caseType]}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Preparing for {caseNames[caseType]}</DialogTitle>
            <DialogDescription>
              Master these key areas to excel in your case interview
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checklist">Preparation Checklist</TabsTrigger>
              <TabsTrigger value="tips">Expert Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="checklist">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary">Your Progress</h4>
                  <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="space-y-2">
                  {Object.entries(checklist).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200 hover:bg-gray-100">
                      <Checkbox 
                        id={key} 
                        checked={value}
                        onCheckedChange={(checked) => 
                          setChecklist(prev => ({ ...prev, [key]: checked === true }))
                        }
                      />
                      <Label htmlFor={key} className="flex items-center space-x-2 cursor-pointer">
                        {key === 'frameworks' && <><Book className="w-4 h-4" /> <span>Review relevant business frameworks</span></>}
                        {key === 'mentalMath' && <><Calculator className="w-4 h-4" /> <span>Practice quick mental math and data interpretation</span></>}
                        {key === 'structuredResponses' && <><MessageSquare className="w-4 h-4" /> <span>Prepare concise and structured responses</span></>}
                        {key === 'industryTrends' && <><TrendingUp className="w-4 h-4" /> <span>Research recent industry trends</span></>}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tips">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Expert Preparation Tips</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Brain className="w-5 h-5 mt-0.5 text-blue-500" />
                    <span>Develop a "consultant mindset" - think analytically and strategically about everyday situations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MessageSquare className="w-5 h-5 mt-0.5 text-green-500" />
                    <span>Practice the "Pyramid Principle" for structured communication - start with the conclusion, then provide supporting arguments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 mt-0.5 text-purple-500" />
                    <span>Stay updated on business news and industry trends - read publications like The Economist, Wall Street Journal, or Harvard Business Review</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Calculator className="w-5 h-5 mt-0.5 text-red-500" />
                    <span>Improve your mental math skills - practice quick calculations and estimations daily</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              I need more time
            </Button>
            <Button onClick={handleStartCase} disabled={!allChecked}>
              {allChecked ? "I'm ready to start" : `${Math.round(progress)}% Prepared`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function RevisitPreparationButton({ caseType, onStartCase }: { caseType: CaseType, onStartCase: (caseType: CaseType) => void }) {
  return (
    <Button onClick={() => onStartCase(caseType)} variant="outline" className="mt-4 w-full">
      Revisit Preparation
    </Button>
  )
}


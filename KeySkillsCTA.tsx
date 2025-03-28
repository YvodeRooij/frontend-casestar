import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SkillCategory, Skill } from '@/types/journey'
import { Calculator, BarChart2, FileSpreadsheet, Database, MessageSquare } from 'lucide-react'
import { ScoreBreakdown } from './ScoreBreakdown'

interface KeySkillsCTAProps {
  skills: Skill[]
  onPractice: (skill: SkillCategory) => void
}

const skillInfo: Record<SkillCategory, {
  name: string,
  description: string,
  icon: React.ComponentType<{ className?: string }>,
  color: string
}> = {
  quantitative_analysis: {
    name: "Quantitative Problem Solving",
    description: "Enhance your ability to perform quick calculations and analyze numerical data in case scenarios.",
    icon: Calculator,
    color: "text-blue-500"
  },
  business_acumen: {
    name: "Market & Industry Analysis",
    description: "Learn techniques to analyze markets, industries, and competitive landscapes crucial for strategic business decisions.",
    icon: BarChart2,
    color: "text-green-500"
  },
  problem_structuring: {
    name: "Business Problem Structuring",
    description: "Master key business frameworks and learn to structure your approach to various case types.",
    icon: FileSpreadsheet,
    color: "text-yellow-500"
  },
  creativity: {
    name: "Data-Driven Decision Making",
    description: "Improve your ability to analyze complex data sets, draw insights, and make informed decisions.",
    icon: Database,
    color: "text-purple-500"
  },
  communication: {
    name: "Case Communication & Presentation",
    description: "Develop skills to articulate your solutions clearly and persuasively in various formats.",
    icon: MessageSquare,
    color: "text-pink-500"
  }
}

export function KeySkillsCTA({ skills, onPractice }: KeySkillsCTAProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Enhance Your Case Interview Skills</h2>
        <p className="text-muted-foreground mt-2">
          Select a skill and difficulty level to start your personalized training session
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill) => {
          const info = skillInfo[skill.category]
          const Icon = info.icon
          
          return (
            <Card key={skill.category} className="transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-2 ${info.color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{info.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {info.description}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Current Score</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{skill.score}%</span>
                          <ScoreBreakdown category={skill.category} score={skill.score} />
                        </div>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                      <Button 
                        onClick={() => onPractice(skill.category)}
                        className="w-full mt-2"
                      >
                        Practice Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


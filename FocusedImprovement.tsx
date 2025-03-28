import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaseResult, SkillCategory } from '@/types/journey'
import { AlertCircle } from 'lucide-react'

interface FocusedImprovementProps {
  latestResult: CaseResult
  onPractice: (skill: SkillCategory) => void
}

const skillCategoryNames: Record<SkillCategory, string> = {
  problem_structuring: "Business Problem Structuring",
  quantitative_analysis: "Quantitative Problem Solving",
  business_acumen: "Market & Industry Analysis",
  communication: "Case Communication & Presentation",
  creativity: "Data-Driven Decision Making"
}

export function FocusedImprovement({ latestResult, onPractice }: FocusedImprovementProps) {
  const sortedSkills = latestResult.skills.sort((a, b) => a.score - b.score)
  const lowestScoringSkills = sortedSkills.slice(0, 3)

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-xl text-orange-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Required Practice Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-orange-800">
          Based on your {latestResult.caseType.replace('_', ' ')} performance, 
          focus on these skills before proceeding:
        </p>
        <div className="space-y-4">
          {lowestScoringSkills.map((skill) => (
            <Card key={skill.category} className="bg-white">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">
                      {skillCategoryNames[skill.category]}
                    </h4>
                    <p className="text-sm text-orange-700 mt-1 mb-3">
                      {getSkillImprovement(skill.category, latestResult.improvementAreas)}
                    </p>
                  </div>
                  <Button 
                    onClick={() => onPractice(skill.category)}
                    variant="outline"
                    className="shrink-0"
                  >
                    Practice Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getSkillImprovement(skill: SkillCategory, improvementAreas: string[]): string {
  const improvements: Record<SkillCategory, string[]> = {
    problem_structuring: [
      "Break down complex problems into manageable parts",
      "Develop a structured approach to problem-solving",
      "Identify key issues and prioritize them effectively"
    ],
    quantitative_analysis: [
      "Improve your mental math skills",
      "Practice data interpretation and analysis",
      "Enhance your ability to draw insights from numbers"
    ],
    business_acumen: [
      "Deepen your understanding of business models",
      "Stay updated on current market trends",
      "Develop a strategic mindset for business challenges"
    ],
    communication: [
      "Articulate your thoughts more clearly and concisely",
      "Improve your ability to explain complex concepts simply",
      "Enhance your active listening skills"
    ],
    creativity: [
      "Generate more innovative solutions to problems",
      "Practice thinking outside the box",
      "Improve your ability to connect disparate ideas"
    ]
  }

  const relevantImprovement = improvementAreas.find(area => 
    improvements[skill].some(improvement => area.toLowerCase().includes(improvement.toLowerCase()))
  )

  return relevantImprovement || improvements[skill][Math.floor(Math.random() * improvements[skill].length)]
}


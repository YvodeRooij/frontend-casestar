import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { InfoIcon } from 'lucide-react'
import { SkillCategory } from "@/types/journey"

interface ScoreBreakdownProps {
  category: SkillCategory
  score: number
}

const breakdownData: Record<SkillCategory, {
  title: string,
  metrics: Array<{
    name: string,
    description: string,
    score: number
  }>
}> = {
  quantitative_analysis: {
    title: "Quantitative Problem Solving Breakdown",
    metrics: [
      {
        name: "Calculation Accuracy",
        description: "Ability to perform calculations quickly and accurately",
        score: 85
      },
      {
        name: "Data Interpretation",
        description: "Skill in analyzing and drawing insights from numerical data",
        score: 75
      },
      {
        name: "Estimation Skills",
        description: "Ability to make reasonable assumptions and estimates",
        score: 70
      }
    ]
  },
  business_acumen: {
    title: "Market & Industry Analysis Breakdown",
    metrics: [
      {
        name: "Market Understanding",
        description: "Knowledge of market dynamics and trends",
        score: 80
      },
      {
        name: "Competitive Analysis",
        description: "Ability to analyze competitive landscapes",
        score: 75
      },
      {
        name: "Strategic Thinking",
        description: "Capability to identify strategic implications",
        score: 70
      }
    ]
  },
  problem_structuring: {
    title: "Business Problem Structuring Breakdown",
    metrics: [
      {
        name: "Framework Application",
        description: "Effective use of business frameworks",
        score: 80
      },
      {
        name: "Issue Identification",
        description: "Ability to identify key business issues",
        score: 75
      },
      {
        name: "Solution Development",
        description: "Skill in developing structured solutions",
        score: 70
      }
    ]
  },
  creativity: {
    title: "Data-Driven Decision Making Breakdown",
    metrics: [
      {
        name: "Data Analysis",
        description: "Ability to analyze complex datasets",
        score: 80
      },
      {
        name: "Insight Generation",
        description: "Skill in drawing meaningful insights",
        score: 75
      },
      {
        name: "Decision Quality",
        description: "Quality of data-backed decisions",
        score: 70
      }
    ]
  },
  communication: {
    title: "Case Communication & Presentation Breakdown",
    metrics: [
      {
        name: "Clarity",
        description: "Clear and concise communication",
        score: 85
      },
      {
        name: "Structure",
        description: "Logical flow and organization",
        score: 75
      },
      {
        name: "Engagement",
        description: "Ability to engage and persuade",
        score: 80
      }
    ]
  }
}

export function ScoreBreakdown({ category, score }: ScoreBreakdownProps) {
  const data = breakdownData[category]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>
            Overall Score: {score}%
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {data.metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{metric.name}</h4>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
                <span className="text-sm font-medium">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
            </div>
          ))}
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">How Scores Are Calculated</h4>
            <p className="text-sm text-muted-foreground">
              Scores are based on your performance across multiple case interviews and practice sessions. 
              Each metric is evaluated based on specific criteria and weighted to provide a comprehensive assessment 
              of your skills in this area.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


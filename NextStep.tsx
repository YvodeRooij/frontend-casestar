import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Lock } from 'lucide-react'
import { CaseType } from '@/types/journey'

interface NextStepProps {
  currentCase: CaseType | null
  canProceed: boolean
  onStart: () => void
}

const caseDescriptions: Record<CaseType, string> = {
  personal_experience: "Share your relevant experiences and demonstrate your communication skills.",
  case_1: "Tackle a business problem and showcase your problem-solving abilities.",
  case_2: "Analyze a complex scenario and provide strategic recommendations.",
  case_3: "Dive deep into a specific industry challenge and present your insights.",
  final_round: "Demonstrate your overall consulting readiness in this final assessment."
}

export function NextStep({ currentCase, canProceed, onStart }: NextStepProps) {
  if (!currentCase) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-green-800">Journey Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Congratulations on completing your interview prep journey!
          </p>
          <Button 
            onClick={onStart} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Review Your Performance
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={canProceed ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}>
      <CardHeader>
        <CardTitle className={`text-2xl ${canProceed ? "text-blue-800" : "text-gray-800"}`}>
          Next: {currentCase.replace('_', ' ')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`mb-4 ${canProceed ? "text-blue-700" : "text-gray-700"}`}>
          {caseDescriptions[currentCase]}
        </p>
        <Button 
          onClick={onStart} 
          className={`w-full ${
            canProceed 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!canProceed}
        >
          {canProceed ? (
            <>
              Start {currentCase.replace('_', ' ')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Practice Required to Unlock
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}


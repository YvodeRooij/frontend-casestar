import { CompanyPath } from '@/types/journey'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CompanySelectionProps {
  onSelect: (company: CompanyPath) => void
}

export function CompanySelection({ onSelect }: CompanySelectionProps) {
  const companies: CompanyPath[] = ["McKinsey", "BCG", "Bain", "General"]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Choose Your Path</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {companies.map((company) => (
            <Button
              key={company}
              onClick={() => onSelect(company)}
              className="w-full h-20 text-lg font-semibold"
              variant={company === "General" ? "outline" : "default"}
            >
              {company}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


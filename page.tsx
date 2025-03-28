"use client"

import { useParams } from "next/navigation"
import { CaseInterview } from "@/components/CaseInterview"
import type { CaseType } from "@/types/journey"

export default function CasePage() {
  const params = useParams()
  const caseType = params.id as CaseType

  return <CaseInterview caseType={caseType} />
}


export type RuleType = "account-mapping" | "tax-code" | "recurring"

export interface RuleException {
  id: string
  description: string
  date: string
  amount: number
}

export interface RuleSuggestion {
  id: string
  type: RuleType
  confidence: number
  statement: string
  evidence: string
  exceptions?: RuleException[]
}

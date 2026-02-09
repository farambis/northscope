export type AnomalyType = "similar" | "typo" | "unusual"

export interface BookingEntry {
  id: string
  text: string
  amount: number
  date: string
}

export interface AnomalyGroup {
  id: string
  type: AnomalyType
  confidence: number
  entries: BookingEntry[]
  suggestion?: string
  matchedPattern?: string
  matchedPatternCount?: number
  reasons?: string[]
  diffDetails?: string
}

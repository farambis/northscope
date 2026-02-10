import { Card, CardContent } from "@/components/ui/card"
import type { RuleSuggestion } from "@/types/rule"

interface RuleSummaryBarProps {
  rules: RuleSuggestion[]
}

export function RuleSummaryBar({ rules }: RuleSummaryBarProps) {
  const total = rules.length
  const accountMappings = rules.filter((r) => r.type === "account-mapping").length
  const taxCodes = rules.filter((r) => r.type === "tax-code").length
  const recurring = rules.filter((r) => r.type === "recurring").length

  const items = [
    { label: "Total Rules", count: total, testId: "total-count" },
    { label: "Account Mappings", count: accountMappings, testId: "account-mapping-count" },
    { label: "Tax Codes", count: taxCodes, testId: "tax-code-count" },
    { label: "Recurring", count: recurring, testId: "recurring-count" },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold" data-testid={item.testId}>
              {item.count}
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

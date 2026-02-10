import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RuleList } from "@/components/accounting/RuleList"
import { ruleSuggestions } from "@/data/rules"

export default function AccountingRulesPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Rule Suggestions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Auto-detected accounting rules from your transaction history
          </p>
        </div>
        <RuleList rules={ruleSuggestions} />
      </main>
    </div>
  )
}

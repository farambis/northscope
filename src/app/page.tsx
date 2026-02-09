import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { KpiGrid } from "@/components/dashboard/KpiGrid"
import { TrendsSection } from "@/components/dashboard/TrendsSection"
import { kpis } from "@/data/kpis"

export default function Home() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Financial Overview
            </h1>
            <p className="mt-1 text-muted-foreground">
              Real-time insights into your financial performance
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: 2 min ago
          </p>
        </div>
        <KpiGrid>
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </KpiGrid>
        <div className="mt-8">
          <TrendsSection />
        </div>
      </main>
    </div>
  )
}

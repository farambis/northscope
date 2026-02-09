import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KpiSummaryHeader } from "@/components/kpi-detail/KpiSummaryHeader"
import { KpiDetailChart } from "@/components/kpi-detail/KpiDetailChart"
import { KpiDetailTable } from "@/components/kpi-detail/KpiDetailTable"
import { kpis } from "@/data/kpis"
import { generateMockData, kpiMetadata } from "@/data/trends"

export default async function KpiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const kpi = kpis.find((k) => k.id === slug)

  if (!kpi) {
    notFound()
  }

  const meta = kpiMetadata.find((m) => m.id === kpi.id)
  const color = meta?.color ?? "var(--chart-1)"

  const tableData = generateMockData("1y").map((point) => ({
    date: point.date,
    value: point[kpi.id],
  }))

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Financial Overview
        </Link>

        <div className="space-y-6">
          <KpiSummaryHeader
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            context={kpi.context}
            badge={kpi.badge}
          />
          <KpiDetailChart kpiId={kpi.id} color={color} />
          <KpiDetailTable kpiId={kpi.id} data={tableData} />
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function KpiNotFound() {
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
        <div className="py-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            KPI not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The requested KPI does not exist.
          </p>
        </div>
      </main>
    </div>
  )
}

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { AnomalyList } from "@/components/bookings/AnomalyList"
import { anomalies } from "@/data/anomalies"

export default function BookingAnomaliesPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Booking Anomalies
          </h1>
          <p className="mt-1 text-muted-foreground">
            Suspicious booking texts that may need review
          </p>
        </div>
        <AnomalyList anomalies={anomalies} />
      </main>
    </div>
  )
}

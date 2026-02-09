import type { Kpi } from "@/types/kpi"

export const kpis: Kpi[] = [
  {
    label: "Monthly Recurring Revenue",
    value: "$47.2k",
    change: { value: 12.3, isPositive: true },
    context: "vs. $42.1k last month",
    badge: { text: "GROWING", variant: "positive" },
  },
  {
    label: "Revenue",
    value: "$124.5k",
    change: { value: 8.7, isPositive: true },
    context: "vs. $114.2k last month",
    badge: { text: "STRONG", variant: "positive" },
  },
  {
    label: "Burn Rate",
    value: "$18.3k",
    change: { value: -5.2, isPositive: true },
    context: "vs. $19.3k last month",
    badge: { text: "IMPROVING", variant: "positive" },
  },
  {
    label: "Cash Flow",
    value: "$42.1k",
    change: { value: 22.4, isPositive: true },
    context: "vs. $34.4k last month",
    badge: { text: "POSITIVE", variant: "positive" },
  },
  {
    label: "Profit Margin",
    value: "34.2%",
    change: { value: 3.1, isPositive: true },
    context: "vs. 33.1% last month",
    badge: { text: "HEALTHY", variant: "positive" },
  },
]

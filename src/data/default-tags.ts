import type { Tag } from "@/types/anomaly"

export const defaultTags: Tag[] = [
  { id: "reviewed", label: "Reviewed", color: "blue" },
  { id: "needs-follow-up", label: "Needs follow-up", color: "amber" },
  { id: "false-positive", label: "False positive", color: "emerald" },
  { id: "recurring-issue", label: "Recurring issue", color: "rose" },
]

export const tagColors = [
  "blue",
  "amber",
  "emerald",
  "rose",
  "violet",
  "cyan",
  "orange",
  "pink",
] as const

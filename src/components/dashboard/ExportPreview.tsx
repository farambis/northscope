import type { ExportFormat } from "@/types/export"

const formatLabels: Record<ExportFormat, string> = {
  markdown: "Markdown",
  json: "JSON",
  pdf: "PDF (Markdown preview)",
  pptx: "PowerPoint (Markdown preview)",
}

export function ExportPreview({
  format,
  selectedCount,
}: {
  format: ExportFormat
  selectedCount: number
}) {
  return (
    <div className="rounded-md border bg-muted/50 px-4 py-3 text-sm">
      <p className="font-medium">Preview</p>
      <p className="mt-1 text-muted-foreground">
        {selectedCount} of 5 KPIs &middot; {formatLabels[format]}
      </p>
    </div>
  )
}

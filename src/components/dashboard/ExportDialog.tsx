"use client"

import { useCallback, useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { kpis } from "@/data/kpis"
import { defaultTitle, generateExport, triggerDownload } from "@/lib/export"
import type { ExportFormat } from "@/types/export"
import { ExportPreview } from "./ExportPreview"

const allKpiIds = new Set(kpis.map((k) => k.id))

const formatOptions: { value: ExportFormat; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "pptx", label: "PowerPoint" },
  { value: "markdown", label: "Markdown" },
  { value: "json", label: "JSON" },
]

export function ExportDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultTitle)
  const [subtitle, setSubtitle] = useState("")
  const [format, setFormat] = useState<ExportFormat>("pdf")
  const [selectedKpiIds, setSelectedKpiIds] = useState<Set<string>>(
    () => new Set(allKpiIds),
  )

  const resetState = useCallback(() => {
    setTitle(defaultTitle())
    setSubtitle("")
    setFormat("pdf")
    setSelectedKpiIds(new Set(allKpiIds))
  }, [])

  function handleOpenChange(next: boolean) {
    if (next) resetState()
    setOpen(next)
  }

  function handleToggleKpi(id: string) {
    setSelectedKpiIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleGenerate() {
    const { content, filename, mimeType } = generateExport(
      { title, subtitle, format, selectedKpiIds },
      kpis,
    )
    triggerDownload(content, filename, mimeType)
    toast.success("Report downloaded successfully")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Create a branded presentation of your KPIs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="export-title">Report Title</Label>
            <input
              id="export-title"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="export-subtitle">Subtitle (optional)</Label>
            <input
              id="export-subtitle"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              placeholder="Add a subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
              className="flex gap-4"
            >
              {formatOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-1.5">
                  <RadioGroupItem value={opt.value} id={`fmt-${opt.value}`} />
                  <Label htmlFor={`fmt-${opt.value}`} className="font-normal">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Include KPIs</Label>
              <Button
                variant="link"
                size="xs"
                onClick={() =>
                  setSelectedKpiIds(
                    selectedKpiIds.size === kpis.length
                      ? new Set()
                      : new Set(allKpiIds),
                  )
                }
              >
                {selectedKpiIds.size === kpis.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="grid gap-2">
              {kpis.map((kpi) => (
                <label
                  key={kpi.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedKpiIds.has(kpi.id)}
                    onCheckedChange={() => handleToggleKpi(kpi.id)}
                  />
                  <span className="flex-1 text-sm">{kpi.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {kpi.value}
                  </span>
                  <span
                    className={`text-sm ${kpi.change.isPositive ? "text-positive" : "text-negative"}`}
                  >
                    {kpi.change.value >= 0 ? "\u2191" : "\u2193"}{" "}
                    {Math.abs(kpi.change.value)}%
                  </span>
                </label>
              ))}
            </div>
          </div>

          <ExportPreview format={format} selectedCount={selectedKpiIds.size} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={selectedKpiIds.size === 0}>
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

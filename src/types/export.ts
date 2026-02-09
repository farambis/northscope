export type ExportFormat = "pdf" | "pptx" | "markdown" | "json"

export interface ExportConfig {
  title: string
  subtitle: string
  format: ExportFormat
  selectedKpiIds: Set<string>
}

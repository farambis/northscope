import { computeInlineDiff } from "@/lib/diff"

interface InlineDiffProps {
  source: string
  target: string
}

export function InlineDiff({ source, target }: InlineDiffProps) {
  const segments = computeInlineDiff(source, target)

  return (
    <span>
      {segments.map((segment, i) =>
        segment.highlight ? (
          <span
            key={i}
            className="bg-negative/20 text-negative rounded px-0.5"
          >
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </span>
  )
}

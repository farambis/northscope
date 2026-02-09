export interface DiffSegment {
  text: string
  highlight: boolean
}

/**
 * Computes an inline diff between `source` and `target` using longest common
 * subsequence. Returns segments of `source` with characters not in the LCS
 * marked as highlighted (i.e., the differences).
 */
export function computeInlineDiff(source: string, target: string): DiffSegment[] {
  if (source.length === 0) return []
  if (target.length === 0) return [{ text: source, highlight: true }]
  if (source === target) return [{ text: source, highlight: false }]

  const lcs = longestCommonSubsequence(source, target)
  const lcsSet = new Set(lcs)

  const segments: DiffSegment[] = []
  let currentText = ""
  let currentHighlight = false

  for (let i = 0; i < source.length; i++) {
    const isHighlighted = !lcsSet.has(i)

    if (i === 0) {
      currentHighlight = isHighlighted
      currentText = source[i]
    } else if (isHighlighted === currentHighlight) {
      currentText += source[i]
    } else {
      segments.push({ text: currentText, highlight: currentHighlight })
      currentText = source[i]
      currentHighlight = isHighlighted
    }
  }

  if (currentText) {
    segments.push({ text: currentText, highlight: currentHighlight })
  }

  return segments
}

/**
 * Returns the indices in `source` that are part of the LCS with `target`.
 */
function longestCommonSubsequence(source: string, target: string): number[] {
  const m = source.length
  const n = target.length

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (source[i - 1] === target[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const indices: number[] = []
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (source[i - 1] === target[j - 1]) {
      indices.push(i - 1)
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return indices
}

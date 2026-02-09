import { describe, it, expect } from "vitest"
import { computeInlineDiff } from "./diff"

describe("computeInlineDiff", () => {
  it("returns a single non-highlighted segment for identical strings", () => {
    const result = computeInlineDiff("hello", "hello")

    expect(result).toEqual([{ text: "hello", highlight: false }])
  })

  it("highlights a single character difference", () => {
    const result = computeInlineDiff("paymnet", "payment")

    const highlighted = result.filter((s) => s.highlight)
    expect(highlighted.length).toBeGreaterThan(0)

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("paymnet")
  })

  it("highlights case differences", () => {
    const result = computeInlineDiff("bürobedarf Amazon", "Bürobedarf Amazon")

    const highlighted = result.filter((s) => s.highlight)
    expect(highlighted.length).toBeGreaterThan(0)
    expect(highlighted.some((s) => s.text === "b")).toBe(true)
  })

  it("returns all highlighted segments for completely different strings", () => {
    const result = computeInlineDiff("abc", "xyz")

    const allHighlighted = result.every((s) => s.highlight)
    expect(allHighlighted).toBe(true)

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("abc")
  })

  it("handles empty source string", () => {
    const result = computeInlineDiff("", "hello")

    expect(result).toEqual([])
  })

  it("handles empty target string", () => {
    const result = computeInlineDiff("hello", "")

    expect(result).toEqual([{ text: "hello", highlight: true }])
  })

  it("handles strings of different lengths", () => {
    const result = computeInlineDiff("Gehalt Janua", "Gehalt Januar")

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("Gehalt Janua")

    const nonHighlighted = result.filter((s) => !s.highlight)
    expect(nonHighlighted.map((s) => s.text).join("")).toContain("Gehalt Janu")
  })

  it("highlights exactly one character with repeated characters", () => {
    const result = computeInlineDiff("aaa", "aa")

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("aaa")

    const highlighted = result.filter((s) => s.highlight)
    expect(highlighted.length).toBeGreaterThan(0)

    const highlightedText = highlighted.map((s) => s.text).join("")
    expect(highlightedText.length).toBe(1)
  })

  it("highlights exactly one extra space in context with repeated characters", () => {
    const result = computeInlineDiff("Miete  Büro", "Miete Büro")

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("Miete  Büro")

    const highlighted = result.filter((s) => s.highlight)
    expect(highlighted.length).toBeGreaterThan(0)

    const highlightedText = highlighted.map((s) => s.text).join("")
    expect(highlightedText).toBe(" ")
  })

  it("highlights characters covering transposition", () => {
    const result = computeInlineDiff("paymnet", "payment")

    const fullText = result.map((s) => s.text).join("")
    expect(fullText).toBe("paymnet")

    const highlighted = result.filter((s) => s.highlight)
    expect(highlighted.length).toBeGreaterThan(0)
  })
})

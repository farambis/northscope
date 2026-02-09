import type { AnomalyGroup } from "@/types/anomaly"

export const anomalies: AnomalyGroup[] = [
  // Similar groups (5)
  {
    id: "sim-1",
    type: "similar",
    confidence: 92,
    suggestion: "Bürobedarf Amazon",
    entries: [
      { id: "e-101", text: "Bürobedarf Amazon", amount: 149.99, date: "2025-01-15" },
      { id: "e-102", text: "bürobedarf Amazon", amount: 89.5, date: "2025-01-22" },
      { id: "e-103", text: "Bürobedarf amazon", amount: 234.0, date: "2025-02-03" },
    ],
  },
  {
    id: "sim-2",
    type: "similar",
    confidence: 88,
    suggestion: "Miete Büro Hauptstr. 12",
    entries: [
      { id: "e-201", text: "Miete Büro Hauptstr. 12", amount: 2400.0, date: "2025-01-01" },
      { id: "e-202", text: "Miete Büro Hauptstr.12", amount: 2400.0, date: "2025-02-01" },
      { id: "e-203", text: "Miete  Büro Hauptstr. 12", amount: 2400.0, date: "2025-03-01" },
    ],
  },
  {
    id: "sim-3",
    type: "similar",
    confidence: 85,
    suggestion: "Travel Expenses - Berlin",
    entries: [
      { id: "e-301", text: "Travel Expenses - Berlin", amount: 876.3, date: "2025-01-18" },
      { id: "e-302", text: "Travel expenses - Berlin", amount: 1243.5, date: "2025-02-10" },
    ],
  },
  {
    id: "sim-4",
    type: "similar",
    confidence: 78,
    suggestion: "Softwarelizenzen Q1",
    entries: [
      { id: "e-401", text: "Softwarelizenzen Q1", amount: 4500.0, date: "2025-01-05" },
      { id: "e-402", text: "Software-Lizenzen Q1", amount: 4500.0, date: "2025-01-05" },
    ],
  },
  {
    id: "sim-5",
    type: "similar",
    confidence: 71,
    suggestion: "AWS Monthly Invoice",
    entries: [
      { id: "e-501", text: "AWS Monthly Invoice", amount: 1872.43, date: "2025-01-31" },
      { id: "e-502", text: "AWS monthly invoice", amount: 1955.12, date: "2025-02-28" },
    ],
  },
  // Typo groups (4)
  {
    id: "typo-1",
    type: "typo",
    confidence: 95,
    matchedPattern: "Monthly rent payment",
    matchedPatternCount: 24,
    diffDetails: '"paymnet" \u2192 "payment"',
    entries: [
      { id: "e-601", text: "Monthly rent paymnet", amount: 3200.0, date: "2025-02-01" },
    ],
  },
  {
    id: "typo-2",
    type: "typo",
    confidence: 91,
    matchedPattern: "Office supplies Q1",
    matchedPatternCount: 8,
    diffDetails: '"suplies" \u2192 "supplies"',
    entries: [
      { id: "e-701", text: "Office suplies Q1", amount: 342.8, date: "2025-01-28" },
    ],
  },
  {
    id: "typo-3",
    type: "typo",
    confidence: 89,
    matchedPattern: "Gehalt Januar",
    matchedPatternCount: 45,
    diffDetails: '"Janua" \u2192 "Januar"',
    entries: [
      { id: "e-801", text: "Gehalt Janua", amount: 5800.0, date: "2025-01-31" },
    ],
  },
  {
    id: "typo-4",
    type: "typo",
    confidence: 82,
    matchedPattern: "Versicherung Betriebshaftpflicht",
    matchedPatternCount: 12,
    diffDetails: '"Betreibshaftpflicht" \u2192 "Betriebshaftpflicht"',
    entries: [
      { id: "e-901", text: "Versicherung Betreibshaftpflicht", amount: 890.0, date: "2025-01-15" },
    ],
  },
  // Unusual groups (3)
  {
    id: "unusual-1",
    type: "unusual",
    confidence: 97,
    reasons: ["Contains test data pattern", "Non-descriptive text"],
    entries: [
      { id: "e-1001", text: "asdf test 123", amount: 1.0, date: "2025-02-05" },
    ],
  },
  {
    id: "unusual-2",
    type: "unusual",
    confidence: 84,
    reasons: ["Placeholder text detected", "Pending review marker"],
    entries: [
      { id: "e-1101", text: "xxxx pending review", amount: 15000.0, date: "2025-01-20" },
    ],
  },
  {
    id: "unusual-3",
    type: "unusual",
    confidence: 72,
    reasons: ["Unusually short description", "Amount exceeds typical range"],
    entries: [
      { id: "e-1201", text: "???", amount: 99999.99, date: "2025-02-08" },
    ],
  },
]

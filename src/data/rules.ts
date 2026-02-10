import type { RuleSuggestion } from "@/types/rule"

export const ruleSuggestions: RuleSuggestion[] = [
  {
    id: "acct-1",
    type: "account-mapping",
    confidence: 96,
    statement: "Office Supplies Ltd → Account 6815 (Office Supplies)",
    evidence: "Matched 23 of 24 transactions in the last 12 months",
    exceptions: [
      {
        id: "ex-1",
        description: "Office Supplies Ltd booked to 6820 (Marketing)",
        date: "2025-03-15",
        amount: 450.0,
      },
    ],
  },
  {
    id: "acct-2",
    type: "account-mapping",
    confidence: 100,
    statement: "Deutsche Telekom AG → Account 6805 (Telecommunications)",
    evidence: "All 12 transactions in the last 12 months match",
  },
  {
    id: "acct-3",
    type: "account-mapping",
    confidence: 88,
    statement: "Staples Europe → Account 6815 (Office Supplies)",
    evidence: "Matched 7 of 8 transactions since October 2024",
    exceptions: [
      {
        id: "ex-2",
        description: "Staples Europe booked to 6850 (IT Equipment)",
        date: "2025-01-20",
        amount: 1299.0,
      },
    ],
  },
  {
    id: "tax-1",
    type: "tax-code",
    confidence: 86,
    statement: "Account 4400 (Revenue) → Tax Code USt19",
    evidence: "Used in 86% of postings (43 of 50) in the last 6 months",
    exceptions: [
      {
        id: "ex-3",
        description: "Account 4400 used USt7 for reduced-rate item",
        date: "2025-02-10",
        amount: 230.0,
      },
      {
        id: "ex-4",
        description: "Account 4400 used USt0 for export sale",
        date: "2025-01-05",
        amount: 8500.0,
      },
    ],
  },
  {
    id: "tax-2",
    type: "tax-code",
    confidence: 94,
    statement: "Account 6300 (Rent) → Tax Code VSt19",
    evidence: "Used in 94% of postings (32 of 34) over the last year",
  },
  {
    id: "tax-3",
    type: "tax-code",
    confidence: 79,
    statement: "Account 6815 (Office Supplies) → Tax Code VSt19",
    evidence: "Used in 79% of postings (19 of 24) in the last 6 months",
    exceptions: [
      {
        id: "ex-5",
        description: "Account 6815 used VSt7 for books",
        date: "2025-02-28",
        amount: 89.9,
      },
    ],
  },
  {
    id: "rec-1",
    type: "recurring",
    confidence: 98,
    statement: "Monthly rent payment EUR 2,400.00 → Account 6310 (Rent Expense)",
    evidence:
      "Detected 11 consecutive monthly postings (same amount, same day)",
  },
  {
    id: "rec-2",
    type: "recurring",
    confidence: 91,
    statement: "Quarterly insurance EUR 890.00 → Account 6420 (Insurance)",
    evidence: "Detected 4 quarterly postings over the past year",
  },
]

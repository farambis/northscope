# Fara-Scope

A simulated finance insights interface built with Next.js. Fara-Scope provides an interactive dashboard for visualizing financial data, tracking key metrics, and surfacing actionable insights.

## Features

- **KPI Cards** — 3–5 cards displaying key financial metrics at a glance (e.g. revenue, expenses, profit margin, cash flow)
- **Trends / Time Series View** — Interactive chart showing KPI trends over time, with filters for time range and KPI selection
- **KPI Detail View** — Click any KPI card to open a dedicated detail page with an expanded chart and a data table

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone <repository-url>
cd northscope
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
northscope/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable UI components
│   └── lib/          # Utilities and helpers
├── public/           # Static assets
└── package.json
```

## License

This project is for simulation and demonstration purposes.

import Link from "next/link"
import { BarChart3 } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Reports", href: "/reports", active: false },
  { label: "Settings", href: "/settings", active: false },
]

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            Northscope
          </span>
        </div>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? "text-sm font-medium text-foreground"
                  : "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

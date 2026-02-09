"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3 } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
]

function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/kpi/")
  }
  return pathname === href || pathname.startsWith(href + "/")
}

export function DashboardHeader() {
  const pathname = usePathname()

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
                isNavItemActive(item.href, pathname)
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

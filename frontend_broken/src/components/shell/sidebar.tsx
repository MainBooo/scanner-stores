import Link from "next/link"
import { cn } from "@/lib/cn"
import { LayoutGrid, Users, FileText, Activity, Sparkles, Settings } from "lucide-react"

const items = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/pages", label: "Pages", icon: FileText },
  { href: "/changes", label: "Changes", icon: Activity },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeHref }: { activeHref: string }) {
  return (
    <aside className="w-[260px] shrink-0 border-r bg-card/40">
      <div className="p-4 text-sm font-semibold">Competitor Intel</div>
      <nav className="px-2 pb-4 space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-mutedForeground hover:bg-muted/60 hover:text-foreground transition",
                activeHref === it.href && "bg-muted text-foreground"
              )}
            >
              <Icon size={16} />
              {it.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-mutedForeground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Live monitoring
        </div>
      </div>
    </aside>
  )
}

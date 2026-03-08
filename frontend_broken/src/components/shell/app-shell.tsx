import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AppShell({
  activeHref,
  title,
  onAdd,
  onRefresh,
  children,
}: {
  activeHref: string
  title: string
  onAdd?: () => void
  onRefresh?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeHref={activeHref} />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} onAdd={onAdd} onRefresh={onRefresh} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

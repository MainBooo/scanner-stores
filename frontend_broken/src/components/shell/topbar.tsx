import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export function Topbar({ title, onAdd, onRefresh }: { title: string; onAdd?: () => void; onRefresh?: () => void }) {
  return (
    <div className="h-14 border-b bg-card/40 flex items-center justify-between px-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex items-center gap-2">
        {onRefresh ? (
          <Button variant="secondary" size="sm" onClick={onRefresh} title="Refresh / tick scheduler">
            <RefreshCcw size={16} />
          </Button>
        ) : null}
        {onAdd ? (
          <Button onClick={onAdd} size="sm">
            Add competitor
          </Button>
        ) : null}
      </div>
    </div>
  )
}

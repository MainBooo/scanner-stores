"use client"
import { useEffect, useState } from "react"
import { AppShell } from "@/components/shell/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddCompetitorModal } from "@/components/feature/add-competitor-modal"
import { listCompetitors } from "@/lib/api"
import { fmtDate } from "@/lib/format"

export default function CompetitorsPage() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    setErr(null)
    try {
      setItems(await listCompetitors())
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    }
  }

  useEffect(() => { load() }, [])

  return (
    <AppShell activeHref="/competitors" title="Competitors" onAdd={() => setOpen(true)}>
      <AddCompetitorModal open={open} onClose={() => setOpen(false)} onDone={load} />

      <Card>
        <CardHeader>
          <CardTitle>Competitors</CardTitle>
          <Badge>{items.length}</Badge>
        </CardHeader>
        <CardContent>
          {err ? <div className="text-sm text-danger">{err}</div> : null}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-mutedForeground">
                <tr className="border-b">
                  <th className="text-left py-2">Domain</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Last scan</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="py-2">{c.domain}</td>
                    <td className="py-2 text-mutedForeground">{c.displayName ?? "—"}</td>
                    <td className="py-2"><Badge>{c.status}</Badge></td>
                    <td className="py-2 text-mutedForeground">{fmtDate(c.lastScanAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}

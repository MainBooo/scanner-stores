"use client"
import { useEffect, useState } from "react"
import { AppShell } from "@/components/shell/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { listChanges } from "@/lib/api"
import { fmtDate } from "@/lib/format"
import { SeverityPill } from "@/components/feature/severity-pill"
import { ChangeDrawer } from "@/components/feature/change-drawer"
import { Button } from "@/components/ui/button"

export default function ChangesPage() {
  const [items, setItems] = useState<any[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  async function load() {
    setErr(null)
    try {
      setItems(await listChanges())
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    }
  }

  useEffect(() => { load() }, [])

  return (
    <AppShell activeHref="/changes" title="Changes">
      <ChangeDrawer id={id} open={open} onClose={() => setOpen(false)} />
      <Card>
        <CardHeader>
          <CardTitle>Changes</CardTitle>
          <Badge>{items.length}</Badge>
        </CardHeader>
        <CardContent>
          {err ? <div className="text-sm text-danger">{err}</div> : null}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-mutedForeground">
                <tr className="border-b">
                  <th className="text-left py-2">Detected</th>
                  <th className="text-left py-2">Severity</th>
                  <th className="text-left py-2">Summary</th>
                  <th className="text-left py-2">Page</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="py-2 text-mutedForeground">{fmtDate(c.detectedAt)}</td>
                    <td className="py-2"><SeverityPill v={c.severity} /></td>
                    <td className="py-2">{c.summary}</td>
                    <td className="py-2 text-mutedForeground max-w-[360px] truncate">{c.page?.url ?? "—"}</td>
                    <td className="py-2">
                      <Button size="sm" variant="secondary" onClick={() => { setId(c.id); setOpen(true) }}>
                        View
                      </Button>
                    </td>
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

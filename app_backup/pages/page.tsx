"use client"

import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/shell/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { bulkEnablePages, listCompetitors, listPages, tickScheduler, type Competitor, type Page } from "@/lib/api"
import { fmtDate } from "@/lib/format"
import { SeverityPill } from "@/components/feature/severity-pill"

const PAGE_TYPES = ["all", "home", "pricing", "product", "category", "blog", "docs", "other"] as const

export default function PagesPage() {
  const [items, setItems] = useState<Page[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [competitorId, setCompetitorId] = useState("all")
  const [pageType, setPageType] = useState<(typeof PAGE_TYPES)[number]>("all")
  const [query, setQuery] = useState("")
  const [onlyUnmonitored, setOnlyUnmonitored] = useState(false)
  const [intervalMin, setIntervalMin] = useState(60)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  async function load() {
    setErr(null)
    try {
      const [pages, comps] = await Promise.all([listPages(), listCompetitors()])
      setItems(pages)
      setCompetitors(comps)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    }
  }

  useEffect(() => {
    load()
  }, [])

  const competitorMap = useMemo(() => {
    return Object.fromEntries(competitors.map((c) => [c.id, c]))
  }, [competitors])

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (competitorId !== "all" && p.competitorId !== competitorId) return false
      if (pageType !== "all" && p.pageType !== pageType) return false
      if (onlyUnmonitored && p.monitoringEnabled) return false

      const q = query.trim().toLowerCase()
      if (!q) return true

      const domain = competitorMap[p.competitorId]?.domain?.toLowerCase() ?? ""
      return p.url.toLowerCase().includes(q) || domain.includes(q) || p.pageType.toLowerCase().includes(q)
    })
  }, [items, competitorId, pageType, onlyUnmonitored, query, competitorMap])

  const selectedUrls = useMemo(() => {
    return filtered.filter((p) => selected[p.url]).map((p) => p.url)
  }, [filtered, selected])

  const selectedCompetitorIds = useMemo(() => {
    return Array.from(new Set(filtered.filter((p) => selected[p.url]).map((p) => p.competitorId)))
  }, [filtered, selected])

  const canEnable = selectedUrls.length > 0 && selectedCompetitorIds.length === 1

  function toggleUrl(url: string, value: boolean) {
    setSelected((prev) => ({ ...prev, [url]: value }))
  }

  function selectVisible(value: boolean) {
    const next = { ...selected }
    for (const p of filtered) next[p.url] = value
    setSelected(next)
  }

  function clearSelection() {
    setSelected({})
  }

  async function enableSelected() {
    if (!canEnable) return
    const targetCompetitorId = selectedCompetitorIds[0]

    setBusy(true)
    setErr(null)
    try {
      await bulkEnablePages(targetCompetitorId, selectedUrls, intervalMin)
      clearSelection()
      await load()
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell
      activeHref="/pages"
      title="Pages"
      onRefresh={async () => {
        await tickScheduler().catch(() => {})
        await load()
      }}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Selection</CardTitle>
            <Badge>{selectedUrls.length} selected</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {err ? <div className="text-sm text-danger">{err}</div> : null}

            <div>
              <div className="mb-1 text-xs text-mutedForeground">Competitor</div>
              <select
                value={competitorId}
                onChange={(e) => setCompetitorId(e.target.value)}
                className="w-full rounded-xl border bg-background/30 px-3 py-2 text-sm"
              >
                <option value="all">All competitors</option>
                {competitors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1 text-xs text-mutedForeground">Page type</div>
              <select
                value={pageType}
                onChange={(e) => setPageType(e.target.value as (typeof PAGE_TYPES)[number])}
                className="w-full rounded-xl border bg-background/30 px-3 py-2 text-sm"
              >
                {PAGE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1 text-xs text-mutedForeground">Search</div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="url / domain / type"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-mutedForeground">
              <input
                type="checkbox"
                checked={onlyUnmonitored}
                onChange={(e) => setOnlyUnmonitored(e.target.checked)}
              />
              Only not monitored
            </label>

            <div>
              <div className="mb-1 text-xs text-mutedForeground">Interval (min)</div>
              <Input
                type="number"
                min={5}
                max={1440}
                value={intervalMin}
                onChange={(e) => setIntervalMin(Number(e.target.value || 60))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => selectVisible(true)}>
                Select visible
              </Button>
              <Button variant="secondary" onClick={() => selectVisible(false)}>
                Unselect visible
              </Button>
            </div>

            <Button variant="secondary" className="w-full" onClick={clearSelection}>
              Clear all
            </Button>

            <div className="rounded-xl border p-3 text-xs text-mutedForeground">
              {selectedCompetitorIds.length > 1
                ? "Выбраны страницы из нескольких competitors. Для bulk enable выбери страницы только одного competitor."
                : selectedUrls.length === 0
                  ? "Выбери страницы слева в таблице."
                  : `Будет включён monitoring для ${selectedUrls.length} page(s).`}
            </div>

            <Button className="w-full" onClick={enableSelected} disabled={!canEnable || busy}>
              {busy ? "Enabling..." : "Enable monitoring"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <Badge>{filtered.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-mutedForeground">
                  <tr className="border-b">
                    <th className="text-left py-2 pr-2 w-10">Sel</th>
                    <th className="text-left py-2">URL</th>
                    <th className="text-left py-2">Competitor</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Monitoring</th>
                    <th className="text-left py-2">Interval</th>
                    <th className="text-left py-2">Last checked</th>
                    <th className="text-left py-2">Last severity</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const c = competitorMap[p.competitorId]
                    return (
                      <tr key={p.id} className="border-b border-border/60">
                        <td className="py-2 pr-2">
                          <input
                            type="checkbox"
                            checked={!!selected[p.url]}
                            onChange={(e) => toggleUrl(p.url, e.target.checked)}
                          />
                        </td>
                        <td className="py-2 max-w-[420px] truncate">{p.url}</td>
                        <td className="py-2 text-mutedForeground">{c?.domain ?? "—"}</td>
                        <td className="py-2 text-mutedForeground">{p.pageType}</td>
                        <td className="py-2">
                          <Badge>{p.monitoringEnabled ? "on" : "off"}</Badge>
                        </td>
                        <td className="py-2 text-mutedForeground">{p.checkIntervalMin}m</td>
                        <td className="py-2 text-mutedForeground">{fmtDate(p.lastCheckedAt)}</td>
                        <td className="py-2">
                          <SeverityPill v={p.lastSeverity} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 ? (
              <div className="py-6 text-sm text-mutedForeground">
                No pages found for current filters.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

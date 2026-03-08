"use client"
import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createCompetitor, getSuggestions, bulkEnablePages, type Suggestion } from "@/lib/api"

export function AddCompetitorModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean
  onClose: () => void
  onDone: () => void
}) {
  const [step, setStep] = useState<"form" | "suggest">("form")
  const [domain, setDomain] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitorId, setCompetitorId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<(Suggestion & { selected: boolean })[]>([])
  const [intervalMin, setIntervalMin] = useState(60)

  useEffect(() => {
    if (!open) {
      setStep("form")
      setDomain("")
      setName("")
      setLoading(false)
      setError(null)
      setCompetitorId(null)
      setSuggestions([])
      setIntervalMin(60)
    }
  }, [open])

  async function scan() {
    setError(null)
    setLoading(true)
    try {
      const c = await createCompetitor(domain.trim(), name.trim() || undefined)
      setCompetitorId(c.id)
      setStep("suggest")
      // Wait a bit and fetch suggestions. In real product we poll scan status.
      const s = await getSuggestions(c.id)
      const preferred = new Set(["home", "pricing", "product", "category"])
      setSuggestions(s.map((x) => ({ ...x, selected: preferred.has(x.pageType) })))
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  async function enable() {
    if (!competitorId) return
    setLoading(true)
    setError(null)
    try {
      const urls = suggestions.filter((s) => s.selected).map((s) => s.url)
      await bulkEnablePages(competitorId, urls, intervalMin)
      onDone()
      onClose()
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={step === "form" ? "Add competitor" : "Pick pages to monitor"} onClose={onClose}>
      <div className="p-4 space-y-3">
        {error ? <div className="text-sm text-danger">{error}</div> : null}

        {step === "form" ? (
          <>
            <div className="text-xs text-mutedForeground">Domain</div>
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
            <div className="text-xs text-mutedForeground">Display name (optional)</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Competitor A" />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={scan} disabled={!domain.trim() || loading}>
                {loading ? "Scanning..." : "Scan"}
              </Button>
            </div>
            <div className="text-xs text-mutedForeground">
              Tip: scanner uses Playwright crawl. Suggestions appear after scan completes.
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-xs text-mutedForeground">Suggestions</div>
              <div className="text-xs text-mutedForeground">
                Interval (min)
                <input
                  className="ml-2 w-24 rounded-xl bg-background/30 border px-2 py-1 text-xs"
                  type="number"
                  min={5}
                  max={1440}
                  value={intervalMin}
                  onChange={(e) => setIntervalMin(Number(e.target.value || 60))}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-auto pr-1">
              {suggestions.length === 0 ? (
                <div className="text-sm text-mutedForeground">No suggestions yet. Try refresh later.</div>
              ) : (
                suggestions.map((s, idx) => (
                  <label
                    key={s.url}
                    className="flex items-start gap-3 rounded-xl border p-3 bg-background/15 hover:bg-background/25 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={s.selected}
                      onChange={(e) => {
                        const next = [...suggestions]
                        next[idx] = { ...next[idx], selected: e.target.checked }
                        setSuggestions(next)
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.url}</div>
                      <div className="text-xs text-mutedForeground">
                        {s.pageType} • {s.reason}
                      </div>
                    </div>
                    <Badge>{s.pageType}</Badge>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={enable} disabled={loading || suggestions.every((s) => !s.selected)}>
                {loading ? "Enabling..." : "Enable monitoring"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

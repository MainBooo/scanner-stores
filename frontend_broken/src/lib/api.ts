const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"

export type Competitor = {
  id: string
  domain: string
  displayName: string | null
  status: "active" | "paused" | "error"
  lastScanAt: string | null
  createdAt: string
}

export type Page = {
  id: string
  competitorId: string
  url: string
  pageType: string
  monitoringEnabled: boolean
  checkIntervalMin: number
  lastCheckedAt: string | null
  lastChangeAt: string | null
  lastSeverity: "low" | "med" | "high" | null
}

export type Change = {
  id: string
  pageId: string
  detectedAt: string
  changeType: string
  severity: "low" | "med" | "high"
  summary: string
  page?: { url: string }
}

export type Suggestion = { url: string; pageType: string; reason: string }

async function ok<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export function health() {
  return fetch(`${API_BASE}/api/health`, { cache: "no-store" }).then(ok<{ ok: boolean }>)
}

export function listCompetitors() {
  return fetch(`${API_BASE}/api/competitors`, { cache: "no-store" }).then(ok<Competitor[]>)
}

export function createCompetitor(domain: string, displayName?: string) {
  return fetch(`${API_BASE}/api/competitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, displayName }),
  }).then(ok<Competitor>)
}

export function getSuggestions(competitorId: string) {
  return fetch(`${API_BASE}/api/competitors/${competitorId}/suggestions`, { cache: "no-store" }).then(ok<Suggestion[]>)
}

export function bulkEnablePages(competitorId: string, urls: string[], intervalMin: number) {
  return fetch(`${API_BASE}/api/pages/bulk-enable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ competitorId, urls, intervalMin }),
  }).then(ok<{ enabled: number }>)
}

export function listPages(params?: { competitorId?: string }) {
  const q = new URLSearchParams()
  if (params?.competitorId) q.set("competitorId", params.competitorId)
  const s = q.toString() ? `?${q.toString()}` : ""
  return fetch(`${API_BASE}/api/pages${s}`, { cache: "no-store" }).then(ok<Page[]>)
}

export function listChanges(params?: { severity?: string }) {
  const q = new URLSearchParams()
  if (params?.severity) q.set("severity", params.severity)
  const s = q.toString() ? `?${q.toString()}` : ""
  return fetch(`${API_BASE}/api/changes${s}`, { cache: "no-store" }).then(ok<Change[]>)
}

export function getChange(id: string) {
  return fetch(`${API_BASE}/api/changes/${id}`, { cache: "no-store" }).then(ok<any>)
}

export function tickScheduler() {
  return fetch(`${API_BASE}/api/jobs/tick`, { method: "POST" }).then(ok<{ enqueued: number }>)
}

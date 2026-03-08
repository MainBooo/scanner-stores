import { createWorker } from "../queue/queue"
import { PrismaClient } from "@prisma/client"
import { chromium } from "playwright"
import { classifyPath } from "./classify"

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase()
}

function normalizeHostname(hostname: string) {
  return hostname.replace(/^www\./, "").toLowerCase()
}

function canonicalUrl(raw: string) {
  const u = new URL(raw)
  u.hash = ""
  u.search = ""
  let pathname = u.pathname || "/"
  pathname = pathname.replace(/\/+$/, "") || "/"
  return `${u.protocol}//${u.hostname.toLowerCase()}${pathname}`
}

export function runDomainScanWorker() {
  const prisma = new PrismaClient()

  return createWorker("domain_scan", async (job) => {
    const { competitorId } = job.data as { competitorId: string }

    console.log("[domain_scan] start", { jobId: job.id, competitorId })

    const competitor = await prisma.competitor.findUnique({
      where: { id: competitorId },
    })

    if (!competitor) {
      console.log("[domain_scan] competitor not found", { competitorId })
      return { ok: false, reason: "competitor not found" }
    }

    const domain = normalizeDomain(competitor.domain)
    const baseUrl = `https://${domain}`

    const maxPages = Number(process.env.SCAN_MAX_PAGES ?? 80)
    const timeoutMs = Number(process.env.SCAN_TIMEOUT_MS ?? 20000)

    console.log("[domain_scan] config", { domain, baseUrl, maxPages, timeoutMs })

    const baseHost = normalizeHostname(new URL(baseUrl).hostname)

    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    page.setDefaultTimeout(timeoutMs)

    const discovered = new Set<string>()
    const queued = new Set<string>()

    const startUrl = canonicalUrl(baseUrl)
    discovered.add(startUrl)
    queued.add(startUrl)

    const q: string[] = [startUrl]

    async function push(raw: string) {
      try {
        const candidate = new URL(raw)
        const candidateHost = normalizeHostname(candidate.hostname)

        if (candidateHost !== baseHost) return

        const normalized = canonicalUrl(candidate.toString())

        if (discovered.has(normalized) || queued.has(normalized)) return

        discovered.add(normalized)
        queued.add(normalized)
        q.push(normalized)
      } catch {
        // ignore invalid URL
      }
    }

    try {
      while (q.length && discovered.size < maxPages) {
        const current = q.shift()!
        console.log("[domain_scan] visiting", current)

        try {
          await page.goto(current, { waitUntil: "domcontentloaded" })
        } catch (e: any) {
          console.log("[domain_scan] goto failed", current, e?.message ?? String(e))
          continue
        }

        const links: string[] = await page.$$eval("a[href]", (as) =>
          as.map((a) => (a as HTMLAnchorElement).href).slice(0, 300),
        )

        console.log("[domain_scan] links found", { current, count: links.length })

        for (const l of links) {
          if (discovered.size >= maxPages) break
          await push(l)
        }
      }
    } finally {
      await browser.close()
    }

    const urls = Array.from(discovered).slice(0, maxPages)

    console.log("[domain_scan] discovered urls", urls.length)

    for (const u of urls) {
      const url = new URL(u)
      const path = url.pathname || "/"
      const pageType = classifyPath(path)

      await prisma.page.upsert({
        where: { competitorId_url: { competitorId, url: u } },
        update: { pageType, path },
        create: { competitorId, url: u, path, pageType },
      })
    }

    await prisma.competitor.update({
      where: { id: competitorId },
      data: { lastScanAt: new Date(), status: "active" },
    })

    console.log("[domain_scan] done", { competitorId, discovered: urls.length })

    return { ok: true, discovered: urls.length }
  })
}

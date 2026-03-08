import { createWorker, createQueue } from "../queue/queue"
import { PrismaClient } from "@prisma/client"
import { createHash } from "crypto"
import { chromium } from "playwright"

function sha256(text: string) {
  return createHash("sha256").update(text).digest("hex")
}

function normalizeText(t: string) {
  return t.replace(/\s+/g, " ").trim()
}

export function runPageCheckWorker() {
  const prisma = new PrismaClient()

  return createWorker("page_check", async (job) => {
    const { pageId } = job.data as { pageId: string }
    const rec = await prisma.page.findUnique({ where: { id: pageId } })
    if (!rec) return { ok: false, reason: "page not found" }

    const timeoutMs = Number(process.env.CHECK_TIMEOUT_MS ?? 20000)

    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    page.setDefaultTimeout(timeoutMs)

    let httpStatus: number | null = null
    let text = ""
    try {
      const resp = await page.goto(rec.url, { waitUntil: "domcontentloaded" })
      httpStatus = resp?.status() ?? null
      text = await page.evaluate(() => document.body?.innerText ?? "")
    } catch {
      // ignore
    } finally {
      await browser.close()
    }

    const norm = normalizeText(text)
    const hash = norm ? sha256(norm) : null

    const prev = await prisma.pageSnapshot.findFirst({
      where: { pageId: rec.id },
      orderBy: { capturedAt: "desc" },
    })

    const snap = await prisma.pageSnapshot.create({
      data: {
        pageId: rec.id,
        httpStatus: httpStatus ?? undefined,
        contentHash: hash ?? undefined,
        textExtracted: norm ? norm.slice(0, 20000) : undefined,
        metaJson: { length: norm.length },
      },
    })

    await prisma.page.update({
      where: { id: rec.id },
      data: { lastCheckedAt: new Date() },
    })

    if (prev?.contentHash && hash && prev.contentHash !== hash) {
      const q = createQueue("diff_detect")
      await q.add("diff_detect", { pageId: rec.id, fromSnapshotId: prev.id, toSnapshotId: snap.id }, { removeOnComplete: 500, removeOnFail: 500 })
      return { ok: true, changed: true }
    }

    return { ok: true, changed: false }
  })
}

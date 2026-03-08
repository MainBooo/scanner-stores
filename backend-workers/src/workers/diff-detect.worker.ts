import { createWorker } from "../queue/queue"
import { PrismaClient } from "@prisma/client"

type Severity = "low" | "med" | "high"
type ChangeType = "content" | "visual" | "price" | "structure" | "meta"

function severityForUrl(url: string): Severity {
  const u = url.toLowerCase()
  if (u.includes("pricing") || u.includes("price") || u.includes("plans")) return "high"
  if (u.includes("checkout") || u.includes("buy") || u.includes("subscribe")) return "high"
  if (u.includes("product") || u.includes("features") || u.includes("catalog") || u.includes("category")) return "med"
  if (u.includes("blog") || u.includes("news")) return "low"
  return "low"
}

export function runDiffDetectWorker() {
  const prisma = new PrismaClient()

  return createWorker("diff_detect", async (job) => {
    const { pageId, fromSnapshotId, toSnapshotId } = job.data as {
      pageId: string
      fromSnapshotId: string
      toSnapshotId: string
    }

    const page = await prisma.page.findUnique({ where: { id: pageId } })
    const from = await prisma.pageSnapshot.findUnique({ where: { id: fromSnapshotId } })
    const to = await prisma.pageSnapshot.findUnique({ where: { id: toSnapshotId } })
    if (!page || !from || !to) return { ok: false, reason: "missing records" }

    const sev = severityForUrl(page.url)
    const summary = sev === "high" ? "High-impact content change" : "Content change"

    await prisma.change.create({
      data: {
        pageId,
        fromSnapshotId,
        toSnapshotId,
        changeType: "content" as ChangeType,
        severity: sev as Severity,
        summary,
        diffJson: {
          fromLen: (from.textExtracted ?? "").length,
          toLen: (to.textExtracted ?? "").length,
        },
      },
    })

    await prisma.page.update({
      where: { id: pageId },
      data: { lastChangeAt: new Date(), lastSeverity: sev as any },
    })

    return { ok: true, severity: sev }
  })
}

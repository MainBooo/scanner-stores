import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { createQueue } from "../queue/queue"

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name)

  constructor(private prisma: PrismaService) {}

  async tick() {
    const now = new Date()

    try {
      const competitors = await this.prisma.competitor.findMany({
        where: {
          status: "active",
          lastScanAt: null,
        },
        take: 100,
        orderBy: { createdAt: "asc" },
      })

      this.logger.log(`tick: competitors waiting for scan = ${competitors.length}`)

      const domainScanQueue = createQueue("domain_scan")
      let domainScanEnqueued = 0

      for (const c of competitors) {
        await domainScanQueue.add(
          "domain_scan",
          {
            competitorId: c.id,
            domain: c.domain,
          },
          {
            jobId: `domain_scan__${c.id}`,
            removeOnComplete: 500,
            removeOnFail: 500,
          },
        )

        domainScanEnqueued++
      }

      const pages = await this.prisma.page.findMany({
        where: { monitoringEnabled: true },
        take: 300,
        orderBy: { lastCheckedAt: "asc" },
      })

      const due = pages.filter((p: any) => {
        if (!p.lastCheckedAt) return true
        const intervalMs = p.checkIntervalMin * 60_000
        return now.getTime() - p.lastCheckedAt.getTime() >= intervalMs
      })

      this.logger.log(`tick: pages due for check = ${due.length}`)

      const pageCheckQueue = createQueue("page_check")
      let pageCheckEnqueued = 0

      for (const p of due) {
        await pageCheckQueue.add(
          "page_check",
          { pageId: p.id },
          {
            jobId: `page_check__${p.id}`,
            removeOnComplete: 500,
            removeOnFail: 500,
          },
        )

        pageCheckEnqueued++
      }

      return {
        domainScanEnqueued,
        pageCheckEnqueued,
      }
    } catch (e: any) {
      this.logger.error(`tick failed: ${e?.message ?? String(e)}`, e?.stack)
      throw e
    }
  }
}

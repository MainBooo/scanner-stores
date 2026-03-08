import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { createQueue } from "../queue/queue"

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async bulkEnable(competitorId: string, urls: string[], intervalMin: number) {
    const pages = await this.prisma.page.findMany({ where: { competitorId, url: { in: urls } } })
    const ids = pages.map((p: any) => p.id)

    await this.prisma.page.updateMany({
      where: { id: { in: ids } },
      data: { monitoringEnabled: true, checkIntervalMin: intervalMin },
    })

    // enqueue immediate checks
    const q = createQueue("page_check")
    for (const p of pages) {
      await q.add("page_check", { pageId: p.id }, { removeOnComplete: 500, removeOnFail: 500 })
    }

    return { enabled: ids.length }
  }

  list(competitorId?: string) {
    return this.prisma.page.findMany({
      where: competitorId ? { competitorId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 500,
    })
  }
}

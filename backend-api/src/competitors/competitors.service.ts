import { ConflictException, Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { Prisma } from "@prisma/client"

@Injectable()
export class CompetitorsService {
  constructor(private prisma: PrismaService) {}

  async create(domain: string, displayName?: string) {
    const normalized = domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")

    try {
      return await this.prisma.competitor.create({
        data: {
          domain: normalized,
          displayName: displayName?.trim() || normalized,
          status: "active",
        },
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("Competitor already exists")
      }
      throw e
    }
  }

  async list() {
    return this.prisma.competitor.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  async suggestions(id: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
    })

    if (!competitor) return []

    const pages = await this.prisma.page.findMany({
      where: { competitorId: id },
      orderBy: { url: "asc" },
    })

    return pages
  }
}

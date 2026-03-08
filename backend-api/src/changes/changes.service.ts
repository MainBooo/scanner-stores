import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ChangesService {
  constructor(private prisma: PrismaService) {}

  list(severity?: string) {
    return this.prisma.change.findMany({
      where: severity ? { severity: severity as any } : undefined,
      orderBy: { detectedAt: "desc" },
      take: 500,
      include: { page: true },
    })
  }

  get(id: string) {
    return this.prisma.change.findUnique({
      where: { id },
      include: { page: true },
    })
  }
}

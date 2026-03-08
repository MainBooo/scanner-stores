"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_1 = require("../queue/queue");
let PagesService = class PagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bulkEnable(competitorId, urls, intervalMin) {
        const pages = await this.prisma.page.findMany({ where: { competitorId, url: { in: urls } } });
        const ids = pages.map((p) => p.id);
        await this.prisma.page.updateMany({
            where: { id: { in: ids } },
            data: { monitoringEnabled: true, checkIntervalMin: intervalMin },
        });
        const q = (0, queue_1.createQueue)("page_check");
        for (const p of pages) {
            await q.add("page_check", { pageId: p.id }, { removeOnComplete: 500, removeOnFail: 500 });
        }
        return { enabled: ids.length };
    }
    list(competitorId) {
        return this.prisma.page.findMany({
            where: competitorId ? { competitorId } : undefined,
            orderBy: { createdAt: "desc" },
            take: 500,
        });
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagesService);
//# sourceMappingURL=pages.service.js.map
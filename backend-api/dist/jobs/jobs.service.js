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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_1 = require("../queue/queue");
let JobsService = JobsService_1 = class JobsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(JobsService_1.name);
    }
    async tick() {
        const now = new Date();
        try {
            const competitors = await this.prisma.competitor.findMany({
                where: {
                    status: "active",
                    lastScanAt: null,
                },
                take: 100,
                orderBy: { createdAt: "asc" },
            });
            this.logger.log(`tick: competitors waiting for scan = ${competitors.length}`);
            const domainScanQueue = (0, queue_1.createQueue)("domain_scan");
            let domainScanEnqueued = 0;
            for (const c of competitors) {
                await domainScanQueue.add("domain_scan", {
                    competitorId: c.id,
                    domain: c.domain,
                }, {
                    jobId: `domain_scan__${c.id}`,
                    removeOnComplete: 500,
                    removeOnFail: 500,
                });
                domainScanEnqueued++;
            }
            const pages = await this.prisma.page.findMany({
                where: { monitoringEnabled: true },
                take: 300,
                orderBy: { lastCheckedAt: "asc" },
            });
            const due = pages.filter((p) => {
                if (!p.lastCheckedAt)
                    return true;
                const intervalMs = p.checkIntervalMin * 60_000;
                return now.getTime() - p.lastCheckedAt.getTime() >= intervalMs;
            });
            this.logger.log(`tick: pages due for check = ${due.length}`);
            const pageCheckQueue = (0, queue_1.createQueue)("page_check");
            let pageCheckEnqueued = 0;
            for (const p of due) {
                await pageCheckQueue.add("page_check", { pageId: p.id }, {
                    jobId: `page_check__${p.id}`,
                    removeOnComplete: 500,
                    removeOnFail: 500,
                });
                pageCheckEnqueued++;
            }
            return {
                domainScanEnqueued,
                pageCheckEnqueued,
            };
        }
        catch (e) {
            this.logger.error(`tick failed: ${e?.message ?? String(e)}`, e?.stack);
            throw e;
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map
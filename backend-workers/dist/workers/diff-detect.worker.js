"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDiffDetectWorker = runDiffDetectWorker;
const queue_1 = require("../queue/queue");
const client_1 = require("@prisma/client");
function severityForUrl(url) {
    const u = url.toLowerCase();
    if (u.includes("pricing") || u.includes("price") || u.includes("plans"))
        return "high";
    if (u.includes("checkout") || u.includes("buy") || u.includes("subscribe"))
        return "high";
    if (u.includes("product") || u.includes("features") || u.includes("catalog") || u.includes("category"))
        return "med";
    if (u.includes("blog") || u.includes("news"))
        return "low";
    return "low";
}
function runDiffDetectWorker() {
    const prisma = new client_1.PrismaClient();
    return (0, queue_1.createWorker)("diff_detect", async (job) => {
        const { pageId, fromSnapshotId, toSnapshotId } = job.data;
        const page = await prisma.page.findUnique({ where: { id: pageId } });
        const from = await prisma.pageSnapshot.findUnique({ where: { id: fromSnapshotId } });
        const to = await prisma.pageSnapshot.findUnique({ where: { id: toSnapshotId } });
        if (!page || !from || !to)
            return { ok: false, reason: "missing records" };
        const sev = severityForUrl(page.url);
        const summary = sev === "high" ? "High-impact content change" : "Content change";
        await prisma.change.create({
            data: {
                pageId,
                fromSnapshotId,
                toSnapshotId,
                changeType: "content",
                severity: sev,
                summary,
                diffJson: {
                    fromLen: (from.textExtracted ?? "").length,
                    toLen: (to.textExtracted ?? "").length,
                },
            },
        });
        await prisma.page.update({
            where: { id: pageId },
            data: { lastChangeAt: new Date(), lastSeverity: sev },
        });
        return { ok: true, severity: sev };
    });
}
//# sourceMappingURL=diff-detect.worker.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPageCheckWorker = runPageCheckWorker;
const queue_1 = require("../queue/queue");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const playwright_1 = require("playwright");
function sha256(text) {
    return (0, crypto_1.createHash)("sha256").update(text).digest("hex");
}
function normalizeText(t) {
    return t.replace(/\s+/g, " ").trim();
}
function runPageCheckWorker() {
    const prisma = new client_1.PrismaClient();
    return (0, queue_1.createWorker)("page_check", async (job) => {
        const { pageId } = job.data;
        const rec = await prisma.page.findUnique({ where: { id: pageId } });
        if (!rec)
            return { ok: false, reason: "page not found" };
        const timeoutMs = Number(process.env.CHECK_TIMEOUT_MS ?? 20000);
        const browser = await playwright_1.chromium.launch({ headless: true });
        const page = await browser.newPage();
        page.setDefaultTimeout(timeoutMs);
        let httpStatus = null;
        let text = "";
        try {
            const resp = await page.goto(rec.url, { waitUntil: "domcontentloaded" });
            httpStatus = resp?.status() ?? null;
            text = await page.evaluate(() => document.body?.innerText ?? "");
        }
        catch {
            // ignore
        }
        finally {
            await browser.close();
        }
        const norm = normalizeText(text);
        const hash = norm ? sha256(norm) : null;
        const prev = await prisma.pageSnapshot.findFirst({
            where: { pageId: rec.id },
            orderBy: { capturedAt: "desc" },
        });
        const snap = await prisma.pageSnapshot.create({
            data: {
                pageId: rec.id,
                httpStatus: httpStatus ?? undefined,
                contentHash: hash ?? undefined,
                textExtracted: norm ? norm.slice(0, 20000) : undefined,
                metaJson: { length: norm.length },
            },
        });
        await prisma.page.update({
            where: { id: rec.id },
            data: { lastCheckedAt: new Date() },
        });
        if (prev?.contentHash && hash && prev.contentHash !== hash) {
            const q = (0, queue_1.createQueue)("diff_detect");
            await q.add("diff_detect", { pageId: rec.id, fromSnapshotId: prev.id, toSnapshotId: snap.id }, { removeOnComplete: 500, removeOnFail: 500 });
            return { ok: true, changed: true };
        }
        return { ok: true, changed: false };
    });
}
//# sourceMappingURL=page-check.worker.js.map
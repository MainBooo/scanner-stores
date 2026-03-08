"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const queue_1 = require("./queue/queue");
const domain_scan_worker_1 = require("./workers/domain-scan.worker");
const page_check_worker_1 = require("./workers/page-check.worker");
const diff_detect_worker_1 = require("./workers/diff-detect.worker");
async function main() {
    // Ensure queues exist
    (0, queue_1.createQueue)("domain_scan");
    (0, queue_1.createQueue)("page_check");
    (0, queue_1.createQueue)("diff_detect");
    const domainScanWorker = (0, domain_scan_worker_1.runDomainScanWorker)();
    const pageCheckWorker = (0, page_check_worker_1.runPageCheckWorker)();
    const diffDetectWorker = (0, diff_detect_worker_1.runDiffDetectWorker)();
    for (const [name, worker] of [
        ["domain_scan", domainScanWorker],
        ["page_check", pageCheckWorker],
        ["diff_detect", diffDetectWorker],
    ]) {
        worker.on("ready", () => console.log(`[worker:${name}] ready`));
        worker.on("active", (job) => console.log(`[worker:${name}] active job=${job.id} name=${job.name}`));
        worker.on("completed", (job, result) => console.log(`[worker:${name}] completed job=${job.id}`, result));
        worker.on("failed", (job, err) => console.error(`[worker:${name}] failed job=${job?.id} name=${job?.name}:`, err?.message ?? err));
        worker.on("error", (err) => console.error(`[worker:${name}] error:`, err?.message ?? err));
    }
    console.log("Workers started: domain_scan, page_check, diff_detect");
    // keep process alive
    await new Promise(() => { });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=worker.js.map
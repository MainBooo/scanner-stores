import "dotenv/config"
import { createQueue } from "./queue/queue"
import { runDomainScanWorker } from "./workers/domain-scan.worker"
import { runPageCheckWorker } from "./workers/page-check.worker"
import { runDiffDetectWorker } from "./workers/diff-detect.worker"

async function main() {
  // Ensure queues exist
  createQueue("domain_scan")
  createQueue("page_check")
  createQueue("diff_detect")

  const domainScanWorker = runDomainScanWorker()
  const pageCheckWorker = runPageCheckWorker()
  const diffDetectWorker = runDiffDetectWorker()

  for (const [name, worker] of [
    ["domain_scan", domainScanWorker],
    ["page_check", pageCheckWorker],
    ["diff_detect", diffDetectWorker],
  ] as const) {
    worker.on("ready", () => console.log(`[worker:${name}] ready`))
    worker.on("active", (job) => console.log(`[worker:${name}] active job=${job.id} name=${job.name}`))
    worker.on("completed", (job, result) => console.log(`[worker:${name}] completed job=${job.id}`, result))
    worker.on("failed", (job, err) =>
      console.error(`[worker:${name}] failed job=${job?.id} name=${job?.name}:`, err?.message ?? err),
    )
    worker.on("error", (err) =>
      console.error(`[worker:${name}] error:`, err?.message ?? err),
    )
  }

  console.log("Workers started: domain_scan, page_check, diff_detect")

  // keep process alive
  await new Promise(() => {})
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

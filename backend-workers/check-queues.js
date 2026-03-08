const { Queue } = require('bullmq')

function parseRedisUrl(url) {
  const u = new URL(url)
  return {
    host: u.hostname || '127.0.0.1',
    port: u.port ? Number(u.port) : 6379,
    username: u.username || undefined,
    password: u.password || undefined,
  }
}

const connection = parseRedisUrl(process.env.REDIS_URL || 'redis://localhost:6379')

async function main() {
  for (const name of ['domain_scan', 'page_check', 'diff_detect']) {
    const q = new Queue(name, { connection })

    const counts = await q.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused'
    )

    console.log('QUEUE:', name)
    console.log('COUNTS:', counts)

    const jobs = await q.getJobs(
      ['waiting','active','completed','failed','delayed'],
      0,
      10,
      true
    )

    for (const job of jobs) {
      console.log({
        id: job.id,
        name: job.name,
        data: job.data,
        failedReason: job.failedReason
      })
    }

    console.log('---------------------------')

    await q.close()
  }
}

main().catch((e)=>{
  console.error(e)
  process.exit(1)
})

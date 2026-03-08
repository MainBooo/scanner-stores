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
  const q = new Queue('domain_scan', { connection })
  const jobs = await q.getJobs(['completed', 'failed', 'waiting', 'delayed'], 0, 100, true)

  for (const job of jobs) {
    console.log('removing', job.id, job.name)
    await job.remove().catch((e) => console.error('remove failed', job.id, e.message))
  }

  await q.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

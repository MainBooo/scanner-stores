
import { Queue } from "bullmq"

function parseRedisUrl(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname || "127.0.0.1",
    port: u.port ? Number(u.port) : 6379,
    username: u.username || undefined,
    password: u.password || undefined,
  }
}

export function redisUrl() {
  return process.env.REDIS_URL ?? "redis://localhost:6379"
}

export function createQueue(name: string) {
  const connection = parseRedisUrl(redisUrl())
  return new Queue(name, { connection })
}
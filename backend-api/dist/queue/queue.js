"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisUrl = redisUrl;
exports.createQueue = createQueue;
const bullmq_1 = require("bullmq");
function parseRedisUrl(url) {
    const u = new URL(url);
    return {
        host: u.hostname || "127.0.0.1",
        port: u.port ? Number(u.port) : 6379,
        username: u.username || undefined,
        password: u.password || undefined,
    };
}
function redisUrl() {
    return process.env.REDIS_URL ?? "redis://localhost:6379";
}
function createQueue(name) {
    const connection = parseRedisUrl(redisUrl());
    return new bullmq_1.Queue(name, { connection });
}
//# sourceMappingURL=queue.js.map
module.exports = {
  apps: [
    { name: "ci-api", cwd: "./backend-api", script: "dist/main.js" },
    { name: "ci-workers", cwd: "./backend-workers", script: "dist/worker.js" },
    { name: "ci-frontend", cwd: "./frontend", script: "node_modules/next/dist/bin/next", args: "start -p 3000" }
  ]
}

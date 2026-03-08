module.exports = {
  apps: [
    {
      name: "competitor-frontend",
      cwd: "/opt/competitor-intel/frontend",
      script: "npm",
      args: "run start -- -p 3002",
      env: {
        NODE_ENV: "production",
        PORT: "3002"
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      out_file: "/opt/competitor-intel/logs/frontend-out.log",
      error_file: "/opt/competitor-intel/logs/frontend-error.log",
      time: true
    },
    {
      name: "competitor-api",
      cwd: "/opt/competitor-intel/backend-api",
      script: "node",
      args: "dist/main.js",
      env: {
        NODE_ENV: "production",
        PORT: "4000"
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      out_file: "/opt/competitor-intel/logs/api-out.log",
      error_file: "/opt/competitor-intel/logs/api-error.log",
      time: true
    },
    {
      name: "competitor-workers",
      cwd: "/opt/competitor-intel/backend-workers",
      script: "node",
      args: "dist/worker.js",
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      out_file: "/opt/competitor-intel/logs/workers-out.log",
      error_file: "/opt/competitor-intel/logs/workers-error.log",
      time: true
    }
  ]
}

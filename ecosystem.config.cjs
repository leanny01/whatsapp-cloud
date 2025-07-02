// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "whatsapp_api",
      script: "./src/server.js",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_file: "./logs/api-combined.log",
      time: true,
      // PM2 hooks for cache management
      pre_restart: "node scripts/clear-cache.js --pm2-restart",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      name: "whatsapp_worker",
      script: "./src/worker.js",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/worker-error.log",
      out_file: "./logs/worker-out.log",
      log_file: "./logs/worker-combined.log",
      time: true,
      // PM2 hooks for cache management
      pre_restart: "node scripts/clear-cache.js --pm2-restart",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      name: "cache_maintenance",
      script: "./scripts/clear-cache.js",
      args: "maintenance",
      cron_restart: "0 2 * * *", // Daily at 2 AM
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "512M",
      error_file: "./logs/cache-maintenance-error.log",
      out_file: "./logs/cache-maintenance-out.log",
      log_file: "./logs/cache-maintenance-combined.log",
      time: true,
      autorestart: false, // Don't restart on completion
    },
    {
      name: "cache_cleanup",
      script: "./scripts/clear-cache.js",
      args: "old --hours=168", // Clear data older than 1 week
      cron_restart: "0 3 * * 0", // Weekly on Sundays at 3 AM
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "512M",
      error_file: "./logs/cache-cleanup-error.log",
      out_file: "./logs/cache-cleanup-out.log",
      log_file: "./logs/cache-cleanup-combined.log",
      time: true,
      autorestart: false, // Don't restart on completion
    },
  ],
  // PM2 deployment and cache management
  deploy: {
    production: {
      user: "node",
      host: "localhost",
      ref: "origin/main",
      repo: "https://github.com/leanny01/whatsapp-cloud.git",
      path: "/root/whatsapp-cloud",
      "post-deploy":
        "npm install && node scripts/clear-cache.js --deploy && pm2 reload ecosystem.config.cjs",
      "pre-deploy-local": "node scripts/clear-cache.js --pre-deploy",
    },
  },
};

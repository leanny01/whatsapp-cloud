#!/usr/bin/env node

import { CacheManager } from "../src/lib/cacheManager.js";
import "dotenv/config";

const command = process.argv[2];
const options = process.argv.slice(3);

async function main() {
  try {
    let results, oldResults, userId, success, stats, maintenanceResults, hours;

    switch (command) {
      case "all":
        console.log("🧹 Clearing all caches...");
        results = await CacheManager.clearAllCaches({
          clearUserStates: true,
          clearQueueJobs: options.includes("--queue"),
        });
        console.log("✅ Cache clearing completed:", results);
        break;

      case "old":
        hours =
          parseInt(
            options.find((opt) => opt.startsWith("--hours="))?.split("=")[1]
          ) || 24;
        console.log(`🧹 Clearing data older than ${hours} hours...`);
        oldResults = await CacheManager.clearOldData({
          olderThanHours: hours,
        });
        console.log("✅ Old data clearing completed:", oldResults);
        break;

      case "user":
        userId = options[0];
        if (!userId) {
          console.error(
            "❌ Please provide a user ID: node scripts/clear-cache.js user <userId>"
          );
          process.exit(1);
        }
        console.log(`🧹 Clearing cache for user: ${userId}`);
        success = await CacheManager.clearUserCache(userId);
        if (success) {
          console.log("✅ User cache cleared successfully");
        } else {
          console.log("❌ Failed to clear user cache");
        }
        break;

      case "stats":
        console.log("📊 Getting cache statistics...");
        stats = await CacheManager.getCacheStats();
        console.log("📈 Cache Statistics:", JSON.stringify(stats, null, 2));
        break;

      case "maintenance":
        console.log("🔧 Performing cache maintenance...");
        maintenanceResults = await CacheManager.performMaintenance();
        console.log("✅ Maintenance completed:", maintenanceResults);
        break;

      // PM2-specific commands
      case "--pm2-restart":
        console.log("🔄 PM2 restart detected - clearing critical caches...");
        results = await CacheManager.clearAllCaches({
          clearUserStates: false, // Keep user states during restart
          clearQueueJobs: true, // Clear queue to prevent stuck jobs
        });
        console.log("✅ PM2 restart cache clearing completed:", results);
        break;

      case "--deploy":
        console.log("🚀 Deployment detected - clearing all caches...");
        results = await CacheManager.clearAllCaches({
          clearUserStates: true,
          clearQueueJobs: true,
        });
        console.log("✅ Deployment cache clearing completed:", results);
        break;

      case "--pre-deploy":
        console.log("📦 Pre-deployment - backing up and clearing caches...");
        results = await CacheManager.clearAllCaches({
          clearUserStates: true,
          clearQueueJobs: true,
        });
        console.log("✅ Pre-deployment cache clearing completed:", results);
        break;

      case "pm2-status": {
        console.log("📊 Getting PM2 and cache status...");
        const pm2Stats = await CacheManager.getCacheStats();
        console.log("📈 PM2 Cache Status:", JSON.stringify(pm2Stats, null, 2));

        // Check if PM2 is running
        try {
          const { execSync } = await import("child_process");
          const pm2List = execSync("pm2 list --no-daemon", {
            encoding: "utf8",
          });
          console.log("🔄 PM2 Process Status:");
          console.log(pm2List);
        } catch (error) {
          console.log("⚠️ PM2 not available or no processes running");
        }
        break;
      }

      case "pm2-clean": {
        console.log(
          "🧹 PM2 clean restart - clearing all caches and restarting..."
        );
        results = await CacheManager.clearAllCaches({
          clearUserStates: true,
          clearQueueJobs: true,
        });
        console.log("✅ Cache cleared, restarting PM2 processes...");

        try {
          const { execSync } = await import("child_process");
          execSync("pm2 restart all", { stdio: "inherit" });
          console.log("✅ PM2 processes restarted successfully");
        } catch (error) {
          console.error("❌ Failed to restart PM2 processes:", error.message);
        }
        break;
      }

      default:
        console.log(`
🗑️ Cache Management CLI

Usage:
  node scripts/clear-cache.js <command> [options]

Commands:
  all [--queue]           Clear all caches (optionally include queue)
  old [--hours=24]        Clear data older than specified hours
  user <userId>           Clear cache for specific user
  stats                   Show cache statistics
  maintenance             Perform cache maintenance

PM2 Commands:
  pm2-status              Show PM2 and cache status
  pm2-clean               Clear caches and restart PM2 processes

PM2 Hooks (automatic):
  --pm2-restart           Called before PM2 restart
  --deploy                Called after deployment
  --pre-deploy            Called before deployment

Examples:
  node scripts/clear-cache.js all
  node scripts/clear-cache.js all --queue
  node scripts/clear-cache.js old --hours=48
  node scripts/clear-cache.js user 1234567890
  node scripts/clear-cache.js stats
  node scripts/clear-cache.js maintenance
  node scripts/clear-cache.js pm2-status
  node scripts/clear-cache.js pm2-clean
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();

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

Examples:
  node scripts/clear-cache.js all
  node scripts/clear-cache.js all --queue
  node scripts/clear-cache.js old --hours=48
  node scripts/clear-cache.js user 1234567890
  node scripts/clear-cache.js stats
  node scripts/clear-cache.js maintenance
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();

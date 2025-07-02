import {
  clearUserState,
  clearAllUserStates,
  clearOldUserStates,
  getMemoryStats,
} from "../leads/state.js";
import { messageQueue } from "../queue/queue.js";

/**
 * Comprehensive cache management utility
 */
export class CacheManager {
  /**
   * Clears all caches and memory
   * @param {Object} options - Clearing options
   * @returns {Promise<Object>} Results of clearing operations
   */
  static async clearAllCaches(options = {}) {
    const results = {
      userStates: 0,
      queueJobs: 0,
      memory: null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Clear all user states
      if (options.clearUserStates !== false) {
        results.userStates = await clearAllUserStates();
      }

      // Clear queue jobs (optional)
      if (options.clearQueueJobs) {
        await messageQueue.obliterate();
        results.queueJobs = "all";
      }

      // Get memory stats
      results.memory = await getMemoryStats();

      console.log("🧹 Cache clearing completed:", results);
      return results;
    } catch (error) {
      console.error("❌ Error clearing caches:", error);
      throw error;
    }
  }

  /**
   * Clears old/stale data
   * @param {Object} options - Clearing options
   * @returns {Promise<Object>} Results
   */
  static async clearOldData(options = {}) {
    const results = {
      oldUserStates: 0,
      timestamp: new Date().toISOString(),
    };

    try {
      // Clear user states older than specified hours
      const hours = options.olderThanHours || 24;
      results.oldUserStates = await clearOldUserStates(hours);

      console.log("🧹 Old data clearing completed:", results);
      return results;
    } catch (error) {
      console.error("❌ Error clearing old data:", error);
      throw error;
    }
  }

  /**
   * Clears cache for specific user
   * @param {string} userId - User ID to clear
   * @returns {Promise<boolean>} Success status
   */
  static async clearUserCache(userId) {
    try {
      await clearUserState(userId);
      console.log(`🧹 Cleared cache for user: ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error clearing cache for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Gets comprehensive memory and cache statistics
   * @returns {Promise<Object>} Memory and cache stats
   */
  static async getCacheStats() {
    try {
      const memoryStats = await getMemoryStats();

      // Get queue stats
      const queueStats = {
        waiting: await messageQueue.getWaiting(),
        active: await messageQueue.getActive(),
        completed: await messageQueue.getCompleted(),
        failed: await messageQueue.getFailed(),
      };

      return {
        memory: memoryStats,
        queue: queueStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error getting cache stats:", error);
      throw error;
    }
  }

  /**
   * Performs cache maintenance (clears old data, compacts memory)
   * @returns {Promise<Object>} Maintenance results
   */
  static async performMaintenance() {
    try {
      console.log("🔧 Starting cache maintenance...");

      const results = {
        oldDataCleared: await this.clearOldData({ olderThanHours: 24 }),
        stats: await this.getCacheStats(),
        timestamp: new Date().toISOString(),
      };

      console.log("✅ Cache maintenance completed");
      return results;
    } catch (error) {
      console.error("❌ Error during cache maintenance:", error);
      throw error;
    }
  }
}

# Cache Management

The WhatsApp Cloud API application includes comprehensive cache management tools for Redis-based state storage and memory optimization. This system ensures optimal performance and provides tools for debugging and maintenance.

## Overview

The cache management system handles:

- **User State Storage**: Redis-based user conversation states
- **Message Queue**: BullMQ message processing queue
- **Memory Optimization**: Automatic cleanup and monitoring
- **Debugging Tools**: Cache inspection and clearing utilities

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User States   │    │  Message Queue  │    │  Cache Manager  │
│   (Redis)       │    │   (BullMQ)      │    │   (CLI/API)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   State Utils   │
                    │  (Validation)   │
                    └─────────────────┘
```

## CLI Cache Management

The primary interface for cache management is the command-line tool located at `scripts/clear-cache.js`.

### Installation

The CLI tool is included with the project and requires no additional installation:

```bash
# Make sure the script is executable
chmod +x scripts/clear-cache.js
```

### Basic Commands

#### Clear All Caches

```bash
# Clear all user states and reset to default
node scripts/clear-cache.js all

# Clear all caches including message queue (use with caution)
node scripts/clear-cache.js all --queue
```

**Use Cases:**

- Emergency cache reset
- Debugging state issues
- System maintenance
- Memory optimization

#### Clear Old Data

```bash
# Clear data older than 24 hours (default)
node scripts/clear-cache.js old

# Clear data older than 48 hours
node scripts/clear-cache.js old --hours=48

# Clear data older than 1 week
node scripts/clear-cache.js old --hours=168
```

**Use Cases:**

- Regular maintenance
- Storage optimization
- Cleanup of abandoned sessions

#### Clear Specific User

```bash
# Clear cache for a specific user
node scripts/clear-cache.js user 27xxxxxxxxx
```

**Use Cases:**

- Debugging user-specific issues
- Resetting problematic user states
- Testing user flows

#### View Statistics

```bash
# Get comprehensive cache statistics
node scripts/clear-cache.js stats
```

**Output includes:**

- Total user states in Redis
- Memory usage statistics
- Queue job counts (waiting, active, completed, failed)
- Timestamp of last check

#### Perform Maintenance

```bash
# Run automated maintenance
node scripts/clear-cache.js maintenance
```

**Maintenance includes:**

- Clearing old user states (24+ hours)
- Generating statistics report
- Logging maintenance activities

### Advanced Usage

#### Batch Operations

```bash
# Clear multiple users (script example)
for user in 27xxxxxxxxx 27yyyyyyyyy 27zzzzzzzzz; do
  node scripts/clear-cache.js user $user
done
```

#### Scheduled Maintenance

Add to crontab for automated maintenance:

```bash
# Daily maintenance at 2 AM
0 2 * * * cd /path/to/whatsapp-cloud && node scripts/clear-cache.js maintenance

# Weekly full cleanup on Sundays at 3 AM
0 3 * * 0 cd /path/to/whatsapp-cloud && node scripts/clear-cache.js old --hours=168
```

## Programmatic Cache Management

For integration into your own scripts or applications, use the `CacheManager` class.

### Basic Usage

```javascript
import { CacheManager } from "./src/lib/cacheManager.js";

// Clear all caches
await CacheManager.clearAllCaches();

// Clear old data
await CacheManager.clearOldData({ olderThanHours: 24 });

// Clear specific user
await CacheManager.clearUserCache("27xxxxxxxxx");

// Get statistics
const stats = await CacheManager.getCacheStats();

// Perform maintenance
await CacheManager.performMaintenance();
```

### Advanced Usage

```javascript
import { CacheManager } from "./src/lib/cacheManager.js";

// Clear with specific options
await CacheManager.clearAllCaches({
  clearUserStates: true,
  clearQueueJobs: false, // Don't clear queue
});

// Clear old data with custom threshold
await CacheManager.clearOldData({
  olderThanHours: 48,
});

// Get detailed statistics
const stats = await CacheManager.getCacheStats();
console.log("Memory usage:", stats.memory);
console.log("Queue status:", stats.queue);
```

## Direct State Management

For low-level access to state management functions:

```javascript
import {
  clearAllUserStates,
  clearOldUserStates,
  getMemoryStats,
  clearUserState,
} from "./src/leads/state.js";

// Clear all user states
const deletedCount = await clearAllUserStates();
console.log(`Deleted ${deletedCount} user states`);

// Clear states older than 24 hours
const oldDeleted = await clearOldUserStates(24);
console.log(`Deleted ${oldDeleted} old states`);

// Get memory statistics
const stats = await getMemoryStats();
console.log("Total keys:", stats.totalKeys);
console.log("User state keys:", stats.userStateKeys);

// Clear specific user
await clearUserState("27xxxxxxxxx");
```

## Cache Management Features

### ✅ Complete Cache Clearing

- Clear all user states from Redis
- Clear BullMQ message queues
- Reset system to clean state
- Emergency recovery option

### ✅ Selective Clearing

- Clear specific user states
- Clear data older than specified time
- Clear only user states (preserve queue)
- Clear only queue (preserve user states)

### ✅ Memory Monitoring

- Real-time memory usage statistics
- Key count tracking
- Redis memory information
- Queue job statistics

### ✅ Maintenance Mode

- Automated cleanup of old data
- Scheduled maintenance support
- Comprehensive reporting
- Error handling and logging

### ✅ CLI Interface

- Easy command-line access
- Interactive help system
- Flexible parameter options
- Clear output formatting

### ✅ Error Handling

- Robust error handling
- Detailed error logging
- Graceful failure recovery
- Validation of operations

### ✅ Flexible Options

- Configurable time thresholds
- Selective clearing options
- Batch operation support
- Custom maintenance schedules

### ✅ Redis Integration

- Full Redis cache management
- TTL-based expiration
- Memory optimization
- Connection management

### ✅ Queue Management

- BullMQ queue clearing
- Job status monitoring
- Queue statistics
- Queue maintenance

### ✅ Statistics Reporting

- Detailed memory analytics
- Cache performance metrics
- User state statistics
- Queue performance data

## Best Practices

### Regular Maintenance

```bash
# Daily: Check statistics
node scripts/clear-cache.js stats

# Weekly: Clear old data
node scripts/clear-cache.js old --hours=168

# Monthly: Full maintenance
node scripts/clear-cache.js maintenance
```

### Emergency Procedures

```bash
# User experiencing issues
node scripts/clear-cache.js user <user_id>

# System-wide problems
node scripts/clear-cache.js all

# Complete reset (including queue)
node scripts/clear-cache.js all --queue
```

### Monitoring

```bash
# Check memory usage
node scripts/clear-cache.js stats

# Monitor queue health
node scripts/clear-cache.js stats | grep queue
```

### Performance Optimization

- Clear old data regularly (24-48 hours)
- Monitor memory usage trends
- Use selective clearing when possible
- Schedule maintenance during low-traffic periods

## Troubleshooting

### Common Issues

**High Memory Usage**

```bash
# Check current usage
node scripts/clear-cache.js stats

# Clear old data
node scripts/clear-cache.js old --hours=24

# If still high, clear all
node scripts/clear-cache.js all
```

**User State Issues**

```bash
# Clear specific user
node scripts/clear-cache.js user <user_id>

# Check user state
node scripts/clear-cache.js stats
```

**Queue Problems**

```bash
# Check queue status
node scripts/clear-cache.js stats

# Clear queue if needed
node scripts/clear-cache.js all --queue
```

### Error Messages

**"Redis connection failed"**

- Check Redis server status
- Verify `REDIS_URL` environment variable
- Ensure Redis is running and accessible

**"Permission denied"**

- Make script executable: `chmod +x scripts/clear-cache.js`
- Check file permissions
- Run with appropriate user privileges

**"No such file or directory"**

- Ensure you're in the project root directory
- Check that `scripts/clear-cache.js` exists
- Verify Node.js installation

## Integration Examples

### PM2 Integration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "whatsapp_api",
      script: "./src/server.js",
      env: { NODE_ENV: "production" },
    },
    {
      name: "whatsapp_worker",
      script: "./src/worker.js",
      env: { NODE_ENV: "production" },
    },
    {
      name: "cache_maintenance",
      script: "./scripts/clear-cache.js",
      args: "maintenance",
      cron_restart: "0 2 * * *", // Daily at 2 AM
      env: { NODE_ENV: "production" },
    },
  ],
};
```

### Docker Integration

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x scripts/clear-cache.js

# Add cache maintenance to crontab
RUN echo "0 2 * * * cd /app && node scripts/clear-cache.js maintenance" >> /etc/crontabs/root

CMD ["npm", "start"]
```

### CI/CD Integration

```yaml
# .github/workflows/maintenance.yml
name: Cache Maintenance

on:
  schedule:
    - cron: "0 2 * * 0" # Weekly on Sunday at 2 AM

jobs:
  maintenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm install
      - run: node scripts/clear-cache.js maintenance
        env:
          REDIS_URL: ${{ secrets.REDIS_URL }}
```

## API Reference

### CacheManager Class

#### `clearAllCaches(options)`

Clears all caches and memory.

**Parameters:**

- `options.clearUserStates` (boolean): Clear user states (default: true)
- `options.clearQueueJobs` (boolean): Clear queue jobs (default: false)

**Returns:** Promise<Object> with clearing results

#### `clearOldData(options)`

Clears old/stale data.

**Parameters:**

- `options.olderThanHours` (number): Age threshold in hours (default: 24)

**Returns:** Promise<Object> with clearing results

#### `clearUserCache(userId)`

Clears cache for specific user.

**Parameters:**

- `userId` (string): User ID to clear

**Returns:** Promise<boolean> success status

#### `getCacheStats()`

Gets comprehensive memory and cache statistics.

**Returns:** Promise<Object> with detailed statistics

#### `performMaintenance()`

Performs cache maintenance (clears old data, compacts memory).

**Returns:** Promise<Object> with maintenance results

### State Management Functions

#### `clearAllUserStates()`

Clears all user states from Redis.

**Returns:** Promise<number> number of keys deleted

#### `clearOldUserStates(hours)`

Clears user states older than specified hours.

**Parameters:**

- `hours` (number): Age threshold in hours

**Returns:** Promise<number> number of keys deleted

#### `getMemoryStats()`

Gets memory usage statistics for Redis.

**Returns:** Promise<Object> memory usage info

#### `clearUserState(phone)`

Clears state for specific user.

**Parameters:**

- `phone` (string): User phone number

**Returns:** Promise<void>

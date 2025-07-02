# Cache Management

The WhatsApp Cloud API application includes comprehensive cache management tools for Redis-based state storage and memory optimization. This system ensures optimal performance and provides tools for debugging and maintenance.

## Quick Reference

### Essential Commands

```bash
# View cache statistics
node scripts/clear-cache.js stats

# Clear all caches
node scripts/clear-cache.js all

# Clear old data (24+ hours)
node scripts/clear-cache.js old

# Clear specific user
node scripts/clear-cache.js user <phone_number>

# Perform maintenance
node scripts/clear-cache.js maintenance

# PM2 status and cache info
node scripts/clear-cache.js pm2-status

# View maintenance logs
pm2 logs cache_maintenance
tail -f ./logs/cache-maintenance-combined.log
```

### PM2 Quick Reference

```bash
# Start all processes
pm2 start ecosystem.config.cjs

# Restart with cache clearing
pm2 restart all

# Deploy to production
pm2 deploy production

# Monitor processes
pm2 status
pm2 monit

# View logs
pm2 logs
pm2 logs cache_maintenance --follow
```

### Scheduled Maintenance

- **Daily**: 2 AM - General maintenance
- **Weekly**: 3 AM Sundays - Deep cleanup (1+ week old data)

## Overview

The cache management system handles:

- **User State Storage**: Redis-based user conversation states
- **Message Queue**: BullMQ message processing queue
- **Memory Optimization**: Automatic cleanup and monitoring
- **Debugging Tools**: Cache inspection and clearing utilities
- **PM2 Integration**: Automatic cache management with PM2 process manager

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

### PM2 Integration Commands

```bash
# Show PM2 and cache status
node scripts/clear-cache.js pm2-status

# Clear caches and restart PM2 processes
node scripts/clear-cache.js pm2-clean
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

The cache management system is fully integrated with PM2 for production deployments.

#### PM2 Hooks (Automatic)

The following hooks are automatically triggered by PM2:

- **`--pm2-restart`**: Called before PM2 restart
  - Clears queue jobs to prevent stuck processes
  - Preserves user states for seamless restarts
- **`--deploy`**: Called after deployment
  - Clears all caches for fresh deployment
  - Ensures clean state after code updates
- **`--pre-deploy`**: Called before deployment
  - Backs up and clears caches
  - Prepares system for new deployment

#### PM2 Configuration

The `ecosystem.config.cjs` file includes:

```javascript
{
  name: "whatsapp_api",
  script: "./src/server.js",
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
  autorestart: false,
},
{
  name: "cache_cleanup",
  script: "./scripts/clear-cache.js",
  args: "old --hours=168", // Clear data older than 1 week
  cron_restart: "0 3 * * 0", // Weekly on Sundays at 3 AM
  autorestart: false,
}
```

#### Scheduled Maintenance

PM2 automatically runs cache maintenance on a schedule:

- **Daily Maintenance**: Runs at 2 AM every day
  - Performs general cache maintenance
  - Optimizes memory usage
  - Logs maintenance activities
- **Weekly Cleanup**: Runs at 3 AM every Sunday
  - Clears data older than 1 week
  - Deep cleanup of old user states
  - Removes stale queue jobs

#### Deployment Integration

PM2 deployment includes automatic cache management:

```javascript
deploy: {
  production: {
    // ... deployment config
    "post-deploy": "npm install && node scripts/clear-cache.js --deploy && pm2 reload ecosystem.config.cjs",
    "pre-deploy-local": "node scripts/clear-cache.js --pre-deploy",
  },
}
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

## Environment Variables

Configure cache management with environment variables:

```bash
# Redis configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_password

# Cache settings
CACHE_TTL=3600
USER_STATE_TTL=86400

# Team notification (optional)
TEAM_CONTACT_EMAIL=team@example.com
TEAM_CONTACT_PHONE=+1234567890
```

## Monitoring and Alerts

### Cache Statistics

Monitor these key metrics:

- **User States**: Number of active user states
- **Queue Jobs**: Pending message processing jobs
- **Memory Usage**: Redis memory consumption
- **Error Rates**: Cache operation failures

### PM2 Process Management

#### Starting Processes

```bash
# Start all processes (including scheduled maintenance)
pm2 start ecosystem.config.cjs

# Start specific processes
pm2 start ecosystem.config.cjs --only whatsapp_api
pm2 start ecosystem.config.cjs --only whatsapp_worker
pm2 start ecosystem.config.cjs --only cache_maintenance

# Start with specific environment
pm2 start ecosystem.config.cjs --env production
```

#### Restarting Processes

```bash
# Restart all processes (with automatic cache clearing)
pm2 restart all

# Restart specific processes
pm2 restart whatsapp_api
pm2 restart whatsapp_worker
pm2 restart cache_maintenance

# Restart with cache management
pm2 restart all --update-env
```

#### Stopping Processes

```bash
# Stop all processes
pm2 stop all

# Stop specific processes
pm2 stop whatsapp_api
pm2 stop cache_maintenance

# Delete processes (removes from PM2)
pm2 delete all
pm2 delete whatsapp_api
```

### PM2 Deployment

#### Initial Setup

```bash
# Setup deployment for first time
pm2 deploy production setup

# Verify deployment configuration
pm2 deploy production list
```

#### Deploying Updates

```bash
# Deploy to production (with cache clearing)
pm2 deploy production

# Deploy with specific branch
pm2 deploy production --ref origin/feature-branch

# Update existing deployment
pm2 deploy production update

# Rollback to previous version
pm2 deploy production revert 1
```

#### Deployment Status

```bash
# Check deployment status
pm2 deploy production status

# View deployment logs
pm2 deploy production logs

# List all deployments
pm2 deploy production list
```

### PM2 Monitoring

```bash
# Monitor PM2 processes
pm2 monit

# Check PM2 logs
pm2 logs

# View PM2 status
pm2 status

# View specific process logs
pm2 logs cache_maintenance
pm2 logs cache_cleanup
pm2 logs whatsapp_api
pm2 logs whatsapp_worker

# View logs with filtering
pm2 logs --lines 100
pm2 logs --timestamp
pm2 logs whatsapp_api --follow
```

### Log File Locations

Cache maintenance logs are stored in the `./logs/` directory:

**Daily Maintenance (2 AM):**

- `./logs/cache-maintenance-out.log` - Standard output
- `./logs/cache-maintenance-error.log` - Error messages
- `./logs/cache-maintenance-combined.log` - All logs combined

**Weekly Cleanup (3 AM Sundays):**

- `./logs/cache-cleanup-out.log` - Standard output
- `./logs/cache-cleanup-error.log` - Error messages
- `./logs/cache-cleanup-combined.log` - All logs combined

### Log Viewing Commands

```bash
# View all logs in the logs directory
ls -la ./logs/

# View cache maintenance logs in real-time
tail -f ./logs/cache-maintenance-combined.log
tail -f ./logs/cache-cleanup-combined.log

# View recent maintenance activity
grep "maintenance" ./logs/cache-maintenance-combined.log
grep "cleanup" ./logs/cache-cleanup-combined.log

# View all cache-related logs via PM2
pm2 logs | grep -E "(cache_maintenance|cache_cleanup)"

# View last 50 lines of maintenance logs
pm2 logs cache_maintenance --lines 50
pm2 logs cache_cleanup --lines 50

# Monitor maintenance in real-time
pm2 logs cache_maintenance --follow
pm2 logs cache_cleanup --follow

# Check maintenance schedule
pm2 describe cache_maintenance
pm2 describe cache_cleanup
```

## Support

For cache management issues:

1. Check cache statistics: `node scripts/clear-cache.js stats`
2. Review PM2 logs: `pm2 logs`
3. Clear problematic caches: `node scripts/clear-cache.js all`
4. Contact team with error details

## Related Documentation

- [Driver Flow Documentation](./driver-flow.md)
- [Quote Flow Documentation](./quote-flow.md)
- [PM2 Configuration](./ecosystem.config.cjs)

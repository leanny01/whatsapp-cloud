#!/bin/bash

# WhatsApp Cloud API Deployment Script
# This script updates the application and restarts services

echo "🚀 Starting deployment process..."

# 1. Pull latest changes from git
echo "📥 Pulling latest changes from git..."
git pull
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi
echo "✅ Git pull completed successfully"

# 2. Install/update dependencies
echo "📦 Installing/updating npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "✅ npm install completed successfully"

# 3. Clear cache (without PM2 restart to avoid hanging)
echo "🧹 Clearing cache..."
node scripts/clear-cache.js all
if [ $? -ne 0 ]; then
    echo "❌ Cache cleanup failed!"
    exit 1
fi
echo "✅ Cache cleanup completed successfully"

# 3.5. Restart PM2 processes separately
echo "🔄 Restarting PM2 processes..."
pm2 restart all
if [ $? -ne 0 ]; then
    echo "❌ PM2 restart failed!"
    exit 1
fi
echo "✅ PM2 processes restarted successfully"

# 4. Check PM2 status
echo "📊 Checking PM2 process status..."
pm2 status
if [ $? -ne 0 ]; then
    echo "❌ PM2 status check failed!"
    exit 1
fi

# 5. Show PM2 logs
echo "📋 Showing PM2 logs..."
pm2 logs --lines 20

echo "🎉 Deployment script completed!"
echo "💡 Use 'pm2 logs --follow' to monitor logs in real-time"
echo "💡 Use 'pm2 restart all' to restart all processes if needed" 
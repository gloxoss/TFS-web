#!/bin/bash

# TFS-web Deployment Script
# This script automates pulling, building, and restarting the PM2 process.

# 1. Pull latest changes
echo "📥 Pulling latest changes from main..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build the Next.js application
echo "🏗️ Building the project..."
npm run build

# 4. Restart/Reload the PM2 process
# We use 'pm2 reload' for zero-downtime if supported, 
# otherwise falls back to starting the app named 'tfs-web'
echo "🔄 Reloading PM2 process..."
pm2 reload tfs-web || pm2 start npm --name "tfs-web" -- start

echo "✨ Deployment successful!"

#!/bin/bash

# Kill any existing Vite processes
pkill -f vite

# Kill any processes using port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Kill any processes using port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Kill any processes using port 3002
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

# Change to the correct directory
cd /Users/m/Documents/unbd/ai-coach

# Start the development server
npm run dev 
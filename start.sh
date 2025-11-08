#!/bin/bash

# Sneaker Resell Game - Startup Script

echo "🔥 Starting Sneaker Resell Game with Real Sneaker Data 🔥"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting server on http://localhost:3000"
echo ""
echo "✅ Server is running!"
echo "🌐 Open your browser and go to: http://localhost:3000/index.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start


#!/bin/bash

# Sneaker Resell Game - Startup Script with Database Connection

echo "🔥 Starting Sneaker Resell Game with Multiplayer 🔥"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found!"
    echo ""
    echo "To enable multiplayer, set your DATABASE_URL:"
    echo "1. Go to your Render dashboard"
    echo "2. Navigate to your PostgreSQL database"
    echo "3. Copy the 'Internal Database URL'"
    echo "4. Run this command in terminal:"
    echo ""
    echo "   export DATABASE_URL='your-database-url-here'"
    echo ""
    echo "Then run this script again."
    echo ""
    echo "Starting server WITHOUT multiplayer for now..."
    echo ""
fi

echo "🚀 Starting server on http://localhost:3000"
echo ""

if [ -n "$DATABASE_URL" ]; then
    echo "✅ Multiplayer ENABLED - Database connected!"
else
    echo "⚠️  Multiplayer DISABLED - No database connection"
fi

echo ""
echo "🌐 Open your browser and go to: http://localhost:3000/index.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start


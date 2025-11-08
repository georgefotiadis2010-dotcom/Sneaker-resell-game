#!/bin/bash

# Sneaker Resell Game - Public Server Startup Script with LocalTunnel

echo "Starting Sneaker Resell Game with Public Access"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if localtunnel is installed
if ! command -v lt &> /dev/null; then
    echo "Installing localtunnel..."
    npm install -g localtunnel
    echo ""
fi

echo "Starting server on http://localhost:3000"
echo ""

# Start the server in the background
node server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

echo ""
echo "Creating public tunnel..."
echo ""
echo "----------------------------------------"
echo "Your game is now publicly accessible!"
echo "Share the URL below with others:"
echo "----------------------------------------"
echo ""

# Start localtunnel and capture output
lt --port 3000

# When localtunnel exits, kill the server
kill $SERVER_PID


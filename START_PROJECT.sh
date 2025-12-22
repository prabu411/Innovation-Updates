#!/bin/bash

echo "🚀 Starting Innovation Management System..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Start MongoDB
echo "📦 Step 1: Starting MongoDB..."
if pgrep mongod > /dev/null; then
    echo -e "${GREEN}✓ MongoDB already running${NC}"
else
    # Try different methods
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod 2>/dev/null && echo -e "${GREEN}✓ MongoDB started via systemctl${NC}" || \
        mongod --fork --logpath /tmp/mongod.log --dbpath ~/data/db 2>/dev/null && echo -e "${GREEN}✓ MongoDB started manually${NC}" || \
        echo -e "${RED}✗ Failed to start MongoDB. Please start manually:${NC}\n  sudo systemctl start mongod\n  OR\n  mongod --dbpath ~/data/db"
    else
        mongod --fork --logpath /tmp/mongod.log --dbpath ~/data/db 2>/dev/null && echo -e "${GREEN}✓ MongoDB started${NC}" || \
        echo -e "${RED}✗ Failed to start MongoDB${NC}"
    fi
fi

sleep 2

# Step 2: Seed demo data
echo ""
echo "🌱 Step 2: Creating demo users..."
cd backend
node seedDemo.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Demo data created${NC}"
else
    echo -e "${YELLOW}⚠ Demo data may already exist or MongoDB not ready${NC}"
fi

# Step 3: Start backend
echo ""
echo "⚙️  Step 3: Starting backend server..."
pkill -f "node server.js" 2>/dev/null
nohup node server.js > server.log 2>&1 &
sleep 3
if lsof -i :5003 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend running on http://localhost:5003${NC}"
else
    echo -e "${RED}✗ Backend failed to start. Check backend/server.log${NC}"
fi

# Step 4: Start frontend
echo ""
echo "🎨 Step 4: Starting frontend..."
cd ../frontend
pkill -f "react-scripts start" 2>/dev/null
nohup npm start > /dev/null 2>&1 &
echo -e "${YELLOW}⏳ Frontend starting... (will open in browser)${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Project Started!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5003"
echo ""
echo "🎭 Demo Accounts:"
echo "   Student:      ganeshprabu@gmail.com / 12345"
echo "   Coordinator:  studentinnovation@gmail.com / stu1234"
echo ""
echo "📋 To stop all services:"
echo "   pkill mongod && pkill -f 'node server.js' && pkill -f 'react-scripts'"
echo ""

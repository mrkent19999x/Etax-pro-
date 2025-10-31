#!/bin/bash

# Script tự động kill và restart emulators với Auth
# ⚠️ WARNING: Script này sẽ kill tất cả Firebase emulator processes
# Usage: bash scripts/kill-and-restart-emulators.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Restarting Firebase Emulators with Auth..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Kill existing emulators
echo "📋 Step 1: Stopping existing emulators..."

# Kill Firebase emulator processes
if pkill -f "firebase emulators:start" 2>/dev/null; then
    echo -e "${GREEN}✅ Stopped Firebase emulator processes${NC}"
else
    echo -e "${YELLOW}⚠️  No Firebase emulator processes found${NC}"
fi

# Kill processes on specific ports (backup method)
for port in 4000 5001 8080 9099; do
    PID=$(lsof -ti :$port 2>/dev/null || true)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null && echo -e "${GREEN}✅ Killed process on port $port${NC}" || true
    fi
done

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2
echo ""

# Step 2: Verify ports are free
echo "📋 Step 2: Verifying ports are free..."
ALL_FREE=true

for port in 4000 5001 8080 9099; do
    if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
        echo -e "${RED}❌ Port $port is still in use${NC}"
        ALL_FREE=false
    else
        echo -e "${GREEN}✅ Port $port is free${NC}"
    fi
done

if [ "$ALL_FREE" = false ]; then
    echo ""
    echo -e "${RED}❌ Some ports are still in use. Please kill them manually:${NC}"
    echo "   lsof -i :4000 -i :5001 -i :8080 -i :9099"
    echo "   kill -9 <PID>"
    exit 1
fi

echo ""

# Step 3: Start emulators
echo "📋 Step 3: Starting emulators with Auth..."
echo ""
echo -e "${YELLOW}⚠️  Starting emulators in background...${NC}"
echo "   Check status at: http://localhost:4000"
echo ""

# Start emulators in background
cd "$(dirname "$0")/.."
npm run emulators > /tmp/firebase-emulators.log 2>&1 &

EMULATOR_PID=$!

echo -e "${GREEN}✅ Started emulators (PID: $EMULATOR_PID)${NC}"
echo ""
echo "⏳ Waiting for emulators to start (15 seconds)..."
sleep 15

# Step 4: Verify emulators are running
echo ""
echo "📋 Step 4: Verifying emulators are running..."

check_port() {
    local port=$1
    local name=$2
    if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
        echo -e "${GREEN}✅ $name (port $port) is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name (port $port) is NOT running${NC}"
        return 1
    fi
}

ALL_RUNNING=true
check_port 4000 "Emulator UI" || ALL_RUNNING=false
check_port 8080 "Firestore" || ALL_RUNNING=false
check_port 5001 "Functions" || ALL_RUNNING=false
check_port 9099 "Auth Emulator" || ALL_RUNNING=false

echo ""

if [ "$ALL_RUNNING" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🎉 All emulators are running!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🚀 Ready to test! Run:"
    echo "   bash scripts/setup-and-test.sh"
    echo ""
    echo "📊 View emulator logs:"
    echo "   tail -f /tmp/firebase-emulators.log"
    echo ""
    echo "🌐 Open Emulator UI:"
    echo "   http://localhost:4000"
    echo ""
else
    echo -e "${RED}❌ Some emulators failed to start${NC}"
    echo ""
    echo "📋 Check logs:"
    echo "   tail -f /tmp/firebase-emulators.log"
    echo ""
    exit 1
fi


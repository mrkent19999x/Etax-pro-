#!/bin/bash

# Script check và hướng dẫn restart emulators với Auth
# Usage: bash scripts/check-and-restart-emulators.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Checking Firebase Emulators Status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check ports
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

check_port 4000 "Emulator UI"
check_port 8080 "Firestore"
check_port 5001 "Functions"
check_port 9099 "Auth Emulator"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Auth is missing
if ! lsof -i :9099 2>/dev/null | grep -q LISTEN; then
    echo ""
    echo -e "${YELLOW}⚠️  Auth Emulator is NOT running!${NC}"
    echo ""
    echo "📋 To restart emulators with Auth:"
    echo ""
    echo -e "${BLUE}Option 1: Kill and restart (tự động)${NC}"
    echo "   bash scripts/kill-and-restart-emulators.sh"
    echo ""
    echo -e "${BLUE}Option 2: Manual restart${NC}"
    echo "   1. Find terminal running 'npm run emulators'"
    echo "   2. Press Ctrl+C to stop"
    echo "   3. Run: npm run emulators"
    echo ""
    echo -e "${BLUE}Option 3: Kill processes manually${NC}"
    echo "   # Kill all emulator processes"
    echo "   pkill -f 'firebase emulators:start'"
    echo "   # Then restart"
    echo "   npm run emulators"
    echo ""
else
    echo ""
    echo -e "${GREEN}✅ All emulators are running, including Auth!${NC}"
    echo ""
    echo "🚀 Ready to test! Run:"
    echo "   bash scripts/setup-and-test.sh"
    echo ""
fi


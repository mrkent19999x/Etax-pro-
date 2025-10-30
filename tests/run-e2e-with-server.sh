#!/bin/bash

# Script tự động start server và chạy E2E tests
# Usage: ./tests/run-e2e-with-server.sh

set -e  # Exit on error

echo "🚀 Starting E2E Tests with Auto Server Startup"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if port 3001 is already in use
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Trying to use existing server...${NC}"
    SERVER_PID=$(lsof -ti:3001)
    echo -e "${GREEN}✅ Using existing server (PID: $SERVER_PID)${NC}"
    WAIT_FOR_SERVER=false
else
    echo -e "${GREEN}📦 Starting Next.js dev server on port 3001...${NC}"
    WAIT_FOR_SERVER=true
    
    # Start server in background
    PORT=3001 npm run dev > /tmp/etax-dev-server.log 2>&1 &
    SERVER_PID=$!
    
    echo -e "${GREEN}✅ Server started (PID: $SERVER_PID)${NC}"
    
    # Wait for server to be ready
    echo -e "${YELLOW}⏳ Waiting for server to be ready...${NC}"
    MAX_WAIT=60
    COUNTER=0
    
    while [ $COUNTER -lt $MAX_WAIT ]; do
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Server is ready!${NC}"
            break
        fi
        sleep 1
        COUNTER=$((COUNTER + 1))
        echo -n "."
    done
    
    if [ $COUNTER -eq $MAX_WAIT ]; then
        echo -e "\n${RED}❌ Server failed to start within ${MAX_WAIT} seconds${NC}"
        echo "Server logs:"
        cat /tmp/etax-dev-server.log
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
fi

# Function to cleanup
cleanup() {
    if [ "$WAIT_FOR_SERVER" = true ]; then
        echo -e "\n${YELLOW}🛑 Stopping dev server...${NC}"
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Server stopped${NC}"
    fi
}

# Trap to cleanup on exit
trap cleanup EXIT INT TERM

# Run tests
echo -e "\n${GREEN}🧪 Running E2E tests...${NC}"
echo "================================================"

if npm run e2e; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Check the output above.${NC}"
    exit 1
fi




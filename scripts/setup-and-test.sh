#!/bin/bash

# Script tự động setup và test Firestore Rules với Auth Emulator
# Usage: bash scripts/setup-and-test.sh

set -e

echo "🚀 Setup và Test Firestore Rules với Auth Emulator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if emulators are running
echo "📋 Step 1: Checking Firebase Emulators..."
echo ""

if lsof -i :9099 | grep -q LISTEN; then
    echo -e "${GREEN}✅ Auth Emulator is running${NC}"
else
    echo -e "${RED}❌ Auth Emulator is NOT running${NC}"
    echo -e "${YELLOW}⚠️  Please start emulators first:${NC}"
    echo "   npm run emulators"
    echo ""
    exit 1
fi

if lsof -i :8080 | grep -q LISTEN; then
    echo -e "${GREEN}✅ Firestore Emulator is running${NC}"
else
    echo -e "${RED}❌ Firestore Emulator is NOT running${NC}"
    echo -e "${YELLOW}⚠️  Please start emulators first:${NC}"
    echo "   npm run emulators"
    echo ""
    exit 1
fi

if lsof -i :5001 | grep -q LISTEN; then
    echo -e "${GREEN}✅ Functions Emulator is running${NC}"
else
    echo -e "${YELLOW}⚠️  Functions Emulator is NOT running (optional)${NC}"
fi

echo ""

# Step 2: Create test data
echo "📋 Step 2: Creating test data..."
echo ""

node scripts/create-test-data.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test data created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create test data${NC}"
    exit 1
fi

echo ""

# Step 3: Test rules with authentication
echo "📋 Step 3: Testing Firestore Rules with Authentication..."
echo ""

node scripts/test-rules-with-auth.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All rules tests passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Setup and test completed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""


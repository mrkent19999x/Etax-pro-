#!/bin/bash

# eTax Mobile PWA - E2E Test Runner
# Simple script to help automate test execution

echo "🧪 eTax Mobile PWA - E2E Test Runner"
echo "===================================="
echo ""

# Check if server is running
check_server() {
    echo "📡 Checking if server is running..."
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Server is running on http://localhost:3000"
        return 0
    else
        echo "❌ Server is NOT running!"
        echo ""
        echo "Please run: npm run dev"
        echo "Then run this script again."
        exit 1
    fi
}

# Open browser with test URL
open_test_page() {
    echo ""
    echo "🌐 Opening test page..."
    
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000/login"
    elif command -v open &> /dev/null; then
        open "http://localhost:3000/login"
    else
        echo "⚠️  Please manually open: http://localhost:3000/login"
    fi
}

# Display test checklist
show_checklist() {
    echo ""
    echo "📋 Test Checklist:"
    echo "=================="
    echo ""
    echo "Phase 1: Authentication Flow (4 tests)"
    echo "  □ Login Success"
    echo "  □ Login Validation"
    echo "  □ Auto-redirect When Logged In"
    echo "  □ Protected Route Access"
    echo ""
    echo "Phase 2: Home Page Navigation (10 tests)"
    echo "  □ Sidebar Open/Close"
    echo "  □ Sidebar Navigation - Home"
    echo "  □ Sidebar Navigation - Services"
    echo "  □ Home Page Carousel"
    echo "  □ Service Grid Navigation"
    echo "  ... (see tests/e2e-test-checklist.md for full list)"
    echo ""
    echo "Phase 3-7: See tests/e2e-test-checklist.md"
    echo ""
    echo "Total: 31 test cases"
    echo ""
}

# Instructions
show_instructions() {
    echo "📝 Test Instructions:"
    echo "====================="
    echo ""
    echo "1. Review: tests/e2e-test-checklist.md"
    echo "2. Open Chrome DevTools"
    echo "3. Switch to Mobile view (375x667)"
    echo "4. Go to Application tab → Service Workers"
    echo "5. Follow each test case in the checklist"
    echo "6. Mark ✅ or ❌ for each test"
    echo "7. Fill in: tests/test-summary.md"
    echo ""
}

# Main execution
main() {
    check_server
    show_checklist
    open_test_page
    show_instructions
    
    echo ""
    echo "✨ Ready to test!"
    echo "📖 Open tests/e2e-test-checklist.md to begin"
    echo ""
}

# Run main function
main



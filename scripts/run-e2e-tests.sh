#!/bin/bash

# Event Sponsorship Platform - E2E Test Runner
# This script helps run the comprehensive Cypress E2E tests

echo "🚀 Event Sponsorship Platform - E2E Test Runner"
echo "================================================"

# Check if Cypress is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if the application is running
echo "🔍 Checking if the application is running on http://localhost:3000..."
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running!"
else
    echo "⚠️  Application is not running on http://localhost:3000"
    echo ""
    echo "Please start your Next.js application first:"
    echo "  npm run dev"
    echo "  # or"
    echo "  yarn dev"
    echo ""
    echo "Then wait for the message 'Ready - started server on 0.0.0.0:3000'"
    echo ""
    read -p "Press Enter when your application is running, or Ctrl+C to exit..."
    
    # Check again after user confirmation
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is now running!"
    else
        echo "❌ Application still not accessible. Please check your setup."
        exit 1
    fi
fi

# Run different test suites
echo ""
echo "Available test options:"
echo "1. Run all E2E tests"
echo "2. Run specific test file"
echo "3. Open Cypress Test Runner (interactive)"
echo "4. Run tests in headless mode"

read -p "Select an option (1-4): " choice

case $choice in
    1)
        echo "🏃‍♂️ Running all E2E tests..."
        npx cypress run
        ;;
    2)
        echo "🏃‍♂️ Running event sponsorship flow tests..."
        npx cypress run --spec "cypress/e2e/event-sponsorship-flow.cy.js"
        ;;
    3)
        echo "🖥️  Opening Cypress Test Runner..."
        npx cypress open
        ;;
    4)
        echo "🏃‍♂️ Running tests in headless mode..."
        npx cypress run --headless
        ;;
    *)
        echo "❌ Invalid option. Please select 1-4."
        exit 1
        ;;
esac

echo ""
echo "📋 Test Results Summary:"
echo "========================"
echo "✅ Tests completed successfully if no errors appeared above"
echo "📄 Detailed reports are available in cypress/reports (if configured)"
echo "📸 Screenshots of failures are saved in cypress/screenshots"
echo "🎥 Videos of test runs are saved in cypress/videos"
echo ""
echo "💡 Tips:"
echo "- Make sure your Firebase configuration is set up correctly"
echo "- Ensure test data doesn't conflict with existing data"
echo "- Check network connectivity for external API calls"
echo "- Review cypress.config.js for environment-specific settings"
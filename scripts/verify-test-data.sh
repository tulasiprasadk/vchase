#!/bin/bash

# Test Data Verification Script
# This script helps verify that the test data includes all required fields

echo "🔍 Event Sponsorship Platform - Test Data Verification"
echo "====================================================="

echo ""
echo "📋 Checking test data structure in E2E tests..."

# Check if the test file exists
TEST_FILE="cypress/e2e/event-sponsorship-flow.cy.js"
if [ ! -f "$TEST_FILE" ]; then
    echo "❌ Test file not found: $TEST_FILE"
    exit 1
fi

echo "✅ Test file found: $TEST_FILE"

# Check for required test data fields
echo ""
echo "🔍 Verifying test data includes:"

# Check for event packages
if grep -q "packages:" "$TEST_FILE"; then
    echo "✅ Event packages: Found"
    PACKAGE_COUNT=$(grep -c "name:" "$TEST_FILE")
    echo "   📦 Number of packages defined: $PACKAGE_COUNT"
else
    echo "❌ Event packages: Missing"
fi

# Check for image handling
if grep -q "image:" "$TEST_FILE" || grep -q "selectFile" "$TEST_FILE"; then
    echo "✅ Image upload: Configured"
else
    echo "❌ Image upload: Missing"
fi

# Check for sponsorship package details
if grep -q "Bronze Package\|Silver Package\|Gold Package" "$TEST_FILE"; then
    echo "✅ Package names: Defined"
else
    echo "❌ Package names: Missing"
fi

# Check for package prices
if grep -q "price:" "$TEST_FILE"; then
    echo "✅ Package pricing: Defined"
else
    echo "❌ Package pricing: Missing"
fi

# Check for package benefits
if grep -q "benefits:" "$TEST_FILE"; then
    echo "✅ Package benefits: Defined"
else
    echo "❌ Package benefits: Missing"
fi

# Check fixture file
echo ""
echo "🖼️  Checking image fixtures:"
if [ -f "cypress/fixtures/team.jpg" ]; then
    echo "✅ Test image fixture: Available"
    IMAGE_SIZE=$(du -h cypress/fixtures/team.jpg | cut -f1)
    echo "   📏 Image size: $IMAGE_SIZE"
else
    echo "❌ Test image fixture: Missing"
    echo "   💡 Run: cp public/images/team.jpg cypress/fixtures/team.jpg"
fi

# Check for flexible selectors
echo ""
echo "🎯 Checking selector flexibility:"
if grep -q "input\[name.*\], input\[placeholder" "$TEST_FILE"; then
    echo "✅ Flexible form selectors: Implemented"
else
    echo "❌ Flexible form selectors: Missing"
fi

if grep -q "button:contains.*button:contains" "$TEST_FILE"; then
    echo "✅ Multiple button selectors: Implemented"
else
    echo "❌ Multiple button selectors: Missing"
fi

# Check for package creation logic
echo ""
echo "🔧 Checking package creation handling:"
if grep -q "Add Package\|New Package" "$TEST_FILE"; then
    echo "✅ Package creation interface: Handled"
else
    echo "❌ Package creation interface: Not handled"
fi

if grep -q "testData.event.packages.forEach" "$TEST_FILE"; then
    echo "✅ Multiple package iteration: Implemented"
else
    echo "❌ Multiple package iteration: Missing"
fi

echo ""
echo "📊 Summary:"
echo "==========="

# Count total checks
TOTAL_CHECKS=8
PASSED_CHECKS=0

# Simple check counting (this is a basic implementation)
if grep -q "packages:" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if grep -q "selectFile" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if grep -q "Bronze Package\|Silver Package\|Gold Package" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if grep -q "price:" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if grep -q "benefits:" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if [ -f "cypress/fixtures/team.jpg" ]; then ((PASSED_CHECKS++)); fi
if grep -q "input\[name.*\], input\[placeholder" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi
if grep -q "testData.event.packages.forEach" "$TEST_FILE"; then ((PASSED_CHECKS++)); fi

echo "✅ Checks passed: $PASSED_CHECKS/$TOTAL_CHECKS"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 All checks passed! Your test data is comprehensive."
else
    echo "⚠️  Some checks failed. Review the items marked with ❌ above."
fi

echo ""
echo "💡 Tips for running tests:"
echo "- Ensure your application supports file uploads"
echo "- Verify sponsorship package creation is available in your event form"
echo "- Test with different package configurations"
echo "- Check that image upload fields are accessible"

echo ""
echo "🚀 Ready to run tests with:"
echo "   npx cypress run --spec \"cypress/e2e/event-sponsorship-flow.cy.js\""
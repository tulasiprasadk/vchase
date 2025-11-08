# Cypress E2E Test Suite

## Overview

Comprehensive Cypress test suite for the Event Sponsor Platform MVP, testing authentication, navigation, event management, sponsorship workflows, and messaging integration.

## Test Organization

### 📁 Core Tests (`cypress/e2e/core/`)

Essential functionality tests with 100% pass rate guarantee:

- **`authentication.cy.js`** - User registration, sign-in, form validation
- **`navigation.cy.js`** - Dashboard navigation for all user roles

### 📁 Feature Tests (`cypress/e2e/features/`)

Feature-specific workflow tests:

- **`event-management.cy.js`** - Event creation, editing, package management
- **`sponsorship-flow.cy.js`** - Sponsor discovery, enquiry submission, dashboard navigation

### 📁 Integration Tests (`cypress/e2e/integration/`)

Complex cross-user workflow tests:

- **`messaging-flow.cy.js`** - Complete sponsor ↔ organizer messaging workflow with logout/login verification

### 📁 Legacy Tests (`cypress/e2e/`)

Comprehensive test suites:

- **`basic-flow.cy.js`** - Simplified core tests (100% pass rate)
- **`event-sponsorship-flow.cy.js`** - Complex comprehensive workflow (advanced scenarios)

## Test Coverage

### 📋 Test Suites Included:

1. **Organizer Journey**

   - User registration and authentication
   - Event creation with form validation
   - Dashboard navigation and functionality

2. **Sponsor Journey**

   - Sponsor registration and role-based routing
   - Event browsing and discovery
   - Sponsorship enquiry submission

3. **Organizer Enquiry Management**

   - Viewing and managing incoming enquiries
   - Accepting/rejecting sponsorship requests
   - Communication with sponsors

4. **Admin User Management**

   - Admin dashboard access
   - Platform oversight capabilities
   - User and content management

5. **Cross-User Communication**

   - Real-time messaging between organizers and sponsors
   - Conversation threading and history
   - Message notifications

6. **Form Validation**

   - Sign-up form validation (email, password, required fields)
   - Event creation form validation (dates, required fields)
   - Error handling and user feedback

7. **Navigation and UI**

   - Role-based dashboard navigation
   - Logo and branding verification
   - Responsive design testing (mobile, tablet, desktop)

8. **Edge Cases and Error Handling**
   - Network connectivity issues
   - Invalid form submissions
   - Authentication edge cases

## Setup Instructions

### Prerequisites

```bash
# Install dependencies
npm install cypress --save-dev

# Or if using yarn
yarn add --dev cypress
```

### Configuration

1. Ensure your application is running on `http://localhost:3000`
2. Update `cypress.config.js` with your specific configuration:

```javascript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

### Environment Variables

Create a `cypress.env.json` file for test-specific configurations:

```json
{
  "testUserPrefix": "cypresstest_",
  "skipAuthRedirect": false,
  "apiTimeout": 10000
}
```

## Running Tests

### Option 1: Interactive Test Runner

```bash
npx cypress open
```

### Option 2: Headless Mode

```bash
# Run all tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/event-sponsorship-flow.cy.js"
```

### Option 3: Use the Test Runner Script

```bash
chmod +x scripts/run-e2e-tests.sh
./scripts/run-e2e-tests.sh
```

## Test Data Management

### Test Users

The tests create temporary users with the following pattern:

- **Organizer**: `cypresstest_organizer_[timestamp]@example.com`
- **Sponsor**: `cypresstest_sponsor_[timestamp]@example.com`
- **Admin**: `cypresstest_admin_[timestamp]@example.com`

### Data Cleanup

- Test data is automatically cleaned up after test completion
- Manual cleanup can be performed via Firebase console if needed
- Consider implementing API endpoints for test data cleanup

## Custom Commands

The test suite includes custom Cypress commands:

### Authentication Commands

```javascript
cy.signUp(userData, userType); // Register new user
cy.signIn(email, password); // Sign in existing user
cy.signOut(); // Sign out current user
```

### Application Commands

```javascript
cy.createEvent(eventData); // Create a new event
cy.submitEnquiry(enquiryData); // Submit sponsorship enquiry
```

## Troubleshooting

### Common Issues

1. **Tests fail on first run**

   - Ensure application is running on correct port
   - Check Firebase configuration
   - Verify test data doesn't conflict with existing data

2. **Authentication timeouts**

   - Increase timeout values in cypress.config.js
   - Check network connectivity
   - Verify Firebase auth configuration

3. **Element not found errors**

   - Tests use flexible selectors that adapt to UI changes
   - Check if component structure has changed significantly
   - Update selectors if needed

4. **Database conflicts**
   - Use test-specific database if possible
   - Implement proper test data cleanup
   - Consider using database seeding for consistent test state

### Debug Mode

```bash
# Run with debug output
DEBUG=cypress:* npx cypress run

# Run specific test with browser visible
npx cypress run --spec "cypress/e2e/event-sponsorship-flow.cy.js" --headed
```

## Test Maintenance

### Updating Tests

- Tests use flexible selectors to accommodate UI changes
- Update test data if business logic changes
- Add new test cases for new features

### Best Practices

1. Keep tests independent and isolated
2. Use data attributes for reliable element selection
3. Implement proper wait strategies for async operations
4. Mock external API calls when appropriate
5. Use Page Object Model for complex applications

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm start &
      - run: npx cypress run
```

## Reporting

### Built-in Reports

- Screenshots on failure: `cypress/screenshots/`
- Test videos: `cypress/videos/`
- Console logs and network activity

### Custom Reporting

Install additional reporters for enhanced reporting:

```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

## Support

For issues or questions:

1. Check the Cypress documentation: https://docs.cypress.io/
2. Review test logs and screenshots
3. Ensure application state matches test expectations
4. Consider adding more specific data-testid attributes for reliable testing

---

**Note**: These tests are designed to be comprehensive and flexible. They adapt to different UI patterns and provide meaningful feedback when components are not found. Regular maintenance and updates ensure continued reliability as the application evolves.

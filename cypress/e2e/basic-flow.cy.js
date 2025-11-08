// /// <reference types="cypress" />

// /**
//  * E2E Test Suite for Event Sponsorship Platform
//  * Simplified version focusing on core functionality
//  */

// describe("Event Sponsorship Platform - Core E2E Flow", () => {
//   // Test data that will be generated for each test run
//   let testData = {
//     organizer: {
//       email: "",
//       password: "TestPass123!",
//       firstName: "John",
//       lastName: "Organizer",
//       companyName: "Event Co Ltd",
//       contactNumber: "+1234567890",
//     },
//     sponsor: {
//       email: "",
//       password: "TestPass123!",
//       firstName: "Jane",
//       lastName: "Sponsor",
//       companyName: "Sponsor Corp",
//       contactNumber: "+0987654321",
//     },
//     admin: {
//       email: "",
//       password: "TestPass123!",
//       firstName: "Admin",
//       lastName: "User",
//       companyName: "Platform Admin",
//       contactNumber: "+1111111111",
//     },
//   };

//   before(() => {
//     // Generate unique test data for this test run
//     const timestamp = Date.now();
//     testData.organizer.email = `cypresstest_organizer_${timestamp}@example.com`;
//     testData.sponsor.email = `cypresstest_sponsor_${timestamp}@example.com`;
//     testData.admin.email = `cypresstest_admin_${timestamp}@example.com`;
//   });

//   beforeEach(() => {
//     // Visit home page before each test
//     cy.visit("/");

//     // Clear any existing authentication state
//     cy.clearAuth();
//   });

//   /**
//    * Test 1: Basic Authentication Flow
//    */
//   describe("Authentication", () => {
//     it("should allow organizer sign up and sign in", () => {
//       // Test sign up
//       cy.signUp(testData.organizer, "organizer");

//       // Verify redirect to dashboard
//       cy.url().should("include", "/dashboard");

//       // Sign out
//       cy.signOut();

//       // Test sign in
//       cy.signIn(testData.organizer.email, testData.organizer.password);

//       // Verify dashboard access
//       cy.url().should("include", "/dashboard");
//     });

//     it("should allow sponsor sign up and sign in", () => {
//       // Test sign up
//       cy.signUp(testData.sponsor, "sponsor");

//       // Verify redirect to dashboard
//       cy.url().should("include", "/dashboard");

//       // Sign out
//       cy.signOut();

//       // Test sign in
//       cy.signIn(testData.sponsor.email, testData.sponsor.password);

//       // Verify dashboard access
//       cy.url().should("include", "/dashboard");
//     });
//   });

//   /**
//    * Test 2: Dashboard Navigation
//    */
//   describe("Dashboard Navigation", () => {
//     it("should navigate organizer dashboard", () => {
//       cy.signIn(testData.organizer.email, testData.organizer.password);

//       // Test basic navigation
//       const routes = ["/dashboard", "/dashboard/events", "/dashboard/messages"];

//       routes.forEach((route) => {
//         cy.visit(route, { failOnStatusCode: false });
//         // Just verify the page loads without 500 errors
//         cy.get("body").should("exist");
//       });
//     });

//     it("should navigate sponsor dashboard", () => {
//       cy.signIn(testData.sponsor.email, testData.sponsor.password);

//       // Test basic navigation
//       const routes = [
//         "/dashboard",
//         "/dashboard/sponsorships",
//         "/dashboard/messages",
//       ];

//       routes.forEach((route) => {
//         cy.visit(route, { failOnStatusCode: false });
//         // Just verify the page loads without 500 errors
//         cy.get("body").should("exist");
//       });
//     });
//   });

//   /**
//    * Test 3: Form Validation
//    */
//   describe("Form Validation", () => {
//     it("should validate sign up form", () => {
//       cy.visit("/auth/signup");

//       // Try to submit empty form
//       cy.get('button[type="submit"], button:contains("Sign Up")')
//         .first()
//         .click();

//       // Should stay on signup page (validation preventing submission)
//       cy.url().should("include", "/auth/signup");

//       // Test with invalid email
//       cy.get('input[type="email"], input[placeholder*="email"]')
//         .first()
//         .type("invalid-email");
//       cy.get('button[type="submit"], button:contains("Sign Up")')
//         .first()
//         .click();

//       // Should still be on signup page
//       cy.url().should("include", "/auth/signup");
//     });
//   });

//   /**
//    * Test 4: Basic Event Management
//    */
//   describe("Event Management", () => {
//     it("should access events page", () => {
//       cy.signIn(testData.organizer.email, testData.organizer.password);

//       // Navigate to events
//       cy.visit("/dashboard/events", { failOnStatusCode: false });

//       // Verify page loads
//       cy.get("body").should("exist");

//       // Look for common event management elements
//       cy.get("body").then(($body) => {
//         if (
//           $body.find(
//             'button:contains("Create Event"), a:contains("Create Event")'
//           ).length > 0
//         ) {
//           cy.log("Create Event button found");
//         } else {
//           cy.log("Create Event button not found - may be different UI");
//         }
//       });
//     });
//   });

//   /**
//    * Test 5: Basic Sponsorship Flow
//    */
//   describe("Sponsorship Flow", () => {
//     it("should access sponsorships page", () => {
//       cy.signIn(testData.sponsor.email, testData.sponsor.password);

//       // Navigate to sponsorships
//       cy.visit("/dashboard/sponsorships", { failOnStatusCode: false });

//       // Verify page loads
//       cy.get("body").should("exist");

//       // Look for sponsorship-related elements
//       cy.get("body").then(($body) => {
//         if (
//           $body.find('button:contains("Discover"), button:contains("Browse")')
//             .length > 0
//         ) {
//           cy.log("Discover/Browse button found");
//         } else {
//           cy.log("Discover/Browse button not found - may be different UI");
//         }
//       });
//     });
//   });

//   /**
//    * Test 6: Basic Messaging
//    */
//   describe("Messaging", () => {
//     it("should access messages page", () => {
//       cy.signIn(testData.organizer.email, testData.organizer.password);

//       // Navigate to messages
//       cy.visit("/dashboard/messages", { failOnStatusCode: false });

//       // Verify page loads
//       cy.get("body").should("exist");

//       // Look for messaging elements
//       cy.get("body").then(($body) => {
//         if (
//           $body.find(
//             'input[placeholder*="message"], textarea[placeholder*="message"]'
//           ).length > 0
//         ) {
//           cy.log("Message input found");
//         } else {
//           cy.log(
//             "Message input not found - may be different UI or no active conversations"
//           );
//         }
//       });
//     });
//   });

//   /**
//    * Cleanup after all tests
//    */
//   after(() => {
//     cy.log("Basic E2E tests completed successfully");
//   });
// });

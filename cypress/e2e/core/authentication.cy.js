/// <reference types="cypress" />

/**
 * Core Authentication Tests
 * Tests basic sign up, sign in, and sign out functionality
 */

describe("Core Authentication", () => {
  let testData = {
    organizer: {
      email: "",
      password: "TestPass123!",
      firstName: "John",
      lastName: "Organizer",
      companyName: "Event Co Ltd",
      contactNumber: "+1234567890",
    },
    sponsor: {
      email: "",
      password: "TestPass123!",
      firstName: "Jane",
      lastName: "Sponsor",
      companyName: "Sponsor Corp",
      contactNumber: "+0987654321",
    },
  };

  before(() => {
    // Generate unique test data with more precise timestamp and random component
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);

    testData.organizer.email = `cypresstest_organizer_${timestamp}_${random}@example.com`;
    testData.sponsor.email = `cypresstest_sponsor_${timestamp}_${random}@example.com`;

    // Log the emails being used for debugging
    cy.log(`Using organizer email: ${testData.organizer.email}`);
    cy.log(`Using sponsor email: ${testData.sponsor.email}`);
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearAuth();
  });

  describe("User Registration", () => {
    it("should allow organizer sign up and authentication", () => {
      // Generate fresh timestamp for this specific test to ensure uniqueness
      const testTimestamp = Date.now();
      const testRandom = Math.floor(Math.random() * 10000);
      const uniqueOrganizerEmail = `cypresstest_org_${testTimestamp}_${testRandom}@example.com`;

      const uniqueOrganizerData = {
        ...testData.organizer,
        email: uniqueOrganizerEmail,
      };

      cy.log(`Testing organizer signup with: ${uniqueOrganizerEmail}`);

      // Test sign up
      cy.signUp(uniqueOrganizerData, "organizer");

      // Verify redirect to dashboard
      cy.url().should("include", "/dashboard");

      // Sign out
      cy.signOut();

      // Test sign in with the same unique email
      cy.signIn(uniqueOrganizerEmail, testData.organizer.password);

      // Verify dashboard access
      cy.url().should("include", "/dashboard");
    });

    it("should allow sponsor sign up and authentication", () => {
      // Generate fresh timestamp for this specific test to ensure uniqueness
      const testTimestamp = Date.now();
      const testRandom = Math.floor(Math.random() * 10000);
      const uniqueSponsorEmail = `cypresstest_spon_${testTimestamp}_${testRandom}@example.com`;

      const uniqueSponsorData = {
        ...testData.sponsor,
        email: uniqueSponsorEmail,
      };

      cy.log(`Testing sponsor signup with: ${uniqueSponsorEmail}`);

      // Test sign up
      cy.signUp(uniqueSponsorData, "sponsor");

      // Verify redirect to dashboard
      cy.url().should("include", "/dashboard");

      // Sign out
      cy.signOut();

      // Test sign in with the same unique email
      cy.signIn(uniqueSponsorEmail, testData.sponsor.password);

      // Verify dashboard access
      cy.url().should("include", "/dashboard");
    });
  });

  describe("Form Validation", () => {
    it("should validate sign up form inputs", () => {
      cy.visit("/auth/signup");

      // Try to submit empty form
      cy.get('button[type="submit"], button:contains("Sign Up")')
        .first()
        .click();

      // Should stay on signup page (validation preventing submission)
      cy.url().should("include", "/auth/signup");

      // Test with invalid email
      cy.get('input[type="email"], input[placeholder*="email"]')
        .first()
        .clear()
        .type("invalid-email");
      cy.get('button[type="submit"], button:contains("Sign Up")')
        .first()
        .click();

      // Should still be on signup page
      cy.url().should("include", "/auth/signup");
    });

    it("should validate sign in form", () => {
      cy.visit("/auth/signin");

      // Try to submit empty form
      cy.get('button[type="submit"], button:contains("Sign In")')
        .first()
        .click();

      // Should stay on signin page
      cy.url().should("include", "/auth/signin");

      // Test with non-existent credentials (use unique email to avoid conflicts)
      const nonExistentEmail = `nonexistent_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}@example.com`;

      cy.get('input[type="email"], input[placeholder*="email"]')
        .first()
        .clear()
        .type(nonExistentEmail);
      cy.get('input[type="password"], input[placeholder*="password"]')
        .first()
        .clear()
        .type("wrongpassword");
      cy.get('button[type="submit"], button:contains("Sign In")')
        .first()
        .click();

      // Should stay on signin page or show error
      cy.url().should("include", "/auth/signin");
    });
  });

  after(() => {
    cy.log("✅ Core Authentication Tests Completed");
  });
});

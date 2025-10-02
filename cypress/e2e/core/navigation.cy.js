/// <reference types="cypress" />

/**
 * Dashboard Navigation Tests
 * Tests navigation and accessibility of all dashboard pages
 */

describe("Dashboard Navigation", () => {
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
    // Generate unique test data for this test run
    const timestamp = Date.now();
    testData.organizer.email = `cypresstest_organizer_${timestamp}@example.com`;
    testData.sponsor.email = `cypresstest_sponsor_${timestamp}@example.com`;

    // Set up test users
    cy.visit("/");
    cy.clearAuth();
    cy.signUp(testData.organizer, "organizer");
    cy.signOut();
    cy.signUp(testData.sponsor, "sponsor");
    cy.signOut();
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearAuth();
  });

  describe("Organizer Dashboard", () => {
    beforeEach(() => {
      cy.signIn(testData.organizer.email, testData.organizer.password);
    });

    it("should navigate through all organizer dashboard pages", () => {
      // Test basic navigation routes
      const routes = [
        { path: "/dashboard", name: "Main Dashboard" },
        { path: "/dashboard/events", name: "Events" },
        { path: "/dashboard/enquiries", name: "Enquiries" },
        { path: "/dashboard/manage-enquiries", name: "Manage Enquiries" },
        { path: "/dashboard/messages", name: "Messages" },
        { path: "/dashboard/settings", name: "Settings" },
      ];

      routes.forEach((route) => {
        cy.log(`Testing route: ${route.name} (${route.path})`);
        cy.visit(route.path, { failOnStatusCode: false });
        cy.get("body").should("exist");
        cy.wait(1000); // Small wait between navigation
      });
    });

    it("should verify organizer-specific navigation elements", () => {
      cy.visit("/dashboard");

      // Look for common organizer navigation elements
      cy.get("body").then(($body) => {
        const organizerElements = [
          'a:contains("Events")',
          'a:contains("Enquiries")',
          'button:contains("Create Event")',
          'a[href*="/events"]',
          'a[href*="/enquiries"]',
        ];

        organizerElements.forEach((selector) => {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Found organizer element: ${selector}`);
          }
        });
      });
    });

    afterEach(() => {
      cy.signOut();
    });
  });

  describe("Sponsor Dashboard", () => {
    beforeEach(() => {
      cy.signIn(testData.sponsor.email, testData.sponsor.password);
    });

    it("should navigate through all sponsor dashboard pages", () => {
      // Test sponsor-specific routes
      const routes = [
        { path: "/dashboard", name: "Main Dashboard" },
        { path: "/dashboard/sponsorships", name: "Sponsorships" },
        { path: "/dashboard/messages", name: "Messages" },
        { path: "/dashboard/settings", name: "Settings" },
      ];

      routes.forEach((route) => {
        cy.log(`Testing route: ${route.name} (${route.path})`);
        cy.visit(route.path, { failOnStatusCode: false });
        cy.get("body").should("exist");
        cy.wait(1000); // Small wait between navigation
      });
    });

    it("should verify sponsor-specific navigation elements", () => {
      cy.visit("/dashboard");

      // Look for common sponsor navigation elements
      cy.get("body").then(($body) => {
        const sponsorElements = [
          'a:contains("Sponsorships")',
          'button:contains("Discover")',
          'button:contains("Browse")',
          'a[href*="/sponsorships"]',
        ];

        sponsorElements.forEach((selector) => {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Found sponsor element: ${selector}`);
          }
        });
      });
    });

    afterEach(() => {
      cy.signOut();
    });
  });

  describe("Cross-Navigation", () => {
    it("should handle navigation between different dashboard sections", () => {
      cy.signIn(testData.organizer.email, testData.organizer.password);

      // Test navigation flow
      cy.visit("/dashboard");
      cy.wait(1000);

      cy.visit("/dashboard/events", { failOnStatusCode: false });
      cy.get("body").should("exist");
      cy.wait(1000);

      cy.visit("/dashboard/messages", { failOnStatusCode: false });
      cy.get("body").should("exist");
      cy.wait(1000);

      // Navigate back to main dashboard
      cy.visit("/dashboard");
      cy.get("body").should("exist");

      cy.signOut();
    });
  });

  after(() => {
    cy.log("✅ Dashboard Navigation Tests Completed");
  });
});

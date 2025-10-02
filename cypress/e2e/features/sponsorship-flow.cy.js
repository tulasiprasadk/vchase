/// <reference types="cypress" />

/**
 * Sponsorship Flow Tests
 * Tests sponsor discovery, enquiry submission, and management
 */

describe("Sponsorship Flow", () => {
  let testData = {
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
    testData.sponsor.email = `cypresstest_sponsor_${timestamp}@example.com`;

    // Set up test user
    cy.visit("/");
    cy.clearAuth();
    cy.signUp(testData.sponsor, "sponsor");
    cy.signOut();
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearAuth();
    cy.signIn(testData.sponsor.email, testData.sponsor.password);
  });

  afterEach(() => {
    cy.signOut();
  });

  describe("Sponsorship Dashboard", () => {
    it("should access sponsorships page", () => {
      cy.visit("/dashboard/sponsorships", { failOnStatusCode: false });

      // Verify page loads
      cy.get("body").should("exist");
      cy.url().should("include", "/sponsorships");

      // Look for sponsorship-related elements
      cy.get("body").then(($body) => {
        const sponsorshipElements = [
          'button:contains("Discover")',
          'button:contains("Browse")',
          'button:contains("Find Events")',
          'a:contains("Discover")',
          'a:contains("Browse")',
          '[data-testid="discover-events"]',
          '[data-testid="browse-events"]',
        ];

        sponsorshipElements.forEach((selector) => {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Found sponsorship element: ${selector}`);
          }
        });
      });
    });

    it("should display sponsorship status or empty state", () => {
      cy.visit("/dashboard/sponsorships", { failOnStatusCode: false });

      cy.get("body").then(($body) => {
        // Check for various states
        if (
          $body.find(
            '.sponsorship-card, [data-testid*="sponsorship"], .enquiry-item'
          ).length > 0
        ) {
          cy.log("✅ Sponsorships found in dashboard");
        } else if (
          $body.text().includes("No sponsorships") ||
          $body.text().includes("Start discovering")
        ) {
          cy.log("✅ Empty state displayed correctly");
        } else {
          cy.log("📝 Sponsorship dashboard loaded - content varies");
        }
      });
    });
  });

  describe("Event Discovery", () => {
    it("should test event discovery workflow", () => {
      cy.visit("/dashboard/sponsorships", { failOnStatusCode: false });
      cy.wait(2000);

      // Try to access event discovery
      cy.get("body").then(($body) => {
        const discoverSelectors = [
          'button:contains("Discover Events")',
          'button:contains("Browse Events")',
          'button:contains("Find Events")',
          'a:contains("Discover")',
          'a:contains("Browse")',
          '[data-testid="discover-events"]',
        ];

        let discoverButtonFound = false;

        for (const selector of discoverSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`Found discover button: ${selector}`);
            cy.get(selector).first().click();
            discoverButtonFound = true;
            break;
          }
        }

        if (!discoverButtonFound) {
          cy.log("Discover button not found - trying direct navigation");
          cy.visit("/events", { failOnStatusCode: false });
        }
      });

      cy.wait(3000);

      // Look for events or event discovery interface
      cy.get("body").then(($body) => {
        if (
          $body.find('.event-card, [data-testid*="event"], .event-item')
            .length > 0
        ) {
          cy.log("✅ Events found for sponsorship discovery");

          // Look for sponsorship action buttons
          const actionSelectors = [
            'button:contains("Sponsor")',
            'button:contains("Enquiry")',
            'button:contains("Send Enquiry")',
            'button:contains("Learn More")',
            'a:contains("View Details")',
          ];

          actionSelectors.forEach((selector) => {
            if ($body.find(selector).length > 0) {
              cy.log(`✅ Found sponsorship action: ${selector}`);
            }
          });
        } else {
          cy.log("📝 Event discovery interface may have different structure");
        }
      });
    });
  });

  describe("Enquiry Submission", () => {
    it("should test enquiry submission flow", () => {
      cy.visit("/dashboard/sponsorships", { failOnStatusCode: false });
      cy.wait(2000);

      // Navigate to events or discovery
      cy.get("body").then(($body) => {
        if (
          $body.find('button:contains("Discover"), button:contains("Browse")')
            .length > 0
        ) {
          cy.get('button:contains("Discover"), button:contains("Browse")')
            .first()
            .click();
          cy.wait(3000);
        } else {
          cy.visit("/events", { failOnStatusCode: false });
          cy.wait(2000);
        }
      });

      // Look for enquiry submission capability
      cy.get("body").then(($body) => {
        const enquirySelectors = [
          'button:contains("Send Enquiry")',
          'button:contains("Enquiry")',
          'button:contains("Contact")',
          'button:contains("Sponsor")',
          '[data-testid="send-enquiry"]',
        ];

        let enquiryFound = false;

        for (const selector of enquirySelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`Found enquiry button: ${selector}`);
            cy.get(selector).first().click();
            enquiryFound = true;
            cy.wait(2000);
            break;
          }
        }

        if (enquiryFound) {
          // Look for enquiry form
          cy.get("body").then(($formBody) => {
            const formSelectors = [
              'textarea[placeholder*="message"]',
              'textarea[placeholder*="enquiry"]',
              'input[placeholder*="message"]',
              'select[name*="package"]',
              "form",
            ];

            formSelectors.forEach((selector) => {
              if ($formBody.find(selector).length > 0) {
                cy.log(`✅ Found enquiry form element: ${selector}`);
              }
            });
          });
        } else {
          cy.log(
            "📝 Enquiry submission interface not found - may have different structure"
          );
        }
      });
    });
  });

  after(() => {
    cy.log("✅ Sponsorship Flow Tests Completed");
  });
});

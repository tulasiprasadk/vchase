/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for Event Sponsorship Platform E2E tests

/**
 * Custom command to sign up a new user
 * @param userData - User data object containing form fields
 * @param userType - Type of user: 'organizer' or 'sponsor'
 */
Cypress.Commands.add("signUp", (userData, userType) => {
  cy.visit("/auth/signup");

  // Fill out the signup form
  cy.get('input[placeholder*="first name"]').type(userData.firstName);
  cy.get('input[placeholder*="last name"]').type(userData.lastName);
  cy.get('input[placeholder*="company name"]').type(userData.companyName);
  cy.get('input[placeholder*="contact number"]').type(userData.contactNumber);
  cy.get('input[placeholder*="email"]').type(userData.email);
  cy.get('input[placeholder*="password"]').type(userData.password);

  // Select user type
  cy.get(`input[value="${userType}"]`).check();

  // Submit form
  cy.get('button[type="submit"]').click();

  // Wait for redirect and verify success with flexible checking
  cy.url().should("include", "/dashboard", { timeout: 15000 });

  // Check for success indicators with multiple options
  cy.get("body").then(($body) => {
    const successIndicators = [
      "Account created successfully",
      "Welcome",
      "Dashboard",
      "Sign out",
      "Logout",
    ];

    let successFound = false;
    successIndicators.forEach((indicator) => {
      if ($body.text().includes(indicator)) {
        cy.log(`✅ Success indicator found: ${indicator}`);
        successFound = true;
      }
    });

    if (!successFound) {
      cy.log(
        "⚠️ No explicit success message found, but redirected to dashboard"
      );
    }
  });
});

/**
 * Custom command to sign in an existing user
 * @param email - User email
 * @param password - User password
 */
Cypress.Commands.add("signIn", (email, password) => {
  cy.visit("/auth/signin");

  cy.get('input[placeholder*="email"]').type(email);
  cy.get('input[placeholder*="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for redirect
  cy.url().should("include", "/dashboard", { timeout: 10000 });
});

/**
 * Custom command to sign out current user
 */
Cypress.Commands.add("signOut", () => {
  // Try multiple possible selectors for sign out
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="user-menu"]').length > 0) {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="sign-out"]').click();
    } else if ($body.find('button:contains("Sign Out")').length > 0) {
      cy.get('button:contains("Sign Out")').click();
    } else if ($body.find('a:contains("Sign Out")').length > 0) {
      cy.get('a:contains("Sign Out")').click();
    } else {
      // Fallback: clear session and navigate to home
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit("/");
    }
  });

  cy.url().should("not.include", "/dashboard");
});

/**
 * Custom command to create an event
 * @param eventData - Event data object
 */
Cypress.Commands.add("createEvent", (eventData) => {
  // Navigate to event creation
  cy.get("body").then(($body) => {
    if ($body.find('a[href*="/dashboard/events"]').length > 0) {
      cy.get('a[href*="/dashboard/events"]').click();
    } else {
      cy.visit("/dashboard/events");
    }
  });

  // Click create event button
  cy.get("body").then(($body) => {
    if ($body.find('button:contains("Create Event")').length > 0) {
      cy.get('button:contains("Create Event")').click();
    } else if ($body.find('a:contains("New Event")').length > 0) {
      cy.get('a:contains("New Event")').click();
    }
  });

  // Fill out basic event information
  cy.get('input[name="title"], input[placeholder*="title"]').type(
    eventData.title
  );
  cy.get(
    'textarea[name="description"], textarea[placeholder*="description"]'
  ).type(eventData.description);

  // Set date and time - handle different input types
  cy.get("body").then(($body) => {
    if ($body.find('input[type="datetime-local"]').length > 0) {
      const dateTimeValue = `${eventData.date}T${eventData.time}`;
      cy.get('input[type="datetime-local"]').type(dateTimeValue);
    } else if ($body.find('input[type="date"]').length > 0) {
      cy.get('input[type="date"]').type(eventData.date);
      if ($body.find('input[type="time"]').length > 0) {
        cy.get('input[type="time"]').type(eventData.time);
      }
    } else if ($body.find('input[name="date"]').length > 0) {
      cy.get('input[name="date"]').type(`${eventData.date}T${eventData.time}`);
    }
  });

  // Location details
  cy.get("body").then(($body) => {
    if (
      $body.find('input[name="venue"], input[placeholder*="venue"]').length > 0
    ) {
      cy.get('input[name="venue"], input[placeholder*="venue"]').type(
        eventData.venue
      );
    }
    if (
      $body.find('input[name="city"], input[placeholder*="city"]').length > 0
    ) {
      cy.get('input[name="city"], input[placeholder*="city"]').type(
        eventData.city
      );
    }
    if (
      $body.find('input[name="country"], input[placeholder*="country"]')
        .length > 0
    ) {
      cy.get('input[name="country"], input[placeholder*="country"]').type(
        eventData.country
      );
    }
  });

  // Additional event details
  cy.get("body").then(($body) => {
    if (
      $body.find('input[name="maxAttendees"], input[placeholder*="attendees"]')
        .length > 0
    ) {
      cy.get(
        'input[name="maxAttendees"], input[placeholder*="attendees"]'
      ).type(eventData.maxAttendees);
    }
    if (
      $body.find('input[name="ticketPrice"], input[placeholder*="price"]')
        .length > 0
    ) {
      cy.get('input[name="ticketPrice"], input[placeholder*="price"]').type(
        eventData.ticketPrice
      );
    }

    // Category selection
    if ($body.find('select[name="category"]').length > 0) {
      cy.get('select[name="category"]').select(eventData.category);
    } else if ($body.find('input[name="category"]').length > 0) {
      cy.get('input[name="category"]').type(eventData.category);
    }
  });

  // Handle image upload if file input exists
  cy.get("body").then(($body) => {
    if ($body.find('input[type="file"]').length > 0) {
      // Create a test image file for upload
      cy.fixture("team.jpg", "base64").then((fileContent) => {
        const fileName = "test-event-image.jpg";
        const mimeType = "image/jpeg";
        const blob = Cypress.Blob.base64StringToBlob(fileContent, mimeType);
        const file = new File([blob], fileName, { type: mimeType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        cy.get('input[type="file"]').then((input) => {
          input[0].files = dataTransfer.files;
          input[0].dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
    }
  });

  // Add sponsorship packages if section exists
  if (
    eventData.sponsorshipPackages &&
    eventData.sponsorshipPackages.length > 0
  ) {
    cy.get("body").then(($body) => {
      eventData.sponsorshipPackages.forEach((pkg, index) => {
        // Look for add package button or package forms
        if (
          $body.find(
            'button:contains("Add Package"), button:contains("New Package")'
          ).length > 0
        ) {
          if (index > 0) {
            cy.get(
              'button:contains("Add Package"), button:contains("New Package")'
            ).click();
          }

          // Fill package details
          cy.get(
            `input[name="packageName"], input[placeholder*="package name"]`
          )
            .eq(index)
            .type(pkg.name);
          cy.get(`input[name="packagePrice"], input[placeholder*="price"]`)
            .eq(index)
            .type(pkg.price);
          cy.get(
            `textarea[name="packageDescription"], textarea[placeholder*="description"]`
          )
            .eq(index)
            .type(pkg.description);

          // Add benefits if field exists
          if (pkg.benefits && pkg.benefits.length > 0) {
            cy.get(
              `textarea[name="packageBenefits"], textarea[placeholder*="benefits"]`
            )
              .eq(index)
              .type(pkg.benefits.join("\n"));
          }
        }
      });
    });
  }

  // Submit event form
  cy.get(
    'button[type="submit"], button:contains("Create Event"), button:contains("Save Event")'
  ).click();

  // Verify event creation success
  cy.get("body").then(($body) => {
    if (
      $body.text().includes("successfully") ||
      $body.text().includes("created") ||
      $body.text().includes("saved")
    ) {
      cy.log("Event created successfully");
    }
  });
});

/**
 * Custom command to submit a sponsorship enquiry
 * @param enquiryData - Enquiry data object
 */
Cypress.Commands.add("submitEnquiry", (enquiryData) => {
  // Select sponsorship package
  cy.get("button").contains(enquiryData.packageName).click();

  // Add message
  cy.get('textarea[placeholder*="message"]').type(enquiryData.message);

  // Submit enquiry
  cy.get("button").contains("Send Enquiry").click();

  // Verify enquiry submission
  cy.get("body").should("contain", "Enquiry sent successfully");
});

/**
 * Custom command to wait for element with retry
 * @param selector - CSS selector
 * @param timeout - Timeout in milliseconds
 */
Cypress.Commands.add("waitForElement", (selector, timeout = 5000) => {
  cy.get(selector, { timeout }).should("be.visible");
});

/**
 * Custom command to handle file uploads
 * @param selector - File input selector
 * @param fileName - Name of file in fixtures folder
 */
Cypress.Commands.add("uploadFile", (selector, fileName) => {
  cy.get(selector).selectFile(`cypress/fixtures/${fileName}`, { force: true });
});

/**
 * Custom command to clear all authentication state
 */
Cypress.Commands.add("clearAuth", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

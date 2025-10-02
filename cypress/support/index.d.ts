/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to sign up a new user
     * @param userData - User data object containing form fields
     * @param userType - Type of user: 'organizer' or 'sponsor'
     */
    signUp(
      userData: {
        firstName: string;
        lastName: string;
        companyName: string;
        contactNumber: string;
        email: string;
        password: string;
      },
      userType: "organizer" | "sponsor"
    ): Chainable<Element>;

    /**
     * Custom command to sign in an existing user
     * @param email - User email
     * @param password - User password
     */
    signIn(email: string, password: string): Chainable<Element>;

    /**
     * Custom command to sign out current user
     */
    signOut(): Chainable<Element>;

    /**
     * Custom command to clear authentication state
     */
    clearAuth(): Chainable<Element>;

    /**
     * Custom command to create an event
     * @param eventData - Event data object
     */
    createEvent(eventData: {
      title: string;
      description: string;
      date: string;
      time: string;
      venue: string;
      city: string;
      country: string;
      category: string;
      maxAttendees: string;
      ticketPrice?: string;
      tags?: string[];
      image?: string;
      sponsorshipPackages?: Array<{
        name: string;
        price: string;
        benefits: string[];
      }>;
    }): Chainable<Element>;

    /**
     * Custom command to submit sponsorship enquiry
     * @param enquiryData - Enquiry data object
     */
    submitEnquiry(enquiryData: {
      companyName: string;
      contactEmail: string;
      message: string;
      packageName: string;
    }): Chainable<Element>;
  }
}

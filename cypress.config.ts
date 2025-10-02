import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    // Specify which browsers to use
    // supportedBrowsers: ["chrome", "edge", "firefox"],
    // Test file patterns
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    // Exclude patterns for faster test discovery
    excludeSpecPattern: ["**/node_modules/**", "**/dist/**"],
  },
});

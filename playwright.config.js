// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // Added 1 retry even in non-CI to handle flakiness with Kroger
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    ...devices['Desktop Chrome'],
    args: [
      '--disable-quic',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
    ignoreHTTPSErrors: true,
    // Record video only on failure
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Increase timeouts for slower sites
    navigationTimeout: 60000,
    actionTimeout: 30000,
    maxFailures: 2,
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        httpVersion: '1.1',
        ignoreHTTPSErrors: true,
        launchOptions: {
          slowMo: 50, // Slow down all actions by 50ms
          headless: false, // Run in headed mode to avoid detection
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        locale: 'en-US',
        geolocation: { longitude: -97.822, latitude: 37.751 }, // US-based location
        permissions: ['geolocation'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          slowMo: 50,
          headless: false,
        },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          slowMo: 50,
          headless: false,
        },
      },
    },
    /* Test against mobile viewports. */
    // {
    // name: 'Mobile Chrome',
    // use: { ...devices['Pixel 5'] },
    // },
    // {
    // name: 'Mobile Safari',
    // use: { ...devices['iPhone 12'] },
    // },
    /* Test against branded browsers. */
    // {
    // name: 'Microsoft Edge',
    // use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    // name: 'Google Chrome',
    // use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  /* Run your local dev server before starting the tests */
  // webServer: {
  // command: 'npm run start',
  // url: 'http://127.0.0.1:3000',
  // reuseExistingServer: !process.env.CI,
  // },
  // Increase overall timeout
  timeout: 60000,
});

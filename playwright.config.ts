import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const baseURL = process.env.WORDPRESS_URL || 'http://localhost:8080';

export default defineConfig({
  testDir: './tests/e2e/specs',

  // Run tests in parallel by default
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for more predictable results
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Global timeout
  timeout: 30000,

  // Shared settings for all the projects below
  use: {
    baseURL,

    // Ignore HTTPS errors for local development with self-signed certificates
    ignoreHTTPSErrors: true,

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording on first retry
    video: 'on-first-retry',

    // Increase timeout for slow WordPress operations
    actionTimeout: 15000,

    // Use authenticated state by default
    storageState: './auth.json',
  },

  // Global setup for authentication
  globalSetup: './tests/e2e/global-setup.ts',

  // Global teardown for cleanup
  globalTeardown: './tests/e2e/global-teardown.ts',

  // Configure projects for different browsers
  projects: [
    // Sequential tests that must run in order (e.g., onboarding)
    // Note: In CI, onboarding runs first on fresh WordPress install
    // For local dev with existing site, run only parallel: npm run test:parallel
    {
      name: 'sequential',
      testMatch: '**/onboarding.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: false,
      workers: 1,
    },

    // Main test suite - can run in parallel
    // Depends on sequential in CI (fresh install needs onboarding first)
    {
      name: 'parallel',
      testIgnore: '**/onboarding.spec.ts',
      dependencies: process.env.CI ? ['sequential'] : [],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local WordPress server before starting the tests
  // Uncomment to use WP Playground
  // webServer: {
  //   command: 'npx @wp-playground/cli@latest server --auto-mount --port=8080 --login',
  //   url: 'http://localhost:8080',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});

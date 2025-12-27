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
    // Sequential tests that must run in order
    // Includes: onboarding (must run first on fresh install),
    // todo tests (create/delete/complete/reorder - share state),
    // task-tagline (modifies WordPress settings)
    {
      name: 'sequential',
      testMatch: [
        '**/onboarding.spec.ts',
        '**/todo-crud.spec.ts',
        '**/todo-complete.spec.ts',
        '**/todo-reorder.spec.ts',
        '**/task-tagline.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: false,
      workers: 1,
    },

    // Main test suite - can run in parallel
    // Depends on sequential in CI (fresh install needs onboarding first)
    {
      name: 'parallel',
      testIgnore: [
        '**/onboarding.spec.ts',
        '**/todo-crud.spec.ts',
        '**/todo-complete.spec.ts',
        '**/todo-reorder.spec.ts',
        '**/task-tagline.spec.ts',
      ],
      dependencies: process.env.CI ? ['sequential'] : [],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run WP Playground server before starting the tests
  webServer: {
    command: 'npx @wp-playground/cli server --mount=.:/wordpress/wp-content/plugins/progress-planner --blueprint=tests/e2e/blueprint.json --port=8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

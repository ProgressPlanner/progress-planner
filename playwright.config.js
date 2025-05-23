const { defineConfig, devices } = require( '@playwright/test' );

module.exports = defineConfig( {
	testDir: './tests/e2e',
	timeout: 30000,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: 'html',
	globalSetup: './tests/e2e/auth.setup.js',
	globalTeardown: './tests/e2e/auth.setup.js',
	use: {
		baseURL: process.env.WORDPRESS_URL || 'http://localhost:8080',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		storageState: 'auth.json',
	},
	projects: [
		{
			name: 'sequential',
			use: { ...devices[ 'Desktop Chrome' ] },
			testMatch: 'sequential.spec.js',
			fullyParallel: false,
			workers: 1,
		},
		{
			name: 'parallel',
			use: { ...devices[ 'Desktop Chrome' ] },
			testIgnore: [ 'sequential.spec.js', '**/sequential/**' ],
			fullyParallel: true,
			workers: 4,
		},
	],
} );

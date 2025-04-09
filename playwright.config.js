const { defineConfig, devices } = require( '@playwright/test' );

module.exports = defineConfig( {
	testDir: './tests/e2e',
	timeout: 30000,
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: 'html',
	globalSetup: require.resolve( './tests/e2e/auth.setup.js' ),
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
			testMatch: 'task-tagline.spec.js',
		},
		{
			name: 'parallel',
			use: { ...devices[ 'Desktop Chrome' ] },
			testIgnore: 'task-tagline.spec.js',
			fullyParallel: true,
			workers: process.env.CI ? 1 : undefined,
		},
	],
} );

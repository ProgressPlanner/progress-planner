const { chromium } = require( '@playwright/test' );
require( 'dotenv' ).config();

async function globalSetup() {
	console.log( 'Starting loging in process...' );
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	// Set up error listener for all tests
	page.on( 'pageerror', ( err ) => {
		console.log( 'JS Error:', err.message );
	} );

	try {
		// Go to WordPress dashboard
		const baseURL = process.env.WORDPRESS_URL || 'http://localhost:8080';
		console.log( 'Navigating to WordPress dashboard...' );
		await page.goto( `${ baseURL }/wp-login.php` );

		// Log in
		console.log( 'Logging in...' );
		await page.fill(
			'#user_login',
			process.env.WORDPRESS_ADMIN_USER || 'admin'
		);
		await page.fill(
			'#user_pass',
			process.env.WORDPRESS_ADMIN_PASSWORD || 'password'
		);
		await page.click( '#wp-submit' );

		// Wait for login to complete and verify we're on the dashboard
		await page.waitForURL( `${ baseURL }/wp-admin/` );
		await page.waitForSelector( '#wpadminbar' );
		console.log( 'Login successful' );
	} catch ( error ) {
		console.error( '\n❌ Onboarding completion failed:', error.message );
		console.error( 'Current page URL:', page.url() );
		console.error( 'Current page content:', await page.content() );
		await page.screenshot( { path: 'onboarding-failed.png' } );
		await browser.close();
		process.exit( 1 );
	}

	console.log( 'Saving auth state...' );
	// Save the state to auth.json
	await context.storageState( { path: 'auth.json' } );
	await browser.close();
	console.log( 'Global setup completed' );
}

module.exports = globalSetup;

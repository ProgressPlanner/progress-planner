const { chromium } = require( '@playwright/test' );
const fs = require( 'fs' );
const path = require( 'path' );
require( 'dotenv' ).config();

// Add cleanup function
async function cleanup() {
	const authFile = path.join( process.cwd(), 'auth.json' );
	if ( fs.existsSync( authFile ) ) {
		console.log( 'Cleaning up auth.json...' );
		fs.unlinkSync( authFile );
	}
}

// Handle async cleanup properly
async function handleCleanup() {
	await cleanup();
	process.exit( 0 );
}

// Register cleanup on process exit
process.on( 'exit', () => cleanup() ); // exit event doesn't support async, it gets triggered between sequential & parallel tests
process.on( 'SIGINT', () => handleCleanup() );
process.on( 'SIGTERM', () => handleCleanup() );

async function globalSetup() {
	const authFile = path.join( process.cwd(), 'auth.json' );

	// Check if auth.json exists
	if ( fs.existsSync( authFile ) ) {
		console.log( 'Using existing auth.json...' );
		return;
	}

	console.log( 'Starting login process...' );
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

// Export both functions
module.exports = globalSetup;
module.exports.globalTeardown = cleanup;

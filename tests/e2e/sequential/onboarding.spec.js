/**
 * External dependencies
 */
import { test, expect } from '@playwright/test';

function onboardingTests( testContext = test ) {
	testContext.describe( 'Progress Planner Onboarding', () => {
		testContext(
			'should complete onboarding process successfully',
			async ( { page } ) => {
				// Listen for console messages
				page.on( 'console', ( msg ) => {
					console.log(
						`Browser console [${ msg.type() }]: ${ msg.text() }`
					);
				} );

				// Listen for page errors
				page.on( 'pageerror', ( error ) => {
					console.log( `Page error: ${ error.message }` );
				} );

				// Listen for network requests
				page.on( 'request', ( request ) => {
					console.log(
						`Request: ${ request.method() } ${ request.url() }`
					);
				} );

				page.on( 'response', ( response ) => {
					console.log(
						`Response: ${ response.status() } ${ response.url() }`
					);
				} );
				// Navigate to Progress Planner page
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				// Verify onboarding element is present
				const onboardingElement = page.locator( '.prpl-welcome' );
				await expect( onboardingElement ).toBeVisible();

				// Fill in the onboarding form
				const form = page.locator( '#prpl-onboarding-form' );
				await expect( form ).toBeVisible();

				// Submit button should be disabled
				const submitButtonWrapper = form.locator(
					'#prpl-onboarding-submit-wrapper'
				);

				// Select "no" for email and accept privacy policy
				await form
					.locator( 'input[name="with-email"][value="no"]' )
					.click();

				// Verify submit button is stilldisabled
				await expect( submitButtonWrapper ).toHaveClass(
					'prpl-disabled'
				);

				await form.locator( 'input[name="privacy-policy"]' ).check();

				// Accept privacy policy and verify button becomes enabled
				await expect( submitButtonWrapper ).not.toHaveClass(
					'prpl-disabled'
				);

				// Submit the form
				await form
					.locator(
						'input[type="submit"].prpl-button-secondary--no-email'
					)
					.click();

				// Wait for navigation to complete
				console.log(
					'Waiting for navigation after form submission...'
				);

				try {
					// Wait for the navigation to complete with a longer timeout
					await page.waitForLoadState( 'networkidle', {
						timeout: 30000,
					} );
					console.log( 'Navigation completed successfully' );
				} catch ( error ) {
					console.log( `Navigation timeout: ${ error.message }` );
					console.log( `Current URL: ${ page.url() }` );

					// Try to wait for DOM content loaded instead
					await page.waitForLoadState( 'domcontentloaded', {
						timeout: 10000,
					} );
					console.log( 'DOM content loaded, continuing...' );
				}

				// Output current URL and page source code
				console.log( `Current URL after navigation: ${ page.url() }` );
				console.log( 'Page content:' );
				console.log( await page.content() );

				// Verify onboarding completion by checking for expected elements
				await expect(
					page.locator( '.prpl-widget-wrapper.prpl-suggested-tasks' )
				).toBeVisible( { timeout: 5000 } );
				await expect(
					page.locator(
						'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list'
					)
				).toBeVisible( {
					timeout: 5000,
				} );

				// Visit the WP Dashboard page and back to the Progress Planner page.
				await page.goto( '/wp-admin/' );
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				await expect(
					page.locator( '#prpl-onboarding-tasks' )
				).toHaveCount( 0 );
			}
		);
	} );
}

module.exports = onboardingTests;

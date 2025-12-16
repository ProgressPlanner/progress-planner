/**
 * External dependencies
 */
import { test, expect } from '@playwright/test';

function onboardingTests( testContext = test ) {
	testContext.describe( 'Progress Planner Onboarding', () => {
		testContext(
			'should complete onboarding process successfully',
			async ( { page } ) => {
				// Navigate to Progress Planner page
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				// Wait for the onboarding popover to be visible
				const popover = page.locator( '#prpl-popover-onboarding' );
				await expect( popover ).toBeVisible( { timeout: 10000 } );

				// Click on the privacy policy checkbox label (clicking label triggers the checkbox)
				const privacyLabel = page.locator(
					'label[for="prpl-privacy-checkbox"]'
				);
				await expect( privacyLabel ).toBeVisible();
				await privacyLabel.click();

				// Click "Start onboarding" button to accept privacy and proceed
				const startButton = popover.locator( '.prpl-tour-next' );
				await expect( startButton ).toBeVisible();
				await startButton.click();

				// Wait for step to advance (license generation happens in background)
				// We should now be on step 1 or later
				await expect( popover ).toHaveAttribute(
					'data-prpl-step',
					/^[1-9]/,
					{ timeout: 15000 }
				);

				// Click the close button to exit onboarding
				const closeButton = page.locator( '#prpl-tour-close-btn' );
				await closeButton.click();

				// Verify onboarding popover is closed/hidden
				await expect( popover ).toBeHidden( { timeout: 5000 } );

				// Visit the WP Dashboard page and back to the Progress Planner page
				await page.goto( '/wp-admin/' );
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				// Verify onboarding doesn't auto-start (progress was saved)
				// The popover element exists but should be hidden (not auto-opened)
				await expect( popover ).toBeHidden( { timeout: 5000 } );
			}
		);
	} );
}

module.exports = onboardingTests;

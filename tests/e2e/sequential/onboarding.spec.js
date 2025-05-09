/**
 * External dependencies
 */
import { test, expect } from '@playwright/test';

function onboardingTests( testContext = test ) {
	testContext.describe.serial( 'Progress Planner Onboarding', () => {
		testContext(
			'should handle onboarding errors gracefully',
			async ( { page } ) => {
				// Navigate to Progress Planner page
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				// Verify onboarding element is present
				const onboardingElement = page.locator( '.prpl-welcome' );
				await expect( onboardingElement ).toBeVisible();

				// Try to submit form without accepting privacy policy
				const form = page.locator( '#prpl-onboarding-form' );
				await form
					.locator( 'input[name="with-email"][value="no"]' )
					.click();

				// Submit button should be disabled
				const submitButtonWrapper = form.locator(
					'#prpl-onboarding-submit-wrapper'
				);
				await expect( submitButtonWrapper ).toHaveClass(
					'prpl-disabled'
				);

				// Accept privacy policy and verify button becomes enabled
				await form.locator( 'input[name="privacy-policy"]' ).check();
				await expect( submitButtonWrapper ).not.toHaveClass(
					'prpl-disabled'
				);
			}
		);

		testContext(
			'should complete onboarding process successfully',
			async ( { page } ) => {
				// Navigate to Progress Planner page
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				// Verify onboarding element is present
				const onboardingElement = page.locator( '.prpl-welcome' );
				await expect( onboardingElement ).toBeVisible();

				// Fill in the onboarding form
				const form = page.locator( '#prpl-onboarding-form' );
				await expect( form ).toBeVisible();

				// Select "no" for email and accept privacy policy
				await form
					.locator( 'input[name="with-email"][value="no"]' )
					.click();
				await form.locator( 'input[name="privacy-policy"]' ).check();

				// Submit the form
				await form
					.locator(
						'input[type="submit"].prpl-button-secondary--no-email'
					)
					.click();

				// Wait for continue button and verify it becomes enabled
				const continueButton = page.locator(
					'#prpl-onboarding-continue-button'
				);
				await continueButton.waitFor( { state: 'visible' } );
				await page.waitForSelector(
					'#prpl-onboarding-continue-button:not(.prpl-disabled)'
				);
				await continueButton.click();

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
			}
		);

		testContext(
			'should not show upgrade popover if user has completed onboarding',
			async ( { page } ) => {
				// Navigate to Progress Planner page
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				const onboardingTasks = page.locator(
					'#prpl-onboarding-tasks'
				);
				await expect( onboardingTasks ).toHaveCount( 0 );

				// Visit the WP Dashboard page and back to the Progress Planner page.
				await page.goto( '/wp-admin/' );
				await page.goto( '/wp-admin/admin.php?page=progress-planner' );
				await page.waitForLoadState( 'networkidle' );

				await expect( onboardingTasks ).toHaveCount( 0 );
			}
		);
	} );
}

module.exports = onboardingTests;

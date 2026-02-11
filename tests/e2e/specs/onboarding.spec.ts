import { test, expect } from '../fixtures/base.fixture';

test.describe( 'Progress Planner Onboarding', () => {
	test( 'should complete onboarding process successfully', async ( {
		page,
	} ) => {
		await test.step( 'Navigate to Progress Planner page', async () => {
			await page.goto( '/wp-admin/admin.php?page=progress-planner' );
			await page.waitForLoadState( 'networkidle' );
		} );

		const onboardingElement = page.locator( '.prpl-welcome' );
		const form = page.locator( '#prpl-onboarding-form' );

		await test.step( 'Verify onboarding form is visible', async () => {
			await expect( onboardingElement ).toBeVisible();
			await expect( form ).toBeVisible();
		} );

		const submitButtonWrapper = form.locator(
			'#prpl-onboarding-submit-wrapper'
		);

		await test.step( 'Select no email and verify submit is disabled', async () => {
			await form
				.locator( 'input[name="with-email"][value="no"]' )
				.click();

			await expect( submitButtonWrapper ).toHaveClass( 'prpl-disabled' );
		} );

		await test.step( 'Accept privacy policy and verify submit is enabled', async () => {
			await form.locator( 'input[name="privacy-policy"]' ).check();

			await expect( submitButtonWrapper ).not.toHaveClass(
				'prpl-disabled'
			);
		} );

		await test.step( 'Complete onboarding via AJAX', async () => {
			// Save the license key directly via the WP AJAX handler.
			// The remote API (progressplanner.com) is unreachable in Playground,
			// so we call the local save endpoint directly.
			const result = await page.evaluate( async () => {
				const formData = new FormData();
				formData.append( 'action', 'progress_planner_save_onboard_data' );
				formData.append(
					'_ajax_nonce',
					( window as any ).progressPlanner.nonce
				);
				formData.append( 'key', 'test-license-for-e2e-testing' );

				const response = await fetch(
					( window as any ).progressPlanner.ajaxUrl,
					{
						method: 'POST',
						body: formData,
					}
				);
				return response.ok;
			} );

			expect( result ).toBe( true );

			// Reload to see the dashboard.
			await page.reload( { waitUntil: 'networkidle' } );

			// Verify onboarding completion - dashboard should now be visible.
			await expect(
				page.locator( '.prpl-widget-wrapper.prpl-suggested-tasks' )
			).toBeVisible( { timeout: 15000 } );
			await expect(
				page.locator(
					'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list'
				)
			).toBeVisible( { timeout: 5000 } );
		} );

		await test.step( 'Verify onboarding does not reappear on revisit', async () => {
			await page.goto( '/wp-admin/' );
			await page.goto( '/wp-admin/admin.php?page=progress-planner' );
			await page.waitForLoadState( 'networkidle' );

			await expect(
				page.locator( '#prpl-onboarding-tasks' )
			).toHaveCount( 0 );
		} );
	} );
} );

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

		await test.step( 'Complete onboarding', async () => {
			// The remote API (progressplanner.com) is unreachable in WP Playground
			// because page.route() cannot intercept requests handled by its
			// service worker. Use Playwright's request API to call the local
			// WP AJAX endpoint directly — it bypasses the service worker and
			// shares the page's auth cookies.
			const nonce = await page.evaluate(
				() => ( window as any ).progressPlanner.nonce
			);

			const response = await page.request.post(
				'/wp-admin/admin-ajax.php',
				{
					form: {
						action: 'progress_planner_save_onboard_data',
						_ajax_nonce: nonce,
						key: 'test-license-for-e2e-testing',
					},
				}
			);

			expect( response.ok() ).toBe( true );

			// Reload to see the dashboard.
			await page.reload( { waitUntil: 'networkidle' } );

			// Verify onboarding completion — dashboard should now be visible.
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

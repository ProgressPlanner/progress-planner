const { test, expect } = require( '@playwright/test' );

test.describe( 'PRPL Tour', () => {
	test( 'Should start the tour when clicking the tour button', async ( {
		page,
	} ) => {
		// Navigate to Progress Planner dashboard
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Click the tour button
		const tourButton = page.locator( '#prpl-start-tour-icon-button' );
		await tourButton.click();

		// Wait for and verify the tour popover is visible
		let tourPopover = page.locator( '.driver-popover' );
		await expect( tourPopover ).toBeVisible();

		// Get the number of steps from the window object
		const numberOfSteps = await page.evaluate(
			() => window.progressPlannerTour.steps.length
		);

		for ( let i = 0; i < numberOfSteps - 1; i++ ) {
			tourPopover = page.locator( '.driver-popover' );

			// Wait for the popover to be visible before interacting
			await expect( tourPopover ).toBeVisible();

			// Click the "Next" button if it's not the last step
			if ( i < numberOfSteps - 1 ) {
				const nextButton = page.locator( '.driver-popover-next-btn' );
				await nextButton.click();
			}
		}

		const nextButton = page.locator( '.driver-popover-next-btn' );

		// Verify the button text changes to "Finish" on the last step
		await expect( nextButton ).toHaveText( 'Finish' );

		// Click the finish button and verify the tour popover closes
		await nextButton.click();
		await expect( tourPopover ).not.toBeVisible();
	} );
} );

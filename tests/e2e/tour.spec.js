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
		const tourPopover = page.locator( '.driver-popover' );
		await expect( tourPopover ).toBeVisible();

		// Get the number of steps from the window object
		const numberOfSteps = await page.evaluate(
			() => window.progressPlannerTour.steps.length
		);

		// Click the next button for each step
		const nextButton = page.locator( '.driver-popover-next-btn' );
		for ( let i = 0; i < numberOfSteps; i++ ) {
			await nextButton.click();
			// Verify the tour popover remains visible for each step
			await expect( tourPopover ).toBeVisible();
		}

		// Verify the button text changes to "Finish" on the last step
		await expect( nextButton ).toHaveText( 'Finish' );

		// Click the finish button and verify the tour popover closes
		await nextButton.click();
		await expect( tourPopover ).not.toBeVisible();
	} );
} );

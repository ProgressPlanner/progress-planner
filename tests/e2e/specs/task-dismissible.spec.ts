import { test, expect } from '../fixtures/base.fixture';

test.describe( 'Dismissible Tasks', () => {
	test( 'should complete dismissible task if present', async ( {
		page,
		tasksApi,
	} ) => {
		// Navigate to Progress Planner dashboard
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Check if complete button exists
		const initialCount = await page
			.locator(
				'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
			)
			.count();

		if ( initialCount > 0 ) {
			const completeButton = page
				.locator(
					'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
				)
				.first();

			// Get the task ID from the button
			const taskId = await completeButton
				.locator( 'xpath=ancestor::li[1]' )
				.getAttribute( 'data-task-id' );

			// Click on the parent of the checkbox (label, because it intercepts pointer events)
			await completeButton.locator( '..' ).click();

			// Wait for animation
			await page.waitForTimeout( 3000 );

			// Verify the task count decreased by 1
			const finalCount = await page
				.locator(
					'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
				)
				.count();
			expect( finalCount ).toBe( initialCount - 1 );

			// Check the final task status via REST API
			if ( taskId ) {
				await tasksApi.expectTaskStatus( taskId, 'trash' );
			}
		}
	} );
} );

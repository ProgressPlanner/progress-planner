const { test, expect } = require( '@playwright/test' );
const { makeAuthenticatedRequest } = require( './utils' );

test.describe( 'PRPL Dismissable Tasks', () => {
	test( 'Complete dismissable task if present', async ( {
		page,
		request,
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
				.locator( 'xpath=ancestor::li[1]' ) // .closest("li"), but playwright doesn't support it
				.getAttribute( 'data-task-id' );

			// Click the on the parent of the checkbox (label, because it intercepts pointer events)
			await completeButton.locator( '..' ).click(); // parent(), but playwright doesn't support it

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
			const completedResponse = await makeAuthenticatedRequest(
				page,
				request,
				`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
			);
			const completedTasks = await completedResponse.json();

			// Find the completed task
			const completedTask = completedTasks.find(
				( task ) => task.task_id === taskId
			);
			expect( completedTask ).toBeDefined();
			expect( completedTask.post_status ).toBe( 'trash' );
		}
	} );
} );

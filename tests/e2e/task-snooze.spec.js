const { test, expect } = require( '@playwright/test' );
const { makeAuthenticatedRequest } = require( './utils' );

test.describe( 'PRPL Task Snooze', () => {
	test( 'Snooze a task for one week', async ( { page, request } ) => {
		// Navigate to Progress Planner dashboard with show all tasks parameter
		await page.goto(
			`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner&prpl_show_all_suggested_tasks=99`
		);
		await page.waitForLoadState( 'networkidle' );

		// Get initial tasks
		const response = await makeAuthenticatedRequest(
			page,
			request,
			`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
		);
		const initialTasks = await response.json();

		// Snooze task ID, Save Settings should be always available.
		const snoozeTaskId = 'settings-saved';

		// Find a task that's not completed or snoozed
		const taskToSnooze = initialTasks.find(
			( task ) => task.task_id === snoozeTaskId
		);

		if ( taskToSnooze ) {
			console.log( 'Snoozing task:', taskToSnooze.task_id );
			// Hover over the task to show actions
			const taskElement = page.locator(
				`li[data-task-id="${ taskToSnooze.task_id }"]`
			);
			await taskElement.hover();

			// Click the snooze button
			const snoozeButton = taskElement.locator(
				'button[data-action="snooze"]'
			);
			await snoozeButton.click();

			// Click the radio group to show options
			const radioGroup = taskElement.locator(
				'button.prpl-toggle-radio-group'
			);
			await radioGroup.click();

			// Select 1 week duration by clicking the label
			await page.evaluate( ( taskToBeSnoozed ) => {
				const radio = document.querySelector(
					`li[data-task-id="${ taskToBeSnoozed.task_id }"] .prpl-snooze-duration-radio-group input[type="radio"][value="1-week"]`
				);
				const label = radio.closest( 'label' );
				label.click();
			}, taskToSnooze );

			// Wait for the API call to complete
			await page.waitForLoadState( 'networkidle' );

			// Wait for the task to be snoozed
			await page.waitForTimeout( 1000 );

			// Verify task status via REST API
			const updatedResponse = await makeAuthenticatedRequest(
				page,
				request,
				`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
			);
			const updatedTasks = await updatedResponse.json();
			const updatedTask = updatedTasks.find(
				( task ) => task.task_id === taskToSnooze.task_id
			);
			expect( updatedTask.status ).toBe( 'snoozed' );
		}
	} );
} );

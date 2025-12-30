import { test, expect } from '../fixtures/base.fixture';

test.describe( 'Task Snooze', () => {
	test( 'should snooze a task for 1 week', async ( { page, tasksApi } ) => {
		// Navigate with show all recommendations to ensure we have tasks
		await page.goto(
			'/wp-admin/admin.php?page=progress-planner&prpl_show_all_recommendations'
		);
		await page.waitForLoadState( 'domcontentloaded' );

		// Wait for the page to settle
		await page.waitForTimeout( 2000 );

		// Use a known task that should always be available: settings-saved
		const snoozeTaskId = 'settings-saved';

		// Verify the task exists and is active
		const task = await tasksApi.getTask( snoozeTaskId );
		if ( ! task || task.post_status !== 'publish' ) {
			console.log(
				`Task ${ snoozeTaskId } not available (status: ${
					task?.post_status || 'not found'
				}), skipping`
			);
			test.skip();
			return;
		}

		await test.step( 'Snooze the task for 1 week', async () => {
			const taskItem = page.locator(
				`li[data-task-id="${ snoozeTaskId }"]`
			);
			await expect( taskItem ).toBeVisible( { timeout: 10000 } );
			await taskItem.hover();

			// Click snooze button
			const snoozeButton = taskItem.locator(
				'button[data-action="snooze"]'
			);
			await snoozeButton.click();

			// Open radio group
			const radioGroup = taskItem.locator(
				'button.prpl-toggle-radio-group'
			);
			await radioGroup.click();

			// Select 1 week duration by clicking the label
			await page.evaluate( ( taskId ) => {
				const radio = document.querySelector(
					`li[data-task-id="${ taskId }"] .prpl-snooze-duration-radio-group input[type="radio"][value="1-week"]`
				) as HTMLInputElement;
				const label = radio?.closest( 'label' );
				label?.click();
			}, snoozeTaskId );

			// Wait for the API call to complete
			await page.waitForTimeout( 2000 );
		} );

		await test.step( 'Verify task is snoozed via API', async () => {
			const updatedTask = await tasksApi.getTask( snoozeTaskId );
			expect( updatedTask?.post_status ).toBe( 'future' );
		} );
	} );
} );

const { test, expect } = require( '@playwright/test' );

const TEST_TASK_TEXT = 'Task to be completed';

test.describe( 'PRPL Complete User Task', () => {
	test( 'Mark task as completed and verify', async ( { page } ) => {
		try {
			// Navigate to Progress Planner dashboard
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Create a new task
			await page.fill( '#new-todo-content', TEST_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 500 );

			// Get the new task
			const todoItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			const taskId = await todoItem.getAttribute( 'data-task-id' );
			const taskSelector = `li[data-task-id="${ taskId }"]`;

			// Verify task was created
			await expect( todoItem.locator( 'h3 > span' ) ).toHaveText(
				TEST_TASK_TEXT
			);

			// Click the checkbox to complete the task
			await todoItem.locator( '.prpl-suggested-task-checkbox' ).click();
			await page.waitForTimeout( 500 );

			// Verify task disappeared from active list
			await expect(
				page.locator( `ul#todo-list ${ taskSelector }` )
			).toHaveCount( 0 );

			// Open completed tasks if not already open
			await page.locator( 'details#todo-list-completed-details' ).click();

			// Verify task appears in completed list
			const completedTask = page.locator(
				`ul#todo-list-completed ${ taskSelector }`
			);
			await expect( completedTask ).toBeVisible();
			await expect( completedTask.locator( 'h3 > span' ) ).toHaveText(
				TEST_TASK_TEXT
			);

			// Verify checkbox is checked
			await expect(
				completedTask.locator( '.prpl-suggested-task-checkbox' )
			).toBeChecked();

			// Reload page and verify persistence
			await page.reload();
			await page.waitForLoadState( 'networkidle' );

			// Open completed tasks again
			await page.locator( 'details#todo-list-completed-details' ).click();

			// Verify task is still in completed list
			const reloadedCompletedTask = page.locator(
				`ul#todo-list-completed ${ taskSelector }`
			);
			await expect( reloadedCompletedTask ).toBeVisible();
			await expect(
				reloadedCompletedTask.locator( 'h3 > span' )
			).toHaveText( TEST_TASK_TEXT );
			await expect(
				reloadedCompletedTask.locator( '.prpl-suggested-task-checkbox' )
			).toBeChecked();
		} catch ( error ) {
			console.error( 'Error in Complete task test:', error );
			console.error( 'Current page URL:', page.url() );
			console.error( 'Current page content:', await page.content() );
			throw error;
		}
	} );
} );

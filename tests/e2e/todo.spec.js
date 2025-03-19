const { test, expect } = require( '@playwright/test' );

const TEST_TASK_TEXT = 'My test task';

test.describe( 'PRPL Add / Remove User Task', () => {
	test( 'Add new user task', async ( { page } ) => {
		try {
			// Navigate to Progress Planner dashboard
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Fill in the new todo input
			await page.fill( '#new-todo-content', TEST_TASK_TEXT );

			// Submit the form (press Enter)
			await page.keyboard.press( 'Enter' );

			// Add a small delay to ensure the UI updates
			await page.waitForTimeout( 500 );

			// Wait for the new todo item to appear
			const todoItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			const taskId = await todoItem.getAttribute( 'data-task-id' );
			const taskSelector = `ul#todo-list > prpl-suggested-task li[data-task-id="${ taskId }"]`; // Cache the task selector for later use

			await expect( todoItem ).toBeVisible();

			// Verify the content
			await expect( todoItem.locator( 'h3 > span' ) ).toHaveText(
				TEST_TASK_TEXT
			);

			// Reload the page
			await page.reload();

			// Re-query and verify the todo item after reload
			const reloadedTodoItem = page.locator(
				`${ taskSelector } h3 > span`
			);
			await expect( reloadedTodoItem ).toBeVisible();
			await expect( reloadedTodoItem ).toHaveText( TEST_TASK_TEXT );

			// Hover over the todo item
			await reloadedTodoItem.hover();

			// Click the trash button and wait for network idle
			const trashButton = page.locator( `${ taskSelector } .trash` );
			await trashButton.click();
			await page.waitForLoadState( 'networkidle' );

			// Wait for the item to be removed and verify
			const todoItemsAfterDelete = page.locator(
				`${ taskSelector } h3 > span`
			);

			// Add a small delay to ensure the UI updates
			await page.waitForTimeout( 1000 );

			// Verify the item is removed
			await expect( todoItemsAfterDelete ).toHaveCount( 0 );

			// Reload the page
			await page.reload();
			await page.waitForLoadState( 'networkidle' );

			// Re-query and verify the todo item is still removed after reload
			const removedTodoItem = page.locator(
				`${ taskSelector } h3 > span`
			);
			await expect( removedTodoItem ).toHaveCount( 0 );
		} catch ( error ) {
			console.error( 'Error in Add new todo item test:', error );
			console.error( 'Current page URL:', page.url() );
			console.error( 'Current page content:', await page.content() );
			throw error;
		}
	} );
} );

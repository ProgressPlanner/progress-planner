const { test: base, expect } = require( '@playwright/test' );

const TEST_TASK_TEXT = 'Task to be completed';

// Create a custom fixture to share data between tests
const test = base.extend( {
	taskSelector: [
		async ( { page }, use ) => {
			// Navigate and create the task
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			await page.fill( '#new-todo-content', TEST_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 500 );

			// Get the task selector
			const todoItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			const taskId = await todoItem.getAttribute( 'data-task-id' );
			const taskSelector = `li[data-task-id="${ taskId }"]`;

			// Share the selector with the test
			await use( taskSelector );
		},
		{ auto: true },
	], // auto: true means this fixture runs before each test
} );

test.describe( 'PRPL Complete User Task', () => {
	test( 'Mark as completed', async ( { page, taskSelector } ) => {
		// Verify task was created
		const todoItem = page.locator( `ul#todo-list ${ taskSelector }` );
		await expect( todoItem.locator( 'h3 > span' ) ).toHaveText(
			TEST_TASK_TEXT
		);

		// Click the checkbox to complete the task
		await todoItem.locator( '.prpl-suggested-task-checkbox' ).click();
		await page.waitForTimeout( 1000 );

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
		await expect(
			completedTask.locator( '.prpl-suggested-task-checkbox' )
		).toBeChecked();
	} );

	test( 'Verify completed task persists after reload', async ( {
		page,
		taskSelector,
	} ) => {
		// Reload page
		await page.reload();
		await page.waitForLoadState( 'networkidle' );

		// Verify task is not in active list
		await expect(
			page.locator( `ul#todo-list ${ taskSelector }` )
		).toHaveCount( 0 );

		// Open completed tasks
		await page.locator( 'details#todo-list-completed-details' ).click();

		// Verify task is still in completed list with correct state
		const completedTask = page.locator(
			`ul#todo-list-completed ${ taskSelector }`
		);
		await expect( completedTask ).toBeVisible();
		await expect( completedTask.locator( 'h3 > span' ) ).toHaveText(
			TEST_TASK_TEXT
		);
		await expect(
			completedTask.locator( '.prpl-suggested-task-checkbox' )
		).toBeChecked();
	} );
} );

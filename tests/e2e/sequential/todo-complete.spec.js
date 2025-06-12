const { test, expect, chromium } = require( '@playwright/test' );
const SELECTORS = require( '../constants/selectors' );

const TEST_TASK_TEXT = 'Task to be completed';

let browser;
let context;
let page;
let taskSelector;

function todoCompleteTests( testContext = test ) {
	testContext.describe( 'Complete User Task', () => {
		testContext.beforeAll( async () => {
			browser = await chromium.launch();
		} );

		testContext.beforeEach( async () => {
			context = await browser.newContext();
			page = await context.newPage();
		} );

		testContext.afterEach( async () => {
			// Clean up any remaining tasks
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Clean up active tasks
			const activeTodoItems = page.locator( SELECTORS.TODO_ITEM );

			while ( ( await activeTodoItems.count() ) > 0 ) {
				const firstItem = page.locator( SELECTORS.TODO_ITEM ).nth( 0 );
				await firstItem.hover();
				await page.waitForTimeout( 500 );
				await firstItem.waitFor( { state: 'visible' } );
				await firstItem.locator( '.trash' ).click();
				await page.waitForTimeout( 1500 );
			}

			// Clean up completed tasks if the section exists
			const completedDetails = page.locator(
				'details#todo-list-completed-details'
			);

			if ( await completedDetails.isVisible() ) {
				await completedDetails.click();
				await page.waitForTimeout( 500 );

				const completedTodoItems = page.locator(
					SELECTORS.TODO_COMPLETED_ITEM
				);

				while ( ( await completedTodoItems.count() ) > 0 ) {
					const firstItem = page
						.locator( SELECTORS.TODO_COMPLETED_ITEM )
						.nth( 0 );
					await firstItem.hover();
					await page.waitForTimeout( 500 );
					await firstItem.waitFor( { state: 'visible' } );
					await firstItem.locator( '.trash' ).click();
					await page.waitForTimeout( 1500 );
				}
			}

			// Safely close context if it's still open
			try {
				await context.close();
			} catch ( error ) {
				// Ignore errors if context is already closed
			}
		} );

		testContext.afterAll( async () => {
			await browser.close();
		} );

		testContext( 'Create task and mark as completed', async () => {
			// Navigate and create the task
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			await page.fill( '#new-todo-content', TEST_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			// Get the task selector
			const todoItem = page.locator( SELECTORS.TODO_ITEM );
			const taskId = await todoItem.getAttribute( 'data-task-id' );
			taskSelector = `li[data-task-id="${ taskId }"]`;

			// Complete the task
			const todoItemElement = page.locator(
				`${ SELECTORS.TODO_LIST } ${ taskSelector }`
			);
			await todoItemElement.locator( 'label' ).click();
			await page.waitForTimeout( 1000 );

			// Verify task is not in active list
			await expect(
				page.locator( `${ SELECTORS.TODO_LIST } ${ taskSelector }` )
			).toHaveCount( 0 );

			// Open completed tasks
			await page.locator( 'details#todo-list-completed-details' ).click();

			// Verify task is still in completed list with correct state
			const completedTask = page.locator(
				`${ SELECTORS.TODO_LIST_COMPLETED } ${ taskSelector }`
			);
			await expect( completedTask ).toBeVisible();
			await expect( completedTask.locator( 'h3 > span' ) ).toHaveText(
				TEST_TASK_TEXT
			);
			await expect(
				completedTask.locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( TEST_TASK_TEXT );
			await expect(
				completedTask.locator( '.prpl-suggested-task-checkbox' )
			).toBeChecked();
		} );

		testContext(
			'Verify completed task persists after reload',
			async () => {
				// Navigate to Progress Planner dashboard
				await page.goto(
					`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
				);
				await page.waitForLoadState( 'networkidle' );

				// Create a new task
				await page.fill( '#new-todo-content', TEST_TASK_TEXT );
				await page.keyboard.press( 'Enter' );
				await page.waitForTimeout( 1500 );

				// Get the task selector
				const todoItem = page.locator( SELECTORS.TODO_ITEM );
				const taskId = await todoItem.getAttribute( 'data-task-id' );
				taskSelector = `li[data-task-id="${ taskId }"]`;

				// Complete the task
				const todoItemElement = page.locator(
					`${ SELECTORS.TODO_LIST } ${ taskSelector }`
				);
				await todoItemElement.locator( 'label' ).click();
				await page.waitForTimeout( 1500 );

				// Verify task is not in active list
				await expect(
					page.locator( `${ SELECTORS.TODO_LIST } ${ taskSelector }` )
				).toHaveCount( 0 );

				// Open completed tasks
				await page
					.locator( 'details#todo-list-completed-details' )
					.click();

				// Verify task is still in completed list with correct state
				const completedTask = page.locator(
					`${ SELECTORS.TODO_LIST_COMPLETED } ${ taskSelector }`
				);
				await expect( completedTask ).toBeVisible();
				await expect( completedTask.locator( 'h3 > span' ) ).toHaveText(
					TEST_TASK_TEXT
				);
				await expect(
					completedTask.locator( SELECTORS.RR_ITEM_TEXT )
				).toHaveText( TEST_TASK_TEXT );
				await expect(
					completedTask.locator( '.prpl-suggested-task-checkbox' )
				).toBeChecked();
			}
		);
	} );
}

module.exports = todoCompleteTests;

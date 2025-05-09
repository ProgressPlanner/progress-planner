const { test, expect, chromium } = require( '@playwright/test' );
const SELECTORS = require( '../constants/selectors' );

const CREATE_TASK_TEXT = 'Test task to create';
const DELETE_TASK_TEXT = 'Test task to delete';

let browser;
let context;
let page;

function todoTests( testContext = test ) {
	testContext.describe( 'PRPL Create and Delete Todo', () => {
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
			const activeTodoItems = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);

			while ( ( await activeTodoItems.count() ) > 0 ) {
				const firstItem = activeTodoItems.first();
				await firstItem.hover();
				await page.waitForTimeout( 500 );
				await firstItem.waitFor( { state: 'visible' } );
				await firstItem.locator( '.trash' ).click();
				await page.waitForTimeout( 500 );
			}

			// Clean up completed tasks if the section exists
			const completedDetails = page.locator(
				'details#todo-list-completed-details'
			);

			if ( await completedDetails.isVisible() ) {
				await completedDetails.click();
				await page.waitForTimeout( 500 );

				const completedTodoItems = page.locator(
					'ul#todo-list-completed > prpl-suggested-task li'
				);

				while ( ( await completedTodoItems.count() ) > 0 ) {
					const firstItem = completedTodoItems.first();
					await firstItem.hover();
					await page.waitForTimeout( 500 );
					await firstItem.waitFor( { state: 'visible' } );
					await firstItem.locator( '.trash' ).click();
					await page.waitForTimeout( 500 );
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

		testContext( 'Create a new todo', async () => {
			// Navigate to Progress Planner dashboard
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Fill in the new todo input
			await page.fill( '#new-todo-content', CREATE_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 500 );

			// Verify the todo was created
			const todoItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			await expect( todoItem ).toHaveCount( 1 );
			await expect(
				todoItem.locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( CREATE_TASK_TEXT );
		} );

		testContext( 'Delete a todo', async () => {
			// Navigate to Progress Planner dashboard
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Create a todo to delete
			await page.fill( '#new-todo-content', DELETE_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 500 );

			// Wait for the delete button to be visible and click it
			const deleteItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			await deleteItem.hover();
			await deleteItem.waitFor( { state: 'visible' } );
			await deleteItem.locator( '.trash' ).click();
			await page.waitForTimeout( 500 );

			// Verify the todo was deleted
			const todoItem = page.locator(
				'ul#todo-list > prpl-suggested-task li'
			);
			await expect( todoItem ).toHaveCount( 0 );
		} );
	} );
}

module.exports = todoTests;

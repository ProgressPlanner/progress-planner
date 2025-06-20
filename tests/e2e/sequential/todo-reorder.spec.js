const { test, expect, chromium } = require( '@playwright/test' );
const SELECTORS = require( '../constants/selectors' );
const { cleanUpPlannerTasks } = require( '../helpers/cleanup' );

const FIRST_TASK_TEXT = 'First task to reorder';
const SECOND_TASK_TEXT = 'Second task to reorder';
const THIRD_TASK_TEXT = 'Third task to reorder';

let browser;
let context;
let page;

function todoReorderTests( testContext = test ) {
	testContext.describe( 'PRPL Todo Reorder', () => {
		testContext.beforeAll( async () => {
			browser = await chromium.launch();
		} );

		testContext.beforeEach( async () => {
			context = await browser.newContext();
			page = await context.newPage();
		} );

		testContext.afterEach( async () => {
			await cleanUpPlannerTasks( {
				page,
				context,
				baseUrl: process.env.WORDPRESS_URL,
			} );
		} );

		testContext.afterAll( async () => {
			await browser.close();
		} );

		testContext( 'Reorder todo items', async () => {
			// Navigate to Progress Planner dashboard
			await page.goto(
				`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
			);
			await page.waitForLoadState( 'networkidle' );

			// Create first task
			await page.fill( '#new-todo-content', FIRST_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			// Create second task
			await page.fill( '#new-todo-content', SECOND_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			// Create third task
			await page.fill( '#new-todo-content', THIRD_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			// Get all todo items
			const todoItems = page.locator( SELECTORS.TODO_ITEM );

			// Verify initial order
			const items = await todoItems.all();
			await expect(
				items[ 0 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( FIRST_TASK_TEXT );
			await expect(
				items[ 1 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( SECOND_TASK_TEXT );
			await expect(
				items[ 2 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( THIRD_TASK_TEXT );

			// Hover over second item and click move down button
			await items[ 1 ].hover();
			await items[ 1 ]
				.locator( '.prpl-suggested-task-button.move-down' )
				.click();
			await page.waitForTimeout( 1500 );

			// Verify new order
			const reorderedItems = await todoItems.all();
			await expect(
				reorderedItems[ 0 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( FIRST_TASK_TEXT );
			await expect(
				reorderedItems[ 1 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( THIRD_TASK_TEXT );
			await expect(
				reorderedItems[ 2 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( SECOND_TASK_TEXT );

			// Reload page
			await page.reload();
			await page.waitForLoadState( 'networkidle' );

			// Verify order persists after reload
			const persistedItems = await todoItems.all();
			await expect(
				persistedItems[ 0 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( FIRST_TASK_TEXT );
			await expect(
				persistedItems[ 1 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( THIRD_TASK_TEXT );
			await expect(
				persistedItems[ 2 ].locator( SELECTORS.RR_ITEM_TEXT )
			).toHaveText( SECOND_TASK_TEXT );
		} );
	} );
}

module.exports = todoReorderTests;

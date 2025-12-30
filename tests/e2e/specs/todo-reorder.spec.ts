import { test, expect } from '../fixtures/base.fixture';

const FIRST_TASK_TEXT = 'First task to reorder';
const SECOND_TASK_TEXT = 'Second task to reorder';
const THIRD_TASK_TEXT = 'Third task to reorder';

test.describe( 'Todo Reorder Operations', () => {
	// Enable cleanup for this test suite
	test.use( { cleanupAfterTest: true } );

	test( 'should reorder todo items', async ( { page, dashboard } ) => {
		await test.step( 'Create three todos', async () => {
			await page.fill( '#new-todo-content', FIRST_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			await page.fill( '#new-todo-content', SECOND_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );

			await page.fill( '#new-todo-content', THIRD_TASK_TEXT );
			await page.keyboard.press( 'Enter' );
			await page.waitForTimeout( 1500 );
		} );

		await test.step( 'Verify initial order', async () => {
			const todoItems = page.locator( 'ul#todo-list > li' );
			const items = await todoItems.all();

			await expect( items[ 0 ].locator( 'h3 > span' ) ).toHaveText(
				FIRST_TASK_TEXT
			);
			await expect( items[ 1 ].locator( 'h3 > span' ) ).toHaveText(
				SECOND_TASK_TEXT
			);
			await expect( items[ 2 ].locator( 'h3 > span' ) ).toHaveText(
				THIRD_TASK_TEXT
			);
		} );

		await test.step( 'Move second item down', async () => {
			const todoItems = page.locator( 'ul#todo-list > li' );
			const items = await todoItems.all();

			await items[ 1 ].hover();
			await items[ 1 ]
				.locator( '.prpl-suggested-task-button.move-down' )
				.click();
			await page.waitForTimeout( 1500 );
		} );

		await test.step( 'Verify new order', async () => {
			const todoItems = page.locator( 'ul#todo-list > li' );
			const reorderedItems = await todoItems.all();

			await expect(
				reorderedItems[ 0 ].locator( 'h3 > span' )
			).toHaveText( FIRST_TASK_TEXT );
			await expect(
				reorderedItems[ 1 ].locator( 'h3 > span' )
			).toHaveText( THIRD_TASK_TEXT );
			await expect(
				reorderedItems[ 2 ].locator( 'h3 > span' )
			).toHaveText( SECOND_TASK_TEXT );
		} );

		await test.step( 'Reload page and verify order persists', async () => {
			await page.reload();
			await page.waitForLoadState( 'networkidle' );

			const todoItems = page.locator( 'ul#todo-list > li' );
			const persistedItems = await todoItems.all();

			await expect(
				persistedItems[ 0 ].locator( 'h3 > span' )
			).toHaveText( FIRST_TASK_TEXT );
			await expect(
				persistedItems[ 1 ].locator( 'h3 > span' )
			).toHaveText( THIRD_TASK_TEXT );
			await expect(
				persistedItems[ 2 ].locator( 'h3 > span' )
			).toHaveText( SECOND_TASK_TEXT );
		} );
	} );
} );

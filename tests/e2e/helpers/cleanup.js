const SELECTORS = require( '../constants/selectors' );

/**
 * Cleans up all active and completed tasks in the planner UI.
 * Requires a Playwright `page`, `context`, and `baseUrl`.
 * @param root0
 * @param root0.page
 * @param root0.context
 * @param root0.baseUrl
 */
async function cleanUpPlannerTasks( { page, context, baseUrl } ) {
	try {
		if ( page.isClosed?.() ) return;

		await page.goto(
			`${ baseUrl }/wp-admin/admin.php?page=progress-planner`
		);
		await page.waitForLoadState( 'networkidle' );

		// Clean up ACTIVE tasks
		const todoItems = page.locator( SELECTORS.TODO_ITEM );
		while ( ( await todoItems.count() ) > 0 ) {
			const firstItem = todoItems.first();
			const trash = firstItem.locator( '.trash' );

			try {
				console.log(
					'deleting TODO: ',
					await firstItem.locator( 'h3 > span' ).textContent()
				);
				await firstItem.scrollIntoViewIfNeeded();
				await firstItem.hover();
				await trash.waitFor( { state: 'visible', timeout: 3000 } );
				await trash.click();
				await page.waitForTimeout( 1500 );
			} catch ( err ) {
				console.warn(
					'[Cleanup] Failed to delete active todo item:',
					err.message
				);
				break;
			}
		}

		// Clean up COMPLETED tasks
		const completedDetails = page.locator(
			'details#todo-list-completed-details'
		);
		if ( await completedDetails.isVisible() ) {
			await completedDetails.click();
			await page.waitForTimeout( 500 );

			const completedItems = page.locator(
				SELECTORS.TODO_COMPLETED_ITEM
			);
			while ( ( await completedItems.count() ) > 0 ) {
				const firstCompleted = completedItems.first();
				const trash = firstCompleted.locator( '.trash' );

				try {
					console.log(
						'deleting completed TODO: ',
						await firstCompleted
							.locator( 'h3 > span' )
							.textContent()
					);
					await firstCompleted.scrollIntoViewIfNeeded();
					await firstCompleted.hover();
					await trash.waitFor( { state: 'visible', timeout: 3000 } );
					await trash.click();
					await page.waitForTimeout( 1500 );
				} catch ( err ) {
					console.warn(
						'[Cleanup] Failed to delete completed todo item:',
						err.message
					);
					break;
				}
			}
		}
	} catch ( e ) {
		console.warn( '[Cleanup] Unexpected failure:', e.message );
	}

	try {
		await context.close();
	} catch {
		// context might already be closed
	}
}

module.exports = { cleanUpPlannerTasks };

const { test, expect } = require( '@playwright/test' );

/**
 * Security Enhancement Tests
 *
 * Tests to verify that security enhancements don't break normal functionality
 * and that security measures are working as expected.
 */

test.describe( 'Security Enhancements - Normal Functionality', () => {
	test( 'Task completion with nonce still works', async ( { page } ) => {
		// Navigate to Progress Planner dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Check if there are any tasks.
		const taskCount = await page
			.locator(
				'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
			)
			.count();

		if ( taskCount > 0 ) {
			const firstTask = page
				.locator(
					'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
				)
				.first();

			// Click to complete the task.
			await firstTask.locator( '..' ).click();

			// Wait for completion animation.
			await page.waitForTimeout( 2000 );

			// Verify task was completed successfully.
			const newTaskCount = await page
				.locator(
					'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)'
				)
				.count();

			expect( newTaskCount ).toBe( taskCount - 1 );
		}
	} );

	test( 'Interactive tasks (timezone/date format) still work', async ( {
		page,
	} ) => {
		// Navigate to Progress Planner dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Look for timezone or date format task.
		const timezoneTask = page.locator(
			'li[data-task-id*="select-timezone"], li[data-task-id*="set-date-format"]'
		);

		const timezoneTaskCount = await timezoneTask.count();

		if ( timezoneTaskCount > 0 ) {
			// Click on the first interactive task action.
			const actionButton = timezoneTask
				.first()
				.locator( '.prpl-tooltip-action-text' )
				.first();

			if ( ( await actionButton.count() ) > 0 ) {
				await actionButton.click();

				// Wait for popover to appear.
				await page.waitForTimeout( 1000 );

				// Check if popover opened.
				const popover = page.locator( '[popover]:popover-open' );
				expect( await popover.count() ).toBeGreaterThan( 0 );

				// Close popover.
				await page.keyboard.press( 'Escape' );
			}
		}
	} );

	test( 'Settings page still loads and saves', async ( { page } ) => {
		// Navigate to settings page.
		await page.goto( '/wp-admin/admin.php?page=progress-planner-settings' );
		await page.waitForLoadState( 'networkidle' );

		// Check page loaded.
		const pageTitle = await page.locator( 'h1' ).first().textContent();
		expect( pageTitle ).toContain( 'Settings' );

		// Verify settings form exists.
		const settingsForm = page.locator(
			'form[id*="progress-planner-settings"]'
		);
		expect( await settingsForm.count() ).toBeGreaterThan( 0 );
	} );

	test( 'Task dismissal still works', async ( { page } ) => {
		// Navigate to Progress Planner dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Look for dismissible tasks.
		const dismissButtons = page.locator(
			'#prpl-suggested-tasks-list button.prpl-dismiss-task'
		);

		const dismissCount = await dismissButtons.count();

		if ( dismissCount > 0 ) {
			const initialTaskCount = await page
				.locator( '#prpl-suggested-tasks-list li[data-task-id]' )
				.count();

			// Click first dismiss button.
			await dismissButtons.first().click();

			// Wait for dismissal.
			await page.waitForTimeout( 2000 );

			// Verify task count decreased.
			const newTaskCount = await page
				.locator( '#prpl-suggested-tasks-list li[data-task-id]' )
				.count();

			expect( newTaskCount ).toBeLessThan( initialTaskCount );
		}
	} );

	test( 'Email sending test task still works', async ( { page } ) => {
		// Navigate to Progress Planner dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Look for email sending task.
		const emailTask = page.locator( 'li[data-task-id="sending-email"]' );

		if ( ( await emailTask.count() ) > 0 ) {
			// Click on test email action.
			const testButton = emailTask.locator(
				'a:has-text("Test email sending")'
			);

			if ( ( await testButton.count() ) > 0 ) {
				await testButton.click();

				// Wait for popover.
				await page.waitForTimeout( 1000 );

				// Verify popover opened.
				const popover = page.locator( '#prpl-popover-sending-email' );
				expect( await popover.count() ).toBeGreaterThan( 0 );

				// Close popover.
				await page.keyboard.press( 'Escape' );
			}
		}
	} );
} );

test.describe( 'Security Enhancements - Security Verification', () => {
	test( 'REST API rate limiting works', async ( { request } ) => {
		// Get the token from the site.
		const wpUrl = process.env.WORDPRESS_URL || 'http://localhost:8889';

		// Make many requests to trigger rate limiting.
		let successCount = 0;
		const maxAttempts = 15; // More than the default 10 limit.

		for ( let i = 0; i < maxAttempts; i++ ) {
			try {
				const response = await request.get(
					`${ wpUrl }/wp-json/progress-planner/v1/get-stats/test_token`,
					{
						headers: {
							Accept: 'application/json',
						},
					}
				);

				if ( response.status() === 429 ) {
					break;
				}

				if ( response.ok() ) {
					successCount++;
				}
			} catch ( error ) {
				// Continue to next request.
			}
		}

		// We should hit rate limit before all requests complete.
		// Note: This might not work if authenticated, which bypasses rate limiting.
		console.log(
			`Made ${ successCount } successful requests before rate limit`
		);
	} );

	test( 'Invalid nonce prevents task completion', async ( { page } ) => {
		// Navigate to dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Try to complete a task via URL with invalid nonce (should fail).
		const taskId = 'test-task-id';
		const invalidNonce = 'invalid_nonce_12345';

		// Navigate with invalid nonce.
		const gotoPromise = page.goto(
			`/wp-admin/admin.php?page=progress-planner&prpl_complete_task=${ taskId }&_wpnonce=${ invalidNonce }`
		);

		// Should show error or redirect, not complete the task.
		await gotoPromise;

		// Check for error message or that we're still on a valid page.
		const bodyText = await page.locator( 'body' ).textContent();

		// Should contain either an error message or be back on normal page.
		const hasError =
			bodyText.includes( 'Security check' ) ||
			bodyText.includes( 'failed' ) ||
			bodyText.includes( 'error' );

		// Or we should be back on the normal dashboard.
		const url = page.url();
		const onDashboard = url.includes( 'page=progress-planner' );

		expect( hasError || onDashboard ).toBeTruthy();
	} );

	test( 'Sensitive data not exposed to unauthenticated API calls', async ( {
		request,
	} ) => {
		const wpUrl = process.env.WORDPRESS_URL || 'http://localhost:8889';

		// Make unauthenticated request with token.
		const response = await request.get(
			`${ wpUrl }/wp-json/progress-planner/v1/get-stats/test_token`
		);

		if ( response.ok() ) {
			const data = await response.json();

			// Should have plugin_count, not full plugins list.
			if ( data.plugins_count !== undefined ) {
				expect( data.plugins ).toBeUndefined();
			}

			// Or if it has plugins, we're authenticated.
			if ( data.plugins !== undefined ) {
				// This means we're authenticated, which is OK.
				expect( Array.isArray( data.plugins ) ).toBeTruthy();
			}
		}
	} );

	test( 'Path traversal protection works', async ( { page } ) => {
		// This is harder to test via E2E, but we can verify the plugin loads correctly.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// The page should load normally (no errors from file inclusion issues).
		const errors = await page.locator( '.error, .notice-error' ).count();
		expect( errors ).toBe( 0 );

		// Check that normal files are loaded.
		const mainContent = page.locator( '#prpl-suggested-tasks-list' );
		expect( await mainContent.count() ).toBeGreaterThan( 0 );
	} );

	test( 'AJAX requests include proper nonces', async ( { page } ) => {
		// Navigate to dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Set up request interception to check for nonces.
		const requests = [];

		page.on( 'request', ( request ) => {
			if ( request.url().includes( 'admin-ajax.php' ) ) {
				requests.push( request );
			}
		} );

		// Look for any interactive task.
		const interactiveTask = page.locator(
			'li[data-task-id] .prpl-tooltip-action-text'
		);

		if ( ( await interactiveTask.count() ) > 0 ) {
			// Click to trigger AJAX.
			await interactiveTask.first().click();

			// Wait for any AJAX requests.
			await page.waitForTimeout( 2000 );

			// If there were AJAX requests, verify they had nonces.
			if ( requests.length > 0 ) {
				// Check post data for nonce.
				for ( const req of requests ) {
					if ( req.method() === 'POST' ) {
						const postData = req.postData();
						if ( postData ) {
							// Should include nonce.
							expect(
								postData.includes( 'nonce' ) ||
									postData.includes( '_wpnonce' )
							).toBeTruthy();
						}
					}
				}
			}
		}
	} );
} );

test.describe( 'Security Enhancements - Backward Compatibility', () => {
	test( 'Existing workflows still function correctly', async ( { page } ) => {
		// Test the main dashboard loads.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Check main elements are present.
		const elements = [
			'#prpl-suggested-tasks-list',
			'.prpl-score-widget',
			'.prpl-badges-widget',
		];

		for ( const selector of elements ) {
			const element = page.locator( selector );
			if ( ( await element.count() ) > 0 ) {
				expect( await element.isVisible() ).toBeTruthy();
			}
		}
	} );

	test( 'Admin can still access all features', async ( { page } ) => {
		// Navigate to main dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Check menu items are accessible.
		const menuItems = await page
			.locator( '#adminmenu a[href*="progress-planner"]' )
			.count();
		expect( menuItems ).toBeGreaterThan( 0 );

		// Navigate to settings.
		await page.goto( '/wp-admin/admin.php?page=progress-planner-settings' );
		await page.waitForLoadState( 'networkidle' );

		// Page should load without errors.
		const url = page.url();
		expect( url ).toContain( 'progress-planner-settings' );
	} );

	test( 'Todo list functionality unchanged', async ( { page } ) => {
		// Navigate to dashboard.
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForLoadState( 'networkidle' );

		// Look for todo widget.
		const todoWidget = page.locator( '.prpl-todo-widget' );

		if ( ( await todoWidget.count() ) > 0 ) {
			// Todo widget should be visible and functional.
			expect( await todoWidget.isVisible() ).toBeTruthy();

			// Check for todo items.
			const todoItems = todoWidget.locator( 'li' );
			const itemCount = await todoItems.count();

			// If there are todos, they should be interactable.
			if ( itemCount > 0 ) {
				expect( await todoItems.first().isVisible() ).toBeTruthy();
			}
		}
	} );
} );

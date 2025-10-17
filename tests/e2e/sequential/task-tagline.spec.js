const { test, expect } = require( '@playwright/test' );
const { makeAuthenticatedRequest } = require( '../utils' );

function taglineTests( testContext = test ) {
	testContext.describe( 'PRPL Complete Task', () => {
		testContext(
			'Complete blog description task',
			async ( { page, request } ) => {
				// First, navigate to Progress Planner dashboard (to init everything)
				await page.goto(
					`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
				);
				await page.waitForLoadState( 'networkidle' );

				// Get initial tasks
				const response = await makeAuthenticatedRequest(
					page,
					request,
					`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
				);
				const responseData = await response.json();

				// Handle both array and object responses
				const initialTasks = Array.isArray( responseData ) ? responseData : ( responseData.tasks || [] );

				// Find the blog description task
				const blogDescriptionTask = initialTasks.find(
					( task ) => task.task_id === 'core-blogdescription'
				);

				// Skip test if the task doesn't exist
				if ( ! blogDescriptionTask ) {
					testContext.skip( true, 'Blog description task not available' );
					return;
				}

				expect( blogDescriptionTask ).toBeDefined();
				expect( blogDescriptionTask.post_status ).toBe( 'publish' );

				// Navigate to WordPress settings
				await page.goto(
					`${ process.env.WORDPRESS_URL }/wp-admin/options-general.php`
				);
				await page.waitForLoadState( 'networkidle' );

				// Fill in the tagline
				await page.fill(
					'#blogdescription',
					'My Awesome Site Description'
				);

				// Save changes
				await page.click( '#submit' );
				await page.waitForLoadState( 'networkidle' );

				// Wait a moment for the task status to update
				await page.waitForTimeout( 1000 );

				// Check the task status again via REST API
				const finalResponse = await makeAuthenticatedRequest(
					page,
					request,
					`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
				);
				const finalResponseData = await finalResponse.json();
				const finalTasks = Array.isArray( finalResponseData ) ? finalResponseData : ( finalResponseData.tasks || [] );

				// Find the blog description task again
				const updatedTask = finalTasks.find(
					( task ) => task.task_id === 'core-blogdescription'
				);
				expect( updatedTask ).toBeDefined();
				expect( updatedTask.post_status ).toBe( 'pending' );

				// Go to Progress Planner dashboard
				await page.goto(
					`${ process.env.WORDPRESS_URL }/wp-admin/admin.php?page=progress-planner`
				);
				await page.waitForLoadState( 'networkidle' );

				// Wait for the widget container to be visible first
				const widgetContainer = page.locator(
					'.prpl-widget-wrapper.prpl-suggested-tasks'
				);
				await expect( widgetContainer ).toBeVisible();

				// Then wait for the tasks to be loaded in the widget
				const tasksList = page.locator(
					'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list'
				);
				await expect( tasksList ).toBeVisible();

				// Wait for the specific task to appear and verify its content
				const taskElement = page.locator(
					`li[data-task-id="core-blogdescription"]`
				);
				await expect( taskElement ).toBeVisible();

				// Wait for the celebration animation and task removal (3s delay + 1s buffer)
				await page.waitForTimeout( 4000 );

				// Verify that the task is removed from the DOM
				await expect( taskElement ).toHaveCount( 0 );

				// Check the final task status via REST API
				const completedResponse = await makeAuthenticatedRequest(
					page,
					request,
					`${ process.env.WORDPRESS_URL }/?rest_route=/progress-planner/v1/tasks`
				);
				const completedResponseData = await completedResponse.json();
				const completedTasks = Array.isArray( completedResponseData ) ? completedResponseData : ( completedResponseData.tasks || [] );

				// Find the blog description task one last time
				const completedTask = completedTasks.find(
					( task ) => task.task_id === 'core-blogdescription'
				);
				expect( completedTask ).toBeDefined();
				expect( completedTask.post_status ).toBe( 'trash' );
			}
		);
	} );
}

module.exports = taglineTests;

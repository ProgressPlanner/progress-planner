import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { YoastSettingsPage } from '../pages/yoast-settings.page';
import { TasksApi } from '../api/tasks.api';

/**
 * Custom fixture types for Progress Planner E2E tests.
 */
type ProgressPlannerFixtures = {
	/**
	 * Dashboard page object with all Progress Planner dashboard functionality.
	 * Automatically navigates to the dashboard.
	 */
	dashboard: DashboardPage;

	/**
	 * Dashboard page object without automatic navigation.
	 * Use when you need to go somewhere else first.
	 */
	dashboardPage: DashboardPage;

	/**
	 * Yoast SEO settings page object.
	 * Use for testing Yoast integration features.
	 */
	yoastSettings: YoastSettingsPage;

	/**
	 * REST API client for direct task manipulation.
	 */
	tasksApi: TasksApi;

	/**
	 * Automatic cleanup after each test.
	 * Set to true to enable.
	 */
	cleanupAfterTest: boolean;
};

/**
 * Extended test with Progress Planner fixtures.
 *
 * Usage:
 * ```ts
 * import { test, expect } from './fixtures/base.fixture';
 *
 * test('my test', async ({ dashboard }) => {
 *   const { taskId } = await dashboard.createTodo('My task');
 *   // ...
 * });
 * ```
 */
export const test = base.extend< ProgressPlannerFixtures >( {
	// Default: no automatic cleanup
	cleanupAfterTest: [ false, { option: true } ],

	// Dashboard page object (no auto-navigation)
	dashboardPage: async ( { page }, use ) => {
		const dashboardPage = new DashboardPage( page );
		await use( dashboardPage );
	},

	// Dashboard with auto-navigation
	dashboard: async ( { page, cleanupAfterTest }, use ) => {
		const dashboard = new DashboardPage( page );
		await dashboard.goto();

		await use( dashboard );

		// Cleanup after test if enabled
		// Note: Cleanup is best-effort and should not affect test results
		if ( cleanupAfterTest ) {
			// Set a short timeout for the entire cleanup operation
			await Promise.race( [
				dashboard.deleteAllTodos().catch( ( err ) => {
					console.warn(
						'[Fixture Cleanup] Failed:',
						( err as Error ).message
					);
				} ),
				new Promise( ( resolve ) => setTimeout( resolve, 10000 ) ), // 10s max for cleanup
			] );
		}
	},

	// Yoast settings page object (no auto-navigation)
	yoastSettings: async ( { page }, use ) => {
		const yoastSettings = new YoastSettingsPage( page );
		await use( yoastSettings );
	},

	// REST API client
	tasksApi: async ( { page, request }, use ) => {
		const api = new TasksApi( page, request );
		await use( api );
	},
} );

export { expect } from '@playwright/test';

// Re-export for convenience
export type { Page, Locator } from '@playwright/test';

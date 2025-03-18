const { test, expect } = require('@playwright/test');

const TEST_TASK_TEXT = 'My test task';

test.describe('PRPL Todo', () => {
	test('Add new todo item', async ({ page }) => {
		try {
			// Navigate to Progress Planner dashboard
			await page.goto(`${process.env.WORDPRESS_URL}/wp-admin/admin.php?page=progress-planner`);
			await page.waitForLoadState('networkidle');

			// Fill in the new todo input
			await page.fill('#new-todo-content', TEST_TASK_TEXT);

			// Submit the form (press Enter)
			await page.keyboard.press('Enter');

			// Wait for the new todo item to appear
			const todoItem = page.locator('ul#todo-list > prpl-suggested-task span');
			await expect(todoItem).toBeVisible();

			// Verify the content
			await expect(todoItem).toHaveText(TEST_TASK_TEXT);

			// Reload the page
			await page.reload();

			// Re-query and verify the todo item after reload
			const reloadedTodoItem = page.locator('ul#todo-list > prpl-suggested-task span');
			await expect(reloadedTodoItem).toBeVisible();
			await expect(reloadedTodoItem).toHaveText(TEST_TASK_TEXT);

			// Click the trash button and wait for network idle
			const trashButton = page.locator('ul#todo-list > prpl-suggested-task .trash');
			await trashButton.click();
			await page.waitForLoadState('networkidle');

			// Wait for the item to be removed and verify
			const todoItemsAfterDelete = page.locator('ul#todo-list > prpl-suggested-task span');

			// Add a small delay to ensure the UI updates
			await page.waitForTimeout(1000);

			// Verify the item is removed
			await expect(todoItemsAfterDelete).toHaveCount(0);

			// Reload the page
			await page.reload();
			await page.waitForLoadState('networkidle');

			// Re-query and verify the todo item is still removed after reload
			const removedTodoItem = page.locator('ul#todo-list > prpl-suggested-task span');
			await expect(removedTodoItem).toHaveCount(0);
		} catch (error) {
			console.error('Error in Add new todo item test:', error);
			console.error('Current page URL:', page.url());
			console.error('Current page content:', await page.content());
			throw error;
		}
	});
});
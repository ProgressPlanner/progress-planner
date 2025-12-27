import { test, expect } from '../fixtures/base.fixture';

const TEST_TASK_TEXT = 'Task to be completed';

test.describe('Todo Completion', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should create task and mark as completed', async ({ page, dashboard }) => {
    let taskSelector: string;

    await test.step('Navigate and create the task', async () => {
      await page.fill('#new-todo-content', TEST_TASK_TEXT);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      // Get the task selector
      const todoItem = page.locator('ul#todo-list > li');
      const taskId = await todoItem.getAttribute('data-task-id');
      taskSelector = `li[data-task-id="${taskId}"]`;
    });

    await test.step('Complete the task', async () => {
      const todoItemElement = page.locator(`ul#todo-list ${taskSelector}`);
      await todoItemElement.locator('label').click();
      await page.waitForTimeout(1000);
    });

    await test.step('Verify task is not in active list', async () => {
      await expect(page.locator(`ul#todo-list ${taskSelector}`)).toHaveCount(0);
    });

    await test.step('Open completed tasks and verify', async () => {
      await page.locator('details#todo-list-completed-details').click();

      // Verify task is in completed list with correct state
      const completedTask = page.locator(`ul#todo-list-completed ${taskSelector}`);
      await expect(completedTask).toBeVisible();
      await expect(completedTask.locator('h3 > span')).toHaveText(TEST_TASK_TEXT);
      await expect(completedTask.locator('.prpl-suggested-task-checkbox')).toBeChecked();
    });
  });

  test('should verify completed task persists after reload', async ({ page, dashboard }) => {
    let taskSelector: string;

    await test.step('Create and complete a task', async () => {
      await page.fill('#new-todo-content', TEST_TASK_TEXT);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      // Get the task selector
      const todoItem = page.locator('ul#todo-list > li');
      const taskId = await todoItem.getAttribute('data-task-id');
      taskSelector = `li[data-task-id="${taskId}"]`;

      // Complete the task
      const todoItemElement = page.locator(`ul#todo-list ${taskSelector}`);
      await todoItemElement.locator('label').click();
      await page.waitForTimeout(1500);

      // Verify task is not in active list
      await expect(page.locator(`ul#todo-list ${taskSelector}`)).toHaveCount(0);

      // Open completed tasks
      await page.locator('details#todo-list-completed-details').click();

      // Verify task is in completed list
      const completedTask = page.locator(`ul#todo-list-completed ${taskSelector}`);
      await expect(completedTask).toBeVisible();
      await expect(completedTask.locator('h3 > span')).toHaveText(TEST_TASK_TEXT);
      await expect(completedTask.locator('.prpl-suggested-task-checkbox')).toBeChecked();
    });
  });
});

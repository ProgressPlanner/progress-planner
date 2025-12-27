import { test, expect } from '../fixtures/base.fixture';

const CREATE_TASK_TEXT = 'Test task to create';
const DELETE_TASK_TEXT = 'Test task to delete';

test.describe('Todo CRUD Operations', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should create a new todo', async ({ page, dashboard }) => {
    await test.step('Create the todo', async () => {
      await page.fill('#new-todo-content', CREATE_TASK_TEXT);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    });

    await test.step('Verify todo was created', async () => {
      const todoItem = page.locator('ul#todo-list > li');
      await expect(todoItem).toHaveCount(1);
      await expect(todoItem.locator('h3 > span')).toHaveText(CREATE_TASK_TEXT);
    });
  });

  test('should delete a todo', async ({ page, dashboard }) => {
    await test.step('Create a todo to delete', async () => {
      await page.fill('#new-todo-content', DELETE_TASK_TEXT);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    });

    await test.step('Delete the todo', async () => {
      const deleteItem = page.locator('ul#todo-list > li');
      await deleteItem.hover();
      await deleteItem.waitFor({ state: 'visible' });
      await deleteItem.locator('.prpl-suggested-task-actions-wrapper .trash').click();
      await page.waitForTimeout(1500);
    });

    await test.step('Verify todo was deleted', async () => {
      const todoItem = page.locator('ul#todo-list > li');
      await expect(todoItem).toHaveCount(0);
    });
  });
});

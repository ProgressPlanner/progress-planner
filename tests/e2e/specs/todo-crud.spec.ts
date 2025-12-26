import { test, expect } from '../fixtures/base.fixture';

test.describe('Todo CRUD Operations', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should create a new todo', async ({ dashboard }) => {
    const taskText = 'Test task created at ' + Date.now();

    await test.step('Create the todo', async () => {
      const { taskId, element } = await dashboard.createTodo(taskText);

      expect(taskId).toBeTruthy();
      await expect(element).toBeVisible();
    });

    await test.step('Verify todo text is correct', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(1);

      const text = await dashboard.getTodoText(items[0]);
      expect(text).toBe(taskText);
    });
  });

  test('should delete a todo', async ({ dashboard }) => {
    const taskText = 'Task to be deleted';

    await test.step('Create a todo to delete', async () => {
      await dashboard.createTodo(taskText);
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(1);
    });

    await test.step('Delete the todo', async () => {
      const item = await dashboard.getTodoByText(taskText);
      await dashboard.deleteTodo(item);
    });

    await test.step('Verify todo was deleted', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(0);
    });
  });

  test('should persist todo after page reload', async ({ dashboard, page }) => {
    const taskText = 'Persistent task ' + Date.now();

    await test.step('Create a todo', async () => {
      await dashboard.createTodo(taskText);
    });

    await test.step('Reload the page', async () => {
      await page.reload();
      await dashboard.waitForReady();
    });

    await test.step('Verify todo still exists', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(1);

      const text = await dashboard.getTodoText(items[0]);
      expect(text).toBe(taskText);
    });
  });
});

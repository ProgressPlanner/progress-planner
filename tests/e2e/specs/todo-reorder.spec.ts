import { test, expect } from '../fixtures/base.fixture';

test.describe('Todo Reorder Operations', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should reorder todos using move down button', async ({ dashboard }) => {
    await test.step('Create two todos', async () => {
      await dashboard.createTodo('First task');
      await dashboard.createTodo('Second task');

      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(2);
    });

    await test.step('Move first task down', async () => {
      const items = await dashboard.getTodoItems();
      const firstItem = items[0];

      await dashboard.moveTodoDown(firstItem);
    });

    await test.step('Verify order changed', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(2);

      // After moving down, "Second task" should be first
      const firstText = await dashboard.getTodoText(items[0]);
      const secondText = await dashboard.getTodoText(items[1]);

      expect(firstText).toBe('Second task');
      expect(secondText).toBe('First task');
    });
  });

  test('should reorder todos using move up button', async ({ dashboard }) => {
    await test.step('Create two todos', async () => {
      await dashboard.createTodo('First task');
      await dashboard.createTodo('Second task');

      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(2);
    });

    await test.step('Move second task up', async () => {
      const items = await dashboard.getTodoItems();
      const secondItem = items[1];

      await dashboard.moveTodoUp(secondItem);
    });

    await test.step('Verify order changed', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(2);

      // After moving up, "First task" should be second
      const firstText = await dashboard.getTodoText(items[0]);
      const secondText = await dashboard.getTodoText(items[1]);

      expect(firstText).toBe('First task');
      expect(secondText).toBe('Second task');
    });
  });

  test('should persist order after page reload', async ({ dashboard, page }) => {
    await test.step('Create and reorder todos', async () => {
      await dashboard.createTodo('Task A');
      await dashboard.createTodo('Task B');
      await dashboard.createTodo('Task C');

      // Move Task C up twice to make it first
      let items = await dashboard.getTodoItems();
      await dashboard.moveTodoUp(items[2]); // C is now second
      items = await dashboard.getTodoItems();
      await dashboard.moveTodoUp(items[1]); // C is now first
    });

    await test.step('Reload the page', async () => {
      await page.reload();
      await dashboard.waitForReady();
    });

    await test.step('Verify order persisted', async () => {
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(3);

      const firstText = await dashboard.getTodoText(items[0]);
      expect(firstText).toBe('Task C');
    });
  });
});

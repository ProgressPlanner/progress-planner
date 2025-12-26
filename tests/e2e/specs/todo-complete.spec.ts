import { test, expect } from '../fixtures/base.fixture';

test.describe('Todo Completion', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should complete a todo and move it to completed list', async ({ dashboard }) => {
    const taskText = 'Task to complete ' + Date.now();

    await test.step('Create a todo', async () => {
      await dashboard.createTodo(taskText);
      const items = await dashboard.getTodoItems();
      expect(items).toHaveLength(1);
    });

    await test.step('Complete the todo', async () => {
      const item = await dashboard.getTodoByText(taskText);
      await dashboard.completeTodo(item);
    });

    await test.step('Verify todo moved to completed list', async () => {
      // Active list should be empty
      const activeItems = await dashboard.getTodoItems();
      expect(activeItems).toHaveLength(0);

      // Completed list should have the task
      await dashboard.openCompletedTasks();
      const completedItems = await dashboard.getCompletedItems();
      expect(completedItems.length).toBeGreaterThan(0);
    });
  });

  test('should verify task status via API after completion', async ({ dashboard, tasksApi }) => {
    const taskText = 'API verified task ' + Date.now();

    let taskId: string;

    await test.step('Create a todo', async () => {
      const result = await dashboard.createTodo(taskText);
      taskId = result.taskId;
    });

    await test.step('Complete the todo', async () => {
      const item = await dashboard.getTodoByText(taskText);
      await dashboard.completeTodo(item);
    });

    await test.step('Verify task status via API', async () => {
      await tasksApi.expectTaskStatus(taskId, 'trash');
    });
  });

  test('should complete suggested task and decrease count', async ({ dashboard }) => {
    await test.step('Complete a suggested task', async () => {
      const { taskId, previousCount } = await dashboard.completeSuggestedTask();

      if (taskId === null) {
        test.skip();
        return;
      }

      // Wait for the task count to decrease
      const newCount = await dashboard.getSuggestedTasksCount();
      expect(newCount).toBeLessThan(previousCount);
    });
  });
});

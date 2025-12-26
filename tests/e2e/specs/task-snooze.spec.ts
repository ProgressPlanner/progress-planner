import { test, expect } from '../fixtures/base.fixture';

test.describe('Task Snooze', () => {
  // Enable cleanup for this test suite
  test.use({ cleanupAfterTest: true });

  test('should snooze a task for 1 day', async ({ dashboard, tasksApi }) => {
    const taskText = 'Task to snooze ' + Date.now();

    let taskId: string;

    await test.step('Create a todo', async () => {
      const result = await dashboard.createTodo(taskText);
      taskId = result.taskId;
    });

    await test.step('Snooze the task for 1 day', async () => {
      await dashboard.snoozeTask(taskId, '1-day');
    });

    await test.step('Verify task is snoozed via API', async () => {
      // Snoozed tasks have a 'future' status
      await tasksApi.waitForTaskStatus(taskId, 'future', { timeout: 5000 });
    });

    await test.step('Verify task is no longer in active list', async () => {
      const items = await dashboard.getTodoItems();
      const taskStillVisible = await Promise.all(
        items.map(async (item) => {
          const text = await dashboard.getTodoText(item);
          return text === taskText;
        })
      );
      expect(taskStillVisible.every((visible) => !visible)).toBe(true);
    });
  });

  test('should snooze a task for 1 week', async ({ dashboard, tasksApi }) => {
    const taskText = 'Week snooze task ' + Date.now();

    let taskId: string;

    await test.step('Create a todo', async () => {
      const result = await dashboard.createTodo(taskText);
      taskId = result.taskId;
    });

    await test.step('Snooze the task for 1 week', async () => {
      await dashboard.snoozeTask(taskId, '1-week');
    });

    await test.step('Verify task is snoozed via API', async () => {
      await tasksApi.waitForTaskStatus(taskId, 'future', { timeout: 5000 });
    });
  });
});

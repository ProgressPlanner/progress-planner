import { test, expect } from '../fixtures/base.fixture';

test.describe('Dismissible Tasks', () => {
  test('should complete dismissible task if present', async ({ dashboard, tasksApi }) => {
    await test.step('Check for available suggested tasks', async () => {
      const initialCount = await dashboard.getSuggestedTasksCount();

      if (initialCount === 0) {
        test.skip();
        return;
      }
    });

    let taskId: string | null;
    let previousCount: number;

    await test.step('Complete a suggested task', async () => {
      const result = await dashboard.completeSuggestedTask();
      taskId = result.taskId;
      previousCount = result.previousCount;

      if (taskId === null) {
        test.skip();
        return;
      }
    });

    await test.step('Verify task count decreased', async () => {
      const finalCount = await dashboard.getSuggestedTasksCount();
      expect(finalCount).toBe(previousCount - 1);
    });

    await test.step('Verify task is marked as completed via API', async () => {
      if (taskId) {
        await tasksApi.expectTaskStatus(taskId, 'trash');
      }
    });
  });
});

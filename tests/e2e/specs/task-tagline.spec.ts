import { test, expect } from '../fixtures/base.fixture';

test.describe('Task Tagline Completion', () => {
  test('should complete blog description task when tagline is set', async ({ page, tasksApi }) => {
    await test.step('Navigate to Progress Planner dashboard', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify blog description task exists and is active', async () => {
      const task = await tasksApi.getTask('core-blogdescription');
      expect(task).toBeDefined();
      expect(task?.post_status).toBe('publish');
    });

    await test.step('Navigate to WordPress settings and set tagline', async () => {
      await page.goto('/wp-admin/options-general.php');
      await page.waitForLoadState('networkidle');

      await page.fill('#blogdescription', 'My Awesome Site Description');
      await page.click('#submit');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify task status changed to pending', async () => {
      await tasksApi.waitForTaskStatus('core-blogdescription', 'pending', { timeout: 5000 });
    });

    await test.step('Navigate to dashboard and verify task completion animation', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('networkidle');

      // Wait for widget to be visible
      const widgetContainer = page.locator('.prpl-widget-wrapper.prpl-suggested-tasks');
      await expect(widgetContainer).toBeVisible();

      // Wait for task element to appear
      const taskElement = page.locator('li[data-task-id="core-blogdescription"]');

      // If task is visible, wait for the celebration animation
      if (await taskElement.isVisible()) {
        // Wait for animation and task removal
        await expect(taskElement).toHaveCount(0, { timeout: 5000 });
      }
    });

    await test.step('Verify task is completed via API', async () => {
      await tasksApi.expectTaskStatus('core-blogdescription', 'trash');
    });
  });
});

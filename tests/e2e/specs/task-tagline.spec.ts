import { test, expect } from '../fixtures/base.fixture';

test.describe('Task Tagline Completion', () => {
  test('should complete blog description task when tagline is set', async ({ page, tasksApi }) => {
    await test.step('Navigate to Progress Planner dashboard to init', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('domcontentloaded');
      // Wait for page to settle
      await page.waitForTimeout(1000);
    });

    await test.step('Verify blog description task exists and is active', async () => {
      const task = await tasksApi.getTask('core-blogdescription');
      if (!task || task.post_status !== 'publish') {
        // Task doesn't exist or isn't active - skip test
        console.log('Task core-blogdescription not available, skipping test');
        test.skip();
        return;
      }
      expect(task.post_status).toBe('publish');
    });

    await test.step('Navigate to WordPress settings and set tagline', async () => {
      await page.goto('/wp-admin/options-general.php');
      await page.waitForLoadState('domcontentloaded');

      await page.fill('#blogdescription', 'My Awesome Site Description');
      await page.click('#submit');
      await page.waitForLoadState('domcontentloaded');

      // Wait for task status to update
      await page.waitForTimeout(500);
    });

    await test.step('Verify task status changed to pending', async () => {
      const task = await tasksApi.getTask('core-blogdescription');
      expect(task).toBeDefined();
      expect(task?.post_status).toBe('pending');
    });

    await test.step('Navigate to dashboard and verify task completion', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('domcontentloaded');

      // Wait for widget container to be visible
      const widgetContainer = page.locator('.prpl-widget-wrapper.prpl-suggested-tasks');
      await expect(widgetContainer).toBeVisible({ timeout: 10000 });

      // Wait for tasks list to be visible
      const tasksList = page.locator('.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list');
      await expect(tasksList).toBeVisible();

      // Wait for the specific task to appear
      const taskElement = page.locator('li[data-task-id="core-blogdescription"]');
      await expect(taskElement).toBeVisible();

      // Wait for the celebration animation and task removal (3s delay + 1s buffer)
      await page.waitForTimeout(4000);

      // Verify task is removed from DOM
      await expect(taskElement).toHaveCount(0);
    });

    await test.step('Verify task is no longer active via API', async () => {
      const task = await tasksApi.getTask('core-blogdescription');
      // Task should either be trash or undefined (fully deleted)
      if (task) {
        expect(task.post_status).toBe('trash');
      }
      // If task is undefined, it was deleted which is also acceptable
    });
  });
});

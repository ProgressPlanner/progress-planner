const { test, expect } = require('@playwright/test');

test.describe('PRPL Remote Tasks', () => {
    test('Complete remote task if present', async ({ page, request }) => {
        // Navigate to Progress Planner dashboard
        await page.goto(`${process.env.WORDPRESS_URL}/wp-admin/admin.php?page=progress-planner`);
        await page.waitForLoadState('networkidle');

        // Check if remote task exists
        const remoteTask = page.locator('li[data-task-id^="remote-task-"]');
        const count = await remoteTask.count();

        if (count > 0) {
            const taskId = await remoteTask.getAttribute('data-task-id');
            // Hover over the task to show actions
            await remoteTask.hover();

            // Click the actions button to open dropdown
            const actionsButton = remoteTask.locator('.prpl-suggested-task-actions');
            await actionsButton.click();

            // Click the complete button within the remote task
            const completeButton = remoteTask.locator('button[data-action="complete"]');
            await completeButton.click();

            // Wait for animation
            await page.waitForTimeout(3000);

            // Verify the task is removed
            await expect(remoteTask).toHaveCount(0);

            // Check the final task status via REST API
            const completedResponse = await request.get(`${process.env.WORDPRESS_URL}/?rest_route=/progress-planner/v1/tasks`);
            const completedTasks = await completedResponse.json();

            // Find the blog description task one last time
            const completedTask = completedTasks.find(task => task.task_id === taskId);
            expect(completedTask).toBeDefined();
            expect(completedTask.status).toBe('completed');
        }
    });
});
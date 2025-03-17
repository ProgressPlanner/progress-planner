const { test, expect } = require('@playwright/test');

test.describe('PRPL Dismissible Tasks', () => {
    test('Complete dismissible task if present', async ({ page, request }) => {
        // Navigate to Progress Planner dashboard
        await page.goto('/wp-admin/admin.php?page=progress-planner');
        await page.waitForLoadState('networkidle');

        // Check if complete button exists
        const completeButton = page.locator('button.prpl-suggested-task-button[data-action="complete"]');
        const initialCount = await completeButton.count();

        if (initialCount > 0) {
            // Get the task ID from the button
            const taskId = await completeButton.getAttribute('data-task-id');

            // Hover over the task to show actions
            const taskElement = page.locator(`li[data-task-id="${taskId}"]`);
            await taskElement.hover();

            // Click the complete button
            await completeButton.click();

            // Wait for animation
            await page.waitForTimeout(3000);

            // Verify the task count decreased by 1
            const finalCount = await completeButton.count();
            expect(finalCount).toBe(initialCount - 1);

            // Check the final task status via REST API
            const completedResponse = await request.get('/?rest_route=/prpl-testing/v1/tasks');
            const completedTasks = await completedResponse.json();

            // Find the completed task
            const completedTask = completedTasks.find(task => task.task_id === taskId);
            expect(completedTask).toBeDefined();
            expect(completedTask.status).toBe('completed');
        }
    });
});
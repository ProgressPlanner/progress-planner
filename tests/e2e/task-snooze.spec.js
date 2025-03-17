const { test, expect } = require('@playwright/test');

test.describe('PRPL Task Snooze', () => {
    test('Snooze a task for one week', async ({ page, request }) => {
        // Navigate to Progress Planner dashboard with show all tasks parameter
        await page.goto('/wp-admin/admin.php?page=progress-planner&prpl_show_all_suggested_tasks=99');
        await page.waitForLoadState('networkidle');

        // Get initial tasks
        const response = await request.get('/wp-json/progress-planner/v1/tasks');
        const initialTasks = await response.json();

        // Find a task that's not completed or snoozed
        const taskToSnooze = initialTasks.find(task =>
            task.status === 'pending' &&
            task.task_id !== 'core-blogdescription' &&
            !task.task_id.startsWith('remote-task-')
        );

        if (taskToSnooze) {
            // Hover over the task to show actions
            const taskElement = page.locator(`li[data-task-id="${taskToSnooze.task_id}"]`);
            await taskElement.hover();

            // Click the snooze button
            const snoozeButton = taskElement.locator('button[data-action="snooze"]');
            await snoozeButton.click();

            // Click the radio group to show options
            const radioGroup = taskElement.locator('button.prpl-toggle-radio-group');
            await radioGroup.click();

            // Select 1 week duration by clicking the label
            await taskElement.evaluate(() => {
                const radio = document.querySelector('.prpl-snooze-duration-radio-group input[type="radio"][value="1-week"]');
                const label = radio.closest('label');
                label.click();
            });

            // Wait for the API call to complete
            await page.waitForLoadState('networkidle');

            // Wait for the task to be snoozed
            await page.waitForTimeout(1000);

            // Verify task status via REST API
            const updatedResponse = await request.get('/wp-json/progress-planner/v1/tasks');
            const updatedTasks = await updatedResponse.json();
            const updatedTask = updatedTasks.find(task => task.task_id === taskToSnooze.task_id);
            expect(updatedTask.status).toBe('snoozed');
        }
    });
});
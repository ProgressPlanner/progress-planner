const { test, expect } = require('@playwright/test');

test.describe('PRPL Settings', () => {
    test('should save post types settings', async ({ page }) => {
        // Navigate to Progress Planner dashboard
        await page.goto('/wp-admin/admin.php?page=progress-planner');
        await page.waitForLoadState('networkidle');

        // Click the settings trigger to open popover
        const settingsTrigger = page.locator('#prpl-popover-settings-trigger');
        await settingsTrigger.click();

        // Verify both checkboxes are initially checked
        const checkboxes = page.locator('input[name="prpl-settings-post-types-include[]"]');
        const initialCount = await checkboxes.count();
        for (let i = 0; i < initialCount; i++) {
            await expect(checkboxes.nth(i)).toBeChecked();
        }

        // Uncheck the first checkbox
        await checkboxes.first().uncheck();

        // Click the submit button
        const submitButton = page.locator('#submit-include-post-types');
        await submitButton.click();

        // Wait for page refresh
        await page.waitForLoadState('networkidle');

        // Open the popover again
        await settingsTrigger.click();

        // Verify the first checkbox is still unchecked
        await expect(checkboxes.first()).not.toBeChecked();
    });
});
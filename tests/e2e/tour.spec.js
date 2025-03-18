const { test, expect } = require('@playwright/test');

test.describe('PRPL Tour', () => {
    test('should start the tour when clicking the tour button', async ({ page }) => {
        // Navigate to Progress Planner dashboard
        await page.goto('/wp-admin/admin.php?page=progress-planner');
        await page.waitForLoadState('networkidle');

        // Click the tour button
        const tourButton = page.locator('#prpl-start-tour-icon-button');
        await tourButton.click();

        // Wait for and verify the tour popover is visible
        const tourPopover = page.locator('.driver-popover');
        await expect(tourPopover).toBeVisible();
    });
});

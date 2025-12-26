import { test, expect } from '../fixtures/base.fixture';

test.describe('Progress Planner Onboarding', () => {
  // This test needs a fresh state, so we use a separate storage state
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should complete onboarding process successfully', async ({ page }) => {
    // Login manually since we cleared storage state
    await test.step('Login to WordPress', async () => {
      await page.goto('/wp-login.php');
      await page.fill('#user_login', process.env.WORDPRESS_ADMIN_USER || 'admin');
      await page.fill('#user_pass', process.env.WORDPRESS_ADMIN_PASSWORD || 'password');
      await page.click('#wp-submit');
      await page.waitForURL('**/wp-admin/**');
    });

    const popover = page.locator('#prpl-popover-onboarding');

    await test.step('Navigate to Progress Planner', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('networkidle');

      await expect(popover).toBeVisible({ timeout: 10000 });
    });

    await test.step('Accept privacy policy', async () => {
      const privacyLabel = page.locator('label[for="prpl-privacy-checkbox"]');
      await expect(privacyLabel).toBeVisible();
      await privacyLabel.click();
    });

    await test.step('Start onboarding', async () => {
      const startButton = popover.locator('.prpl-tour-next');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for step to advance (license generation happens in background)
      await expect(popover).toHaveAttribute('data-prpl-step', /^[1-9]/, {
        timeout: 15000,
      });
    });

    await test.step('Close onboarding', async () => {
      const closeButton = page.locator('#prpl-tour-close-btn');
      await closeButton.click();

      await expect(popover).toBeHidden({ timeout: 5000 });
    });

    await test.step('Verify onboarding does not restart on revisit', async () => {
      await page.goto('/wp-admin/');
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('networkidle');

      // Popover should remain hidden
      await expect(popover).toBeHidden({ timeout: 5000 });
    });
  });
});

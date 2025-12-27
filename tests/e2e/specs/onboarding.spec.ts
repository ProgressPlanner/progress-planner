import { test, expect } from '../fixtures/base.fixture';

test.describe('Progress Planner Onboarding', () => {
  // This test requires external API for license generation, which isn't available in Playground
  // Skip by default in Playground environments
  test.skip(({ }, testInfo) => {
    // Skip if running in Playground mode (no WORDPRESS_URL set means Playground)
    return !process.env.WORDPRESS_URL;
  }, 'License generation requires external API (not available in Playground)');

  test('should complete onboarding process successfully', async ({ page }) => {
    const popover = page.locator('#prpl-popover-onboarding');

    await test.step('Navigate to Progress Planner and trigger onboarding', async () => {
      await page.goto('/wp-admin/admin.php?page=progress-planner');
      await page.waitForLoadState('networkidle');

      // In Playground mode with pre-existing license, click "Show onboarding" to trigger onboarding
      const showOnboardingButton = page.locator('#progress-planner-show-onboarding');
      if (await showOnboardingButton.isVisible()) {
        // This button triggers AJAX that deletes license and progress, then reloads
        await showOnboardingButton.click();

        // Wait for reload
        await page.waitForLoadState('networkidle');
      }

      await expect(popover).toBeVisible({ timeout: 10000 });
    });

    await test.step('Accept privacy policy if visible', async () => {
      // Privacy checkbox is only visible when no license exists
      const privacyLabel = page.locator('label[for="prpl-privacy-checkbox"]');
      if (await privacyLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
        await privacyLabel.click();
      }
    });

    await test.step('Start onboarding', async () => {
      const startButton = popover.locator('.prpl-tour-next');
      await expect(startButton).toBeVisible();

      // Click the button
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

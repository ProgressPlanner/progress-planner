import { test, expect } from '../fixtures/base.fixture';

test.describe('Progress Planner Tour', () => {
  test('should complete the tour from start to finish', async ({ dashboard }) => {
    await test.step('Start the tour', async () => {
      await dashboard.startTour();
      expect(await dashboard.isTourVisible()).toBe(true);
    });

    await test.step('Navigate through all tour steps', async () => {
      const stepsCount = await dashboard.getTourStepsCount();
      expect(stepsCount).toBeGreaterThan(0);

      // Navigate through all steps except the last one
      for (let i = 0; i < stepsCount - 1; i++) {
        await expect(dashboard.tourPopover).toBeVisible();
        await dashboard.clickTourNext();
      }
    });

    await test.step('Verify finish button on last step', async () => {
      const buttonText = await dashboard.getTourNextButtonText();
      expect(buttonText).toBe('Finish');
    });

    await test.step('Complete the tour', async () => {
      await dashboard.clickTourNext();
      await expect(dashboard.tourPopover).not.toBeVisible();
    });
  });

  test('should be able to start tour multiple times', async ({ dashboard, page }) => {
    await test.step('Complete tour first time', async () => {
      await dashboard.completeTour();
    });

    await test.step('Reload and start tour again', async () => {
      await page.reload();
      await dashboard.waitForReady();

      await dashboard.startTour();
      expect(await dashboard.isTourVisible()).toBe(true);
    });

    await test.step('Complete tour second time', async () => {
      await dashboard.completeTour();
    });
  });
});

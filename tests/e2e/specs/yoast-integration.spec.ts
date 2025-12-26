import { test, expect } from '../fixtures/base.fixture';

test.describe('Yoast SEO Integration', () => {
  test('should show Ravi icon on Yoast crawl optimization page', async ({ yoastSettings }) => {
    await test.step('Navigate to crawl optimization page', async () => {
      await yoastSettings.gotoCrawlOptimization();
    });

    await test.step('Find feed comments toggle', async () => {
      const toggleHeader = await yoastSettings.getFeedCommentsToggleHeader();
      await expect(toggleHeader).toBeVisible();
    });

    await test.step('Verify Ravi icon is present', async () => {
      const toggleHeader = await yoastSettings.getFeedCommentsToggleHeader();
      await yoastSettings.verifyRaviIcon(toggleHeader);
    });
  });

  test('should show Ravi icon on Yoast site representation page', async ({ yoastSettings }) => {
    await test.step('Navigate to site representation page', async () => {
      await yoastSettings.gotoSiteRepresentation();
    });

    await test.step('Find company logo label', async () => {
      const logoLabel = await yoastSettings.getCompanyLogoLabel();
      await expect(logoLabel).toBeVisible();
    });

    await test.step('Verify Ravi icon is present', async () => {
      const logoLabel = await yoastSettings.getCompanyLogoLabel();
      await yoastSettings.verifyRaviIcon(logoLabel);
    });
  });

  test('should update Ravi icon state after completing task', async ({ yoastSettings }) => {
    await test.step('Navigate to crawl optimization page', async () => {
      await yoastSettings.gotoCrawlOptimization();
    });

    await test.step('Verify initial uncompleted state', async () => {
      const toggleHeader = await yoastSettings.getFeedCommentsToggleHeader();
      await yoastSettings.verifyRaviIconUncompleted(toggleHeader);
    });

    await test.step('Toggle the setting', async () => {
      await yoastSettings.clickFeedCommentsToggle();
    });

    await test.step('Verify completed state', async () => {
      const toggleHeader = await yoastSettings.getFeedCommentsToggleHeader();
      await yoastSettings.verifyRaviIconCompleted(toggleHeader);
    });
  });
});

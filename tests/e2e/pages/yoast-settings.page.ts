import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Selectors for Yoast SEO settings pages.
 */
const SELECTORS = {
  // Modal
  modalCloseButton: 'button.yst-modal__close-button',

  // Ravi icon elements (Progress Planner integration)
  raviIconWrapper: '[data-prpl-element="ravi-icon"]',
  raviIconImage: '[data-prpl-element="ravi-icon"] img',
  raviIconPoints: '.prpl-form-row-points',

  // Crawl optimization page
  feedCommentsToggle: 'button[data-id="input-wpseo-remove_feed_global_comments"]',
  toggleFieldHeader: '.yst-toggle-field__header',

  // Site representation page
  companyLogoFieldset: '#wpseo_titles-company_logo',
  companyLogoLabel: '#wpseo_titles-company_logo legend.yst-label',
} as const;

export class YoastSettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    // Default to crawl optimization page
    await this.gotoCrawlOptimization();
  }

  async gotoCrawlOptimization(): Promise<void> {
    await this.page.goto('/wp-admin/admin.php?page=wpseo_page_settings#/crawl-optimization');
    await this.waitForReady();
  }

  async gotoSiteRepresentation(): Promise<void> {
    await this.page.goto('/wp-admin/admin.php?page=wpseo_page_settings#/site-representation');
    await this.waitForReady();
  }

  override async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    // Dismiss any modal that might be blocking
    await this.dismissModal();
  }

  /**
   * Dismiss the Yoast modal if it's visible.
   */
  async dismissModal(): Promise<void> {
    const closeButton = this.page.locator(SELECTORS.modalCloseButton);

    try {
      // Short timeout - modal may or may not exist
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click();
        await closeButton.waitFor({ state: 'hidden', timeout: 3000 });
      }
    } catch {
      // Modal not present, that's fine
    }
  }

  // ==================
  // Feed Comments Toggle (Crawl Optimization)
  // ==================

  async getFeedCommentsToggle(): Promise<Locator> {
    const toggle = this.page.locator(SELECTORS.feedCommentsToggle);
    await toggle.waitFor({ state: 'visible' });
    return toggle;
  }

  async getFeedCommentsToggleHeader(): Promise<Locator> {
    const toggle = await this.getFeedCommentsToggle();
    return toggle.locator('xpath=ancestor::div[contains(@class, "yst-toggle-field__header")]');
  }

  async clickFeedCommentsToggle(): Promise<void> {
    const toggle = await this.getFeedCommentsToggle();
    await toggle.click();
  }

  // ==================
  // Company Logo (Site Representation)
  // ==================

  async getCompanyLogoLabel(): Promise<Locator> {
    const label = this.page.locator(SELECTORS.companyLogoLabel);
    await label.waitFor({ state: 'visible' });
    return label;
  }

  // ==================
  // Ravi Icon Helpers
  // ==================

  /**
   * Get the Ravi icon within a parent element.
   */
  getRaviIcon(parent: Locator): Locator {
    return parent.locator(SELECTORS.raviIconWrapper);
  }

  /**
   * Get the Ravi icon image within a parent element.
   */
  getRaviIconImage(parent: Locator): Locator {
    return parent.locator(SELECTORS.raviIconImage);
  }

  /**
   * Get the points text from a Ravi icon.
   */
  async getRaviIconPoints(parent: Locator): Promise<string> {
    const points = parent.locator(SELECTORS.raviIconPoints);
    return await points.textContent() ?? '';
  }

  /**
   * Verify a Ravi icon exists and has correct attributes.
   */
  async verifyRaviIcon(parent: Locator): Promise<void> {
    const raviIcon = this.getRaviIcon(parent);
    await expect(raviIcon).toBeVisible();

    const iconImg = this.getRaviIconImage(parent);
    await expect(iconImg).toBeVisible();
    await expect(iconImg).toHaveAttribute('alt', 'Ravi');
    await expect(iconImg).toHaveAttribute('width', '16');
    await expect(iconImg).toHaveAttribute('height', '16');
  }

  /**
   * Verify the Ravi icon shows uncompleted state (+N points).
   */
  async verifyRaviIconUncompleted(parent: Locator): Promise<void> {
    const raviIcon = this.getRaviIcon(parent);
    const points = raviIcon.locator(SELECTORS.raviIconPoints);
    await expect(points).toHaveText('+1');
  }

  /**
   * Verify the Ravi icon shows completed state (checkmark).
   */
  async verifyRaviIconCompleted(parent: Locator): Promise<void> {
    const raviIcon = this.getRaviIcon(parent);
    const points = raviIcon.locator(SELECTORS.raviIconPoints);
    await expect(points).toHaveText('✓');
  }
}

import { Page, Locator, Response } from '@playwright/test';

/**
 * Base page object with common functionality.
 * All page objects should extend this class.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page URL.
   * Subclasses should override this with their specific URL.
   */
  abstract goto(): Promise<void>;

  /**
   * Wait for page to be fully loaded.
   * Override in subclasses for page-specific loading indicators.
   */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Smart wait for an element with automatic retry.
   * Much better than waitForTimeout!
   */
  protected async waitForElement(
    selector: string | Locator,
    options: { state?: 'visible' | 'hidden' | 'attached'; timeout?: number } = {}
  ): Promise<Locator> {
    const locator = typeof selector === 'string'
      ? this.page.locator(selector)
      : selector;

    await locator.waitFor({
      state: options.state ?? 'visible',
      timeout: options.timeout ?? 10000
    });

    return locator;
  }

  /**
   * Wait for a REST API response.
   * Use instead of arbitrary timeouts after actions.
   */
  protected async waitForApiResponse(
    urlPattern: string | RegExp,
    action: () => Promise<void>
  ): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => {
          const url = resp.url();
          return typeof urlPattern === 'string'
            ? url.includes(urlPattern)
            : urlPattern.test(url);
        },
        { timeout: 15000 }
      ),
      action(),
    ]);
    return response;
  }

  /**
   * Wait for animation to complete.
   * Uses requestAnimationFrame instead of fixed timeout.
   */
  protected async waitForAnimation(element: Locator): Promise<void> {
    await element.evaluate((el) => {
      return new Promise<void>((resolve) => {
        const animations = el.getAnimations();
        if (animations.length === 0) {
          resolve();
          return;
        }
        Promise.all(animations.map((a) => a.finished)).then(() => resolve());
      });
    });
  }

  /**
   * Scroll element into view and wait for it to be stable.
   */
  protected async scrollToAndWait(element: Locator): Promise<void> {
    await element.scrollIntoViewIfNeeded();
    // Wait for any scroll-triggered animations
    await this.page.waitForTimeout(100);
  }
}

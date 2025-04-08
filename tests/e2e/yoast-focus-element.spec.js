/**
 * External dependencies
 */
import { test, expect } from '@playwright/test';

test.describe( 'Yoast Focus Element', () => {
	test.beforeEach( async ( { page } ) => {
		await page.goto(
			'/wp-admin/admin.php?page=wpseo_page_settings#/crawl-optimization'
		);
	} );

	test( 'should add Ravi icon to the feed comments toggle', async ( {
		page,
	} ) => {
		// Wait for the page to load and the toggle to be visible
		await page.waitForSelector(
			'button[data-id="input-wpseo-remove_feed_global_comments"]'
		);

		// Find the toggle input
		const toggleInput = page.locator(
			'button[data-id="input-wpseo-remove_feed_global_comments"]'
		);

		// Find the parent toggle field header
		const toggleHeader = toggleInput.locator(
			'xpath=ancestor::div[contains(@class, "yst-toggle-field__header")]'
		);

		// Verify the Ravi icon exists within the toggle header
		const raviIcon = toggleHeader.locator( 'span.prpl-form-row-ravi' );
		await expect( raviIcon ).toBeVisible();

		// Verify the icon has the correct styling
		await expect( raviIcon ).toHaveCSS( 'position', 'absolute' );
		await expect( raviIcon ).toHaveCSS( 'right', '-24px' ); // -1.5rem
		await expect( raviIcon ).toHaveCSS( 'top', '0px' );

		// Verify the icon image exists and has correct attributes
		const iconImg = raviIcon.locator( 'img' );
		await expect( iconImg ).toBeVisible();
		await expect( iconImg ).toHaveAttribute( 'alt', 'Ravi' );
		await expect( iconImg ).toHaveAttribute( 'width', '16' );
		await expect( iconImg ).toHaveAttribute( 'height', '16' );

		// Verify that image has this style
		await expect( iconImg ).toHaveCSS( 'filter', 'grayscale(1)' );

		// Now click the toggle
		await toggleInput.click();

		// Verify that the image has no filter
		await expect( iconImg ).toHaveCSS( 'filter', 'none' );
	} );
} );

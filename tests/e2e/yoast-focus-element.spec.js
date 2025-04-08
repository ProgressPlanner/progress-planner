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
		const raviIconWrapper = toggleHeader.locator(
			'[data-prpl-element="ravi-icon"]'
		);
		await expect( raviIconWrapper ).toBeVisible();

		// Verify the icon image exists and has correct attributes
		const iconImg = raviIconWrapper.locator( 'img' );
		await expect( iconImg ).toBeVisible();
		await expect( iconImg ).toHaveAttribute( 'alt', 'Ravi' );
		await expect( iconImg ).toHaveAttribute( 'width', '16' );
		await expect( iconImg ).toHaveAttribute( 'height', '16' );

		// Verify that the icon is not checked
		await expect(
			raviIconWrapper.locator( '.prpl-form-row-points' )
		).toHaveText( '+1' );

		// Now click the toggle
		await toggleInput.click();

		// Verify that the icon is now checked
		await expect(
			raviIconWrapper.locator( '.prpl-form-row-points' )
		).toHaveText( '✓' );
	} );
} );

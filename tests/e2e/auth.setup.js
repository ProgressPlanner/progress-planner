const { chromium } = require('@playwright/test');
require('dotenv').config();

async function globalSetup() {
    console.log('Starting global setup...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set up error listener for all tests
    page.on('pageerror', (err) => {
        console.log('JS Error:', err.message);
    });

    // Go to WordPress dashboard
    const baseURL = process.env.WORDPRESS_URL || 'http://localhost:8080';
    console.log('Navigating to WordPress dashboard...');
    await page.goto(`${baseURL}/wp-login.php`);

    // Log in
    console.log('Logging in...');
    await page.fill('#user_login', process.env.WORDPRESS_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WORDPRESS_ADMIN_PASSWORD || 'password');
    await page.click('#wp-submit');

    // Wait for login to complete and verify we're on the dashboard
    await page.waitForURL(`${baseURL}/wp-admin/`);
    await page.waitForSelector('#wpadminbar');
    console.log('Login successful');

    // Complete onboarding process
    try {
        // Go to Progress Planner page
        console.log('Navigating to Progress Planner...');
        await page.goto(`${baseURL}/wp-admin/admin.php?page=progress-planner`);
        await page.waitForLoadState('networkidle');

        // Check if onboarding is active
        const onboardingElement = page.locator('.prpl-welcome');
        const count = await onboardingElement.count();

        if (count === 0) {
            console.error('\n❌ Onboarding element not found! This is unexpected.');
            console.error('Current page URL:', page.url());
            console.error('Current page content:', await page.content());
            await page.screenshot({ path: 'onboarding-not-found.png' });
            console.error('\nSetup failed: Onboarding element not found. This might indicate that:');
            console.error('1. Onboarding was already completed');
            console.error('2. The plugin is not properly activated');
            console.error('3. There is an issue with the plugin\'s initialization\n');
            await browser.close();
            process.exit(1);
        }

        console.log('Onboarding found, starting form...');
        // Fill in the onboarding form
        const form = page.locator('#prpl-onboarding-form');
        console.log('Form found, filling in details...');
        await form.locator('input[name="with-email"][value="no"]').click();
        await form.locator('input[name="privacy-policy"]').check();
        await form.locator('input[type="submit"].prpl-button-secondary--no-email').click();
        console.log('Form submitted');

        // Wait for new elements to appear
        console.log('Waiting for new elements...');
        await page.waitForTimeout(1000);

        // Wait for continue button to become clickable and click it
        console.log('Looking for continue button...');
        const continueButton = page.locator('#prpl-onboarding-continue-button');
        await continueButton.waitFor({ state: 'visible' });
        console.log('Continue button visible');
        await page.waitForSelector('#prpl-onboarding-continue-button:not(.prpl-disabled)');
        console.log('Continue button enabled');
        await continueButton.click();
        console.log('Continue button clicked');

        // Verify that onboarding is complete and tasks are loaded
        try {
            console.log('Starting verification...');
            // Wait for elements to be visible with timeout
            console.log('Waiting for widget container...');
            await page.waitForSelector('.prpl-widget-wrapper.prpl-suggested-tasks', { state: 'visible', timeout: 5000 });
            console.log('Widget container loaded successfully');

            console.log('Waiting for tasks list...');
            await page.waitForSelector('.prpl-suggested-tasks-list', { state: 'visible', timeout: 5000 });
            console.log('Tasks list loaded successfully');
        } catch (error) {
            console.error('\n❌ Failed to verify task loading:', error.message);
            console.error('Current page URL:', page.url());
            // console.error('Current page content:', await page.content());
            await page.screenshot({ path: 'onboarding-verification-failed.png' });
            await browser.close();
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Onboarding completion failed:', error.message);
        console.error('Current page URL:', page.url());
        // console.error('Current page content:', await page.content());
        await page.screenshot({ path: 'onboarding-failed.png' });
        await browser.close();
        process.exit(1);
    }

    console.log('Saving auth state...');
    // Save the state to auth.json
    await context.storageState({ path: 'auth.json' });
    await browser.close();
    console.log('Global setup completed');
}

module.exports = globalSetup;
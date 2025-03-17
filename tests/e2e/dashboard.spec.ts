import { test, expect } from '@playwright/test';

test('Login and open Progress Planner in WordPress Admin', async ({ page }) => {
  // Navigate to WP Login Page
  await page.goto(`${process.env.WORDPRESS_URL}/wp-login.php`);

  // Fill in login form
  await page.fill('#user_login', process.env.WORDPRESS_ADMIN_USER!);
  await page.fill('#user_pass', process.env.WORDPRESS_ADMIN_PASSWORD!);
  await page.click('#wp-submit');

  // Check if Dashboard loaded
  await expect(page).toHaveURL(`${process.env.WORDPRESS_URL}/wp-admin/`);
  await expect(page.locator('#wpbody-content')).toBeVisible();

  // Navigate to Progress Planner Page
  await page.goto(`${process.env.WORDPRESS_URL}/wp-admin/admin.php?page=progress-planner`);

  // Ensure the Progress Planner Page loads
  await expect(page).toHaveURL(`${process.env.WORDPRESS_URL}/wp-admin/admin.php?page=progress-planner`);
  await expect(page.locator('#wpbody-content')).toBeVisible();

  // Ensure there are no JS errors
  page.on('console', (msg) => {
    expect(msg.type()).not.toBe('error');
  });

  console.log('✅ Progress Planner page loaded successfully');
});

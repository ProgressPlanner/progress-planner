import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const authFile = path.join(process.cwd(), 'auth.json');

async function globalSetup(config: FullConfig): Promise<void> {
  // Skip if auth file already exists and is recent
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const ageMinutes = (Date.now() - stats.mtimeMs) / 1000 / 60;

    // Reuse auth file if less than 30 minutes old
    if (ageMinutes < 30) {
      console.log('Using existing auth.json (age: ' + Math.round(ageMinutes) + ' minutes)');
      return;
    }
  }

  console.log('Generating fresh auth.json...');

  const baseURL = process.env.WORDPRESS_URL || 'http://localhost:8080';
  const browser = await chromium.launch();
  const context = await browser.newContext({
    // Ignore HTTPS errors for local development with self-signed certificates
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  // Listen for console errors
  page.on('pageerror', (err) => {
    console.warn('Page error:', err.message);
  });

  try {
    // Navigate to login page
    await page.goto(`${baseURL}/wp-login.php`);

    // Fill login form
    await page.fill('#user_login', process.env.WORDPRESS_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WORDPRESS_ADMIN_PASSWORD || 'password');
    await page.click('#wp-submit');

    // Wait for login to complete
    await page.waitForURL(`${baseURL}/wp-admin/**`, { timeout: 30000 });
    await page.waitForSelector('#wpadminbar', { timeout: 10000 });

    console.log('Login successful');

    // Save auth state
    await context.storageState({ path: authFile });
    console.log('Auth state saved to auth.json');
  } catch (error) {
    console.error('Login failed:', error);

    // Take screenshot for debugging
    await page.screenshot({ path: 'login-failed.png' });

    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const authFile = path.join(process.cwd(), 'auth.json');
const isPlayground = !process.env.WORDPRESS_URL || process.env.PLAYGROUND === 'true';

async function globalSetup(config: FullConfig): Promise<void> {
  // For Playground, always generate fresh auth (each instance is new)
  // For traditional WP, reuse auth if recent
  if (!isPlayground && !process.env.CI && fs.existsSync(authFile)) {
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
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  page.on('pageerror', (err) => {
    console.warn('Page error:', err.message);
  });

  try {
    if (isPlayground) {
      // WP Playground with --login flag auto-authenticates
      // Just navigate to admin to capture the auth state
      console.log('Using WP Playground auto-login...');
      console.log(`Navigating to: ${baseURL}/wp-admin/`);

      // Wait for the page to load and retry a few times if needed
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await page.goto(`${baseURL}/wp-admin/`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          });
          console.log(`Response status: ${response?.status()}`);
          console.log(`Current URL: ${page.url()}`);

          // Check if we're on login page (not auto-logged in)
          if (page.url().includes('wp-login.php')) {
            console.log('Not auto-logged in, trying default credentials...');
            await page.fill('#user_login', 'admin');
            await page.fill('#user_pass', 'password');
            await page.click('#wp-submit');
            await page.waitForURL(`${baseURL}/wp-admin/**`, { timeout: 30000 });
          }

          await page.waitForSelector('#wpadminbar', { timeout: 30000 });
          console.log('WP Playground login successful');
          break;
        } catch (retryError) {
          retries--;
          if (retries === 0) throw retryError;
          console.log(`Retry attempt, ${retries} left...`);
          await page.waitForTimeout(2000);
        }
      }
    } else {
      // Traditional WordPress login
      await page.goto(`${baseURL}/wp-login.php`);

      await page.fill('#user_login', process.env.WORDPRESS_ADMIN_USER || 'admin');
      await page.fill('#user_pass', process.env.WORDPRESS_ADMIN_PASSWORD || 'password');
      await page.click('#wp-submit');

      await page.waitForURL(`${baseURL}/wp-admin/**`, { timeout: 30000 });
      await page.waitForSelector('#wpadminbar', { timeout: 10000 });
      console.log('Login successful');
    }

    // Save auth state
    await context.storageState({ path: authFile });
    console.log('Auth state saved to auth.json');
  } catch (error) {
    console.error('Login failed:', error);
    console.log(`Final URL: ${page.url()}`);
    await page.screenshot({ path: 'login-failed.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

import { test, expect } from '@playwright/test';

test.describe('Dashboard - Staging Sanity', () => {
  test('should open dashboard directly and display metrics', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    // Ensure credentials are available
    if (!email || !password) {
      throw new Error('USER_EMAIL and USER_PASSWORD environment variables are required');
    }

    // 1. Navigate to login page
    await page.goto(`${baseUrl}/login`, { waitUntil: 'load' });

    // 2. Fill in login credentials
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill(password);

    // 3. Click login button
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();

    // 4. Wait for navigation away from login page
    await page.waitForNavigation({ timeout: 10000 });

    // 5. Verify we are NOT on the login page (redirect was successful)
    await expect(page).not.toHaveURL(/.*login/, { timeout: 10000 });

    // 6. Assert the presence of dashboard components
    const mainContent = page.getByRole('main');
    await expect(mainContent).toContainText('Live Operations Metrics', { timeout: 15000 });
    
    // 7. Verify persistent session header/logout control
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible({ timeout: 10000 });
  });
});
import { test, expect } from '@playwright/test';

test.describe('Dashboard - Staging Sanity', () => {
  test('should open dashboard directly and display metrics', async ({ page }) => {
    // 1. Navigate to the base route and wait for network activity to settle
    await page.goto('/', { waitUntil: 'load' });

    // 2. If the staging app redirects from '/' to a dashboard path, allow URL stabilization
    await page.waitForURL('**/*', { timeout: 10000 });

    // 3. Confirm we are NOT redirected back to login
    await expect(page).not.toHaveURL(/.*login/, { timeout: 10000 });

    // 4. Assert the presence of dashboard components
    const mainContent = page.getByRole('main');
    await expect(mainContent).toContainText('Live Operations Metrics', { timeout: 15000 });
    
    // 5. Verify persistent session header/logout control
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible({ timeout: 10000 });
  });
});
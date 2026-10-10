import { test, expect } from '@playwright/test';

test.describe('Dashboard - Staging Sanity', () => {
  test('should open dashboard directly and display metrics', async ({ page }) => {
    // Navigate explicitly with DOM content loaded check
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const mainArea = page.getByRole('main');
    await expect(mainArea).toBeVisible({ timeout: 15000 });
    await expect(mainArea).toContainText('Live Operations Metrics');
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });
});
import { test, expect } from '@playwright/test';

test.describe('Dashboard - Staging Sanity', () => {
  test('should open dashboard directly and display metrics', async ({ page }) => {
    // Navigate straight to the home/dashboard route
    await page.goto('/');

    // Check that the authenticated landing container is visible
    const mainArea = page.getByRole('main');
    await expect(mainArea).toBeVisible();
    await expect(mainArea).toContainText('Live Operations Metrics');

    // Confirm session status by checking for the Sign Out option
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });
});
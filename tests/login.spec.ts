import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/users.json';

// Bypass any global auth state to test the raw login form
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Menza Authentication Suite', () => {
  for (const record of testData) {
    test(`[${record.id}] - ${record.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Resolve password safely from .env if marked
      const password = record.useEnvPassword
        ? (process.env.DEFAULT_USER_PASSWORD || 'Admin@123')
        : (record.password || '');

      await test.step('1. Navigate to /login', async () => {
        await loginPage.navigate();
      });

      await test.step(`2. Submit credentials for: ${record.email}`, async () => {
        await loginPage.login(record.email, password);
      });

      await test.step('3. Validate outcome', async () => {
        if (record.isValid) {
          // Success verification from recorded assertion
          await expect(loginPage.mainContent).toContainText(record.expectedContent);
          
          // Sign Out action from recorded script
          await loginPage.logout();
          await expect(loginPage.loginButton).toBeVisible();
        } else {
          // Failure verification: Remains on login page
          await expect(loginPage.loginButton).toBeVisible();
        }
      });
    });
  }
});
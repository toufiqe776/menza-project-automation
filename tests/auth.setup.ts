import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import fs from 'fs';
import path from 'path';

// Define explicit absolute path to .auth/user.json in project root
const authDir = path.resolve(__dirname, '../.auth');
const authFile = path.resolve(authDir, 'user.json');

setup('authenticate user on staging', async ({ page }) => {
  
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  const email = process.env.USER_EMAIL || 'managerqatest@yopmail.com';
  const password = process.env.USER_PASSWORD || 'Admin@123';

  await loginPage.login(email, password);

  //  Wait for successful login to settle
  await expect(loginPage.mainContent).toContainText('Live Operations Metrics', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  //  Save the storage state
  await page.context().storageState({ path: authFile });
});
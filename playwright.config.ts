import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env explicitly from root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const STORAGE_STATE_PATH = path.resolve(__dirname, '.auth/user.json');

export default defineConfig({
  testDir: './tests',
  // Enforces that only files ending in .spec.ts or .setup.ts in tests/ are treated as tests
  testMatch: /.*(spec|setup)\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://qr.paycaps.com',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Setup: Runs first to generate .auth/user.json
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.ts$/,
    },

    // 2. Auth Tests: DDT Login specs that run on a clean browser state (no login tokens)
    {
      name: 'auth-tests',
      testMatch: /.*login\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },

    // 3. Authenticated App Tests: Reuses the logged-in session saved by setup
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts$/,
      testIgnore: [/.*login\.spec\.ts$/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['setup'],
    },
  ],
});
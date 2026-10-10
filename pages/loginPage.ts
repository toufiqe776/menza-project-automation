import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly mainContent: Locator;
  readonly signOutButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Staff / Account Email *' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.mainContent = page.getByRole('main');
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    // Common notification/toast/alert locators on PayCaps staging
    this.errorMessage = page.locator('[role="alert"], .ant-notification-notice, .toast, .text-danger');
  }

  /**
   * Navigate directly to the login route using configured baseURL
   */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Performs full login flow. 
   * Safely handles undefined/empty strings for negative DDT test cases.
   */
  async login(email?: string, password?: string): Promise<void> {
    if (email !== undefined) {
      await this.fillEmail(email);
    }
    if (password !== undefined) {
      await this.fillPassword(password);
    }
    await this.clickLogin();
  }

  async logout(): Promise<void> {
    await this.signOutButton.click();
  }
}
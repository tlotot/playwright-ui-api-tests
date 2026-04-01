import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginLink = page.getByRole('link', { name: /Signup \/ Login/i });
    this.logoutLink = page.getByRole('link', { name: /logout/i });
    this.loginHeading = page.getByRole('heading', { name: /login to your account/i });
    this.loginError = page.getByText(/your email or password is incorrect/i);
  }

  async open() {
    await this.page.goto('/');
    await this.loginLink.click();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }

  async verifyLoginPageOpened() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.loginHeading).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyInvalidCredentialsError() {
    await expect(this.loginError).toBeVisible();
  }

  async verifyLoggedIn(name) {
    await expect(this.page.getByText(`Logged in as ${name}`)).toBeVisible();
    await expect(this.page).not.toHaveURL(/login/);
  }

  /**
   * Verifies that the specified input field is invalid based on browser validation.
   * @param {'email' | 'password'} invalidField - The field expected to be invalid.
   */
  async verifyInvalidInput(invalidField) {
    if (invalidField === 'email') {
      const isValid = await this.emailInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBe(false);
    } else if (invalidField === 'password') {
      const isValid = await this.passwordInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBe(false);
    }
  }

  async verifyUserIsNotLoggedIn() {
    await expect(this.page.getByText(/Logged in as/i)).toHaveCount(0);
  }
}

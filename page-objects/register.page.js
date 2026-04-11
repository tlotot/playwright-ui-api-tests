import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.signupLink = page.getByRole('link', { name: /Signup \/ Login/i });
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupHeading = page.getByRole('heading', { name: /new user signup!/i });

    this.genderFemaleRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');

    this.accountCreatedText = page.getByText('Account Created!');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.accountDeletedText = page.getByText('Account Deleted!');
  }

  async openSignupPage() {
    await this.page.goto('/');
    await this.signupLink.click();
  }

  async verifySignupPageOpened() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.signupHeading).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  async submitSignupForm(name, email) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async verifyAccountInformationPageOpened() {
    await expect(this.page).toHaveURL(/signup/);
    await expect(this.page.getByRole('heading', { name: /enter account information/i })).toBeVisible();
  }

  async fillAccountInformation(data) {
    await this.genderFemaleRadio.check();
    await this.passwordInput.fill(data.password);
    await this.daysSelect.selectOption(data.day);
    await this.monthsSelect.selectOption(data.month);
    await this.yearsSelect.selectOption(data.year);

    await this.newsletterCheckbox.check();
    await this.optinCheckbox.check();

    await this.firstNameInput.fill(data.name);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.addressInput.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countrySelect.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.phone);
  }

  async submitCreateAccount() {
    await this.createAccountButton.click();
  }

  async verifyAccountCreated() {
    await expect(this.page).toHaveURL(/account_created/);
    await expect(this.accountCreatedText).toBeVisible();
  }

  async continueAfterCreation() {
    await this.continueButton.click();
  }

  async verifyLoggedIn(userName) {
    await expect(this.page.getByText(`Logged in as ${userName}`)).toBeVisible();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }

  async verifyAccountDeleted() {
    await expect(this.page).toHaveURL(/delete_account/);
    await expect(this.accountDeletedText).toBeVisible();
  }

  async continueAfterDeletion() {
    await this.continueButton.click();
  }

  async verifyHomePage() {
    await expect(this.page).toHaveURL('/');
  }
}

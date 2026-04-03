import { test, expect } from '../setup';

test('User can register and delete account', async ({ page }) => {
  const name = 'Tina';
  const lastName = 'Kovalenko';
  const uniqueEmail = `test_${Date.now()}@yahoo.com`;

  await page.goto('https://automationexercise.com/');
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await expect(page).toHaveURL(/login/);

  const newUserSignupText = page.getByRole('heading', { name: 'New User Signup!' });
  await expect(newUserSignupText).toBeVisible();

  const nameInput = page.locator('[data-qa="signup-name"]');
  const emailInput = page.locator('[data-qa="signup-email"]');
  const signupButton = page.locator('[data-qa="signup-button"]');

  await nameInput.fill(name);
  await emailInput.fill(uniqueEmail);
  await signupButton.click();

  await expect(page).toHaveURL(/signup/);
  await expect(page.getByRole('heading', { name: /enter account information/i })).toBeVisible();

  await page.locator('#id_gender2').check();
  await page.locator('[data-qa="password"]').fill('1234567');
  await page.locator('[data-qa="days"]').selectOption('10');
  await page.locator('[data-qa="months"]').selectOption('5');
  await page.locator('[data-qa="years"]').selectOption('2000');

  await page.locator('#newsletter').check();
  await page.locator('#optin').check();

  await page.locator('[data-qa="first_name"]').fill(name);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill('Microsoft');

  await page.locator('[data-qa="address"]').fill('Zelena');
  await page.locator('[data-qa="address2"]').fill('Naukova');

  await page.locator('[data-qa="country"]').selectOption('United States');
  await page.locator('[data-qa="state"]').fill('CA');
  await page.locator('[data-qa="city"]').fill('California');
  await page.locator('[data-qa="zipcode"]').fill('1234');
  await page.locator('[data-qa="mobile_number"]').fill('0644099075');

  await page.locator('[data-qa="create-account"]').click();

  await expect(page).toHaveURL(/account_created/);
  await expect(page.getByText('Account Created!')).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

  await page.getByRole('link', { name: 'Delete Account' }).click();
  await expect(page).toHaveURL(/delete_account/);
  await expect(page.getByText('Account Deleted!')).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page).toHaveURL('https://automationexercise.com/');
});

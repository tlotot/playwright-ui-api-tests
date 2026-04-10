import { test, expect } from '../setup';

const USER_REGISTRATION_DATA = {
  name: 'Tina',
  lastName: 'Kovalenko',
  password: '1234567',
  day: '10',
  month: '5',
  year: '2000',
  company: 'Microsoft',
  address1: 'Zelena',
  address2: 'Naukova',
  country: 'United States',
  state: 'CA',
  city: 'California',
  zipcode: '1234',
  phone: '0644099075',
};

test('User can register and delete account', async ({ page }) => {
  const uniqueEmail = `test_${Date.now()}@yahoo.com`;

  await page.goto('https://automationexercise.com/');
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

  await page.locator('[data-qa="signup-name"]').fill(USER_REGISTRATION_DATA.name);
  await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
  await page.locator('[data-qa="signup-button"]').click();

  await expect(page).toHaveURL(/signup/);
  await expect(page.getByRole('heading', { name: /enter account information/i })).toBeVisible();

  await page.locator('#id_gender2').check();
  await page.locator('[data-qa="password"]').fill(USER_REGISTRATION_DATA.password);
  await page.locator('[data-qa="days"]').selectOption(USER_REGISTRATION_DATA.day);
  await page.locator('[data-qa="months"]').selectOption(USER_REGISTRATION_DATA.month);
  await page.locator('[data-qa="years"]').selectOption(USER_REGISTRATION_DATA.year);

  await page.locator('#newsletter').check();
  await page.locator('#optin').check();

  await page.locator('[data-qa="first_name"]').fill(USER_REGISTRATION_DATA.name);
  await page.locator('[data-qa="last_name"]').fill(USER_REGISTRATION_DATA.lastName);
  await page.locator('[data-qa="company"]').fill(USER_REGISTRATION_DATA.company);

  await page.locator('[data-qa="address"]').fill(USER_REGISTRATION_DATA.address1);
  await page.locator('[data-qa="address2"]').fill(USER_REGISTRATION_DATA.address2);

  await page.locator('[data-qa="country"]').selectOption(USER_REGISTRATION_DATA.country);
  await page.locator('[data-qa="state"]').fill(USER_REGISTRATION_DATA.state);
  await page.locator('[data-qa="city"]').fill(USER_REGISTRATION_DATA.city);
  await page.locator('[data-qa="zipcode"]').fill(USER_REGISTRATION_DATA.zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(USER_REGISTRATION_DATA.phone);

  await page.locator('[data-qa="create-account"]').click();

  await expect(page).toHaveURL(/account_created/);
  await expect(page.getByText('Account Created!')).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page.getByText(`Logged in as ${USER_REGISTRATION_DATA.name}`)).toBeVisible();

  await page.getByRole('link', { name: 'Delete Account' }).click();

  await expect(page).toHaveURL(/delete_account/);
  await expect(page.getByText('Account Deleted!')).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(page).toHaveURL('https://automationexercise.com/');
});

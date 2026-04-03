import { test, expect } from '../setup';

test('Smoke: home page should open and display navigation', async ({ page }) => {
  await page.goto('https://automationexercise.com/');

  await expect(page).toHaveURL(/automationexercise/);
  await expect(page).toHaveTitle(/Automation Exercise/);

  const homeLink = page.getByRole('link', { name: 'Home' });

  await expect(homeLink).toBeVisible();
});

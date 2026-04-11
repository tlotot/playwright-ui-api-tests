import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { RegisterPage } from '../page-objects/register.page';

/*
 Global test setup.
 Blocks known advertising and tracking requests (Google Ads, DoubleClick, etc.)
 that can create overlays and interfere with UI tests.
*/

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();

      if (
        url.includes('doubleclick') ||
        url.includes('googlesyndication') ||
        url.includes('adservice') ||
        url.includes('/ads/') ||
        url.includes('googleads')
      ) {
        return route.abort();
      }

      return route.continue();
    });

    await use(page);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },
});

export { expect };

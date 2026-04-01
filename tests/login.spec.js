import { test } from './setup';
import { VALID_USER, INVALID_DATA } from '../test-data/users';

const negativeLoginCases = [
  {
    title: 'empty email',
    email: INVALID_DATA.empty,
    password: VALID_USER.password,
    invalidField: 'email',
  },
  {
    title: 'empty password',
    email: VALID_USER.email,
    password: INVALID_DATA.empty,
    invalidField: 'password',
  },
  {
    title: 'invalid email format',
    email: INVALID_DATA.invalidEmailFormat,
    password: VALID_USER.password,
    invalidField: 'email',
  },
];

test.describe('Login', () => {
  test.describe('Positive scenarios', () => {
    test('Smoke: Login page is opened correctly', async ({ loginPage }) => {
      await loginPage.verifyLoginPageOpened();
    });

    test('Login with correct credentials', async ({ loginPage }) => {
      await loginPage.login(VALID_USER.email, VALID_USER.password);
      await loginPage.verifyLoggedIn(VALID_USER.name);
    });
  });

  test.describe('Invalid credentials', () => {
    test('Login with incorrect email', async ({ loginPage }) => {
      await loginPage.login(INVALID_DATA.wrongEmail, VALID_USER.password);
      await loginPage.verifyInvalidCredentialsError();
      await loginPage.verifyLoginPageOpened();
    });

    test('Login with incorrect password', async ({ loginPage }) => {
      await loginPage.login(VALID_USER.email, INVALID_DATA.wrongPassword);
      await loginPage.verifyInvalidCredentialsError();
      await loginPage.verifyLoginPageOpened();
    });
  });

  test.describe('Form validation', () => {
    for (const negativeCase of negativeLoginCases) {
      test(`Login with ${negativeCase.title}`, async ({ loginPage }) => {
        await loginPage.login(negativeCase.email, negativeCase.password);
        await loginPage.verifyInvalidInput(negativeCase.invalidField);
        await loginPage.verifyLoginPageOpened();
      });
    }
  });
});

test.describe('Logout', () => {
  test('User can log out successfully', async ({ loginPage }) => {
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.logout();
    await loginPage.verifyLoginPageOpened();
  });
  test('User cannot access protected page after logout', async ({ loginPage, page }) => {
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.logout();
    await page.goBack();
    await loginPage.verifyUserIsNotLoggedIn();
  });
});

import { test } from '../setup';
import { REGISTRATION_DATA, generateUniqueEmail } from '../../test-data/registration';

async function registerNewUser(registerPage, userData, email) {
  await registerPage.openSignupPage();
  await registerPage.verifySignupPageOpened();
  await registerPage.submitSignupForm(userData.name, email);
  await registerPage.verifyAccountInformationPageOpened();
  await registerPage.fillAccountInformation(userData);
  await registerPage.submitCreateAccount();
  await registerPage.verifyAccountCreated();
  await registerPage.continueAfterCreation();
  await registerPage.verifyLoggedIn(userData.name);
}

test.describe('User registration', () => {
  test('Smoke: Signup page can be opened', async ({ registerPage }) => {
  await registerPage.openSignupPage();
  await registerPage.verifySignupPageOpened();
});

  test('User can register successfully', async ({ registerPage }) => {
    const email = generateUniqueEmail();
    await registerNewUser(registerPage, REGISTRATION_DATA, email);
  });

  test('Registered user can delete account after registration', async ({ registerPage }) => {
    const email = generateUniqueEmail();
    await registerNewUser(registerPage, REGISTRATION_DATA, email);

    await registerPage.deleteAccount();
    await registerPage.verifyAccountDeleted();
    await registerPage.continueAfterDeletion();
    await registerPage.verifyHomePage();
  });
});

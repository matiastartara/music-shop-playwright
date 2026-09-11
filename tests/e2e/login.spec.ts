import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../data-test/users.json';

test.describe('Login tests', () => {

  for (const user of users) {
    test(`Login with valid credentials - ${user.role}`, async ({ page }) => {
      const home = new HomePage(page);
      const login = new LoginPage(page);
      await home.goto();

      await home.clickOnLogin();
      await login.signIn(user.email, user.password);

      await expect(home.userMenuBtn).toBeVisible();
      await expect(home.successfulLogin).toBeVisible();
    });
  }

  test('Login with invalid credentials', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    await home.goto();

    await home.clickOnLogin();
    await login.signIn('mat@mat.com', 'mat');

    await expect(login.errorMessage).toHaveText('Invalid credentials');
  });

  for (const user of users) {
    test(`Login using 'Use This Account' - ${user.role}`, async ({ page }) => {
      const home = new HomePage(page);
      const login = new LoginPage(page);
      await home.goto();

      await home.clickOnLogin();
      await login.useTestAccount(user.role as 'admin' | 'customer');

      await expect(home.userMenuBtn).toBeVisible();
      await expect(home.successfulLogin).toBeVisible();
    });
  }

  test('Continue as Guest', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    await home.goto();

    await home.clickOnLogin();
    await login.continueAsGuest();

    await expect(page).toHaveURL('/');
    await expect(home.loginBtn).toBeVisible();
  });
})


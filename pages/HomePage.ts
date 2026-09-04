import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    readonly loginBtn: Locator;
    readonly userMenuBtn: Locator;
    readonly successfulLogin: Locator;

    constructor(page: Page) {
        super(page);
        this.loginBtn = page.getByTestId('login-button')
        this.userMenuBtn = page.getByTestId('user-menu-button')
        this.successfulLogin = page.getByRole('listitem').filter({ hasText: 'Login successfulWelcome back' });
    }

    async clickOnLogin() {
        await this.loginBtn.click();
    }
}
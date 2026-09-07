import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    readonly loginBtn: Locator;
    readonly userMenuBtn: Locator;
    readonly successfulLogin: Locator;
    readonly productsBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.loginBtn = page.getByTestId('login-button')
        this.userMenuBtn = page.getByTestId('user-menu-button')
        this.successfulLogin = page.getByRole('listitem').filter({ hasText: 'Login successfulWelcome back' });
        this.productsBtn = page.getByTestId('nav-products');
    }

    async goto() {
        await super.goto('/');
    }

    async clickOnLogin() {
        await this.loginBtn.click();
    }

    async clickOnProducts() {
        await this.productsBtn.click();
    }
}
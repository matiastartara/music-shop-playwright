import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly signInBtn: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByTestId('login-email-input');
        this.password = page.getByTestId('login-password-input');
        this.signInBtn = page.getByTestId('login-submit-button');
        this.errorMessage = page.getByText('Invalid credentials', { exact: true });
    }

    async signIn(user: string, pwd: string) {
        await this.username.fill(user);
        await this.password.fill(pwd);
        await this.signInBtn.click();
    }
}
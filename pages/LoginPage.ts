import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly signInBtn: Locator;
    readonly errorMessage: Locator;
    readonly adminAccountBtn: Locator;
    readonly customerAccountBtn: Locator;
    readonly continueAsGuestLink: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByTestId('login-email-input');
        this.password = page.getByTestId('login-password-input');
        this.signInBtn = page.getByTestId('login-submit-button');
        this.errorMessage = page.getByText('Invalid credentials', { exact: true });
        this.adminAccountBtn = page.getByTestId('admin-account-button');
        this.customerAccountBtn = page.getByTestId('customer-account-button');
        this.continueAsGuestLink = page.getByTestId('continue-as-guest-link');
    }

    async signIn(user: string, pwd: string) {
        await this.username.fill(user);
        await this.password.fill(pwd);
        await this.signInBtn.click();
    }

    async useTestAccount(role: 'admin' | 'customer') {
        const accountBtn = role === 'admin' ? this.adminAccountBtn : this.customerAccountBtn;
        await accountBtn.click();
        await this.signInBtn.click();
    }

    async continueAsGuest() {
        await this.continueAsGuestLink.click();
    }
}
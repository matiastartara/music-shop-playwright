import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';
import { parseMoney } from './utils/parseMoney';

export class CartPage extends BasePage {

    readonly cartItems: Locator;
    readonly completePurchaseBtn: Locator;
    readonly subtotal: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator('[data-testid^="cart-item-"][role="article"]');
        this.completePurchaseBtn = page.getByTestId('checkout-button');
        this.subtotal = page.getByLabel('Subtotal: $');
    }

    async completePurchase() {
        await this.completePurchaseBtn.click();
    }

    async getSubtotal() {
        const subtotalText = await this.subtotal.innerText();
        return parseMoney(subtotalText);
    }

}
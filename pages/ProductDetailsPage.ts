import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class ProductDetailsPage extends BasePage {

    readonly addToCartBtn: Locator;
    readonly continueShoppingBtn: Locator;
    readonly quantityDecreaseBtn: Locator;
    readonly quantityIncreaseBtn: Locator;
    readonly quantityDisplay: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartBtn = page.getByTestId('add-to-cart-button');
        this.continueShoppingBtn = page.getByTestId('continue-shopping-button');
        this.quantityDecreaseBtn = page.getByTestId('quantity-decrease-button');
        this.quantityIncreaseBtn = page.getByTestId('quantity-increase-button');
        this.quantityDisplay = page.getByTestId('quantity-display');
    }

    async clickOnAddToCart() {
        await this.addToCartBtn.click();
    }

}
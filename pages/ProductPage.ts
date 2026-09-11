import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';
import { parseMoney } from './utils/parseMoney';

export class ProductPage extends BasePage {

    readonly searchInput: Locator;
    readonly productTitles: Locator;
    readonly noProductsMessage: Locator;
    readonly detailsButtons: Locator;
    readonly addToCartButtons: Locator;
    readonly cartBtn: Locator;
    readonly productPrices: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('search-products-input');
        this.productTitles = page.locator('[data-testid^="product-title-link-"]');
        this.noProductsMessage = page.getByTestId('no-products-message');
        this.detailsButtons = page.locator('[data-testid^="product-details-button-"]');
        this.addToCartButtons = page.locator('[data-testid^="product-add-to-cart-button-"]');
        this.cartBtn = page.getByTestId('cart-button');
        this.productPrices = page.locator('[data-testid^="product-price-"]');
    }

    async goto() {
        await super.goto('/products');
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
    }

    async openDetails(index = 0) {
        await this.detailsButtons.nth(index).click();
    }

    async addToCart(index = 0) {
        await this.addToCartButtons.nth(index).click();
    }

    async goToCart() {
        await this.cartBtn.click();
    }

    async getProductPrice(index = 0) {
        const priceText = await this.productPrices.nth(index).innerText();

        return parseMoney(priceText);
    }
}
import { BasePage } from "./BasePage";
import { Page, Locator } from '@playwright/test';

export class ProductPage extends BasePage {

    readonly searchInput: Locator;
    readonly productTitles: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('search-products-input');
        this.productTitles = page.locator('[data-testid^="product-title-link-"]');
    }

    async goto() {
        await super.goto('/products');
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
    }

}
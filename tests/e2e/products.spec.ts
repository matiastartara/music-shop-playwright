import { test, expect } from '@playwright/test'
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Products test', () => {

    test('Search product', async ({ page }) => {
        const home = new HomePage(page);
        const products = new ProductPage(page);
        const searchTerm = 'smartwatch';
        await home.goto();
        await home.clickOnProducts();
        await products.searchProduct(searchTerm);

        await expect(products.productTitles.first()).toBeVisible();

        const titles = await products.productTitles.allTextContents();
        expect(titles.length).toBeGreaterThan(0);
        for (const title of titles) {
            expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
    })

    test('Search product with no results', async ({ page }) => {
        const product = new ProductPage(page);
        const searchTerm = 'monitornotfound';
        await product.goto();
        await product.searchProduct(searchTerm);

        await expect(product.noProductsMessage).toContainText('No products found');
        await expect(product.productTitles).toHaveCount(0);
    })

    test('Check product detail', async ({ page }) => {
        const home = new HomePage(page);
        const products = new ProductPage(page);
        const productDetail = new ProductDetailsPage(page);

        const searchTerm = 'smartwatch';
        await home.goto();
        await home.clickOnProducts();
        await products.searchProduct(searchTerm);
        await products.openDetails();

        await expect(productDetail.addToCartBtn).toBeVisible();
        await expect(productDetail.quantityDecreaseBtn).toBeDisabled();
        await expect(productDetail.quantityIncreaseBtn).toBeEnabled();
        await expect(productDetail.quantityDisplay).toHaveText('1');
    })

    test('Should redirect to login when adding to cart without session', async ({ page }) => {
        const home = new HomePage(page);
        const productsPage = new ProductPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const loginPage = new LoginPage(page);
        const searchTerm = 'behringer';

        await productsPage.goto();
        await productsPage.searchProduct(searchTerm);
        await productsPage.openDetails();
        await productDetailsPage.clickOnAddToCart();

        await expect(loginPage.welcomeHeading).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    })
})
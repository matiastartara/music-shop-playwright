import { test, expect } from '@playwright/test'
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../data-test/users.json';
import { CartPage } from '../../pages/CartPage';

test.describe('Purchase tests', () => {

    test('Purchase product test', async ({ page }) => {
        const home = new HomePage(page);
        const login = new LoginPage(page);
        const product = new ProductPage(page);
        const cart = new CartPage(page);
        const user = users[1]; // customer
        const searchTerm = 'monitor';
        await home.goto();

        await home.clickOnLogin();
        await login.signIn(user.email, user.password);
        await home.clickOnStartShoping();
        await product.searchProduct(searchTerm);
        await product.addToCart();
        await product.goToCart();

        await expect(page).toHaveURL(/\/cart/);
        await expect(cart.cartItems.first()).toBeVisible();

        await cart.completePurchase();
        await expect(home.purchaseCompleteText).toBeVisible();

    })

    test('Validate subtotal amount', async ({ page }) => {
        const home = new HomePage(page);
        const login = new LoginPage(page);
        const product = new ProductPage(page);
        const cart = new CartPage(page);
        const user = users[1]; // customer
        const searchTerm = 'monitor';
        await home.goto();

        await home.clickOnLogin();
        await login.signIn(user.email, user.password);
        await home.clickOnStartShoping();
        await product.searchProduct(searchTerm);
        await expect(product.productPrices.first()).toBeVisible();
        const productPrice = await product.getProductPrice(0);

        await expect(product.addToCartButtons.first()).toBeVisible();
        await product.addToCart(0);
        await product.goToCart();
        await expect(page).toHaveURL(/\/cart/);
        await expect(cart.cartItems.first()).toBeVisible();

        const cartSubtotal = await cart.getSubtotal();
        expect(cartSubtotal).toBeCloseTo(productPrice, 2);

    })

})
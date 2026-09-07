import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';

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
})
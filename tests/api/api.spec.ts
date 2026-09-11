import { test, expect } from '@playwright/test';

test('Get - All Products ', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(data);
})

test('Get - Product I ', async ({ request }) => {
    const response = await request.get('/api/products/1');
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(data);

    expect(data.product).toMatchObject({
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        category: 'Electronics',
    });
})
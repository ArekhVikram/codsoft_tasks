import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { memoryStore } from '../data/memoryStore.js';

test('NOVA SUPPLY API Test Suite', async (t) => {
  // Ensure store is fresh
  await memoryStore.init();

  await t.test('1. Health Check Endpoint', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.brand, 'NOVA SUPPLY');
    assert.ok(res.body.productsCount >= 14);
  });

  await t.test('2. Product Listing, Search & Filtering', async () => {
    // Basic product list
    const resAll = await request(app).get('/api/products');
    assert.equal(resAll.status, 200);
    assert.equal(resAll.body.success, true);
    assert.ok(resAll.body.products.length >= 14);

    // Filter by Category: Audio
    const resAudio = await request(app).get('/api/products?category=Audio');
    assert.equal(resAudio.status, 200);
    assert.ok(resAudio.body.products.length > 0);
    resAudio.body.products.forEach(p => {
      assert.equal(p.category, 'Audio');
    });

    // Search query: "Headphones"
    const resSearch = await request(app).get('/api/products?search=Headphones');
    assert.equal(resSearch.status, 200);
    assert.ok(resSearch.body.products.length >= 1);
    assert.ok(resSearch.body.products[0].name.includes('Headphones'));

    // Price filtering: minPrice=100 & maxPrice=200
    const resPrice = await request(app).get('/api/products?minPrice=100&maxPrice=200');
    assert.equal(resPrice.status, 200);
    resPrice.body.products.forEach(p => {
      assert.ok(p.price >= 100 && p.price <= 200);
    });

    // Product detail
    const resSingle = await request(app).get('/api/products/nova-01');
    assert.equal(resSingle.status, 200);
    assert.equal(resSingle.body.product.name, 'Studio Monitor Headphones Mk. II');

    // Invalid product ID
    const resNotFound = await request(app).get('/api/products/non-existent-sku-999');
    assert.equal(resNotFound.status, 404);
  });

  let testAuthToken = '';
  const testEmail = `tester-${Date.now()}@novasupply.com`;

  await t.test('3. Authentication Flow', async () => {
    // Register new user
    const resRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: testEmail,
        password: 'Password123!'
      });
    assert.equal(resRegister.status, 201);
    assert.equal(resRegister.body.success, true);
    assert.ok(resRegister.body.token);
    assert.equal(resRegister.body.user.email, testEmail);

    // Duplicate email registration should fail
    const resDup = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Clone',
        email: testEmail,
        password: 'Password123!'
      });
    assert.equal(resDup.status, 400);

    // Login with wrong password should fail
    const resBadLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword!'
      });
    assert.equal(resBadLogin.status, 401);

    // Login with correct password
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!'
      });
    assert.equal(resLogin.status, 200);
    assert.ok(resLogin.body.token);
    testAuthToken = resLogin.body.token;

    // Access protected route /api/auth/me with Bearer token
    const resMe = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${testAuthToken}`);
    assert.equal(resMe.status, 200);
    assert.equal(resMe.body.user.email, testEmail);

    // Access protected route without token fails with 401
    const resUnauthorized = await request(app).get('/api/auth/me');
    assert.equal(resUnauthorized.status, 401);
  });

  await t.test('4. Secure Server-Side Order Calculations and Stock Decrement', async () => {
    // Get current stock of nova-05 (Architectural Machined Brass Pen, price $68)
    const prodBefore = await memoryStore.getProductByIdOrSlug('nova-05');
    const initialStock = prodBefore.stock;

    // Send order with deliberately manipulated fake client prices
    // Notice client provides forged price: 1.00 instead of 68.00!
    // Server must reject fake prices and compute based on true $68.00!
    const fakeOrderPayload = {
      items: [
        {
          productId: 'nova-05',
          price: 1.00, // FORGED CLIENT PRICE
          quantity: 2
        }
      ],
      shippingAddress: {
        fullName: 'Jane Doe',
        email: testEmail,
        street: '100 Creative Way',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        country: 'United States'
      },
      shippingMethod: {
        id: 'standard',
        name: 'Standard Carbon-Neutral Ground',
        price: 0
      },
      promoCode: 'NOVA10'
    };

    const resOrder = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${testAuthToken}`)
      .send(fakeOrderPayload);

    assert.equal(resOrder.status, 201);
    const order = resOrder.body.order;

    // Expected subtotal: 68 * 2 = 136.00 (NOT 2 * 1 = 2.00!)
    assert.equal(order.subtotal, 136);

    // Discount: 10% of 136 = 13.60
    assert.equal(order.discount, 13.6);

    // Subtotal after discount: 122.40. Tax 8%: 9.79. Shipping (>= 100): 0.
    // Total: 122.40 + 9.79 = 132.19
    assert.equal(order.total, 132.19);

    // Verify stock was decremented by 2
    const prodAfter = await memoryStore.getProductByIdOrSlug('nova-05');
    assert.equal(prodAfter.stock, initialStock - 2);

    // Verify order is visible in user's order history
    const resHistory = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${testAuthToken}`);
    assert.equal(resHistory.status, 200);
    assert.ok(resHistory.body.orders.length >= 1);
    assert.equal(resHistory.body.orders[0].orderNumber, order.orderNumber);
  });

  await t.test('5. Stock Validation Rejection', async () => {
    // Attempting to buy more than available stock must fail
    const resOverstock = await request(app)
      .post('/api/orders')
      .send({
        items: [
          {
            productId: 'nova-10', // only 4 in stock
            quantity: 999
          }
        ],
        shippingAddress: {
          fullName: 'Test User',
          email: 'test@example.com',
          street: '123 Test St',
          city: 'Anytown',
          state: 'CA',
          zip: '90001',
          country: 'United States'
        }
      });

    assert.equal(resOverstock.status, 400);
    assert.ok(resOverstock.body.message.includes('Insufficient inventory'));
  });

  await t.test('6. Newsletter and Contact Validation', async () => {
    // Invalid email in newsletter
    const resBadEmail = await request(app)
      .post('/api/contact/newsletter')
      .send({ email: 'not-an-email' });
    assert.equal(resBadEmail.status, 400);

    // Valid email
    const resGoodEmail = await request(app)
      .post('/api/contact/newsletter')
      .send({ email: 'newsletter@novasupply.com' });
    assert.equal(resGoodEmail.status, 200);

    // Contact submission missing message
    const resBadContact = await request(app)
      .post('/api/contact')
      .send({ name: 'Alex', email: 'alex@novasupply.com' });
    assert.equal(resBadContact.status, 400);

    // Valid contact submission
    const resGoodContact = await request(app)
      .post('/api/contact')
      .send({
        name: 'Alex Vane',
        email: 'alex@novasupply.com',
        subject: 'Wholesale Inquiry',
        message: 'Looking to stock your products in our London showroom.'
      });
    assert.equal(resGoodContact.status, 200);
    assert.ok(resGoodContact.body.inquiryId);
  });
});

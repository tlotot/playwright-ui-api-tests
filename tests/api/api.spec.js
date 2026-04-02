import { test, expect } from '@playwright/test';
import { INVALID_DATA, VALID_USER } from '../../test-data/users';
import { SEARCH_DATA } from '../../test-data/search-data';

test.describe('productsList API', () => {
  test('GET products list returns 200 and non-empty products array', async ({ request }) => {
    const response = await request.get('/api/productsList');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST products list returns 405 method not supported', async ({ request }) => {
    const response = await request.post('/api/productsList');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });
});

test.describe('brandsList API', () => {
  test('GET brands list returns 200 and non-empty brands array', async ({ request }) => {
    const response = await request.get('/api/brandsList');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('PUT brands list returns 405 method not supported', async ({ request }) => {
    const response = await request.put('/api/brandsList');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });
});

test.describe('searchProduct API', () => {
  test('POST search product returns 200 and matching results', async ({ request }) => {
    const response = await request.post('/api/searchProduct', {
      form: {
        search_product: SEARCH_DATA.validSearch,
      },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);

    for (const product of body.products) {
      expect(product).toHaveProperty('name');
      expect(typeof product.name).toBe('string');
      expect(product.name.toLowerCase()).toContain(SEARCH_DATA.validSearch);
    }
  });

  test('POST search product returns 400 without required parameter', async ({ request }) => {
    const response = await request.post('/api/searchProduct');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('search_product parameter is missing');
  });

  test('POST search product with empty string returns all products', async ({ request }) => {
    const response = await request.post('/api/searchProduct', {
      form: { search_product: '' },
    });

    expect(response.status()).toBe(200);
    const searchBody = await response.json();

    const allProductsResponse = await request.get('/api/productsList');
    expect(allProductsResponse.status()).toBe(200);
    const allProductsBody = await allProductsResponse.json();

    expect(searchBody.responseCode).toBe(200);
    expect(Array.isArray(searchBody.products)).toBe(true);

    expect(allProductsBody.responseCode).toBe(200);
    expect(Array.isArray(allProductsBody.products)).toBe(true);

    expect(searchBody.products.length).toBe(allProductsBody.products.length);

    const sortedAllProductsIDs = allProductsBody.products.map((el) => el.id).sort((a, b) => a - b);
    const sortedProductsIDs = searchBody.products.map((el) => el.id).sort((a, b) => a - b);
    expect(sortedProductsIDs).toEqual(sortedAllProductsIDs);
  });

  test('POST search product returns empty array for unknown query', async ({ request }) => {
    const response = await request.post('/api/searchProduct', {
      form: { search_product: SEARCH_DATA.invalidSearch },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(0);
  });

  test('POST search product is case insensitive', async ({ request }) => {
    const responseUpperCase = await request.post('/api/searchProduct', {
      form: { search_product: SEARCH_DATA.upperCaseSearch },
    });
    expect(responseUpperCase.status()).toBe(200);
    const bodyUpperCase = await responseUpperCase.json();

    const responseLowerCase = await request.post('/api/searchProduct', {
      form: { search_product: SEARCH_DATA.validSearch },
    });
    expect(responseLowerCase.status()).toBe(200);
    const bodyLowerCase = await responseLowerCase.json();

    expect(bodyUpperCase.responseCode).toBe(200);
    expect(bodyLowerCase.responseCode).toBe(200);

    const bodyUpperCaseIds = bodyUpperCase.products.map((el) => el.id).sort((a, b) => a - b);

    const bodyLowerCaseIds = bodyLowerCase.products.map((el) => el.id).sort((a, b) => a - b);

    expect(bodyUpperCaseIds).toEqual(bodyLowerCaseIds);
  });
});

test.describe('verifyLogin API', () => {
  test('POST verify login returns 200 for valid credentials', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: VALID_USER.email, password: VALID_USER.password },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('User exists');
  });

  test('POST verify login returns 404 for non-existing email', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: INVALID_DATA.wrongEmail, password: VALID_USER.password },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('POST verify login returns 404 for invalid password', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: VALID_USER.email, password: INVALID_DATA.wrongPassword },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('POST verify login returns 404 when email is missing', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: INVALID_DATA.empty, password: VALID_USER.password },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('POST verify login returns 404 when password is missing', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: VALID_USER.email, password: INVALID_DATA.empty },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('POST verify login returns 404 when email and password are missing', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: INVALID_DATA.empty, password: INVALID_DATA.empty },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('DELETE verifyLogin endpoint returns 405', async ({ request }) => {
    const response = await request.delete('/api/verifyLogin');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('method is not supported');
  });
});

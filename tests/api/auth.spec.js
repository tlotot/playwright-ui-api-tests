import { test, expect } from '@playwright/test';
import { VALID_USER, INVALID_DATA } from '../../test-data/users';
import Ajv from 'ajv';

test.use({
  baseURL: 'https://conduit-api.bondaracademy.com',
});

test.describe('POST /api/users/login', () => {
  test('returns token with valid credentials', async ({ request }) => {
    const loginPayload = {
      user: {
        email: VALID_USER.email,
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    expect(body.user.email).toBe(VALID_USER.email);
    expect(body.user.token).toEqual(expect.any(String));
  });

  test('returns response matching user schema', async ({ request }) => {
    const loginPayload = {
      user: {
        email: VALID_USER.email,
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    const schema = {
      type: 'object',
      required: ['user'],
      properties: {
        user: {
          type: 'object',
          required: ['email', 'token'],
          properties: {
            email: { type: 'string' },
            token: { type: 'string', minLength: 1 },
            username: { type: 'string' },
            bio: { type: ['string', 'null'] },
            image: { type: ['string', 'null'] },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    };

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    expect(validate(body)).toBe(true);
  });

  test('returns 403 with wrong password', async ({ request }) => {
    const loginPayload = {
      user: {
        email: VALID_USER.email,
        password: INVALID_DATA.wrongPassword,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('returns 403 with wrong email', async ({ request }) => {
    const loginPayload = {
      user: {
        email: INVALID_DATA.wrongEmail,
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('returns 403 with invalid email and password', async ({ request }) => {
    const loginPayload = {
      user: {
        email: INVALID_DATA.wrongEmail,
        password: INVALID_DATA.wrongPassword,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('returns 422 when password is empty', async ({ request }) => {
    const loginPayload = {
      user: {
        email: VALID_USER.email,
        password: INVALID_DATA.empty,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors.password[0]).toBe("can't be blank");
  });

  test('returns 422 when email is empty', async ({ request }) => {
    const loginPayload = {
      user: {
        email: INVALID_DATA.empty,
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors.email[0]).toBe("can't be blank");
  });

  test('returns 403 with invalid email format', async ({ request }) => {
    const loginPayload = {
      user: {
        email: INVALID_DATA.invalidEmailFormat,
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
  });

  test('returns 422 with missing email key', async ({ request }) => {
    const loginPayload = {
      user: {
        password: VALID_USER.password,
      },
    };

    const response = await request.post('/api/users/login', {
      data: loginPayload,
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors.email[0]).toBe("can't be blank");
  });

  test('does not allow GET request', async ({ request }) => {
    const response = await request.get('/api/users/login');

    expect(response.status()).toBe(404);

    const body = await response.text();

    expect(body).toContain('Cannot GET /api/users/login');
  });
});

import { test, expect } from '@playwright/test';
import { VALID_USER, INVALID_DATA } from '../../test-data/users';
import Ajv from 'ajv';

test.describe('POST /api/users/login', () => {
  test('POST /api/users/login returns token with valid credentials', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: { user: { email: VALID_USER.email, password: VALID_USER.password } },
    });

    expect(response.status()).toBe(200);

    // verify response format (API returns JSON)
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    // verify returned user email
    expect(body.user.email).toBe(VALID_USER.email);

    // verify token exists and is string
    expect(body.user.token).toEqual(expect.any(String));
  });

  test('POST /api/users/login returns response matching user schema', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: VALID_USER.email,
          password: VALID_USER.password,
        },
      },
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
    const isValid = validate(body);

    if (!isValid) {
      console.log(validate.errors);
    }

    expect(isValid).toBe(true);
  });

  test('POST /api/users/login returns 403 with wrong password', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: { user: { email: VALID_USER.email, password: INVALID_DATA.wrongPassword } },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('POST /api/users/login returns 403 with wrong email', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: { user: { email: INVALID_DATA.wrongEmail, password: VALID_USER.password } },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('POST /api/users/login returns 403 with invalid email and password', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: INVALID_DATA.wrongEmail,
          password: INVALID_DATA.wrongPassword,
        },
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors['email or password']).toContain('is invalid');
    expect(body.user).toBeUndefined();
  });

  test('POST /api/users/login returns 422 when password is empty', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: VALID_USER.email,
          password: INVALID_DATA.empty,
        },
      },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors.password[0]).toBe("can't be blank");
  });

  test('POST /api/users/login returns 422 when email is empty', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: INVALID_DATA.empty,
          password: VALID_USER.password,
        },
      },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors.email[0]).toBe("can't be blank");
  });

  test('POST /api/users/login returns 403 with invalid email format', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: INVALID_DATA.invalidEmailFormat,
          password: VALID_USER.password,
        },
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors['email or password']).toContain('is invalid');
  });

  test('POST /api/users/login returns 403 with missing email key', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          password: VALID_USER.password,
        },
      },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors.email[0]).toBe("can't be blank");
  });

  test('POST /api/users/login does not allow GET request', async ({ request }) => {
    const response = await request.get('https://conduit-api.bondaracademy.com/api/users/login');

    expect(response.status()).toBe(404);

    const body = await response.text();

    expect(body).toContain('Cannot GET /api/users/login');
  });
});

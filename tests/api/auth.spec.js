import { test, expect } from '@playwright/test';
import { VALID_USER, INVALID_DATA } from '../../test-data/users';

test('POST /api/users/login returns token with valid credentials', async ({ request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { user: { email: VALID_USER.email, password: VALID_USER.password } },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.user.email).toBe(VALID_USER.email);
  expect(body.user.token).toEqual(expect.any(String));
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
        password: '',
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
        email: '',
        password: VALID_USER.password,
      },
    },
  });

  expect(response.status()).toBe(422);

  const body = await response.json();

  expect(body.errors).toBeDefined();
  expect(body.errors.email[0]).toBe("can't be blank");
});

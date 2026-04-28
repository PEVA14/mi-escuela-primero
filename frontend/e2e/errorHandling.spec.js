import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.describe('Login form validation', () => {
    test('shows validation error when submitting empty form', async ({ page }) => {
      await page.goto('/login');
      await page.click('button[type="submit"]');
      await expect(page.getByText('Por favor llena este espacio').first()).toBeVisible();
    });

    test('shows validation error for empty email only', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="contraseña"]', 'somepassword');
      await page.click('button[type="submit"]');
      await expect(page.getByText('Por favor llena este espacio')).toBeVisible();
    });

    test('shows validation error for empty password only', async ({ page }) => {
      await page.goto('/login');
      await page.fill('#correo', 'admin@test.com');
      await page.click('button[type="submit"]');
      await expect(page.getByText('Por favor llena este espacio')).toBeVisible();
    });
  });

  test.describe('Login API errors', () => {
    test('shows error message when credentials are wrong (401)', async ({ page }) => {
      await page.route('**/api/login', (route) =>
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ mensaje: 'Credenciales incorrectas' }),
        })
      );

      await page.goto('/login');
      await page.fill('#correo', 'wrong@test.com');
      await page.fill('input[name="contraseña"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      await expect(page.getByText('Credenciales incorrectas')).toBeVisible();
    });

    test('shows fallback error message on server error (500)', async ({ page }) => {
      await page.route('**/api/login', (route) =>
        route.fulfill({ status: 500, body: 'Internal Server Error' })
      );

      await page.goto('/login');
      await page.fill('#correo', 'admin@test.com');
      await page.fill('input[name="contraseña"]', 'somepassword');
      await page.click('button[type="submit"]');

      await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
    });

    test('shows error when network is completely unavailable', async ({ page }) => {
      await page.route('**/api/login', (route) => route.abort('failed'));

      await page.goto('/login');
      await page.fill('#correo', 'admin@test.com');
      await page.fill('input[name="contraseña"]', 'somepassword');
      await page.click('button[type="submit"]');

      await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
    });
  });

  test.describe('API failures — graceful degradation', () => {
    test('Home page still renders when /api/stats fails', async ({ page }) => {
      await page.route('**/api/stats', (route) =>
        route.fulfill({ status: 500, body: 'error' })
      );

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('nav')).toBeVisible();
    });

    test('Catalog page still renders when /api/escuelas fails', async ({ page }) => {
      await page.route('**/api/escuelas', (route) =>
        route.fulfill({ status: 500, body: 'error' })
      );

      await page.goto('/escuelas');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('nav')).toBeVisible();
    });

    test('Catalog page still renders when /api/escuelas is slow', async ({ page }) => {
      await page.route('**/api/escuelas', async (route) => {
        await new Promise((r) => setTimeout(r, 800));
        await route.continue();
      });

      await page.goto('/escuelas');
      await expect(page.locator('nav')).toBeVisible();
    });
  });
});

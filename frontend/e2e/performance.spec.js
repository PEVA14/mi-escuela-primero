import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home',    path: '/' },
  { name: 'Catalog', path: '/escuelas' },
  { name: 'Login',   path: '/login' },
];

const MAX_LOAD_MS = 4000;

test.describe('Performance', () => {
  for (const { name, path } of PAGES) {
    test(`${name} page loads in under ${MAX_LOAD_MS}ms`, async ({ page }) => {
      const start = Date.now();
      await page.goto(path);
      await page.waitForLoadState('load');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(MAX_LOAD_MS);
    });
  }

  test('Home page navigation timing: TTFB < 1s, DOM < 3s', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const timing = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType('navigation');
      return {
        ttfb: nav.responseStart - nav.requestStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      };
    });

    expect(timing.ttfb).toBeLessThan(1000);
    expect(timing.domContentLoaded).toBeLessThan(3000);
  });

  test('No JavaScript errors on Home page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('No JavaScript errors on Login page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/login');
    await page.waitForLoadState('load');
    expect(errors).toHaveLength(0);
  });

  test('NavBar is visible quickly (< 2s) on Home page', async ({ page }) => {
    await page.goto('/');
    const start = Date.now();
    await page.locator('nav').waitFor({ state: 'visible', timeout: 2000 });
    expect(Date.now() - start).toBeLessThan(2000);
  });
});

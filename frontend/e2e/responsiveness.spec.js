import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: 'mobile',  width: 375,  height: 812  },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1280, height: 800  },
];

test.describe('Responsiveness', () => {
  for (const { name, width, height } of BREAKPOINTS) {
    test.describe(`${name} (${width}px)`, () => {
      test.use({ viewport: { width, height } });

      test('Home page has no horizontal scroll', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('load');
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(width + 5);
      });

      test('Home page navbar is visible', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('nav')).toBeVisible();
      });

      test('Login form is visible and usable', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('load');
        await expect(page.locator('form')).toBeVisible();
        await expect(page.locator('#correo')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Inputs are fully within the viewport (not cut off)
        const input = page.locator('#correo');
        const box = await input.boundingBox();
        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width + 5);
      });

      test('Catalog page has no horizontal scroll', async ({ page }) => {
        await page.goto('/escuelas');
        await page.waitForLoadState('load');
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(width + 5);
      });
    });
  }

  test('Login page: "Donar Ahora" button visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /donar ahora/i })).toBeVisible();
  });

  test('Login page: form stacks vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await page.waitForLoadState('load');

    const emailBox = await page.locator('#correo').boundingBox();
    const submitBox = await page.locator('button[type="submit"]').boundingBox();

    // On mobile the submit button should be below the email input
    expect(submitBox.y).toBeGreaterThan(emailBox.y);
  });
});

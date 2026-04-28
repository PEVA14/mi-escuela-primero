import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { name: 'Home',    path: '/' },
  { name: 'Login',   path: '/login' },
  { name: 'Catalog', path: '/escuelas' },
];

test.describe('Accessibility', () => {
  for (const { name, path } of PAGES) {
    test(`${name} page has no critical/serious structural axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // color-contrast is excluded here because it depends on design decisions
      // and is tracked separately in the dedicated contrast test below.
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      const summary = critical
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');

      expect(critical, `Accessibility violations:\n${summary}`).toHaveLength(0);
    });
  }

  test('Login page passes color-contrast check (WCAG AA)', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    const violations = results.violations;
    const summary = violations.map((v) => `${v.id}: ${v.description}`).join('\n');
    expect(violations, `Color contrast violations:\n${summary}`).toHaveLength(0);
  });

  test('Login form inputs have associated labels', async ({ page }) => {
    await page.goto('/login');
    const inputs = await page.locator('input[required]').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('All visible buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    const buttons = await page.locator('button:visible').all();

    for (const btn of buttons) {
      const text = (await btn.textContent())?.trim();
      const ariaLabel = await btn.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/');
    const imgs = await page.locator('img').all();

    for (const img of imgs) {
      const alt = await img.getAttribute('alt');
      // alt="" is valid for decorative images; null/missing is the issue
      expect(alt).not.toBeNull();
    }
  });

  test('Page has a single h1', async ({ page }) => {
    await page.goto('/login');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
});

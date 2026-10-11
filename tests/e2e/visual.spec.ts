import { test, expect } from '@playwright/test';

const routes = ['/'];

for (const route of routes) {
  test(`visuel ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.001, fullPage: true });
  });
}

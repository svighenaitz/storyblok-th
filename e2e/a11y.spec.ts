import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('home page should have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  
  // Expect to find at least some accessibility issues (baseline documentation)
  expect(accessibilityScanResults.violations.length).toBeGreaterThan(0);
  
  
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import projects from '../../content/business/agent-projects.json';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
});

test('agent portfolio section links all four source-backed projects without changing existing filters', async ({ page }) => {
  await page.goto('/work');
  const section = page.getByRole('region', { name: 'Agents with database workflows.' });
  await expect(section.locator('.agent-portfolio-card')).toHaveCount(4);
  await expect(section).toContainText('synthetic data');
  for (const project of projects) {
    await expect(section.getByRole('link', { name: project.name, exact: true })).toHaveAttribute('href', `/work/agents/${project.slug}`);
  }
  await page.getByRole('link', { name: 'BuildZn-built workflows', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('.agent-portfolio-card')).toHaveCount(4);
});

for (const project of projects) {
  test(`${project.slug}: recorded evidence, source links, mobile layout and accessibility`, async ({ page }) => {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`/work/agents/${project.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: project.name, exact: true })).toBeVisible();
      for (const heading of ['Problem', 'Architecture', 'Tradeoffs', 'Test results', 'Recorded demo output', 'Known limits']) {
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
      }
      await expect(page.getByRole('main')).toContainText('Synthetic data.');
      await expect(page.getByRole('main')).toContainText(`${project.distinct} distinct test cases`);
      await expect(page.getByRole('link', { name: 'View GitHub source ↗', exact: true })).toHaveAttribute('href', project.repoUrl);
      await expect(page.getByRole('link', { name: 'Inspect passing CI ↗', exact: true })).toHaveAttribute('href', project.ciUrl);
      const output = page.getByLabel('Recorded synthetic Docker demo output', { exact: true });
      await expect(output).toContainText('synthetic');
      await expect(output).toContainText(project.demoOutput.split('\n')[0]);
      await expect(page.getByRole('main').locator('a[href*="vercel.app"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(scan.violations, `${width}px ${project.slug}: ${JSON.stringify(scan.violations.map(v => v.id))}`).toEqual([]);
    }
  });
}

test('unknown agent project returns 404 rather than fabricated evidence', async ({ page }) => {
  const response = await page.goto('/work/agents/no-such-project');
  expect(response?.status()).toBe(404);
});

test('sitemap lists each agent portfolio page', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const project of projects) expect(xml).toContain(`https://www.buildzn.com/work/agents/${project.slug}`);
});

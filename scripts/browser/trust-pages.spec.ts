import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const routes = ['/security', '/evidence', '/samples', '/samples/inquiry-pilot-scope', '/samples/inquiry-pilot-operating-notes'];
const origin = 'https://www.buildzn.com';
const samples = [
  { route: '/samples/inquiry-pilot-scope', filename: 'inquiry-pilot-scope.pdf', heading: 'Inquiry pilot: scope and acceptance' },
  { route: '/samples/inquiry-pilot-operating-notes', filename: 'inquiry-pilot-operating-notes.pdf', heading: 'Inquiry pilot: operating notes' },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
});

for (const width of [390, 320]) {
  test(`${width}px: trust pages are readable and identify their own content when shared`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const socialTitles = new Set<string>();
    const socialDescriptions = new Set<string>();
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBeTruthy();
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      const socialTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const socialDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(title.length, route).toBeGreaterThan(10);
      expect(description?.length, route).toBeGreaterThan(30);
      expect(socialTitle?.length, route).toBeGreaterThan(10);
      expect(socialDescription?.length, route).toBeGreaterThan(30);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + route);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', origin + route);
      expect(await page.locator('meta[property="og:image"]').first().getAttribute('content'), route).toContain(route + '/opengraph-image');
      titles.add(title);
      descriptions.add(description!);
      socialTitles.add(socialTitle!);
      socialDescriptions.add(socialDescription!);
    }
    for (const values of [titles, descriptions, socialTitles, socialDescriptions]) expect(values.size).toBe(routes.length);
  });
}

test('visitors can find the scope and operating documents from the pilot offer', async ({ page }) => {
  await page.goto('/pricing#inquiry-pilot');
  await page.getByRole('main').getByRole('link', { name: 'See a scope and acceptance document', exact: true }).click();
  await expect(page).toHaveURL(/\/samples\/inquiry-pilot-scope$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(samples[0].heading);
  await expect(page.getByText('This is a sample document using fictional business data.', { exact: true })).toHaveCount(1);
  for (const heading of ['6. Acceptance tests', '8. Fees, costs and payment', '9. Changes and handover']) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  await page.getByRole('main').getByRole('link', { name: 'Read the operating notes', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(samples[1].heading);
  await expect(page.getByText('This is a sample document using fictional business data.', { exact: true })).toHaveCount(1);
  for (const heading of ['5. Recognize a failure and recover', '6. Pause the workflow', '7. Rotate a key']) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
});

for (const sample of samples) {
  test(`${sample.filename}: visitors can download a real PDF`, async ({ page, request }) => {
    test.skip(!existsSync(path.join(process.cwd(), 'public/samples', sample.filename)), 'Generate sample PDFs after the first build, then run the final checks.');
    await page.goto(sample.route);
    const pending = page.waitForEvent('download');
    await page.getByRole('main').getByRole('link', { name: 'Download PDF', exact: true }).click();
    const download = await pending;
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).toBe(sample.filename);
    const downloadedPath = await download.path();
    expect(downloadedPath).not.toBeNull();
    expect(readFileSync(downloadedPath!).subarray(0, 5).toString()).toBe('%PDF-');
    const response = await request.get('/samples/' + sample.filename);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).length).toBeGreaterThan(1000);
  });
}

test('new pages are discoverable while internal pilot drafts and the held booking URL stay unpublished', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of routes) expect(xml).toContain(origin + route);
  expect(xml).not.toMatch(/case-study-template|first-inquiry-pilot-offer/);
  for (const route of ['/', '/contact', '/pricing', ...routes]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(await response.text(), route).not.toMatch(/https?:[^\s\"<>]*cal\.com/i);
  }
  for (const route of ['/docs/case-study-template.md', '/docs/first-inquiry-pilot-offer.md', '/case-study-template', '/first-inquiry-pilot-offer']) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
});

test('the hero draft works with keyboard input and reduced motion without a background API request', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const backgroundRequests: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    const appOrigin = new URL(String(test.info().project.use.baseURL || 'http://127.0.0.1:3100')).origin;
    if (url.pathname.startsWith('/api/') || (['fetch', 'xhr'].includes(request.resourceType()) && url.origin !== appOrigin)) backgroundRequests.push(request.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const reply = page.getByRole('textbox', { name: 'Reply draft', exact: true });
  await expect(reply).toBeVisible();
  expect(backgroundRequests).toEqual([]);
  expect(await page.locator('[aria-label="Inquiry workflow"]').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await page.getByRole('link', { name: 'Explore the work', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(reply).toBeFocused();
  await page.keyboard.press('ControlOrMeta+A');
  const edited = 'Please confirm the workflow owner before I prepare the next step.';
  await page.keyboard.type(edited);
  await expect(reply).toHaveValue(edited);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Open the inquiry workflow', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work\/inquiry-assistant$/);
});

test('unconfigured contact and commercial details stay out of public pages', async ({ page }) => {
  for (const route of ['/', '/contact', '/pricing', '/security', '/privacy', '/samples', ...samples.map(sample => sample.route)]) {
    await page.goto(route);
    expect(await page.getByRole('main').innerText(), route).not.toMatch(/\b(?:TODO|TBD|to be confirmed)\b|\[\s*\]/i);
  }
  await page.goto('/contact');
  await expect(page.getByRole('main')).not.toContainText('Reply time:');
  await page.goto('/pricing');
  await expect(page.getByRole('main')).not.toContainText('Fixed discovery fee:');
  await expect(page.getByRole('main')).not.toContainText('Inquiry pilot:');
});

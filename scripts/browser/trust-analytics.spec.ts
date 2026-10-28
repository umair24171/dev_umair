import { test, expect, type Page } from '@playwright/test';
type RecordedEvent = { name: string; parameters: Record<string, string> };
async function events(page: Page): Promise<RecordedEvent[]> {
  return page.evaluate(() => {
    const entries = (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
    return entries.flatMap(entry => {
      const row = Array.from(entry as ArrayLike<unknown>);
      return row[0] === 'event' ? [{ name: row[1] as string, parameters: row[2] as Record<string, string> }] : [];
    });
  });
}
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/[^/]*(?:google-analytics|googletagmanager)\.com\//, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});
test('requested conversion events use consent and controlled categories', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'accepted'));
  await page.goto('/pricing');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'pricing_view')).toBeTruthy();
  await page.goto('/security');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'security_view')).toBeTruthy();
  await page.goto('/work/support-assistant');
  await page.getByRole('button', { name: 'Find grounded answer' }).click();
  await expect.poll(async () => (await events(page)).filter(e => ['demo_run','demo_complete'].includes(e.name)).length).toBe(2);
  for (const event of (await events(page)).filter(e => ['demo_run','demo_complete'].includes(e.name))) {
    expect(event.parameters).toEqual({ page:'/work/[slug]', demo:'support-assistant', service:'ai-agents' });
  }
  await page.route('**/api/inquiries', route => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({accepted:true,ownerNotification:'disabled'}) }));
  await page.goto('/contact?service=ai-agents');
  await page.getByLabel('Name', { exact:true }).fill('Private fictional name');
  await page.getByLabel('Email', { exact:true }).fill('private@example.com');
  await page.getByLabel('Workflow brief').fill('Private fictional brief that must never reach analytics.');
  await page.getByRole('button', { name:'Send workflow brief' }).click();
  await expect.poll(async () => (await events(page)).some(e => e.name === 'form_submit')).toBeTruthy();
  const formEvents = (await events(page)).filter(e => ['form_start','form_submit'].includes(e.name));
  expect(formEvents.map(e => e.name)).toEqual(['form_start','form_submit']);
  for (const event of formEvents) expect(event.parameters).toEqual({ page:'/contact', demo:'none', service:'ai-agents' });
  expect(JSON.stringify(await events(page))).not.toContain('private@example.com');
  expect(JSON.stringify(await events(page))).not.toContain('Private fictional');
  await expect(page.getByRole('link', { name:'Book a call' })).toHaveCount(0);
});
test('declining analytics prevents requested custom events and Google script loading', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
  await page.goto('/work/support-assistant');
  await page.getByRole('button', { name:'Find grounded answer' }).click();
  expect(await events(page)).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});

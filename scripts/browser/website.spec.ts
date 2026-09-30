import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
});
test('inquiry: missing-data gate, local lead and approval reset', async ({ page }) => {
  await page.goto('/work/inquiry-assistant');
  await page.getByRole('button', { name: 'Missing information', exact: true }).click();
  await page.getByRole('button', { name: 'Structure requirements' }).click();
  await expect(page.getByText('Needs clarification:', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create sample lead', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Complete inquiry', exact: true }).click();
  await page.getByRole('button', { name: 'Structure requirements' }).click();
  await page.getByRole('button', { name: 'Create sample lead', exact: true }).click();
  await page.getByRole('button', { name: 'Approve draft locally', exact: true }).click();
  await expect(page.getByText('Approved in this preview. Nothing has been sent.')).toBeVisible();
  await page.getByLabel('Recorded draft · editable').fill('A revised sample draft');
  await expect(page.getByRole('button', { name: 'Approve draft locally', exact: true })).toBeEnabled();
  await page.getByLabel('Inquiry text', { exact: true }).fill('Name: Sample');
  await expect(page.getByText('Lead DEMO-001', { exact: false })).toHaveCount(0);
});
test('support: source citation and uncertainty handoff', async ({ page }) => {
  await page.goto('/work/support-assistant');
  await page.getByRole('button', { name: 'Find grounded answer' }).click();
  await expect(page.getByRole('link', { name: 'Source: KB-01' })).toBeVisible();
  await page.getByRole('button', { name: 'Outside coverage', exact: true }).click();
  await page.getByRole('button', { name: 'Find grounded answer' }).click();
  await expect(page.getByText('Human handoff required', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Source:/ })).toHaveCount(0);
});
test('invoice: validation, correction, review, export and approval invalidation', async ({ page }) => {
  await page.goto('/work/document-processing');
  await expect(page.getByRole('button', { name: 'Export CSV', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Mismatched total', exact: true }).click();
  await page.getByRole('button', { name: 'Extract fields' }).click();
  await expect(page.getByText('Subtotal + tax does not match', { exact: false })).toBeVisible();
  await expect(page.getByRole('checkbox')).toBeDisabled();
  await page.getByLabel('total', { exact: true }).fill('264.00');
  await expect(page.getByRole('checkbox')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export CSV', exact: true })).toBeDisabled();
  await page.getByRole('checkbox').check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV', exact: true }).click();
  const download = await downloadPromise; expect(download.suggestedFilename()).toBe('buildzn-sample-invoice.csv');
  const stream = await download.createReadStream(); let csv = ''; for await (const chunk of stream!) csv += chunk;
  expect(csv).toContain('"DEMO-1043"'); expect(csv).toContain('"264.00"');
  const jsonPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON', exact: true }).click();
  const jsonStream = await (await jsonPromise).createReadStream(); let json = ''; for await (const chunk of jsonStream!) json += chunk;
  expect(JSON.parse(json)).toMatchObject({ total: '264.00', reviewed: true, demonstration: true });
  await page.getByLabel('supplier', { exact: true }).fill('Sample Updated Supplier');
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Export CSV', exact: true })).toBeDisabled();
});
test('contact: simulated private capture success and failure without real storage writes', async ({ page }) => {
  let mode = 'error';
  await page.route('**/api/inquiries', route => route.fulfill({ status: mode === 'error' ? 500 : 200, contentType: 'application/json', body: mode === 'error' ? JSON.stringify({ error: 'Sample failure' }) : JSON.stringify({ accepted: true }) }));
  await page.goto('/contact');
  await page.getByLabel('Name', { exact: true }).fill('BuildZn sample check');
  await page.getByLabel('Email', { exact: true }).fill('sample@example.com');
  await page.getByLabel('What kind of work do you need?').selectOption('Automation repair');
  await page.getByLabel('Workflow brief').fill('Sample workflow check; no real submission.');
  await page.getByRole('button', { name: 'Send workflow brief' }).click();
  await expect(page.locator('form [role=alert]')).toContainText('could not be sent');
  await expect(page.getByLabel('Workflow brief')).toHaveValue('Sample workflow check; no real submission.');
  mode = 'success';
  await page.getByRole('button', { name: 'Send workflow brief' }).click();
  await expect(page.getByRole('status')).toContainText('Your brief was accepted.');
});
test('desktop and mobile: accessible routes, no overflow, keyboard menu', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/services', '/services/ai-agents', '/work', '/work/inquiry-assistant', '/work/support-assistant', '/work/document-processing', '/pricing', '/about', '/contact', '/blog', '/blog/n8n-webhook-not-working', '/work/nexusos-agent-operations', '/work/seo-content-agent', '/work/video-production-pipeline', '/privacy']) {
      await page.goto(route); await page.locator('h1').waitFor();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(scan.violations, `${width}px ${route}: ${JSON.stringify(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([]);
    }
  }
  await page.goto('/'); await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('dialog').getByRole('link', { name: 'Discuss your workflow', exact: true })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeFocused();
});

test('portfolio distinguishes source studies from working demos and provides valid captures',async({page})=>{
 await page.goto('/work?type=build');await expect(page.locator('.project-card')).toHaveCount(5);
 await page.getByRole('link',{name:'Interactive demos',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(3);
 for(const slug of ['nexusos-agent-operations','content-production-pipeline','video-production-pipeline','seo-content-agent','buildzn-web-platform']) {
  await page.goto('/work/'+slug);await expect(page.locator('.case-workbench')).toBeVisible();await expect(page.locator('.demo-workbench')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Inspect the evidence'})).toBeVisible();
  await page.locator('.demo-capture img').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.demo-capture img').evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBeTruthy();
 }
});

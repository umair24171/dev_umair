import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
});
test('inquiry: configurable service template, pending Owner review and approval reset', async ({ page }) => {
  await page.goto('/work/inquiry-assistant');
  const demo = page.frameLocator('iframe[title="SparkleClean fictional enquiry and Owner approval demo"]');
  await demo.getByRole('button', { name: 'Request a quote', exact: true }).click();
  await expect(demo.locator('#form-error')).toContainText('Name is required.');
  await demo.getByLabel('Name', { exact: true }).fill('Alex Taylor');
  await demo.getByLabel('Service', { exact: true }).selectOption('weekly-evening');
  await demo.getByLabel('Start date', { exact: true }).fill('30/02/2026');
  await demo.getByLabel('Message', { exact: true }).fill('Weekly evening office cleaning across 3 floors.');
  await demo.getByRole('button', { name: 'Request a quote', exact: true }).click();
  await expect(demo.locator('#form-error')).toContainText('dd/mm/yyyy');
  await demo.getByLabel('Start date', { exact: true }).fill('02/11/2026');
  await demo.getByRole('button', { name: 'Request a quote', exact: true }).click();
  await demo.getByRole('button', { name: 'Check details', exact: true }).click();
  await demo.getByRole('button', { name: 'Prepare reply draft', exact: true }).click();
  await expect(demo.locator('#prepared-reply')).toContainText('What is the total floor area in square metres?');
  await demo.getByRole('button', { name: 'Log the enquiry', exact: true }).click();
  await expect(demo.locator('#lead-status')).toHaveText('Awaiting review');
  await expect(demo.locator('#lead-time')).toContainText('Logged');
  await demo.getByRole('button', { name: 'Owner', exact: true }).click();
  await expect(demo.locator('#owner-message')).toContainText('3 floors');
  await expect(demo.locator('#owner-reply-state')).toHaveText('Draft, not sent');
  await demo.getByRole('button', { name: 'Approve reply', exact: true }).click();
  await expect(demo.locator('#owner-reply-state')).toHaveText('Approved, not sent');
  await demo.getByLabel('Reply draft', { exact: true }).fill('A revised reply.');
  await expect(demo.locator('#owner-reply-state')).toHaveText('Draft, not sent');
  await expect(demo.getByRole('button', { name: 'Approve reply', exact: true })).toBeEnabled();
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
  await page.route('**/api/inquiries', route => route.fulfill({ status: mode === 'error' ? 500 : 200, contentType: 'application/json', body: mode === 'error' ? JSON.stringify({ error: 'Sample failure' }) : JSON.stringify({ accepted: true, ownerNotification: 'accepted', receipt: 'on-screen' }) }));
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
  await expect(page.getByRole('status')).toContainText('email service accepted an owner notification');
});
test('desktop and mobile: accessible routes, no overflow, keyboard menu', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/services', '/services/ai-agents', '/services/workflow-automation', '/services/api-integrations', '/services/automation-repair', '/work', '/work/inquiry-assistant', '/work/support-assistant', '/work/document-processing', '/pricing', '/about', '/contact', '/blog', '/blog/n8n-webhook-not-working', '/work/nexusos-agent-operations', '/work/seo-content-agent', '/work/video-production-pipeline', '/work/content-production-pipeline', '/work/buildzn-web-platform', '/blog/ai-workflow-scope-human-review', '/blog/automation-operating-costs', '/blog/automation-validation-before-export', '/blog/ai-blog-writer-duplicate-topics', '/blog/agent-kill-boundary', '/privacy']) {
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
 await page.getByRole('link',{name:'BuildZn-built workflows',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(3);
 for(const slug of ['nexusos-agent-operations','content-production-pipeline','video-production-pipeline','seo-content-agent','buildzn-web-platform']) {
  await page.goto('/work/'+slug);await expect(page.locator('.case-workbench')).toBeVisible();await expect(page.locator('.demo-workbench')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Inspect the evidence'})).toBeVisible();
  await page.locator('.demo-capture img').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.demo-capture img').evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBeTruthy();
 }
});

test('saved inquiry with uncertain mail shows an honest receipt instead of a submission failure', async ({page}) => {
  await page.route('**/api/inquiries', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({accepted:true,ownerNotification:'uncertain',receipt:'on-screen'})}));
  await page.goto('/contact');
  await page.getByLabel('Name',{exact:true}).fill('Controlled mail failure');
  await page.getByLabel('Email',{exact:true}).fill('sample@example.com');
  await page.getByLabel('What kind of work do you need?').selectOption('Workflow automation');
  await page.getByLabel('Workflow brief').fill('Controlled saved inquiry with uncertain notification.');
  await page.getByRole('button',{name:'Send workflow brief'}).click();
  await expect(page.getByRole('status')).toContainText('Your brief was accepted.');
  await expect(page.getByRole('status')).toContainText('Owner email notification could not be confirmed');
  await expect(page.locator('form [role=alert]')).toHaveCount(0);
});

test('BuildZn workflow pages connect authorship, running code and public implementation evidence', async ({page}) => {
 for(const slug of ['inquiry-assistant','support-assistant','document-processing']) {
  await page.goto('/work/'+slug);
  await expect(page.getByRole('heading',{name:'Designed and built by BuildZn.'})).toBeVisible();
  await expect(page.getByRole('region',{name:'BuildZn-built interactive workflow'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Workflow logic built by BuildZn'})).toHaveAttribute('href',slug==='inquiry-assistant'?'https://github.com/umair24171/dev_umair/blob/preview/sparkleclean-commercial-20261027/public/demos/inquiry-workflow/app.js':'https://github.com/umair24171/dev_umair/blob/main/lib/demos.ts');
  await expect(page.getByRole('link',{name:'Interactive interface and review gates'})).toHaveAttribute('href',slug==='inquiry-assistant'?'https://github.com/umair24171/dev_umair/blob/preview/sparkleclean-commercial-20261027/app/components/CommercialInquiryDemo.tsx':'https://github.com/umair24171/dev_umair/blob/main/app/components/DemoWorkbench.tsx');
  await expect(page.getByRole('heading',{name:'What BuildZn can implement'})).toHaveCount(0);
 }
});

test('service interest carries into an editable inquiry and optional fields stay optional', async ({ page }) => {
  let submitted: Record<string, string> | undefined;
  await page.route('**/api/inquiries', async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ accepted: true, ownerNotification: 'accepted' }) });
  });
  await page.goto('/services/ai-agents');
  await expect(page.getByRole('link', { name: 'Support assistant' })).toHaveAttribute('href', '/work/support-assistant');
  await page.getByRole('link', { name: 'Discuss your workflow' }).last().click();
  await expect(page.getByLabel('What kind of work do you need?')).toHaveValue('AI agents');
  await expect(page.getByLabel('Budget range')).not.toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('Sample inquiry');
  await page.getByLabel('Email', { exact: true }).fill('sample@example.com');
  await page.getByLabel('What kind of work do you need?').selectOption('Something else');
  await page.getByLabel('Workflow brief').fill('Please help me choose a starting point for repetitive admin.');
  await page.getByRole('button', { name: 'Send workflow brief' }).click();
  await expect(page.getByRole('status')).toContainText('Your brief was accepted.');
  expect(submitted).toMatchObject({ projectType: 'Something else', budget: '', source: 'direct' });
});
test('unknown or repeated service parameters leave the inquiry choice empty', async ({ page }) => {
  for (const query of ['service=unknown', 'service=ai-agents&service=automation-repair']) {
    await page.goto('/contact?' + query);
    await expect(page.getByLabel('What kind of work do you need?')).toHaveValue('');
  }
  await page.goto('/contact?service=automation-repair');
  await page.getByText('Budget and referral details', { exact: false }).click();
  await page.getByLabel('Budget range').selectOption('Under $1,000');
  await expect(page.getByLabel('Budget range')).toHaveValue('Under $1,000');
});

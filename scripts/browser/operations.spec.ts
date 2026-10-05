import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const password = process.env.OPS_TEST_PASSWORD || 'controlled-ops-test-password';
const unique = () => `Sample Operations ${Date.now()}`;
async function login(page: import('@playwright/test').Page) {
    if (process.env.OPS_TEST_SESSION) {
        await page.context().addCookies([{name:'buildzn-ops',value:process.env.OPS_TEST_SESSION,url:process.env.SMOKE_URL!,httpOnly:true,secure:true,sameSite:'Strict'}]);
        await page.goto('/ops');
    } else {
        await page.goto('/ops');
        await page.getByLabel('Operations password').fill(password);
        await page.getByRole('button', { name: 'Sign in securely' }).click();
    }
    await expect(page.getByRole('heading', { name: 'Your next conversation.' })).toBeVisible();
}
test('private workspace: complete inquiry, proposal, opt-out and review reset', async ({ page }) => {
    await login(page);
    const name = unique();
    await page.getByRole('button', { name: 'Add inquiry', exact: true }).click();
    await page.getByLabel('Contact name', { exact: true }).fill(name);
    await page.getByLabel('Contact email', { exact: true }).fill(`sample-${Date.now()}@example.com`);
    await page.getByLabel('Company', { exact: true }).fill('Sample studio');
    await page.getByLabel('Tools', { exact: true }).fill('Form and CRM');
    await page.getByLabel('Frequency / volume', { exact: true }).first().fill('20/week');
    await page.getByLabel('Budget', { exact: true }).first().fill('Not agreed');
    await page.getByLabel('Timing', { exact: true }).fill('After review');
    await page.getByLabel('Inquiry brief', { exact: true }).fill('Sample inquiry workflow to validate and draft owner-reviewed replies.');
    await page.getByRole('button', { name: 'Save inquiry', exact: true }).click();
    await expect(page.locator('.ops-detail h2')).toHaveText(name);
    await page.getByRole('button', { name: 'Confirm service fit and qualification' }).click();
    await page.getByRole('button', { name: 'Draft inquiry reply', exact: true }).click();
    await page.getByRole('button', { name: 'drafts', exact: true }).click();
    await page.getByRole('checkbox', { name: 'I reviewed facts, recipient, scope and all terms.' }).check();
    await page.getByRole('button', { name: 'Approve this version' }).click();
    await expect(page.getByRole('link', { name: 'Download approved draft' })).toBeVisible();
    await page.getByLabel('Editable reply draft').fill('Changed sample draft, no sending.');
    await expect(page.getByRole('link', { name: 'Download approved draft' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Save draft changes' }).click();
    await expect(page.getByRole('button', { name: 'Approve this version' })).toBeDisabled();
    await page.getByRole('button', { name: 'requirements', exact: true }).click();
    await page.getByRole('button', { name: 'Move to discovery' }).click();
    await page.getByRole('button', { name: 'discovery', exact: true }).click();
    await page.getByLabel('Discovery notes').fill('Approved sample scope: one form, one CRM, validation, no unattended messages.');
    await page.getByRole('button', { name: 'Save discovery notes' }).click();
    await expect(page.getByRole('button', { name: 'Approve saved discovery notes' })).toBeEnabled();
    await page.getByRole('button', { name: 'Approve saved discovery notes' }).click();
    await page.getByLabel('Internal proposed price (USD)').fill('800');
    await page.getByRole('button', { name: 'Draft proposal', exact: true }).click();
    await page.getByRole('button', { name: 'drafts', exact: true }).click();
    const proposal = page.locator('.ops-draft').filter({ has: page.getByRole('heading', { name: 'proposal', exact: true }) });
    await proposal.getByRole('checkbox').check();
    await proposal.getByRole('button', { name: 'Approve this version' }).click();
    await page.getByRole('button', { name: 'discovery', exact: true }).click();
    await page.getByRole('button', { name: 'Advance approved proposal' }).click();
    await expect(page.locator('.ops-detail header .ops-tag')).toHaveText('proposal');
    await page.getByRole('button', { name: 'requirements', exact: true }).click();
    await page.getByRole('button', { name: 'Record opt-out' }).click();
    await expect(page.getByText('Contact is closed.', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Draft inquiry reply' })).toBeDisabled();
});
test('private evidence -> assessment -> outreach and approved public case study', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Add inquiry', exact: true }).click();
    const name = unique();
    await page.getByLabel('Contact name', { exact: true }).fill(name);
    await page.getByLabel('Contact email', { exact: true }).fill(`evidence-sample-${Date.now()}@example.com`);
    await page.getByLabel('Inquiry brief', { exact: true }).fill('Public sample request for workflow webhook help; no real prospect.');
    await page.getByRole('button', { name: 'Save inquiry', exact: true }).click();
    await expect(page.locator('.ops-detail h2')).toHaveText(name);
    await page.getByRole('button', { name: 'evidence', exact: true }).click();
    await page.getByLabel('Evidence URL').fill('https://github.com/n8n-io/n8n/issues/123');
    await page.getByLabel('Source date').fill('2026-09-01');
    await page.getByLabel('Exact evidence / supplied workflow notes').fill('Controlled sample workflow shows repeated webhook deliveries. Runtime not verified.');
    await page.getByRole('button', { name: 'Add evidence for review' }).click();
    await page.getByRole('button', { name: 'Approve this evidence' }).click();
    await page.getByRole('button', { name: 'Draft technical assessment' }).click();
    await page.getByRole('button', { name: 'drafts', exact: true }).click();
    await page.getByRole('checkbox', { name: 'I reviewed facts, recipient, scope and all terms.' }).check();
    await page.getByRole('button', { name: 'Approve this version' }).click();
    await page.getByRole('button', { name: 'evidence', exact: true }).click();
    await page.getByRole('button', { name: 'Prepare outreach draft' }).click();
    await page.getByRole('button', { name: 'drafts', exact: true }).click();
    await expect(page.getByLabel('Editable outreach draft')).toContainText('have not inspected your runtime');
    await page.getByRole('button', { name: 'Content studio', exact: true }).click();
    await page.getByRole('checkbox', { name: 'I reviewed the selected public evidence and its limitations.' }).check();
    await page.getByRole('button', { name: 'Prepare content draft' }).click();
    await expect(page.getByLabel('Editable case-study draft').last()).toContainText('No savings');
});
test('access controls, prevention of sending and provider cost gate', async ({ request }) => {
    expect((await request.get('/api/ops/action')).status()).toBe(401);
    expect((await request.post('/api/ops/inquiry-notifications',{data:{leadId:crypto.randomUUID()}})).status()).toBe(401);
    expect((await request.get('/api/ops/export?draft=missing')).status()).toBe(401);
    const base = process.env.SMOKE_URL || 'http://127.0.0.1:3100';
    expect((await request.post('/api/ops/action', { headers: { Origin: 'https://evil.example' }, data: { action: 'send', key: crypto.randomUUID() } })).status()).toBe(401);
    const login = await request.post('/api/ops/session', { headers: { Origin: base }, data: { password } });
    expect(login.status()).toBe(200);
    const cookie = login.headers()['set-cookie'].split(';')[0];
    const command = async (action: string) => request.post('/api/ops/action', { headers: { Origin: base, Cookie: cookie }, data: { action, key: crypto.randomUUID(), data: { topic: 'inquiry-approval-reset' } } });
    expect((await command('send')).status()).toBe(403);
    expect((await command('publish')).status()).toBe(403);
    const inquiry = {name:'Controlled public capture',email:`controlled-${Date.now()}@example.com`,message:'Controlled sample inquiry for private capture and duplicate verification.',source:'referral',sample:true};
    const submit=()=>request.post('/api/inquiries',{headers:{Origin:base},data:inquiry});
    const first=await submit();expect(first.status()).toBe(200);expect(await first.json()).toEqual({accepted:true,ownerNotification:'disabled',receipt:'on-screen'});expect((await submit()).status()).toBe(200);
    const records=await (await request.get('/api/ops/action',{headers:{Cookie:cookie}})).json();
    const matching=records.leads.filter((lead:{email:string})=>lead.email===inquiry.email);expect(matching).toHaveLength(1);expect(matching[0].sample).toBe(false);expect(matching[0].source).toBe('referral');
    expect((await request.post('/api/ops/action',{headers:{Origin:base,Cookie:cookie},data:{action:'mark-sample',key:crypto.randomUUID(),data:{leadId:matching[0].id,sample:true}}})).status()).toBe(200);
    expect((await request.post('/api/inquiries',{headers:{Origin:base},data:{...inquiry,email:'invalid'}})).status()).toBe(400);

    const ai = await command('article');
    expect(ai.status()).toBe(process.env.OPS_TEST_AI_RESERVATION_EXHAUSTED ? 429 : 503);
    expect((await ai.json()).error).toContain(process.env.OPS_TEST_AI_RESERVATION_EXHAUSTED ? 'daily spending ceiling' : 'spending is disabled');
    expect((await request.post('/api/ops/action', { headers: { Origin: 'https://evil.example', Cookie: cookie }, data: { action: 'capture', key: crypto.randomUUID(), data: {} } })).status()).toBe(403);
});
test('desktop and mobile accessibility, keyboard use and no internal analytics', async ({ page }) => {
    await login(page);
    for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        for (const section of ['Pipeline', 'Research & SEO', 'Content studio', 'Performance', 'Activity & failures', 'Operating controls']) {
            await page.getByRole('button', { name: section, exact: true }).click();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${section} ${width}px`).toBeTruthy();
            const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
            expect(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
        }
    }
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
});

test('simulated stale SEO run preserves the last valid plan without crashing', async ({page}) => {
    await login(page);
    await page.route('**/api/ops/action',async route=>{
        if(route.request().method()!=='GET')return route.continue();
        const response=await route.fetch(),state=await response.json();
        await route.fulfill({response,json:{...state,jobs:[...state.jobs,
            {id:'simulated-valid-plan',kind:'seo-plan',status:'review',startedAt:new Date().toISOString(),attempts:0,reservedCalls:0,result:{topics:[],metricsDisclosure:'Simulated frontend test only',searchConsoleContext:'Simulated last valid plan retained'}},
            {id:'simulated-stale-skip',kind:'seo-plan',status:'review',startedAt:new Date().toISOString(),attempts:0,reservedCalls:0,result:{status:'skipped',reason:'Fresh actual Search Console export required'}}]}});
    });
    await page.getByRole('button',{name:'Refresh records',exact:true}).click();
    await page.getByRole('button',{name:'Research & SEO',exact:true}).click();
    await expect(page.getByText('Simulated last valid plan retained')).toBeVisible();
    await expect(page.getByRole('heading',{name:'Prioritize useful content.'})).toBeVisible();
});

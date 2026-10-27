import { chromium } from '@playwright/test';
import fs from 'node:fs';
const base=process.env.SMOKE_URL || 'http://127.0.0.1:3100';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
await page.addInitScript(()=>localStorage.setItem('buildzn-analytics-consent','declined'));
fs.mkdirSync('public/demos',{recursive:true});
for(const slug of ['inquiry-assistant','support-assistant','document-processing']) {
  await page.goto(`${base}/work/${slug}`); await page.locator('.demo-workbench').waitFor();
  if(slug==='inquiry-assistant') { const f=page.frameLocator('iframe'); await f.locator('#name').fill('Alex Taylor'); await f.locator('#service').selectOption('weekly-evening'); await f.locator('#date').fill('02/11/2026'); await f.locator('#message').fill('Weekly evening office cleaning across 3 floors.'); for(const id of ['submit-enquiry','validate','draft-ack','log-lead']) await f.locator('#'+id).click(); await f.locator('#tab-owner').click(); }
  if(slug==='support-assistant') await page.getByRole('button',{name:'Find grounded answer'}).click();
  if(slug==='document-processing') { await page.getByRole('button',{name:'Extract fields'}).click(); await page.getByRole('checkbox').check(); const download=page.waitForEvent('download'); await page.getByRole('button',{name:'Export JSON',exact:true}).click(); await (await download).saveAs('public/demos/document-processing-output.json'); }
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.demo-workbench').screenshot({animations:'disabled',style:'.site-header { visibility: hidden !important; }',path:`public/demos/${slug}.png`});
  console.log(`Captured actual working preview: ${slug}`);
}
await browser.close();

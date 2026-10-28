import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.SMOKE_URL || 'http://127.0.0.1:3100';
const samples = ['inquiry-pilot-scope', 'inquiry-pilot-operating-notes'];
const target = path.resolve('public/samples');
const captures = path.resolve('work/sample-document-captures');
await mkdir(target, { recursive: true });
await mkdir(captures, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => localStorage.setItem('buildzn-analytics-consent', 'declined'));
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  for (const slug of samples) {
    const response = await page.goto(base + '/samples/' + slug, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error('Could not load sample document: ' + slug);
    await page.getByRole('main').getByRole('heading', { level: 1 }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (!canonical || new URL(canonical).origin !== 'https://www.buildzn.com') throw new Error('Missing verified canonical URL: ' + slug);
    // Downloaded documents must keep working when generated on a local or preview server.
    await page.locator('main a[href]').evaluateAll((links, url) => {
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) link.setAttribute('href', new URL(href, url).href);
      }
    }, canonical);
    const filename = path.join(target, slug + '.pdf');
    await page.pdf({ path: filename, format: 'A4', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true, outline: true });
    const bytes = await readFile(filename);
    if (bytes.subarray(0, 5).toString() !== '%PDF-' || bytes.length < 1000) throw new Error('Invalid PDF: ' + slug);
    await page.screenshot({ path: path.join(captures, slug + '-print.png'), fullPage: true, animations: 'disabled' });
    console.log('Created ' + path.relative(process.cwd(), filename) + ' (' + bytes.length + ' bytes)');
  }
} finally {
  await browser.close();
}

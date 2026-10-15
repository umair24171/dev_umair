import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = 'https://www.buildzn.com';
await mkdir('live-audit', { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
 for (const width of [1440, 390, 320]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
   localStorage.setItem('buildzn-analytics-consent', 'declined');
   window.__auditLcp = 0; window.__auditCls = 0;
   new PerformanceObserver(list => { for (const e of list.getEntries()) window.__auditLcp = e.startTime; }).observe({type:'largest-contentful-paint', buffered:true});
   new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__auditCls += e.value; }).observe({type:'layout-shift', buffered:true});
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['/', '/contact', '/work', '/services', '/work/inquiry-assistant']) {
   const samples = [];
   for (let run = 0; run < 3; run++) {
    const response = await page.goto(base + route, {waitUntil:'load'});
    await page.waitForTimeout(1500);
    const data = await page.evaluate(() => {
     const n = performance.getEntriesByType('navigation')[0];
     return {ttfbMs:n.responseStart,domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,
      fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime || null,
      lcpMs:window.__auditLcp,cls:window.__auditCls,htmlEncodedBytes:n.encodedBodySize,
      resourceEncodedBytes:performance.getEntriesByType('resource').reduce((s,r)=>s+r.encodedBodySize,0),
      overflow:document.documentElement.scrollWidth > innerWidth,
      brokenImages:[...document.images].filter(i=>i.complete && !i.naturalWidth).map(i=>i.src)};
    });
    if (response?.status() !== 200 || data.overflow || data.brokenImages.length) throw new Error(JSON.stringify({route,width,status:response?.status(),...data}));
    samples.push(data);
   }
   await page.screenshot({path:'live-audit/'+(route === '/' ? 'home' : route.slice(1).replaceAll('/','-'))+'-'+width+'.png',fullPage:true});
   results.push({route,width,samples});
  }
  if(errors.length) throw new Error('Application errors: '+JSON.stringify(errors));
  await context.close();
 }
} finally { await browser.close(); await writeFile('live-audit/measurements.json',JSON.stringify({base,at:new Date().toISOString(),conditions:'Unthrottled headless Chromium on GitHub hosted Linux; three navigations per route and viewport with browser cache retained. Lab observations, not field Core Web Vitals or Lighthouse scores.',results},null,2)); }
for (const r of results) {
 const median = key => r.samples.map(s=>s[key]).sort((a,b)=>a-b)[1];
 console.log(JSON.stringify({route:r.route,width:r.width,medianTtfbMs:median('ttfbMs'),medianFcpMs:median('fcpMs'),medianLcpMs:median('lcpMs'),maxCls:Math.max(...r.samples.map(s=>s.cls))}));
}

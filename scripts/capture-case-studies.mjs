import { chromium } from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';
const base=process.env.SMOKE_URL || 'http://127.0.0.1:3100';
const file='content/business/projects.json';
const projects=JSON.parse(fs.readFileSync(file,'utf8'));
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
await page.addInitScript(()=>localStorage.setItem('buildzn-analytics-consent','declined'));
try {
  for(const project of projects.filter(p=>p.kind==='build')) {
    await page.goto(`${base}/work/${project.slug}`);await page.locator('.case-workbench').waitFor();await page.evaluate(()=>document.fonts.ready);
    await page.locator('.case-workbench').screenshot({path:`public${project.image}`});
    const image=await sharp(`public${project.image}`).metadata();project.imageWidth=image.width;project.imageHeight=image.height;
    console.log(`Captured actual source walkthrough: ${project.slug}`);
  }
  fs.writeFileSync(file,JSON.stringify(projects,null,2)+'\n');
} finally {await browser.close();}

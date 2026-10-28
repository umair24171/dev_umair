import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';

const projects=JSON.parse(await fs.readFile('content/business/agent-projects.json','utf8'));
const provenance=JSON.parse(await fs.readFile('docs/recorded-runs/provenance.json','utf8'));
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
 for(const project of projects){
  const source=provenance.find(item=>item.slug===project.slug);
  const raw=await fs.readFile('docs/recorded-runs/'+project.slug+'.log','utf8');
  if(createHash('sha256').update(raw).digest('hex')!==source.excerptSha256)throw new Error('Archived log hash mismatch: '+project.slug);
  const stdout=raw.trimEnd().split('\n').map(line=>line.replace(/^\S+\s+app-1\s+\|\s?/, '')).join('\n');
  if(stdout!==project.demoOutput)throw new Error('Recorded output mismatch: '+project.slug);
  await page.setContent('<!doctype html><html lang="en"><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;background:#0d1418;color:#eef3f1}main{width:1600px;height:900px;padding:40px;display:flex;align-items:center}pre{margin:0;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;font:400 18px/26px ui-monospace,"DejaVu Sans Mono",monospace;tab-size:2}</style><main><pre></pre></main></html>');
  await page.locator('pre').evaluate((pre,text)=>{pre.textContent=text},raw.trimEnd());
  const geometry=await page.locator('pre').boundingBox();
  if(!geometry||geometry.height>820)throw new Error('Output would be cropped: '+project.slug);
  if(await page.locator('pre').innerText()!==raw.trimEnd())throw new Error('Rendered log changed: '+project.slug);
  await page.locator('main').screenshot({path:'public'+project.image.src,animations:'disabled'});
  console.log('Captured verified recorded output: '+project.slug);
 }
} finally {await browser.close();}

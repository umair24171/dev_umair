#!/usr/bin/env node
// Disabled by both the checked-in manifest and an explicit runtime opt-in.
import fs from 'node:fs';
const configuration=JSON.parse(fs.readFileSync(new URL('../content/business/operations-schedules.json',import.meta.url),'utf8'));
const job=process.argv[2];const selected=configuration.jobs.find(j=>j.id===job);
if(configuration.enabled!==true||selected?.enabled!==true||process.env.OPS_JOBS_ENABLED!=='true'){
 console.log('Recurring operations are disabled. Review schedules, costs and access before explicit activation.');process.exit(0);
}
const origin=process.env.OPS_RUNNER_ORIGIN,password=process.env.OPS_RUNNER_PASSWORD;
if(!origin||!password||!/^https:\/\/(?:www\.)?buildzn\.com$/.test(origin))throw new Error('Use the approved HTTPS origin and a server-only owner credential.');
const login=await fetch(origin+'/api/ops/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({password}),signal:AbortSignal.timeout(60000)});
if(!login.ok)throw new Error('Operations runner sign-in failed. No job was dispatched.');
const cookie=login.headers.get('set-cookie')?.split(';')[0];if(!cookie)throw new Error('No authenticated runner session.');
const action=job==='public-requests'?'discover':job==='seo-plan'?'seo-plan':job==='follow-up-review'?'prepare-due-follow-ups':null;
if(!action)throw new Error('Unknown job.');
const data={};if(job==='seo-plan'){if(!process.env.SEARCH_CONSOLE_CSV||!process.env.SEARCH_CONSOLE_CONTEXT)throw new Error('Supply the actual Search Console export and reporting context.');data.csv=fs.readFileSync(process.env.SEARCH_CONSOLE_CSV,'utf8');data.range=process.env.SEARCH_CONSOLE_CONTEXT;}
const key=`scheduled-${job}-${new Date().toISOString().slice(0,10)}`;
const response=await fetch(origin+'/api/ops/action',{method:'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({action,key,data}),signal:AbortSignal.timeout(120000)});
if(!response.ok)throw new Error(`Scheduled preparation failed (HTTP ${response.status}). Inspect private activity; retry the same window key.`);
console.log('Draft/research preparation complete. No external message or publication was dispatched.');

#!/usr/bin/env node
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
export function selectedJobs(schedule, date = new Date()) {
 const local = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
 const [year,month,day] = local.split('-').map(Number),weekday=new Date(Date.UTC(year,month-1,day)).getUTCDay();
 if(schedule==='0 4 * * 1') return weekday===1?['public-requests']:[];
 if(schedule==='0 5 * * 1-5') return weekday>0&&weekday<6?['follow-up-review']:[];
 if(schedule==='15 4 1-3 * *') {
  if(weekday===0||weekday===6)return [];
  for(let earlier=1;earlier<day;earlier++){const w=new Date(Date.UTC(year,month-1,earlier)).getUTCDay();if(w>0&&w<6)return [];}
  return ['seo-plan'];
 }
 return [];
}
export async function runJob(job) {
 const configuration=JSON.parse(fs.readFileSync(new URL('../content/business/operations-schedules.json',import.meta.url),'utf8'));
 const selected=configuration.jobs.find(j=>j.id===job);
 if(configuration.enabled!==true||selected?.enabled!==true||process.env.OPS_JOBS_ENABLED!=='true') {
  console.log('Recurring operations are disabled.');return;
 }
 const origin=process.env.OPS_RUNNER_ORIGIN,secret=process.env.OPS_RUNNER_SECRET;
 if(!origin||!secret||!/^https:\/\/(?:www\.)?buildzn\.com$/.test(origin))throw new Error('Use the approved HTTPS origin and restricted runner credential.');
 for(let attempt=0;attempt<3;attempt++) {
  let response;
  try {response=await fetch(origin+'/api/ops/scheduled',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify({job}),signal:AbortSignal.timeout(130000)});}catch{if(attempt===2)throw new Error('Scheduled preparation could not connect after bounded retries.');}
  if(response?.ok){const result=await response.json();if(result.result?.status==='failed'||result.result?.error)throw new Error('Scheduled preparation recorded a failure. Inspect private activity before a manual retry.');console.log(JSON.stringify({job,status:result.result?.status||'complete',reason:result.result?.reason||undefined,noMessagesSent:true}));return;}
  if(response && ![409,429,500,502,503,504].includes(response.status))throw new Error('Scheduled preparation failed HTTP '+response.status);
  if(attempt===2)throw new Error('Scheduled preparation unavailable after bounded retries. Inspect private activity.');
  await new Promise(r=>setTimeout(r,1000*2**attempt));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const argument=process.argv[2];
 const jobs=argument==='--scheduled'?selectedJobs(process.env.OPS_EVENT_SCHEDULE):[argument];
 for(const job of jobs)await runJob(job);
}

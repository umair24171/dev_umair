import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPlan, topics, qualityGate, approvedRoutes, parseSearchConsoleCSV, history, safeSourceURL, fetchSource, geminiJSON, prepareDraft, normalizeDraft, resumeDraft } from '../lib/pipeline.js';

const plan=buildPlan({records:[]});
const topic=plan.topics.find(t=>t.id==='agent-kill-boundary');
const sources=topic.sources.map(s=>({...s,text:'The key authentication middleware checks the agent state. A killed agent receives a 403 response from the ingestion endpoint.',retrievedAt:'2026-10-01T00:00:00Z'}));
const limitation='Blocking log ingestion does not prove an external agent process has stopped.';
const paragraph='Check the point where the request enters the backend. Identify the credential used, the agent identifier and the state read by the middleware. A rejected request should remain visible in the caller’s error handling. Distinguish permission to send telemetry from permission to execute a tool outside this service. Keep each operational boundary explicit so a reviewer can reproduce the check without assuming that an entire distributed process has been terminated.';
const draft={title:'AI agent kill switch: verify the ingestion boundary',slug:topic.id,excerpt:'See what an AI agent kill switch blocks in a public ingestion middleware example, and verify the boundary before relying on it to stop external actions.',keyword:topic.keyword,intentKey:topic.intentKey,markdown:`The middleware checks agent state before allowing ingestion. ${paragraph}\n\n## Diagnose the control boundary\n${paragraph}\n\n## Follow the implementation\n${paragraph}\n\n## Verify the rejected request\n${paragraph}\n\n## Limitations before production\n${limitation}\n\nInspect the [public middleware](${sources[0].url}). Explore the [agent operations case study](/work/nexusos-agent-operations) and discuss [bounded AI agents](/services/ai-agents).`,claims:[{text:'The middleware checks agent state before allowing ingestion.',sourceIds:[sources[0].id]}],limitations:[limitation]};
const context={topic,sources,records:[],routes:approvedRoutes([])};
const brief={intentKey:topic.intentKey,reader:'Operations owner',searchIntent:'Understand the kill control boundary',answerPromise:'Explain exactly what is blocked',angle:'Public source inspection',sections:['Boundary','Implementation','Verification','Limitations'].map(heading=>({heading,purpose:'Explain the supplied source',sourceIds:[sources[0].id]})),proof:['Reviewed middleware'],limitations:[limitation],verificationSteps:['Check the state lookup','Check the rejected response']};
const pass={verdict:'pass',issues:[],unsupportedClaims:[],readerValue:'A concrete control boundary and verification path.'};

test('real Search Console queries rank relevant intent without inventing market volume',()=>{
 const signals=parseSearchConsoleCSV('\uFEFFTop queries,Clicks,Impressions,CTR,Position\r\n"AI agent kill switch",2,200,1%,12\r\n"query, with comma",0,10,0%,30\r\n');
 const ranked=buildPlan({records:[],signals});const item=ranked.topics.find(t=>t.id===topic.id);
 assert.equal(item.demand,'site-search-data');assert.equal(item.marketSearchVolume,null);assert.equal(item.searchData[0].impressions,200);assert.ok(item.score>topic.score);
 assert.throws(()=>parseSearchConsoleCSV('Top queries,Clicks,Impressions,CTR,Position\na,20,2,100%,1'),/Invalid/);
 assert.throws(()=>parseSearchConsoleCSV('query,volume\na,100'),/Queries export/);
});
test('existing intent is updated while a different intent in the cluster remains eligible',()=>{
 const current=buildPlan({records:[{title:topic.title,keyword:topic.keyword,intentKey:topic.intentKey,route:'/blog/control-boundary',state:'published'}]});
 assert.equal(current.topics.find(t=>t.id===topic.id).action,'update-existing');
 assert.equal(current.topics.find(t=>t.id==='audit-log-concurrency').action,'new-draft');
});
test('quarantined history cannot establish expertise and malformed draft registry fails closed',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'buildzn-history-'));
 try {fs.mkdirSync(path.join(dir,'content/posts'),{recursive:true});fs.writeFileSync(path.join(dir,'content/posts/unsafe.md'),'---\ntitle: Claimed success\nstatus: review\nreviewed: false\n---\n');assert.deepEqual(history(dir),[]);
 fs.mkdirSync(path.join(dir,'content/drafts/runs/bad'),{recursive:true});fs.writeFileSync(path.join(dir,'content/drafts/runs/bad/report.json'),'{truncated');assert.throws(()=>history(dir));}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('quality checks reject invented metrics, client claims, missing proof, broken routes and truncation',()=>{
 assert.deepEqual(qualityGate(draft,context).errors,[]);
 for(const text of ['We saved $5000 for a client.','Search volume: 9000','In today’s digital landscape, unlock the power.','<script>alert(1)</script>','```js\nconsole.log(1)']) assert.ok(qualityGate({...draft,markdown:draft.markdown+'\n'+text},context).errors.length,text);
 assert.ok(qualityGate({...draft,claims:[{text:'Unfounded',sourceIds:['invented']}]},context).errors.some(e=>e.includes('not retrieved')));
 assert.ok(qualityGate({...draft,markdown:draft.markdown.replace('/services/ai-agents','/services/mobile')},context).errors.some(e=>e.includes('no approved route')));
 assert.ok(qualityGate({...draft,markdown:draft.markdown+'\n[claim](https://unsupported.example/a)'},context).errors.some(e=>e.includes('not researched')));
 assert.ok(qualityGate({...draft,limitations:['A hidden caveat']},context).errors.some(e=>e.includes('missing')));
});
test('sources cannot fetch arbitrary hosts, credentials or a redirect to a private endpoint',async()=>{
 for(const url of ['http://docs.n8n.io/a','https://127.0.0.1/a','https://user:secret@docs.n8n.io/a','https://github.com/someone/private/blob/main/a']) assert.throws(()=>safeSourceURL(url));
 await assert.rejects(fetchSource({id:'redirect',url:'https://docs.n8n.io/a'},{fetcher:async()=>new Response(null,{status:302,headers:{location:'https://127.0.0.1/private'}})}),/approved public/);
 await assert.rejects(fetchSource({id:'missing',url:'https://docs.n8n.io/a'},{fetcher:async()=>new Response('missing',{status:404})}),/unavailable/);
});
test('provider rejects incomplete or malformed output; secrets never enter error text',async()=>{
 await assert.rejects(geminiJSON('review',{}, {apiKey:'sample-private-key',model:'test-model',fetcher:async()=>new Response(JSON.stringify({candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'{}'}]}}]}))}),/did not complete/);
 await assert.rejects(geminiJSON('review',{}, {apiKey:'sample-private-key',model:'test-model',fetcher:async()=>new Response('provider-secret-error',{status:403})}),error=>!error.message.includes('sample-private-key') && !error.message.includes('provider-secret-error'));
 await assert.rejects(geminiJSON('review',{}, {apiKey:'sample-private-key',model:'test-model',fetcher:async()=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:'{bad'}]}}]}))}),/invalid JSON/);
});
test('full workflow saves evidence and an unpublished draft; pending intent is recognized on the next run',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'buildzn-draft-'));
 try {const result=await prepareDraft(topic,{directory:dir,records:[],researcher:async s=>sources.find(x=>x.id===s.id),generator:async stage=>stage==='brief'?brief:stage==='draft'?draft:pass});
 assert.equal(result.report.status,'ready-for-human-review');const markdown=fs.readFileSync(path.join(result.runDir,'draft.md'),'utf8');assert.match(markdown,/status: "draft"/);assert.match(markdown,/reviewed: false/);assert.ok(!fs.existsSync(path.join(dir,'content/posts')));
 assert.equal(buildPlan({records:history(dir)}).topics.find(t=>t.id===topic.id).action,'review-existing-draft');}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('source failure or unresolved independent review preserves diagnostics without a final draft',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'buildzn-reject-'));
 try {const result=await prepareDraft(topic,{directory:dir,records:[],researcher:async s=>sources.find(x=>x.id===s.id),generator:async stage=>stage==='brief'?brief:stage==='draft'?draft:{...pass,verdict:'revise',unsupportedClaims:['Missing support']}});
 assert.equal(result.report.status,'failed');assert.equal(fs.existsSync(path.join(result.runDir,'draft.md')),false);assert.ok(fs.existsSync(path.join(result.runDir,'review-2.json')));
 const missing=await prepareDraft(topic,{directory:dir,records:[],researcher:async()=>{throw new Error('Source unavailable');},generator:async()=>{throw new Error('Should not call model');}});assert.equal(missing.report.error,'Source unavailable');}finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('renderer and metadata normalization use approved topic copy without truncating the article',()=>{
 const malformed={...draft,markdown:'# '+draft.title+'\n\n'+draft.markdown,excerpt:'A'.repeat(190)};
 const result=normalizeDraft(malformed,topic);
 assert.equal(result.draft.markdown,draft.markdown);assert.equal(result.draft.excerpt,topic.metaDescription);assert.equal(result.warnings.length,2);
 assert.deepEqual(qualityGate(result.draft,context).errors,[]);
});
test('existing public article revisions preserve their canonical slug and stay unpublished',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'buildzn-update-'));
 const record={title:topic.title,keyword:topic.keyword,intentKey:topic.intentKey,route:'/blog/existing-control',content:'Original reviewed scope',state:'published'};
 const update=buildPlan({records:[record]}).topics.find(t=>t.id===topic.id);
 try {const result=await prepareDraft(update,{directory:dir,records:[record],researcher:async s=>sources.find(x=>x.id===s.id),generator:async(stage,payload)=>stage==='brief'?brief:stage==='draft'?{...draft,slug:payload.topic.editorialSlug}:pass});
 assert.equal(result.report.status,'ready-for-human-review');assert.equal(JSON.parse(fs.readFileSync(path.join(result.runDir,'candidate-1.json'),'utf8')).slug,'existing-control');assert.equal(fs.existsSync(path.join(dir,'content/posts/existing-control.md')),false);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('resume reuses paid work, reruns review and rejects stale or arbitrary source packs',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'buildzn-resume-'));
 try {const fresh=sources.map(s=>({...s,sha256:'a'.repeat(64),retrievedAt:new Date().toISOString()}));
 const failed=await prepareDraft(topic,{directory:dir,records:[],researcher:async s=>fresh.find(x=>x.id===s.id),generator:async stage=>{if(stage==='review')throw new Error('Provider temporarily unavailable');return stage==='brief'?brief:draft;}});
 let calls=0;const recovered=await resumeDraft(path.basename(failed.runDir),{directory:dir,generator:async stage=>{calls++;assert.equal(stage,'review');return pass;}});
 assert.equal(recovered.report.status,'ready-for-human-review');assert.equal(calls,1);assert.equal(recovered.report.resumedFrom,path.basename(failed.runDir));
 await assert.rejects(resumeDraft('../outside',{directory:dir}),/arbitrary path/);
 const pack=JSON.parse(fs.readFileSync(path.join(failed.runDir,'sources.json'),'utf8'));pack[0].retrievedAt='2000-01-01T00:00:00Z';fs.writeFileSync(path.join(failed.runDir,'sources.json'),JSON.stringify(pack));
 // Remove the accepted new run to isolate the stale-evidence scenario.
 fs.rmSync(recovered.runDir,{recursive:true,force:true});
 await assert.rejects(resumeDraft(path.basename(failed.runDir),{directory:dir,generator:async()=>{throw new Error('Must not call provider');}}),/older than 24 hours/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

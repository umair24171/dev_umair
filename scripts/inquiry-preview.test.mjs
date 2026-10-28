import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
function loadRoute(stubs) {
  const source=fs.readFileSync(new URL('../app/api/inquiries/route.ts',import.meta.url),'utf8');
  const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}});
  const exports={};
  new Function('require','exports',outputText)(path=>{
    if(!(path in stubs))throw new Error('Unexpected route dependency: '+path);
    return stubs[path];
  },exports);
  return exports;
}
test('preview rejects before parsing, storage, owner alerts or any external request',async()=>{
  const previous=process.env.VERCEL_ENV,originalFetch=global.fetch;let calls=0;
  const forbidden=()=>{calls++;throw new Error('Side effect must not run');};
  const route=loadRoute({
    '@/lib/ops/inquiry-mail':{captureWithNotification:forbidden,deliverNotification:forbidden},
    '@/lib/ops/auth':{body:forbidden,failure:forbidden,sameOrigin:forbidden},
    '@/lib/ops/core':{hash:forbidden,OpsError:Error},
    '@/lib/ops/store':{transaction:forbidden},
  });
  try {
    process.env.VERCEL_ENV='preview';global.fetch=forbidden;
    const response=await route.POST(new Request('https://preview.example/api/inquiries',{method:'POST',body:'not even valid JSON'}));
    assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');
    const result=await response.json();assert.equal(result.accepted,undefined);assert.match(result.error,/https:\/\/www\.buildzn\.com\/contact/);
    assert.equal(calls,0);
  } finally {if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;global.fetch=originalFetch;}
});
test('production preserves the existing successful response without making external calls in the test',async()=>{
  const previous=process.env.VERCEL_ENV;let captured=0,notified=0;
  const route=loadRoute({
    '@/lib/ops/inquiry-mail':{captureWithNotification:()=>{captured++;return {leadId:'fictional-id'};},deliverNotification:async()=>{notified++;return 'disabled';}},
    '@/lib/ops/auth':{body:async()=>({name:'Fictional owner',email:'owner@example.com',message:'A fictional workflow inquiry.'}),failure:error=>{throw error;},sameOrigin:()=>{}},
    '@/lib/ops/core':{hash:()=> 'fictional-ip-hash',OpsError:Error},
    '@/lib/ops/store':{transaction:async callback=>callback({security:{}})},
  });
  try {
    process.env.VERCEL_ENV='production';
    const response=await route.POST(new Request('https://www.buildzn.com/api/inquiries',{method:'POST'}));
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{accepted:true,ownerNotification:'disabled',receipt:'on-screen'});
    assert.equal(captured,1);assert.equal(notified,1);
  } finally {if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});

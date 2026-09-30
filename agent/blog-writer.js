#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { root, topics, history, buildPlan, parseSearchConsoleCSV, discoverQuestions, prepareDraft, resumeDraft } from './lib/pipeline.js';
dotenv.config({path:path.join(root,'agent/.env'),quiet:true});
const [command='plan',...args]=process.argv.slice(2);
const option=name=>{const i=args.indexOf(name);if(i<0)return undefined;if(!args[i+1] || args[i+1].startsWith('--')) throw new Error(`Missing value for ${name}.`);return args[i+1];};
try {
  if(!['plan','draft','resume'].includes(command)) throw new Error('Use plan [--search-console file.csv] [--discover] [--out file.json] or draft [--topic topic-id] [--update] [--search-console file.csv], or resume --run run-directory [--update].');
  const csv=option('--search-console');const signals=csv?parseSearchConsoleCSV(fs.readFileSync(path.resolve(csv),'utf8')):[];
  const observations=args.includes('--discover')?await discoverQuestions():[];
  const plan=buildPlan({records:history(),signals,observations});
  const out=option('--out');if(out){fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(path.resolve(out),JSON.stringify(plan,null,2)+'\n');}
  if(command==='plan') {
    console.log(`BuildZn editorial plan — ${plan.topics.length} evidence-backed candidates.\n${plan.metricsDisclosure}`);
    for(const topic of plan.topics) console.log(`${topic.score} | ${topic.action} | ${topic.demand} | ${topic.id}\n  ${topic.title}${topic.existing?' → '+topic.existing.route:''}`);
  } else {
    if(!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) throw new Error('Set GEMINI_API_KEY and GEMINI_MODEL in agent/.env or the environment. No model calls were made.');
    let result;
    if(command==='resume') result=await resumeDraft(option('--run'),{allowUpdate:args.includes('--update')});
    else {
      const id=option('--topic');if(id && !topics.some(t=>t.id===id))throw new Error('Unknown topic ID. Run plan to inspect the approved backlog.');
      const topic=id?plan.topics.find(t=>t.id===id):plan.topics.find(t=>t.action==='new-draft');
      if(!topic)throw new Error('No new intent available. Review or update existing work.');
      if(topic.action==='update-existing' && !args.includes('--update')) throw new Error(`Intent already published at ${topic.existing.route}. Use --update to prepare an unpublished revision.`);
      result=await prepareDraft(topic);
    }
    console.log(`${result.report.status}: ${path.relative(root,result.runDir)}`);
    if(result.report.status!=='ready-for-human-review') throw new Error(result.report.error);
    console.log('Unpublished draft prepared. Inspect sources, brief, review reports and actual examples before manually approving publication.');
  }
} catch(error) {console.error(`Editorial workflow stopped: ${error.message}`);process.exitCode=1;}

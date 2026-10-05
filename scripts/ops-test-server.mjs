import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
const password=process.env.OPS_TEST_PASSWORD||'controlled-ops-test-password';const salt='buildzn-test-only';
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port',process.env.OPS_TEST_PORT||'3100'],{stdio:'inherit',env:{...process.env,OPS_PASSWORD_HASH:salt+':'+crypto.scryptSync(password,salt,64).toString('hex'),OPS_SESSION_SECRET:'test-session-only-'.repeat(4),OPS_DATA_KEY:'ab'.repeat(32),OPS_LOCAL_STORE:process.env.OPS_LOCAL_STORE||`work/private-ops-test/${Date.now()}-state.enc`,OPS_STORE_REPO:'',OPS_AI_ENABLED:'false',OPS_INQUIRY_NOTIFICATIONS:'disabled'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code||0));

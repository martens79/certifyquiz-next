// Run all children in the same isolated environment / network namespace.
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const env={...process.env,API_BASE_URL:'http://127.0.0.1:8459/api',API_BASE_URL_DEV:'http://127.0.0.1:8459/api',NEXT_PUBLIC_SITE_URL:'https://www.certifyquiz.com',NEXT_PUBLIC_SANITY_PROJECT_ID:'e2edummy',NEXT_PUBLIC_SANITY_DATASET:'test',NEXT_PUBLIC_GA_ID:'',NEXT_PUBLIC_META_PIXEL_ID:'',SANITY_READ_TOKEN:'',INTERNAL_SERVER_TOKEN:'',NEXT_TELEMETRY_DISABLED:'1'};
const children=[];
function start(args){const child=spawn(process.execPath,args,{env,stdio:['ignore','pipe','pipe']});children.push(child);child.stdout.resume();child.stderr.on('data',d=>process.stderr.write(d));return child;}
async function ready(url){for(let i=0;i<30;i++){try{const r=await fetch(url,{signal:AbortSignal.timeout(2000)});if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw Error(`Server did not become ready: ${url}`);}
try{
  start(['tests/helpers/eipass-editorial-backend.mjs']);
  await ready('http://127.0.0.1:8459/api/test-status');
  start(['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3459']);
  await ready('http://127.0.0.1:3459/it/certificazioni/eipass');
  const test=spawn(process.execPath,['scripts/verify-eipass-editorial-ssr.mjs'],{env,stdio:'inherit'});
  const [code]=await once(test,'exit');
  process.exitCode=code ?? 1;
}catch(error){console.error(error);process.exitCode=1;}
finally{for(const child of children)child.kill('SIGTERM');}

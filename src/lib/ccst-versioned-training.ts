// Opt-in transport/persistence controller used by the existing QuizEngine.
import type {AnswerCheckResult} from './apiClient';
export type TrainingLocale='en'|'it'|'fr'|'es';
export type TrainingState={marked:Record<string,number|null>;reviewLater:number[];currentIndex:number;evaluations?:Record<string,AnswerCheckResult & {answerId:number}>;completed?:boolean;summary?:{total:number;answered:number;correct:number;scorePct:number}};
export type TrainingQuestion={id:number;topic_id:number;question:string;contentVersion:string;contentHash:string;answers:{id:number;text:string}[];exhibit?:unknown};
export type TrainingAttempt={id:string;lang:TrainingLocale;certificationId:34;contentVersion:string;seed:number;startedAt:number;expiresAt:number|null;rev:number;state:TrainingState;expired:boolean;questions:TrainingQuestion[]};
type Pending={baseRev:number;state:TrainingState;base?:TrainingState};
type Handle={startKey:string;attemptId?:string;pending?:Pending};
type StorageLike={getItem(key:string):string|null;setItem(key:string,value:string):void};
type Request=(path:string,init?:{method?:string;body?:string})=>Promise<unknown>;
export class VersionedTrainingError extends Error{
 constructor(message:string,public status?:number,public server?:TrainingAttempt,public pending?:TrainingState){super(message);}
}
const same=(a:TrainingState,b:TrainingState)=>a.currentIndex===b.currentIndex&&JSON.stringify(a.reviewLater)===JSON.stringify(b.reviewLater)&&Object.keys(a.marked).length===Object.keys(b.marked).length&&Object.entries(a.marked).every(([k,v])=>b.marked[k]===v);
const navSame=(a:TrainingState,b:TrainingState)=>a.currentIndex===b.currentIndex&&JSON.stringify(a.reviewLater)===JSON.stringify(b.reviewLater);
// A write made against an older revision may be replayed only if the server moved by evaluations the local copy agrees with:
// same navigation as the copy we based the write on, not completed, and no answer that contradicts the local one.
const rebasable=(base:TrainingState|undefined,remote:TrainingState,local:TrainingState)=>!!base&&!remote.completed&&navSame(base,remote)&&Object.entries(remote.marked).every(([q,a])=>a==null||local.marked[q]==null||local.marked[q]===a);
const isStale=(e:unknown)=>e instanceof VersionedTrainingError&&e.status===409&&e.message==='STALE_REVISION';
const validState=(s:TrainingState)=>!!s&&typeof s==='object'&&!!s.marked&&typeof s.marked==='object'&&!Array.isArray(s.marked)&&Object.values(s.marked).every(v=>v===null||Number.isSafeInteger(v))&&Array.isArray(s.reviewLater)&&s.reviewLater.every(Number.isSafeInteger)&&Number.isSafeInteger(s.currentIndex)&&s.currentIndex>=0;
export function createVersionedTrainingClient({userId,topicId,lang,storage,request,randomKey=()=>globalThis.crypto.randomUUID()}:{userId:number;topicId:number;lang:TrainingLocale;storage:StorageLike;request:Request;randomKey?:()=>string}){
 if(!Number.isSafeInteger(userId)||userId<=0||!Number.isSafeInteger(topicId)||topicId<=0||!['en','it','fr','es'].includes(lang))throw new VersionedTrainingError('INVALID_SCOPE');
 const key=`cq:ccst34:versioned:${userId}:${topicId}:${lang}`;
 let latest:TrainingAttempt|null=null,opening:Promise<TrainingAttempt>|null=null,queue:Promise<unknown>=Promise.resolve();
 function load():Handle|null{const raw=storage.getItem(key);if(!raw)return null;try{const h=JSON.parse(raw);if(!h||typeof h.startKey!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(h.startKey)||(h.attemptId!==undefined&&typeof h.attemptId!=='string')||(h.pending&&(!Number.isSafeInteger(h.pending.baseRev)||h.pending.baseRev<0||!validState(h.pending.state)||(h.pending.base!==undefined&&!validState(h.pending.base)))))throw Error();return h;}catch{throw new VersionedTrainingError('PERSISTENCE_CORRUPT');}}
 function persist(h:Handle){const text=JSON.stringify(h);storage.setItem(key,text);if(storage.getItem(key)!==text)throw new VersionedTrainingError('PERSISTENCE_UNAVAILABLE');}
 function validate(raw:unknown,id?:string):TrainingAttempt{
  const a=raw as TrainingAttempt;
  if(!a||typeof a.id!=='string'||(id&&a.id!==id)||a.lang!==lang||a.certificationId!==34||!Number.isSafeInteger(a.rev)||a.rev<0||!Number.isSafeInteger(a.seed)||!Number.isFinite(a.startedAt)||!(a.expiresAt===null||Number.isFinite(a.expiresAt))||typeof a.expired!=='boolean'||!validState(a.state)||!Array.isArray(a.questions)||!a.questions.length||new Set(a.questions.map(q=>q.id)).size!==a.questions.length||a.questions.some(q=>!q||!Number.isSafeInteger(q.id)||q.topic_id!==topicId||typeof q.question!=='string'||!['legacy-v1','release-02-v2','release-03-v3','release-04-v4','release-05-v5','release-06-v6','release-07-v7','release-08-v8','release-09-v9','release-11-v11'].includes(q.contentVersion)||!/^[a-f0-9]{64}$/.test(q.contentHash)||!Array.isArray(q.answers)||q.answers.length!==4||new Set(q.answers.map(a=>a.id)).size!==4||q.answers.some(a=>!Number.isSafeInteger(a.id)||typeof a.text!=='string')))throw new VersionedTrainingError('INVALID_ATTEMPT_RESPONSE');
  return structuredClone(a);
 }
 async function pendingResume(a:TrainingAttempt,h:Handle):Promise<TrainingAttempt>{
  if(!h.pending)return a;const p=h.pending;
  if(same(a.state,p.state)){delete h.pending;persist(h);return a;}
  if(a.rev!==p.baseRev&&!rebasable(p.base,a.state,p.state))throw new VersionedTrainingError('PROGRESS_CONFLICT',409,a,p.state);
  const saved=await put(a,a.rev,p.state);
  delete h.pending;persist(h);return saved;
 }
 const put=async(a:TrainingAttempt,expectedRev:number,state:TrainingState)=>validate(await request(`/attempts/${encodeURIComponent(a.id)}/progress`,{method:'PUT',body:JSON.stringify({expectedRev,state})}),a.id);
 // Every call that depends on the server revision runs on this queue, so a PUT /progress never overlaps a POST /answers.
 const run=<T,>(task:()=>Promise<T>):Promise<T>=>{const job=queue.then(task);queue=job.catch(()=>{});return job;};
 // Reuse the cached attempt only when no unsent write is waiting; otherwise re-read the server and reconcile first.
 async function current(){const h=load();return latest&&!h?.pending?latest:await openInner();}
 function backupPending(p:Pending){const backupKey=`${key}:conflict:${Date.now()}`,backup=JSON.stringify(p);storage.setItem(backupKey,backup);if(storage.getItem(backupKey)!==backup)throw new VersionedTrainingError('PERSISTENCE_UNAVAILABLE');}
 async function openInner(){
  let h=load();if(!h){h={startKey:randomKey()};persist(h);}
  // Persist nonce before POST. A lost response retries the same server-issued attempt.
  const found=!h.attemptId?await request(`/latest?topicId=${topicId}&lang=${lang}`) as {attempt:unknown}:null;
  const raw=h.attemptId?await request(`/attempts/${encodeURIComponent(h.attemptId)}`):found?.attempt||await request('/attempts',{method:'POST',body:JSON.stringify({topicId,lang,idempotencyKey:h.startKey})});
  let a=validate(raw,h.attemptId);h.attemptId=a.id;persist(h);a=await pendingResume(a,h);latest=a;return structuredClone(a);
 }
 async function open(){if(!opening)opening=run(openInner).finally(()=>{opening=null;});return structuredClone(await opening);}
 function save(state:TrainingState):Promise<TrainingAttempt>{
  if(!validState(state))return Promise.reject(new VersionedTrainingError('INVALID_PROGRESS'));
  const frozen={marked:structuredClone(state.marked),reviewLater:[...state.reviewLater],currentIndex:state.currentIndex};
  return run(async()=>{const a=await current(),h=load();if(!h?.attemptId)throw new VersionedTrainingError('ATTEMPT_HANDLE_MISSING');h.pending={baseRev:a.rev,state:frozen,base:a.state};persist(h);
   try{let saved:TrainingAttempt;
    try{saved=await put(a,a.rev,frozen);}catch(e){
     // POST /answers bumps the revision on the server. One retry, only if the server moved compatibly with this write.
     if(!isStale(e))throw e;
     const remote=validate(await request(`/attempts/${encodeURIComponent(a.id)}`),a.id);
     if(!rebasable(a.state,remote.state,frozen))throw new VersionedTrainingError('PROGRESS_CONFLICT',409,remote,frozen);
     saved=await put(a,remote.rev,frozen);
    }
    delete h.pending;persist(h);latest=saved;return structuredClone(saved);}catch(e){latest=null;throw e;}
  });
 }
 function checkAnswer(questionId:number,answerId:number){return run(async()=>{const a=await current(),q=a.questions.find(q=>q.id===questionId);if(!q||!q.answers.some(x=>x.id===answerId))throw new VersionedTrainingError('ANSWER_SCOPE');
  // The evaluation bumps the server revision and the response does not carry it: whatever happens, re-read before the next write.
  try{const result=await request(`/attempts/${encodeURIComponent(a.id)}/answers`,{method:'POST',body:JSON.stringify({questionId,answerId})}) as AnswerCheckResult & {contentVersion:string;contentHash:string};
   if(!result||result.contentVersion!==q.contentVersion||result.contentHash!==q.contentHash||typeof result.correct!=='boolean')throw new VersionedTrainingError('ANSWER_VERSION_MISMATCH');return result;}finally{latest=null;}
 });}
 async function review(){const h=load();if(!h?.attemptId)throw new VersionedTrainingError('ATTEMPT_HANDLE_MISSING');return validate(await request(`/attempts/${encodeURIComponent(h.attemptId)}/review`),h.attemptId);}
 function useServerProgress(){return run(async()=>{const h=load();if(!h?.attemptId)throw new VersionedTrainingError('ATTEMPT_HANDLE_MISSING');const a=validate(await request(`/attempts/${encodeURIComponent(h.attemptId)}`),h.attemptId);
  // Explicit recovery only: retain the unsent local copy before adopting the server.
  if(h.pending){backupPending(h.pending);delete h.pending;persist(h);}latest=a;return structuredClone(a);
 });}
 // Runs behind every queued save/answer. Unsent navigation of a finished attempt is moot: the server rejects further saves.
 function complete(){return run(async()=>{const a=await current();const completed=validate(await request(`/attempts/${encodeURIComponent(a.id)}/complete`,{method:'POST',body:'{}'}),a.id);const h=load();if(h?.pending){delete h.pending;persist(h);}latest=completed;return structuredClone(completed);});}
 // Restarting abandons the old attempt, so an unresolved conflict must not block it: the unsent copy is kept as a backup.
 function restart(){return run(async()=>{let a:TrainingAttempt;try{a=await current();}catch(e){if(e instanceof VersionedTrainingError&&e.message==='PROGRESS_CONFLICT'&&e.server)a=e.server;else throw e;}
  const h=load();if(h?.pending){backupPending(h.pending);delete h.pending;persist(h);}
  const next=validate(await request('/attempts',{method:'POST',body:JSON.stringify({topicId,lang,previousAttemptId:a.id,idempotencyKey:randomKey()})}));persist({startKey:randomKey(),attemptId:next.id});latest=next;return structuredClone(next);
 });}
 return Object.freeze({open,save,checkAnswer,review,useServerProgress,complete,restart,storageKey:key});
}
export type VersionedTrainingClient=ReturnType<typeof createVersionedTrainingClient>;
export function versionedTrainingRequest(apiFetch:(path:string,init?:{method?:string;body?:string})=>Promise<Response>,base='/ccst-versioned-training'):Request{
 return async(path,init)=>{for(let attempt=0;attempt<2;attempt++){try{const response=await apiFetch(base+path,init),body=await response.json();if(!response.ok)throw new VersionedTrainingError(body?.error||'REQUEST_FAILED',response.status);return body;}catch(e){const read=!init?.method||init.method==='GET';if(attempt===0&&read&&(e instanceof TypeError||e instanceof SyntaxError))continue;throw e;}}throw new VersionedTrainingError('REQUEST_FAILED');};
}

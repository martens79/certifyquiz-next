import { portPool } from "./data";
import type { PortDifficulty, PortEntry, PortMode, PortQuestion } from "./types";

export function shuffle<T>(items:readonly T[],random=Math.random):T[]{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function validPortAnswer(raw:string):number|null{const s=raw.trim();if(!/^\d+$/.test(s))return null;const n=Number(s);return n>=1&&n<=65535?n:null;}
export function validatePort(entry:PortEntry,raw:string):boolean{const n=validPortAnswer(raw);return n!==null&&entry.ports.includes(n);}
export function makeQuestion(mode:PortMode,difficulty:PortDifficulty,previous?:PortQuestion,random=Math.random):PortQuestion{
 const pool=portPool(difficulty);const direction=mode==="mixed"?(previous?(previous.direction==="service-to-port"?"port-to-service":"service-to-port"):(random()<.5?"service-to-port":"port-to-service")):mode;
 let entry=pool[Math.floor(random()*pool.length)];if(previous&&entry.id===previous.entry.id)entry=pool[(pool.indexOf(entry)+1)%pool.length];
 const distractors=shuffle(pool.filter(x=>x.id!==entry.id&&!x.ports.some(p=>entry.ports.includes(p))),random).slice(0,3);
 return{id:`${direction}-${entry.id}-${Date.now()}`,direction,entry,options:direction==="port-to-service"?shuffle([entry,...distractors],random):[]};
}
export function scorePortAnswer(combo:number,responseMs:number,difficulty:PortDifficulty):number{const speed=Math.max(0,Math.round(50*(1-Math.min(responseMs,10000)/10000)));const multiplier=Math.min(2,1+Math.floor(combo/5)*.25);const bonus={basic:1,intermediate:1.1,advanced:1.2}[difficulty];return Math.round((100+speed)*multiplier*bonus);}

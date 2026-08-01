import type{Difficulty}from"./types";
export const PACKET_DEFENDER_STORAGE_KEY="certifyquiz:games:packet-defender:v1";
type Store={bestOverall:number;bestByDifficulty:Partial<Record<Difficulty,number>>;lastDifficulty:Difficulty;tutorialDone:boolean;sound:boolean};const initial:Store={bestOverall:0,bestByDifficulty:{},lastDifficulty:"basic",tutorialDone:false,sound:false};
export function loadStore():Store{if(typeof window==="undefined")return initial;try{return{...initial,...JSON.parse(localStorage.getItem(PACKET_DEFENDER_STORAGE_KEY)??"{}") as Partial<Store>};}catch{return initial;}}
export function saveStore(patch:Partial<Store>){const value={...loadStore(),...patch};localStorage.setItem(PACKET_DEFENDER_STORAGE_KEY,JSON.stringify(value));return value;}
export function saveResult(d:Difficulty,score:number){const old=loadStore(),isNewRecord=score>old.bestOverall;saveStore({bestOverall:Math.max(old.bestOverall,score),bestByDifficulty:{...old.bestByDifficulty,[d]:Math.max(old.bestByDifficulty[d]??0,score)}});return isNewRecord;}

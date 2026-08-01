import type { PortDifficulty, PortMode } from "./types";
const KEY="certifyquiz:games:port-hunter:v1";
type State={bestOverall:number;bestByMode:Partial<Record<PortMode,number>>;bestByDifficulty:Partial<Record<PortDifficulty,number>>;bestByPair:Record<string,number>;lastMode:PortMode;lastDifficulty:PortDifficulty};
const initial:State={bestOverall:0,bestByMode:{},bestByDifficulty:{},bestByPair:{},lastMode:"mixed",lastDifficulty:"basic"};
export function loadPortStorage():State{if(typeof window==="undefined")return initial;try{return{...initial,...JSON.parse(localStorage.getItem(KEY)??"{}") as Partial<State>};}catch{return initial;}}
export function savePortPreferences(mode:PortMode,difficulty:PortDifficulty):void{localStorage.setItem(KEY,JSON.stringify({...loadPortStorage(),lastMode:mode,lastDifficulty:difficulty}));}
export function savePortResult(mode:PortMode,difficulty:PortDifficulty,score:number){const old=loadPortStorage(),pair=`${mode}:${difficulty}`;const data:State={...old,bestOverall:Math.max(old.bestOverall,score),bestByMode:{...old.bestByMode,[mode]:Math.max(old.bestByMode[mode]??0,score)},bestByDifficulty:{...old.bestByDifficulty,[difficulty]:Math.max(old.bestByDifficulty[difficulty]??0,score)},bestByPair:{...old.bestByPair,[pair]:Math.max(old.bestByPair[pair]??0,score)},lastMode:mode,lastDifficulty:difficulty};localStorage.setItem(KEY,JSON.stringify(data));return{data,isNewRecord:score>old.bestOverall};}
export const PORT_HUNTER_STORAGE_KEY=KEY;

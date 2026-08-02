import type { HexMode } from "./types";
export const HEX_STORAGE_KEY="certifyquiz:games:hex-blitz:v1";
type Stored={bestOverall:number;bestByMode:Partial<Record<HexMode,number>>;lastMode:HexMode};
const defaults:Stored={bestOverall:0,bestByMode:{},lastMode:"mixed"};
export function loadHexStorage():Stored{if(typeof window==="undefined")return defaults;try{return{...defaults,...JSON.parse(localStorage.getItem(HEX_STORAGE_KEY)??"{}")} as Stored;}catch{return defaults;}}
export function saveHexMode(lastMode:HexMode){localStorage.setItem(HEX_STORAGE_KEY,JSON.stringify({...loadHexStorage(),lastMode}));}
export function saveHexResult(mode:HexMode,score:number){const old=loadHexStorage(),isNewRecord=score>old.bestOverall,data:Stored={bestOverall:Math.max(score,old.bestOverall),bestByMode:{...old.bestByMode,[mode]:Math.max(score,old.bestByMode[mode]??0)},lastMode:mode};localStorage.setItem(HEX_STORAGE_KEY,JSON.stringify(data));return{data,isNewRecord};}

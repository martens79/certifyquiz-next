import type { HexDirection, HexMode, HexQuestion } from "./types";

export const HEX_DURATION_MS=60_000;
export function hexDifficultyMax(elapsed:number){if(elapsed<15_000)return 31;if(elapsed<30_000)return 255;if(elapsed<45_000)return 1023;return 4095;}
export const toHex=(value:number)=>value.toString(16).toUpperCase();
export function hexDirection(mode:HexMode,random=Math.random):HexDirection{return mode==="mixed"?(random()<.5?"hex-to-decimal":"decimal-to-hex"):mode;}
export function generateHexQuestion(mode:HexMode,elapsed:number,previous?:HexQuestion,random=Math.random):HexQuestion{const max=hexDifficultyMax(elapsed),direction=hexDirection(mode,random);let value=1+Math.floor(random()*max);if(previous?.value===value&&previous.direction===direction)value=value===max?value-1:value+1;return{id:`${direction}-${value}-${elapsed}`,direction,value,prompt:direction==="hex-to-decimal"?toHex(value):String(value),answer:direction==="hex-to-decimal"?String(value):toHex(value)};}
export const normalizeHexAnswer=(raw:string)=>raw.trim().replace(/^0x/i,"").replace(/^0+(?=[0-9A-F])/i,"").toUpperCase();
export const isHexCorrect=(q:HexQuestion,raw:string)=>normalizeHexAnswer(raw)===q.answer;
export function hexExplanation(value:number){return `${value}₁₀ = ${toHex(value)}₁₆`;}
export function hexScore(combo:number,responseMs:number){const speed=Math.max(0,Math.round(50*(1-Math.min(responseMs,10_000)/10_000))),mult=Math.min(2,1+Math.floor(combo/5)*.25);return Math.round((100+speed)*mult);}

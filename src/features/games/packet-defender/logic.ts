import {SCENARIOS} from "./data";import type{Difficulty,Scenario}from"./types";
const rank:Record<Difficulty,number>={basic:0,intermediate:1,advanced:2};
export const scenarioPool=(d:Difficulty)=>SCENARIOS.filter(s=>rank[s.difficulty]<=rank[d]);
export function nextScenario(d:Difficulty,previous?:string,random=Math.random):Scenario{const pool=scenarioPool(d),eligible=pool.filter(x=>x.id!==previous);return eligible[Math.floor(random()*eligible.length)];}
export function scoreDecision(combo:number,responseMs:number,d:Difficulty){const speed=Math.round(50*(1-Math.min(responseMs,12000)/12000));const comboMultiplier=Math.min(2,1+Math.floor(Math.max(0,combo-1)/5)*.25);return Math.round((100+speed)*comboMultiplier*({basic:1,intermediate:1.2,advanced:1.5}[d]));}
export const eventDuration=(d:Difficulty)=>({basic:12000,intermediate:10000,advanced:8500}[d]);

import { expect,test } from "@playwright/test";
import { PORTS,portPool } from "../src/features/games/port-hunter/data";
import { makeQuestion,scorePortAnswer,validPortAnswer,validatePort } from "../src/features/games/port-hunter/logic";
import { PORT_HUNTER_STORAGE_KEY } from "../src/features/games/port-hunter/storage";

test("dataset has valid unique entries and required pool sizes",()=>{
 expect(PORTS).toHaveLength(46);expect(new Set(PORTS.map(x=>x.id)).size).toBe(PORTS.length);
 for(const entry of PORTS){expect(entry.ports.every(p=>Number.isInteger(p)&&p>=1&&p<=65535)).toBeTruthy();expect(entry.transports.length).toBeGreaterThan(0);}
 expect(portPool("basic")).toHaveLength(16);expect(portPool("intermediate")).toHaveLength(30);expect(portPool("advanced")).toHaveLength(46);
});
test("TCP and UDP services are represented correctly",()=>{expect(PORTS.find(x=>x.id==="dns")?.transports).toEqual(["TCP","UDP"]);expect(PORTS.find(x=>x.id==="rdp")?.transports).toEqual(["TCP","UDP"]);expect(PORTS.find(x=>x.id==="radius-auth")?.transports).toEqual(["UDP"]);});
test("port validation is strict",()=>{const https=PORTS.find(x=>x.id==="https")!;expect(validatePort(https," 443 ")).toBeTruthy();expect(validatePort(https,"443 text")).toBeFalsy();expect(validPortAnswer("0")).toBeNull();expect(validPortAnswer("65536")).toBeNull();});
test("multiple choice has four unique unambiguous services",()=>{const q=makeQuestion("port-to-service","advanced",undefined,()=>.42);expect(q.options).toHaveLength(4);expect(new Set(q.options.map(x=>x.id)).size).toBe(4);expect(q.options.filter(x=>x.id===q.entry.id)).toHaveLength(1);for(const wrong of q.options.filter(x=>x.id!==q.entry.id))expect(wrong.ports.some(p=>q.entry.ports.includes(p))).toBeFalsy();});
test("mixed questions alternate, do not repeat, and scoring rewards difficulty",()=>{const first=makeQuestion("mixed","advanced",undefined,()=>.1),second=makeQuestion("mixed","advanced",first,()=>.1);expect(second.entry.id).not.toBe(first.entry.id);expect(second.direction).not.toBe(first.direction);expect(scorePortAnswer(1,1000,"advanced")).toBeGreaterThan(scorePortAnswer(1,1000,"basic"));});
test("storage is versioned and separate from Binary Rush",()=>{expect(PORT_HUNTER_STORAGE_KEY).toContain("port-hunter:v1");expect(PORT_HUNTER_STORAGE_KEY).not.toContain("binary-rush");});

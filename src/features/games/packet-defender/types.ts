import type { Locale } from "@/lib/i18n";

export type Difficulty="basic"|"intermediate"|"advanced";
export type Decision="allow"|"block";
export type Category="web"|"dns"|"mail"|"remote"|"file"|"auth"|"admin"|"database"|"suspicious"|"firewall";
export type Localized=Record<Locale,string>;
export type Scenario={id:string;category:Category;difficulty:Difficulty;service:string;port:number;transport:"TCP"|"UDP";origin:Localized;description:Localized;decision:Decision;explanation:Localized;indicators:Localized;weight:number};
export type Result={score:number;handled:number;correct:number;wrong:number;missed:number;maxCombo:number;integrity:number;difficulty:Difficulty;isNewRecord:boolean;reason:"time"|"integrity";errors:Partial<Record<Category,number>>};

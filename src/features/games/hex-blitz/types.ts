export type HexMode = "mixed" | "hex-to-decimal" | "decimal-to-hex";
export type HexDirection = Exclude<HexMode, "mixed">;
export type HexQuestion = { id:string; direction:HexDirection; value:number; prompt:string; answer:string };
export type HexResult = { score:number; correct:number; wrong:number; maxCombo:number; mode:HexMode; isNewRecord:boolean };

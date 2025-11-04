/* scripts/validate-certs-extended.ts
 * Validatore esteso per i moduli dati delle certificazioni.
 * Uso:
 *   npx tsx scripts/validate-certs-extended.ts
 * Opzioni:
 *   --no-fs  → non verificare l'esistenza dei file immagine
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CERTS } from "@/certifications/registry";
import type {
  CertificationData,
  LocalizedText,
  LocalizedRoute,
  ExtraContent,
} from "@/certifications/types";

// ---- Config ---------------------------------------------------------------
const REQUIRE_TOPICS = true;            // richiedi almeno 1 topic
const CHECK_IMAGE_FS = !process.argv.includes("--no-fs"); // controlla file esiste
const PUBLIC_DIR = path.resolve(process.cwd(), "public"); // base per immagini
const IMG_PREFIX = "/images/";          // immagini devono iniziare così (puoi cambiare)
const LANGS = ["it", "en", "fr", "es"] as const;

// ---- Helpers --------------------------------------------------------------
type Lang = (typeof LANGS)[number];

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}
function hasAllLangs(obj: any): obj is LocalizedText {
  return obj && LANGS.every((l) => isNonEmptyString(obj[l]));
}
function isLocalizedRoute(obj: any): obj is LocalizedRoute {
  return obj && LANGS.every((l) => isNonEmptyString(obj[l]));
}
function isHttpUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function normalizePath(p: string): string {
  return p.startsWith("/") ? p : `/${p}`;
}
function existsInPublic(webPath: string): boolean {
  const rel = webPath.replace(/^\/+/, ""); // to relative
  const abs = path.join(PUBLIC_DIR, rel);
  try {
    return fs.existsSync(abs) && fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}
function assertArray<T>(arr: any, itemCheck: (x: any) => x is T): arr is readonly T[] {
  return Array.isArray(arr) && arr.every(itemCheck);
}
function isStringArray(arr: any): arr is readonly string[] {
  return assertArray<string>(arr, isNonEmptyString);
}

function validateExtra(extra: ExtraContent | undefined, push: (msg: string) => void) {
  if (!extra) return;

  // learn/whyChoose: array di string per lingua
  for (const key of ["learn", "whyChoose"] as const) {
    const block = extra[key];
    if (!block) continue;
    for (const l of LANGS) {
      const v = (block as any)[l];
      if (v !== undefined && !isStringArray(v)) {
        push(`extraContent.${key}.${l}: deve essere array di string non vuote`);
      }
    }
  }

  // faq: { q, a }[]
  if (extra.faq) {
    for (const l of LANGS) {
      const v = (extra.faq as any)[l];
      if (v !== undefined && !Array.isArray(v)) {
        push(`extraContent.faq.${l}: deve essere array`);
      } else if (Array.isArray(v)) {
        v.forEach((item, i) => {
          if (!item || typeof item !== "object") {
            push(`extraContent.faq.${l}[${i}]: item non valido`);
            return;
          }
          if (!isNonEmptyString(item.q)) push(`extraContent.faq.${l}[${i}].q mancante/vuoto`);
          if (!isNonEmptyString(item.a)) push(`extraContent.faq.${l}[${i}].a mancante/vuoto`);
        });
      }
    }
  }

  // examReference: { text, url }[]
  if (extra.examReference) {
    for (const l of LANGS) {
      const v = (extra.examReference as any)[l];
      if (v !== undefined && !Array.isArray(v)) {
        push(`extraContent.examReference.${l}: deve essere array`);
      } else if (Array.isArray(v)) {
        v.forEach((item, i) => {
          if (!item || typeof item !== "object") {
            push(`extraContent.examReference.${l}[${i}]: item non valido`);
            return;
          }
          if (!isNonEmptyString(item.text))
            push(`extraContent.examReference.${l}[${i}].text mancante/vuoto`);
          if (!isNonEmptyString(item.url) || !isHttpUrl(item.url))
            push(`extraContent.examReference.${l}[${i}].url mancante/URL non valida`);
        });
      }
    }
  }
}

// ---- Validazione principale ----------------------------------------------
const seen = new Set<string>();
let errors = 0;
let warnings = 0;

function validateCert(c: CertificationData) {
  const errs: string[] = [];
  const warns: string[] = [];

  // slug
  if (!isNonEmptyString(c.slug)) errs.push("slug mancante/vuoto");
  else if (seen.has(c.slug)) errs.push(`slug duplicato: ${c.slug}`);
  else seen.add(c.slug);

  // imageUrl
  if (!isNonEmptyString(c.imageUrl)) warns.push("imageUrl mancante");
  else {
    const img = normalizePath(c.imageUrl);
    if (!img.startsWith(IMG_PREFIX)) warns.push(`imageUrl dovrebbe iniziare con "${IMG_PREFIX}"`);
    if (CHECK_IMAGE_FS && !existsInPublic(img)) warns.push(`imageUrl non trovata in /public: ${img}`);
  }

  // officialUrl
  if (!isNonEmptyString(c.officialUrl) || !isHttpUrl(c.officialUrl)) {
    warns.push("officialUrl mancante o non valida (http/https)");
  }

  // title/description/level
  if (!hasAllLangs(c.title)) errs.push("title non completo in 4 lingue");
  if (!hasAllLangs(c.description)) errs.push("description non completa in 4 lingue");
  if (!hasAllLangs(c.level)) warns.push("level non completo in 4 lingue");

  // topics
  if (REQUIRE_TOPICS) {
    if (!Array.isArray(c.topics) || c.topics.length === 0) {
      warns.push("topics assenti/vuoti");
    } else {
      c.topics.forEach((t, i) => {
        if (!hasAllLangs(t)) warns.push(`topics[${i}] non completo in 4 lingue`);
      });
    }
  }

  // quizRoute / backRoute
  if (!isLocalizedRoute(c.quizRoute)) errs.push("quizRoute non completo in 4 lingue");
  if (!isLocalizedRoute(c.backRoute)) errs.push("backRoute non completo in 4 lingue");

  // extraContent
  validateExtra(c.extraContent, (m) => warns.push(m));

  if (errs.length || warns.length) {
    const head = `• ${c.slug || "(slug mancante)"}`;
    console.log(head);
    errs.forEach((e) => console.log(`   ❌ ${e}`));
    warns.forEach((w) => console.log(`   ⚠️  ${w}`));
  }
  errors += errs.length;
  warnings += warns.length;
}

// Esegui validazione
for (const c of CERTS) validateCert(c);

const summary = `\n✅ CERTS: ${CERTS.length}  ❌ errors: ${errors}  ⚠️ warnings: ${warnings}`;
console.log(summary);
if (errors > 0) process.exit(1);

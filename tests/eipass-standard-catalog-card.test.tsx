import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { act, create } from "react-test-renderer";
import { clientModule } from "./helpers/client-component";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mod = clientModule("../../src/components/CertificationCard.tsx", {
  "next/link": { __esModule: true, default: (p: { href: string; children: React.ReactNode } & Record<string, unknown>) => React.createElement("a", p, p.children) },
  "next/image": { __esModule: true, default: (p: Record<string, unknown>) => React.createElement("img", { src: p.src, alt: p.alt }) },
});

async function render(props: Record<string, unknown>) {
  let r!: ReturnType<typeof create>;
  await act(async () => { r = create(React.createElement(mod.CertificationCard, { href: "/x", title: "Titolo", lang: "it", ...props })); });
  return JSON.stringify(r.toJSON());
}

test("coming-soon card: no 'try for free' promise, an explicit 'Prossimamente' pill, in every language", async () => {
  const expected: Record<string, [RegExp, RegExp]> = {
    it: [/Scopri di più →/, /Prossimamente/],
    en: [/Learn more →/, /Coming soon/],
    fr: [/En savoir plus →/, /Bientôt disponible/],
    es: [/Saber más →/, /Próximamente/],
  };
  for (const [lang, [cta, pill]] of Object.entries(expected)) {
    const out = await render({ comingSoon: true, lang });
    assert.match(out, cta, lang);
    assert.match(out, pill, lang);
    assert.doesNotMatch(out, /prova gratis|try free|gratuitement|probar gratis/i, `${lang}: no free-trial promise`);
  }
});

test("ordinary card is unchanged: 'Scopri e prova gratis →' and no pill", async () => {
  const it = await render({ lang: "it" });
  assert.match(it, /Scopri e prova gratis →/);
  assert.doesNotMatch(it, /Prossimamente|amber-100/);
  assert.match(await render({ lang: "en" }), /Explore and try free →/);
  assert.match(await render({ lang: "fr", comingSoon: false }), /Découvrir et essayer gratuitement →/);
  assert.match(await render({ lang: "es", comingSoon: undefined }), /Descubrir y probar gratis →/);
});

test("wiring: only registry coming-soon certifications are flagged on the catalogue cards", () => {
  const view = readFileSync(new URL("../src/app/[lang]/certificazioni/CertificationsListView.tsx", import.meta.url), "utf8");
  assert.match(view, /comingSoon: isComingSoonCertification\(CERTS_BY_SLUG\[c\.slug\]\) \|\| undefined/);
  const client = readFileSync(new URL("../src/components/CertificationListClient.tsx", import.meta.url), "utf8");
  assert.match(client, /comingSoon=\{c\.comingSoon\}/);
});

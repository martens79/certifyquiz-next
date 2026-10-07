import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import React from "react";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { PortableText } from "@portabletext/react";
import { middleware } from "../src/middleware";
import { AUDITED_TOPIC_REDIRECTS } from "../src/lib/audited-topic-redirects";
import { auditedContentLink } from "../src/lib/audited-content-link";
import { certPath } from "../src/lib/paths";
import { portableTextComponents } from "../src/components/blog/PortableTextComponents";
import Footer from "../src/components/Footer";

// Match the project's existing Node SSR test harness outside Next's JSX runtime.
(globalThis as { React?: typeof React }).React = React;

const origin = "https://www.certifyquiz.com";
const fixtures = JSON.parse(fs.readFileSync("tests/fixtures/gsc-404-2026-10-07.json", "utf8")) as Array<{
  path: string; classification: string; current_url: string; state: string;
}>;

test("all 40 newly audited redirects preserve the same page, query and fragment", () => {
  const cases = fixtures.filter(x => x.classification === "REDIRECT_301");
  assert.equal(cases.length, 40);
  for (const row of cases) {
    const response = middleware(new NextRequest(`${origin}${row.path}?utm_source=gsc`));
    assert.equal(response.status, 301, row.path);
    assert.equal(response.headers.get("location"), `${origin}${row.current_url}?utm_source=gsc`, row.path);
    assert.equal(auditedContentLink(`${row.path}?x=1#section`), `${row.current_url}?x=1#section`);
  }
});

test("exact mappings have no loops, chains or soft-404 landing destinations", () => {
  for (const [from, to] of Object.entries(AUDITED_TOPIC_REDIRECTS)) {
    assert.notEqual(from, to);
    assert.equal(AUDITED_TOPIC_REDIRECTS[to], undefined, to);
    assert.equal(from.split("/").length, to.split("/").length, from);
    const response = middleware(new NextRequest(origin + to));
    assert.equal(response.headers.get("location"), null, to);
    assert.equal(response.headers.get("x-middleware-next"), "1", to);
  }
});

test("unknown suffixes, malformed slugs and all 65 KEEP_404 URLs receive no audited redirect", () => {
  const keep = fixtures.filter(x => x.classification === "KEEP_404");
  assert.equal(keep.length, 65);
  for (const row of keep) assert.equal(AUDITED_TOPIC_REDIRECTS[row.path], undefined, row.path);
  assert.equal(AUDITED_TOPIC_REDIRECTS["/es/certificaciones/mysql-certification/made-up-topic"], undefined);
  for (const path of ["/certifications/python/made-up-topic", "/certifications/google-tensorflow/made-up-topic", "/certifications/google-cloud/made-up-topic"]) {
    assert.equal(middleware(new NextRequest(origin + path)).headers.get("location"), null, path);
  }
});

test("real Google Cloud topics stay in their own family in every language", () => {
  for (const path of ["/certifications/google-cloud/cloud-google-cloud-fundamentals", "/it/certificazioni/google-cloud/fondamenti-cloud-google-cloud", "/fr/certifications/google-cloud/fondamentaux-cloud-google-cloud", "/es/certificaciones/google-cloud/fundamentos-cloud-google-cloud"]) {
    const response = middleware(new NextRequest(origin + path));
    assert.equal(response.headers.get("location"), null, path);
    assert.equal(response.headers.get("x-middleware-next"), "1", path);
  }
});

test("certification topic links use the public root without changing DB keys", () => {
  for (const lang of ["en", "it", "fr", "es"] as const) {
    assert.equal(certPath(lang, "google-tensorflow"), certPath(lang, "tensorflow"));
    assert.equal(certPath(lang, "microsoft-csharp"), certPath(lang, "csharp"));
    assert.match(certPath(lang, "google-cloud"), /\/google-cloud$/);
  }
});

test("content links normalize only this site's audited URLs", () => {
  const old = "/certifications/ceh/unauthorized-access";
  const target = "/certifications/ceh/gaining-unauthorized-access";
  assert.equal(auditedContentLink(old), target);
  assert.equal(auditedContentLink(origin + old), target);
  assert.equal(auditedContentLink("https://example.com" + old), "https://example.com" + old);
  assert.equal(auditedContentLink("mailto:help@example.com"), "mailto:help@example.com");
  assert.equal(auditedContentLink("#section"), "#section");
});

test("PortableText marks and embedded Markdown both render the corrected CEH anchor", () => {
  const old = "/certifications/ceh/unauthorized-access";
  const target = "/certifications/ceh/gaining-unauthorized-access";
  const variants = [
    [{ _type: "block", _key: "a", style: "normal", markDefs: [{ _key: "link", _type: "link", href: old }], children: [{ _type: "span", _key: "b", text: "CEH", marks: ["link"] }] }],
    [{ _type: "block", _key: "a", style: "normal", markDefs: [], children: [{ _type: "span", _key: "b", text: `[CEH](${old})`, marks: [] }] }],
  ];
  for (const value of variants) {
    const output = renderToStaticMarkup(<PortableText value={value} components={portableTextComponents} />);
    assert.ok(output.includes(`href="${target}"`), output);
    assert.ok(!output.includes(`href="${old}"`), output);
  }
});

test("footer SSR exposes no mailto email for Cloudflare to rewrite into a crawler URL", () => {
  for (const lang of ["en", "it", "fr", "es"] as const) {
    const output = renderToStaticMarkup(<Footer lang={lang} />);
    assert.ok(!output.includes("mailto:"));
    assert.ok(!output.includes("certifyquiz@gmail.com"));
    assert.ok(!output.includes("/cdn-cgi/"));
  }
});

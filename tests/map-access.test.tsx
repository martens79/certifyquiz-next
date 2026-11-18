import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { canDownloadMap } from "../src/lib/map-access";
import { MapCard, type MapCardItem } from "../src/components/maps/MapOverviewGrid";

const ITEM: MapCardItem = {
  id: 1,
  slug: "isc2-cc-maps",
  title: "Mapas conceptuales ISC2 CC",
  description: null,
  lang_available: true,
  price: 2.99,
  page_count: 9,
  map_count: 8,
  certification_slug: "isc2-cc",
  certification_name: "ISC2 CC",
  access: "locked",
  imageUrl: null,
};

test("canDownloadMap: premium e package sbloccano, tutto il resto no", () => {
  assert.equal(canDownloadMap("premium"), true);
  assert.equal(canDownloadMap("package"), true);
  assert.equal(canDownloadMap("locked"), false);
  assert.equal(canDownloadMap(undefined), false);
  assert.equal(canDownloadMap(null), false);
  assert.equal(canDownloadMap("qualcosa-di-nuovo"), false);
});

function render(lang: "es" | "it" | "en" | "fr", access: MapCardItem["access"]) {
  return renderToStaticMarkup(
    createElement(MapCard, { lang, item: ITEM, access, userStatus: "free" as never })
  );
}

test("interfaccia ES: access=package mostra Descargar PDF e non Desbloquear", () => {
  const html = render("es", "package");
  assert.match(html, /Descargar PDF/);
  assert.doesNotMatch(html, /Desbloquear/);
});

test("interfaccia ES: access=premium mostra Descargar PDF", () => {
  assert.match(render("es", "premium"), /Descargar PDF/);
});

test("interfaccia ES: access=locked mostra Desbloquear e non il download", () => {
  const html = render("es", "locked");
  assert.match(html, /Desbloquear guía y mapas/);
  assert.doesNotMatch(html, /Descargar PDF/);
});

test("tutte le lingue: package scarica, locked rimanda ai prezzi", () => {
  for (const lang of ["it", "en", "fr", "es"] as const) {
    assert.doesNotMatch(render(lang, "package"), /🔒/, lang);
    assert.match(render(lang, "package"), /⬇️/, lang);
    assert.match(render(lang, "locked"), /🔒/, lang);
    assert.doesNotMatch(render(lang, "locked"), /⬇️/, lang);
  }
});

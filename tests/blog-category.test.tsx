import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BlogCategoryBadge from "../src/components/blog/BlogCategoryBadge";

test("diary badge renders the requested label in every article language", () => {
  const labels = { it: "Diario", en: "Diary", fr: "Journal", es: "Diario" } as const;
  for (const lang of Object.keys(labels) as Array<keyof typeof labels>) {
    const markup = renderToStaticMarkup(createElement(BlogCategoryBadge, { category: "diary", lang }));
    assert.ok(markup.endsWith(`>${labels[lang]}</span>`));
    for (const category of ["fundamentals", "security", undefined, null]) {
      assert.equal(renderToStaticMarkup(createElement(BlogCategoryBadge, { category, lang })), "");
    }
  }
});

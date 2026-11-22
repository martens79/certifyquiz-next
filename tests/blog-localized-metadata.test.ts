import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const blogPage = readFileSync("src/app/[lang]/blog/page.tsx", "utf8");
const rootPage = readFileSync("src/app/blog/page.tsx", "utf8");

test("blog listing metadata has distinct English, Italian, French and Spanish text", () => {
  for (const lang of ["en", "it", "fr", "es"]) {
    assert.match(blogPage, new RegExp("  " + lang + ": \\{"));
  }
  assert.match(blogPage, /Gu[ií]as y art[ií]culos para certificaciones inform[aá]ticas/);
  assert.match(blogPage, /Guides et articles pour certifications informatiques/);
  assert.match(blogPage, /Guide e articoli per certificazioni informatiche/);
  assert.match(blogPage, /\.\.\.BLOG_METADATA\[lang\]/);
});

test("all paginated blog pages retain unique canonical and translated navigation", () => {
  assert.match(blogPage, /page > 1 \? `\$\{base\}\?page=\$\{page\}` : base/);
  assert.match(blogPage, /alternates: \{ canonical \}/);
  assert.match(blogPage, /href=\{pageHref\(page \+ 1\)\}/);
  assert.match(blogPage, /href=\{pageHref\(page - 1\)\}/);
  assert.match(blogPage, /articlesPageByLang\(start, end\)/);
  assert.match(rootPage, /generateBlogMetadata/);
});

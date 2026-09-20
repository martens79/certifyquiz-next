import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

// Le pagine error-review esistono in due copie (root EN e [lang]) e non vanno
// refactorizzate in questa fase: questo guard impedisce che divergano, cosi'
// `lang` e `exhibit` restano gestiti allo stesso modo in entrambe.
const ROOT = path.join(__dirname, "..", "src", "app");
const COPIES = [
  path.join(ROOT, "review", "errors", "review-errors-client.tsx"),
  path.join(ROOT, "[lang]", "review", "errors", "review-errors-client.tsx"),
];

const read = (file: string) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");

test("the two error-review clients are identical (ignoring line endings)", () => {
  assert.equal(read(COPIES[0]), read(COPIES[1]));
});

test("both error-review clients send lang and keep the exhibit", () => {
  for (const file of COPIES) {
    const src = read(file);
    assert.match(src, /p\.set\("lang", lang\)/, `${file}: lang query param`);
    assert.match(src, /\[certificationId, topicId, limit, lang\]/, `${file}: lang in the memo dependencies`);
    assert.match(src, /exhibit: q\.exhibit \?\? null/, `${file}: exhibit forwarded to QuizEngine`);
  }
});

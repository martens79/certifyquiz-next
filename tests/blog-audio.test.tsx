import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "@playwright/test";
import ArticleAudio from "../src/components/blog/ArticleAudio";

const labels = { it: "Ascolta l’articolo", en: "Listen to the article", fr: "Écouter l’article", es: "Escucha el artículo" } as const;

function wavUrl() {
  const wav = Buffer.alloc(44 + 8000 * 4 * 2);
  wav.write("RIFF"); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write("data", 36); wav.writeUInt32LE(wav.length - 44, 40);
  return `data:audio/wav;base64,${wav.toString("base64")}`;
}

test("articles without audio render no element or spacing in all four languages", () => {
  for (const lang of Object.keys(labels) as Array<keyof typeof labels>) {
    for (const audioUrl of [undefined, null, ""]) {
      assert.equal(renderToStaticMarkup(createElement(ArticleAudio, { lang, audioUrl })), "");
    }
  }
});

test("native playback, pause, seek and volume on desktop and emulated mobile", async () => {
  const browser = await chromium.launch();
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 }, isMobile: mobile, hasTouch: mobile });
      const page = await context.newPage();
      for (const lang of Object.keys(labels) as Array<keyof typeof labels>) {
        await page.setContent(renderToStaticMarkup(createElement(ArticleAudio, { lang, audioUrl: wavUrl() })));
        const player = page.locator("audio");
        assert.equal(await player.getAttribute("aria-label"), labels[lang]);
        assert.equal(await player.getAttribute("preload"), "none");
        assert.equal(await player.getAttribute("autoplay"), null);
        assert.notEqual(await player.getAttribute("controls"), null);
        assert.equal(await player.evaluate((el: HTMLAudioElement) => el.paused), true);
        await player.evaluate(async (el: HTMLAudioElement) => { await el.play(); });
        await page.waitForFunction(() => document.querySelector("audio")!.currentTime > 0.1);
        await player.evaluate((el: HTMLAudioElement) => el.pause());
        assert.equal(await player.evaluate((el: HTMLAudioElement) => el.paused), true);
        await player.evaluate((el: HTMLAudioElement) => { el.currentTime = 2; el.volume = 0.5; });
        await page.waitForFunction(() => Math.abs(document.querySelector("audio")!.currentTime - 2) < 0.1);
        assert.equal(await player.evaluate((el: HTMLAudioElement) => el.volume), 0.5);
        assert.equal(await player.evaluate(el => el.getBoundingClientRect().right <= window.innerWidth), true);
      }
      await context.close();
    }
  } finally { await browser.close(); }
});

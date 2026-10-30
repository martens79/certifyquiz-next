import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create } from "react-test-renderer";
import { clientModule } from "./helpers/client-component";
import {
  EIPASS_STANDARD_LANDING_PATH,
  EIPASS_STANDARD_LINK_EVENT,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_USER_LANDING_PATH,
} from "../src/lib/eipass-standard";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const events: Array<{ name: string; params: Record<string, unknown> }> = [];
const mod = clientModule("../../src/components/certification/EipassStandardComingSoon.tsx", {
  "next/link": { __esModule: true, default: (p: { href: string; children: React.ReactNode } & Record<string, unknown>) => React.createElement("a", p, p.children) },
  "@/lib/analytics": { trackEvent: (name: string, params: Record<string, unknown>) => events.push({ name, params }) },
  "@/lib/eipass-standard": {
    EIPASS_STANDARD_COMING_SOON_LABEL: "Quiz di preparazione in arrivo",
    EIPASS_STANDARD_LANDING_PATH, EIPASS_STANDARD_LINK_EVENT, EIPASS_STANDARD_OFFICIAL_URL, EIPASS_USER_LANDING_PATH,
  },
});

const links = (node: ReturnType<typeof create>["root"]) => node.findAllByType("a");
const text = (renderer: ReturnType<typeof create>) => JSON.stringify(renderer.toJSON());

test("landing panel: 'Quiz di preparazione in arrivo', exactly the two real links, nothing else interactive", async () => {
  let r!: ReturnType<typeof create>;
  await act(async () => { r = create(React.createElement(mod.EipassStandardComingSoonPanel)); });
  assert.match(text(r), /Quiz di preparazione in arrivo/);
  assert.match(text(r), /non rilascia la certificazione/);
  const a = links(r.root);
  assert.deepEqual(a.map((x) => x.props.href), [EIPASS_STANDARD_OFFICIAL_URL, EIPASS_USER_LANDING_PATH]);
  assert.equal(a[0].props.target, "_blank");
  assert.equal(a[0].props.rel, "noopener noreferrer");
  assert.equal(r.root.findAllByType("form").length + r.root.findAllByType("input").length + r.root.findAllByType("button").length, 0, "no form, no input, no fake button");
  assert.ok(a.every((x) => !/\/quiz\/|ripass|mock/i.test(String(x.props.href))), "no link to quiz, review or mock");
});

test("landing panel: each link click emits one GA4 event with the link name and source page (no personal data)", async () => {
  events.length = 0;
  let r!: ReturnType<typeof create>;
  await act(async () => { r = create(React.createElement(mod.EipassStandardComingSoonPanel)); });
  const [official, user] = links(r.root);
  await act(async () => { official.props.onClick(); });
  await act(async () => { user.props.onClick(); });
  assert.deepEqual(JSON.parse(JSON.stringify(events)), [
    { name: "eipass_standard_link_click", params: { link_target: "official_eipass_standard", source_page: "eipass_standard_coming_soon" } },
    { name: "eipass_standard_link_click", params: { link_target: "eipass_user_landing", source_page: "eipass_standard_coming_soon" } },
  ]);
});

test("User-landing pointer: 'In preparazione', links only to the Standard landing, emits its own event", async () => {
  events.length = 0;
  let r!: ReturnType<typeof create>;
  await act(async () => { r = create(React.createElement(mod.EipassStandardPointer)); });
  assert.match(text(r), /In preparazione/);
  assert.match(text(r), /percorso distinto da EIPASS 7 Moduli User/);
  const a = links(r.root);
  assert.deepEqual(a.map((x) => x.props.href), [EIPASS_STANDARD_LANDING_PATH]);
  await act(async () => { a[0].props.onClick(); });
  assert.deepEqual(JSON.parse(JSON.stringify(events)), [{ name: "eipass_standard_link_click", params: { link_target: "standard_coming_soon", source_page: "eipass_user_landing" } }]);
});

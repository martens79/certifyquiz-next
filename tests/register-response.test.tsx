import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent } from "./helpers/client-component";
import * as conversion from "../src/lib/conversion-context";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

for (const response of [
  { label: "HTML", type: "text/html", body: "<html>Unexpected response</html>", accepted: false },
  { label: "JSON without success", type: "application/json", body: '{"success":false}', accepted: false },
  { label: "confirmed registration", type: "application/json", body: '{"success":true}', accepted: true },
]) {
  test(`register handles a 200 response containing ${response.label}`, async () => {
    const redirects: string[] = [];
    const completions: string[] = [];
    const back = "/it/quiz/ccna/mixed?mode=training";
    const params = new URLSearchParams({ redirect: back });
    const Register = clientComponent("../../src/app/[lang]/register/register-client.tsx", {
      "@marsidev/react-turnstile": { Turnstile: () => null },
      "next/link": "a",
      "next/navigation": {
        usePathname: () => "/it/register",
        useRouter: () => ({ replace: (url: string) => redirects.push(url) }),
        useSearchParams: () => params,
      },
      "@/lib/i18n": { langFromPathname: () => "it", getLabel: (labels: { it: string }) => labels.it },
      "@/lib/auth": { acceptLoginToken: () => {}, backendUrl: (path: string) => path },
      "@/lib/auth-session": { authGeneration: () => 0, assertAuthGeneration: () => {} },
      "@/lib/analytics": {
        trackEvent: (name: string) => completions.push(name),
        trackEventOnce: () => {},
        trackFunnelEventOnce: () => {},
      },
      "@/lib/conversion-context": conversion,
      "@/lib/checkout-intent": { CHECKOUT_SOURCE: "checkout" },
    }, {
      process: { env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: "fixture" } },
      fetch: async () => new Response(response.body, { headers: { "Content-Type": response.type } }),
      setTimeout: (callback: () => void) => callback(),
    });
    let renderer!: ReactTestRenderer;
    await act(async () => { renderer = create(<Register />); });
    const root = renderer.root;
    await act(async () => {
      for (const [name, value] of Object.entries({
        username: "fixture", email: "fixture@example.test", password: "fixture123", confirmPassword: "fixture123",
      })) {
        root.findByProps({ id: name }).props.onChange({ target: { name, value } });
      }
    });
    await act(async () => {
      root.findAll(node => typeof node.props.onSuccess === "function")[0].props.onSuccess("fixture-token");
    });
    await act(async () => {
      await root.findByType("form").props.onSubmit({ preventDefault() {} });
    });
    assert.deepEqual(completions, response.accepted ? ["registration_completed"] : []);
    assert.equal(redirects.length, response.accepted ? 1 : 0);
    if (response.accepted) {
      const destination = new URL(redirects[0], "https://example.test");
      assert.equal(destination.pathname, "/it/login");
      assert.equal(destination.searchParams.get("redirect"), back);
    } else {
      assert.ok(root.findAllByType("p").some(node => String(node.props.children).includes("registrazione")));
    }
    await act(async () => renderer.unmount());
  });
}

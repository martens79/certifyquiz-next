import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent } from "./helpers/client-component";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
for (const revoke of [false, true]) {
  for (const confirmed of [false, true]) {
    test(`member removal: revoke=${revoke}, confirmed=${confirmed}`, async () => {
      const requests: { url: string; method: string }[] = [];
      const prompts: string[] = [];
      const organization = { id: 7, name: "Test group", created_at: "2026-11-05", seats: 5 };
      const member = { id: 42, username: "Test member", email: "fixture@example.invalid", premium: 1, is_org_admin: 0 };
      const Component = clientComponent("../../src/app/admin/organizations/AdminOrganizationsClient.tsx", {
        "@/components/auth/AuthProvider": { useAuth: () => ({ token: "local-fixture" }) },
        "@/lib/download-csv": { downloadCsv: () => {} },
      }, {
        window: { confirm: (message: string) => { prompts.push(message); return confirmed; } },
        fetch: async (url: string, init: RequestInit = {}) => {
          requests.push({ url, method: init.method || "GET" });
          return { ok: true, json: async () => url.endsWith("/organizations")
            ? { organizations: [organization] }
            : { organization, members: [member] } };
        },
      });
      let renderer!: ReactTestRenderer;
      try {
        await act(async () => { renderer = create(<Component />); });
        await act(async () => { renderer.root.findAllByType("button").find(b => b.children.join("") === "Gestisci →")!.props.onClick(); });
        const before = JSON.stringify(renderer.toJSON());
        requests.length = 0;
        const label = revoke ? "Rimuovi e revoca Premium" : "Rimuovi (mantieni Premium)";
        await act(async () => { await renderer.root.findAllByType("button").find(b => b.children.join("") === label)!.props.onClick(); });
        assert.equal(prompts.length, 1);
        if (!confirmed) {
          assert.deepEqual(requests, []);
          assert.equal(JSON.stringify(renderer.toJSON()), before);
          assert.equal(member.premium, 1);
        } else {
          assert.deepEqual(requests[0], {
            url: `/api/backend/admin/organizations/7/members/42?revokePremium=${revoke}`,
            method: "DELETE",
          });
          assert.equal(requests.filter(r => r.method === "DELETE").length, 1);
          assert.equal(requests.length, 3);
        }
      } finally {
        if (renderer) await act(async () => renderer.unmount());
      }
    });
  }
}

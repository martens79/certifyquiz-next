import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent, clientModule } from "./helpers/client-component";
import { fetchFunnelExportCsv } from "../src/lib/funnel-export";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const css = new Proxy({}, { get: (_, key) => String(key) });
const Link = ({ children, ...props }: any) => <a {...props}>{children}</a>;
const event = (id = 1) => ({
  id,
  event: "assessment_started",
  email: null,
  cert_slug: "ccna",
  topic_slug: "routing",
  score: 75,
  lang: "it",
  created_at: "2026-10-25T11:30:00.000Z",
  payload: { token: "SENSITIVE-FIXTURE" },
  session_id: "PRIVATE-SESSION",
});
const page = (events = [event()], n = 1, pages = 3) => ({
  ok: true,
  events,
  pagination: {
    page: n,
    pages,
    total: events.length ? 125 : 0,
    hasPrevious: n > 1,
    hasNext: n < pages,
  },
});
const response = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status });

function fixture(
  fetcher: (url: string, init: RequestInit) => Promise<Response>,
) {
  const requests: { url: URL; init: RequestInit }[] = [];
  const downloads: { name: string; csv: string }[] = [];
  const Component = clientComponent(
    "../../src/app/admin/FunnelEventsClient.tsx",
    {
      "./admin-events.module.css": { __esModule: true, default: css },
      "next/link": { __esModule: true, default: Link },
      "@/lib/download-csv": {
        downloadCsvText: (name: string, csv: string) =>
          downloads.push({ name, csv }),
      },
      "@/lib/funnel-export": { fetchFunnelExportCsv },
    },
    {
      fetch: (url: string, init: RequestInit) => {
        requests.push({ url: new URL(url, "https://fixture.test"), init });
        return fetcher(url, init);
      },
    },
  );
  let renderer: ReactTestRenderer;
  const text = () => JSON.stringify(renderer.toJSON());
  const button = (label: string) =>
    renderer.root
      .findAllByType("button")
      .find((b) => JSON.stringify(b.props.children).includes(label))!;
  const change = async (
    type: "input" | "select",
    index: number,
    value: string,
  ) => {
    await act(async () =>
      renderer.root
        .findAllByType(type)
        [index].props.onChange({ target: { value } }),
    );
  };
  return {
    requests,
    downloads,
    text,
    button,
    change,
    mount: async () => {
      await act(async () => {
        renderer = create(<Component token="synthetic-admin" />);
      });
    },
    unmount: async () => {
      await act(async () => renderer.unmount());
    },
    click: async (label: string) => {
      await act(async () => button(label).props.onClick());
    },
  };
}

test("events only: accessory endpoints can fail without being requested; details project safe fields", async () => {
  const f = fixture(async (url) => {
    if (!url.startsWith("/api/backend/admin/funnel-events?"))
      return response({}, 500);
    return response(page());
  });
  await f.mount();
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].url.pathname, "/api/backend/admin/funnel-events");
  assert.equal(
    (f.requests[0].init.headers as any).Authorization,
    "Bearer synthetic-admin",
  );
  assert.equal(f.requests[0].url.searchParams.get("limit"), "50");
  assert.match(f.text(), /Assessment avviato/);
  assert.match(f.text(), /assessment_started/);
  assert.match(f.text(), /Anonimo \/ non identificato/);
  assert.match(f.text(), /routing/);
  assert.doesNotMatch(f.text(), /SENSITIVE-FIXTURE|PRIVATE-SESSION/);
  await f.unmount();
});

test("filters and search are sent to server; changing any filter resets page atomically", async () => {
  const f = fixture(async (url) =>
    response(
      page(
        [event()],
        Number(new URL(url, "https://fixture.test").searchParams.get("page")),
      ),
    ),
  );
  await f.mount();
  await f.click("Successiva");
  assert.equal(f.requests.at(-1)!.url.searchParams.get("page"), "2");
  for (const [type, index, value, key] of [
    ["input", 2, " alice@example.test ", "q"],
    ["input", 0, "study_started", "event"],
    ["input", 1, "aws-ai-practitioner", "cert"],
    ["select", 1, "es", "lang"],
    ["select", 0, "7d", "date"],
  ] as const) {
    await f.click("Successiva");
    const before = f.requests.length;
    await f.change(type, index, value);
    assert.equal(f.requests.length, before + 1);
    assert.equal(f.requests.at(-1)!.url.searchParams.get(key), value.trim());
    assert.equal(f.requests.at(-1)!.url.searchParams.get("page"), "1");
  }
  await f.unmount();
});

test("rapid filters abort old requests and ignore late responses even if transport ignores abort", async () => {
  const pending: ((r: Response) => void)[] = [];
  const f = fixture(() => new Promise((resolve) => pending.push(resolve)));
  await f.mount();
  assert.match(f.text(), /Caricamento eventi/);
  await f.change("input", 2, "older");
  await f.change("input", 2, "newest");
  assert.equal(f.requests[0].init.signal?.aborted, true);
  assert.equal(f.requests[1].init.signal?.aborted, true);
  await act(async () =>
    pending[2](response(page([{ ...event(3), email: "newest@example.test" }]))),
  );
  await act(async () => {
    pending[0](response(page([{ ...event(1), email: "stale@example.test" }])));
    pending[1](response({}, 403));
  });
  assert.match(f.text(), /newest@example.test/);
  assert.doesNotMatch(f.text(), /stale@example.test|Accesso negato/);
  await f.unmount();
});

test("a resolved page disappears immediately while the next filter is loading", async () => {
  let resolve!: (r: Response) => void;
  let calls = 0;
  const f = fixture(async () =>
    ++calls === 1
      ? response(page([{ ...event(), email: "previous@example.test" }]))
      : new Promise((r) => {
          resolve = r;
        }),
  );
  await f.mount();
  await f.change("input", 2, "other");
  assert.doesNotMatch(f.text(), /previous@example.test/);
  assert.match(f.text(), /Caricamento eventi/);
  await f.unmount();
  await act(async () => resolve(response(page())));
  assert.equal(f.requests.at(-1)!.init.signal?.aborted, true);
});

test("empty dataset and empty filtered results are distinct", async () => {
  const f = fixture(async () => response(page([], 1, 1)));
  await f.mount();
  assert.match(f.text(), /Nessun risultato con i filtri attivi/);
  await f.click("Azzera filtri");
  assert.match(f.text(), /Nessun evento registrato/);
  assert.equal(f.requests.at(-1)!.url.searchParams.get("date"), "all");
  await f.unmount();
});

for (const status of [401, 403, 500]) {
  test(`HTTP ${status} hides data, gives the right state and allows retry`, async () => {
    let failed = true;
    const f = fixture(async () =>
      failed
        ? response({ error: "RAW-SENSITIVE-BACKEND-ERROR" }, status)
        : response(page()),
    );
    await f.mount();
    assert.match(
      f.text(),
      status === 401
        ? /Sessione scaduta/
        : status === 403
          ? /Accesso negato/
          : /Impossibile caricare/,
    );
    assert.doesNotMatch(f.text(), /RAW-SENSITIVE/);
    failed = false;
    await f.click("Riprova");
    assert.match(f.text(), /Assessment avviato/);
    await f.unmount();
  });
}

test("malformed success and network failure expose a retryable generic error", async () => {
  let network = false;
  const f = fixture(async () => {
    if (network) throw new Error("PRIVATE");
    return response({ ok: true });
  });
  await f.mount();
  assert.match(f.text(), /Impossibile caricare/);
  network = true;
  await f.click("Riprova");
  assert.match(f.text(), /Impossibile caricare/);
  assert.doesNotMatch(f.text(), /PRIVATE/);
  await f.unmount();
});

test("CSV uses existing authenticated export, current filters and explicit identity modes", async () => {
  const f = fixture(async (url) => {
    if (!url.includes("/export?")) return response(page());
    return response({
      ok: true,
      columns: ["event"],
      csv: "study_started",
      row_count: 1,
      pagination: { page: 1, pages: 1, total: 1, snapshot_max_id: 10 },
    });
  });
  await f.mount();
  await f.change("input", 2, "test");
  await f.change("select", 1, "es");
  await act(async () => {
    await f.button("Esporta CSV").props.onClick();
  });
  // onClick starts a void async operation; flush its response and download.
  await act(async () => {});
  assert.equal(f.downloads.length, 1);
  assert.equal(
    f.requests.at(-1)!.url.searchParams.get("identity"),
    "pseudonymous",
  );
  assert.equal(f.requests.at(-1)!.url.searchParams.get("q"), "test");
  assert.equal(f.requests.at(-1)!.url.searchParams.get("lang"), "es");
  await f.click("Esporta CSV con email");
  await act(async () => {});
  assert.equal(f.requests.at(-1)!.url.searchParams.get("identity"), "full");
  assert.equal(f.downloads.length, 2);
  await f.unmount();
});

test("export denial removes visible data and disables further exports", async () => {
  const f = fixture(async (url) =>
    url.includes("/export?") ? response({}, 403) : response(page()),
  );
  await f.mount();
  await f.click("Esporta CSV");
  await act(async () => {});
  assert.match(f.text(), /Accesso negato/);
  assert.doesNotMatch(f.text(), /data-label/);
  assert.equal(f.button("Esporta CSV").props.disabled, true);
  assert.equal(f.downloads.length, 0);
  await f.unmount();
});

test("dates explicitly use Rome across DST; unzoned values are not silently guessed", () => {
  const mod = clientModule("../../src/app/admin/FunnelEventsClient.tsx", {
    "./admin-events.module.css": {},
    "next/link": {},
    "@/lib/download-csv": {},
    "@/lib/funnel-export": {},
  });
  assert.match(mod.formatEventDate("2026-10-25T00:30:00Z"), /02:30:00/);
  assert.match(mod.formatEventDate("2026-10-25T02:30:00Z"), /03:30:00/);
  assert.match(
    mod.formatEventDate("2026-10-25 12:00:00"),
    /fuso non specificato/,
  );
});

test("admin shell defaults to events, keeps the dashboard one click away, gates auth/role, and mounts secondary sections only on selection", async () => {
  let auth: any = {
    user: { role: "admin" },
    token: "synthetic",
    isAdmin: true,
    loading: false,
  };
  let dynamicIndex = 0;
  const Components = [
    "overview",
    "feedback",
    "subscriptions",
    "organizations",
    "push",
  ];
  const Component = clientComponent("../../src/app/admin/AdminClient.tsx", {
    "next/link": { __esModule: true, default: Link },
    "next/dynamic": {
      __esModule: true,
      default: () => {
        const name = Components[dynamicIndex++];
        return () => <div>Secondary:{name}</div>;
      },
    },
    "@/components/auth/AuthProvider": { useAuth: () => auth },
    "./FunnelEventsClient": {
      __esModule: true,
      default: () => <div>Events mounted</div>,
    },
    "./analytics/AdminAnalyticsClient": {
      __esModule: true,
      default: ({ onOpenEvents }: { onOpenEvents: () => void }) => (
        <div>
          Dashboard mounted
          <button type="button" onClick={onOpenEvents}>
            dashboard-open-events
          </button>
        </div>
      ),
    },
    "./admin-events.module.css": { __esModule: true, default: css },
  });
  let renderer!: ReactTestRenderer;
  await act(async () => {
    renderer = create(<Component />);
  });
  assert.match(JSON.stringify(renderer.toJSON()), /Events mounted/);
  assert.doesNotMatch(
    JSON.stringify(renderer.toJSON()),
    /Dashboard mounted|Secondary:/,
  );
  // The analytics dashboard is one visible click away and links back to the events.
  await act(async () =>
    renderer.root
      .findAllByType("button")
      .find((b) => b.children.includes("Dashboard"))!
      .props.onClick(),
  );
  assert.match(JSON.stringify(renderer.toJSON()), /Dashboard mounted/);
  assert.doesNotMatch(
    JSON.stringify(renderer.toJSON()),
    /Events mounted|Secondary:/,
  );
  await act(async () =>
    renderer.root
      .findAllByType("button")
      .find((b) => b.children.includes("dashboard-open-events"))!
      .props.onClick(),
  );
  assert.match(JSON.stringify(renderer.toJSON()), /Events mounted/);
  assert.doesNotMatch(JSON.stringify(renderer.toJSON()), /Dashboard mounted/);
  await act(async () =>
    renderer.root
      .findByType("select")
      .props.onChange({ target: { value: "feedback" } }),
  );
  assert.match(JSON.stringify(renderer.toJSON()), /Secondary:/);
  assert.doesNotMatch(JSON.stringify(renderer.toJSON()), /Events mounted/);
  for (const [state, expected] of [
    [{ loading: true }, /Verifica accesso/],
    [{ user: null, loading: false }, /Accesso richiesto/],
    [
      { user: {}, token: "x", isAdmin: false, loading: false },
      /Accesso negato/,
    ],
  ] as const) {
    auth = state;
    await act(async () => renderer.update(<Component />));
    assert.match(JSON.stringify(renderer.toJSON()), expected);
    assert.doesNotMatch(
      JSON.stringify(renderer.toJSON()),
      /Events mounted|Secondary:|Dashboard mounted/,
    );
  }
  await act(async () => renderer.unmount());
});

for (const leave of ["filters", "unmount"]) {
  test(`an export completing after ${leave} cannot download obsolete data`, async () => {
    let resolve!: (response: Response) => void;
    const f = fixture(async (url) =>
      url.includes("/export?")
        ? new Promise((r) => {
            resolve = r;
          })
        : response(page()),
    );
    await f.mount();
    await f.click("Esporta CSV");
    if (leave === "filters") await f.change("input", 2, "new-filter");
    else await f.unmount();
    await act(async () =>
      resolve(
        response({
          ok: true,
          columns: ["event"],
          csv: "study_started",
          row_count: 1,
          pagination: { page: 1, pages: 1, total: 1, snapshot_max_id: 10 },
        }),
      ),
    );
    assert.equal(f.downloads.length, 0);
    if (leave === "filters") await f.unmount();
  });
}

/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [result, setResult] = useState("(in corso...)");

  useEffect(() => {
    (async () => {
      const tries = [
        "/api/backend",           // root
        "/api/backend/",          // root con slash
        "/api/backend/version",
        "/api/backend/status",
        "/api/backend/ping",
        "/api/backend/api",       // molti backend espongono /api
        "/api/backend/api/version",
        "/api/backend/api/status",
      ];
      for (const ep of tries) {
        try {
          const r = await fetch(ep, { credentials: "include", headers: { Accept: "text/plain,application/json" } });
          const txt = await r.text();
          setResult(`GET ${ep} → ${r.status} — ${txt}`);
          return;
        } catch {}
      }
      setResult("Nessuno degli endpoint di prova ha risposto. Usa un endpoint reale del tuo backend.");
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>API Test</h1>
      <pre>{result}</pre>
    </div>
  );
}

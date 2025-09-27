/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";

async function probe(): Promise<string> {
  const endpoints = [
    "/api/backend/health",
    "/api/backend/ping",
    "/api/backend/version",
  ];
  for (const ep of endpoints) {
    try {
      const r = await fetch(ep, {
        credentials: "include",
        headers: { Accept: "text/plain,application/json" },
      });
      const txt = await r.text();
      return "GET " + ep + " → " + r.status + " — " + txt;
    } catch {
      // prova il prossimo
    }
  }
  return "Tutte le prove sono fallite. Cambia endpoint con uno esistente del tuo Express.";
}

export default function ApiTestPage() {
  const [result, setResult] = useState("(in corso...)");
  useEffect(() => {
    probe().then(setResult).catch((e) => setResult("ERRORE: " + String(e)));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>API Test</h1>
      <pre>{result}</pre>
    </div>
  );
}

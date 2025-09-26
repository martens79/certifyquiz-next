"use client";
import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [result, setResult] = useState<string>("(in corso...)");

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL; // se vuoi esporre pubblica, usa NEXT_PUBLIC_API_BASE_URL
    const url = `${api}/health`; // o /ping, /version, un endpoint “safe” del tuo Express

    fetch(url, {
      method: "GET",
      credentials: "include", // fondamentale per i cookie cross-site
      headers: {
        "Accept": "application/json",
      },
    })
      .then(async (r) => {
        const text = await r.text();
        setResult(`STATUS ${r.status} — ${text}`);
      })
      .catch((e) => setResult(`ERRORE: ${String(e)}`));
  }, []);

  return (
    <div style={{padding: 24}}>
      <h1>API Test</h1>
      <p>Chiamo il backend con <code>credentials: "include"</code>.</p>
      <pre>{result}</pre>
    </div>
  );
}

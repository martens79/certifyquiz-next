"use client";
import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [result, setResult] = useState<string>("(in corso...)");

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${api}/health`;

    fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        const text = await r.text();
        setResult(`STATUS ${r.status} — ${text}`);
      })
      .catch((e) => setResult(`ERRORE: ${String(e)}`));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>API Test</h1>
      <p>
        Chiamo il backend con <code>credentials: &quot;include&quot;</code>.
      </p>
      <pre>{result}</pre>
    </div>
  );
}

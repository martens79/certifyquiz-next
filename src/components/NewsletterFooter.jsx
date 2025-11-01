// NewsletterFooter.jsx (client)
"use client";
import { useState } from "react";

export default function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const r = await fetch("/api/newsletter", { method:"POST", body: JSON.stringify({ email }) });
    const j = await r.json();
    setMsg(j?.message || j?.error || (r.ok ? "Ok" : "Errore"));
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="la-tua@email.com"
        className="rounded-xl px-3 py-2 border w-full"
      />
      <button disabled={loading} className="rounded-xl px-4 py-2 border">
        {loading ? "..." : "Iscriviti"}
      </button>
      {msg && <span className="text-sm">{msg}</span>}
    </form>
  );
}

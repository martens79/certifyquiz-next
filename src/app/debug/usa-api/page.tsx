"use client";
import { useEffect, useState } from "react";
// se hai l'alias "@/*" usa questa riga:
import { apiGet } from "@/lib/apiClient";
// altrimenti: import { apiGet } from "../../../lib/apiClient";

export default function UsaApiPage() {
  const [out, setOut] = useState("(in corso...)");

  useEffect(() => {
    apiGet("/")                    // equivale a chiamare /api/backend/ → "OK"
      .then((res) => setOut(String(res)))
      .catch((e) => setOut("ERRORE: " + String(e)));
  }, []);

  return (
    <div style={{padding:24}}>
      <h1>Prova apiGet</h1>
      <pre>{out}</pre>
    </div>
  );
}

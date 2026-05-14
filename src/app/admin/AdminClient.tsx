"use client";

import { useState } from "react";
import AdminFeedbackClient from "./feedback/AdminFeedbackClient";

export default function AdminClient() {
  const [tab, setTab] = useState<"dashboard" | "feedback">("dashboard");

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        CertifyQuiz Admin
      </h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setTab("feedback")}>
          Feedback
        </button>
      </div>

      {tab === "dashboard" && (
        <div>
          <h2>Dashboard Leads</h2>

          <p>
            Qui arriveranno:
          </p>

          <ul>
            <li>Lead overview</li>
            <li>Assessment stats</li>
            <li>Top certifications</li>
            <li>Top topics</li>
          </ul>
        </div>
      )}

      {tab === "feedback" && <AdminFeedbackClient />}
    </div>
  );
}
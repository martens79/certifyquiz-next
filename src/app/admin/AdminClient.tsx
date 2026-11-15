"use client";

import Link from "next/link";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/auth/AuthProvider";
import FunnelEventsClient from "./FunnelEventsClient";
import AdminAnalyticsClient from "./analytics/AdminAnalyticsClient";
import styles from "./admin-events.module.css";

const loadingPanel = () => <p role="status">Caricamento sezione…</p>;
const Overview = dynamic(() => import("./AdminOverviewClient"), {
  loading: loadingPanel,
});
const Feedback = dynamic(() => import("./feedback/AdminFeedbackClient"), {
  loading: loadingPanel,
});
const Subscriptions = dynamic(
  () => import("./subscriptions/AdminSubscriptionsClient"),
  { loading: loadingPanel },
);
const Organizations = dynamic(
  () => import("./organizations/AdminOrganizationsClient"),
  { loading: loadingPanel },
);
const Push = dynamic(() => import("./push/AdminPushClient"), {
  loading: loadingPanel,
});
const sections = {
  overview: { label: "Panoramiche e lead", Component: Overview },
  feedback: { label: "Feedback", Component: Feedback },
  subscriptions: { label: "Abbonamenti", Component: Subscriptions },
  organizations: { label: "Aziende", Component: Organizations },
  push: { label: "Notifiche push", Component: Push },
};
type Section = "analytics" | "events" | keyof typeof sections;

export default function AdminClient() {
  const { user, isAdmin, token, loading } = useAuth();
  const [section, setSection] = useState<Section>("events");

  if (loading)
    return (
      <div className={styles.page} role="status">
        Verifica accesso…
      </div>
    );
  if (!user || !token)
    return (
      <div className={styles.page}>
        <h1>Accesso richiesto</h1>
        <p>Accedi con un account admin.</p>
        <Link href="/login?returnTo=%2Fadmin">Accedi</Link>
      </div>
    );
  if (!isAdmin)
    return (
      <div className={styles.page}>
        <h1>Accesso negato</h1>
        <p>Questa sezione è riservata agli admin.</p>
      </div>
    );

  const Secondary = section === "events" || section === "analytics" ? null : sections[section].Component;
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>CertifyQuiz · Admin</p>
          <h1>
            {section === "analytics"
              ? "Dashboard"
              : section === "events"
                ? "Funnel Events"
                : sections[section].label}
          </h1>
        </div>
        <nav aria-label="Amministrazione" className={styles.navigation}>
          <button
            type="button"
            aria-current={section === "events" ? "page" : undefined}
            onClick={() => setSection("events")}
          >
            Funnel Events
          </button>
          <button
            type="button"
            aria-current={section === "analytics" ? "page" : undefined}
            onClick={() => setSection("analytics")}
          >
            Dashboard
          </button>
          <label>
            Altre funzioni
            <select
              aria-label="Altre funzioni amministrative"
              value={section === "events" || section === "analytics" ? "" : section}
              onChange={(e) =>
                setSection((e.target.value || "events") as Section)
              }
            >
              <option value="">Seleziona sezione</option>
              {Object.entries(sections).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </header>
      {section === "analytics" ? (
        <AdminAnalyticsClient
          key={token}
          token={token}
          onOpenEvents={() => setSection("events")}
        />
      ) : section === "events" ? (
        <FunnelEventsClient key={token} token={token} />
      ) : (
        Secondary && <Secondary />
      )}
    </main>
  );
}

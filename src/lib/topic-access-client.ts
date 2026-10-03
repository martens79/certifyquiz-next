// src/lib/topic-access-client.ts
// Per-user topic access status, shared by the badges and the free-pool notice.
// One request per certification and page load; GET /topics/:certId/access is never cached
// server-side (Cache-Control: private, no-store), so it is only called from the client.

import { apiGet } from "@/lib/apiClient";

export type TopicStatus = "open" | "free" | "unlocked" | "locked";
export type TopicAccessSnapshot = { entitled: boolean | null; statuses: Map<number, TopicStatus> };
type AccessPayload = { entitled?: boolean; topics?: Array<{ id: number; status: TopicStatus }> };

const requests = new Map<number, Promise<TopicAccessSnapshot>>();

export function loadTopicAccess(certId: number): Promise<TopicAccessSnapshot> {
  let p = requests.get(certId);
  if (!p) {
    p = apiGet<AccessPayload>(`/topics/${certId}/access`)
      .then((data) => ({
        entitled: typeof data.entitled === "boolean" ? data.entitled : null,
        statuses: new Map((data.topics ?? []).map((t) => [t.id, t.status] as const)),
      }))
      .catch(() => ({ entitled: null, statuses: new Map<number, TopicStatus>() }));
    requests.set(certId, p);
  }
  return p;
}

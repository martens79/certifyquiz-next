// src/lib/server/maps.ts
import "server-only";

import { getMapsList } from "@/lib/data";
import type { Locale } from "@/lib/paths";
import { getCertBySlug } from "@/certifications/registry";
import type { MapCardItem } from "@/components/maps/MapOverviewGrid";

/**
 * Lista mappe pubblicate, arricchita col logo della certificazione.
 *
 * Il logo NON sta nel DB (la tabella `certifications` non ha image_url): la
 * fonte di verità è il registry statico del frontend. La risoluzione avviene
 * qui, lato server, per non trascinare l'intero registry nel bundle client.
 */
export async function getMapCards(lang: Locale): Promise<MapCardItem[]> {
  const items = await getMapsList(lang);

  return items.map((item) => ({
    ...item,
    imageUrl: getCertBySlug(item.certification_slug)?.imageUrl ?? null,
  }));
}

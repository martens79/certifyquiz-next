import Link from "next/link";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";

export const revalidate = 86400;

export default async function CertListPage() {
  const slugs = await getAllCertSlugs("it");
  const items = await Promise.all(slugs.map(s => getCertBySlug(s, "it")));

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Certificazioni disponibili</h1>
      <ul className="space-y-3">
        {items.filter(Boolean).map(c => (
          <li key={c!.slug}>
            <Link className="underline" href={`/certificazioni/${c!.slug}`}>
              Quiz {c!.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

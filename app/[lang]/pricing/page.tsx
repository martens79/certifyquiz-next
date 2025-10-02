const SUPPORTED = ["it","en","fr","es"] as const;

export default function PricingPage({ params }: { params: { lang: string } }) {
  if (!(SUPPORTED as readonly string[]).includes(params.lang)) return null;
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{params.lang === "it" ? "Prezzi" : "Pricing"}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: "Free", price: "€0", features: ["Quiz base", "Progressi"] },
          { name: "Premium", price: "€9.90/mese", features: ["Spiegazioni", "Modalità esame", "Badge"] },
          { name: "Team", price: "Contattaci", features: ["Licenze multiple", "Report"] },
        ].map((p) => (
          <div key={p.name} className="rounded-xl border p-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="text-2xl mt-2">{p.price}</div>
            <ul className="mt-3 text-sm text-gray-700 list-disc ml-5">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

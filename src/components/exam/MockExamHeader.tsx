export default function MockExamHeader() {
  return (
    <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🛡️</span>
        <h1 className="text-lg font-semibold">
          Official Exam Simulation
        </h1>
      </div>

      <p className="mt-1 text-sm text-neutral-600">
        ⏱️ Timer attivo · ❌ Nessun feedback immediato · 📄 Review finale
      </p>

      <p className="mt-3 text-sm text-neutral-700">
        Questa simulazione replica le condizioni reali dell’esame ufficiale.
      </p>
    </div>
  );
}

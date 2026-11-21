// Testi pubblici specifici di AI-103 (slug storico azure-ai-102-*).
// Finché il banco di domande è in revisione rispetto agli obiettivi ufficiali, le superfici
// generiche (CTA Premium, simulazione d'esame) non devono promettere "preparazione completa"
// né "le condizioni reali dell'esame". Nessun'altra certificazione usa questo modulo.

export const AI103_SLUG = "azure-ai-102-ai-engineer-associate";

export type Ai103Lang = "it" | "en" | "fr" | "es";

export const isAi103Slug = (slug: string | null | undefined): boolean => slug === AI103_SLUG;

export const AI103_DISPLAY_NAME = "AI-103";

/** Titolo della card Premium nella pagina certificazione (al posto di "Preparazione completa per …"). */
export const AI103_PREMIUM_TITLE: Record<Ai103Lang, (name: string) => string> = {
  it: (n) => `Risorse di pratica per ${n}`,
  en: (n) => `Practice resources for ${n}`,
  fr: (n) => `Ressources d'entraînement pour ${n}`,
  es: (n) => `Recursos de práctica para ${n}`,
};

/** Simulazione d'esame: sessione a tempo, senza dichiarare di replicare l'esame ufficiale. */
export const AI103_MOCK_COPY: Record<
  Ai103Lang,
  { badge: string; title: (name: string) => string; desc: string; note: string }
> = {
  it: {
    badge: "🛡️ Sessione di pratica a tempo",
    title: (n) => `Sessione di pratica a tempo — ${n}`,
    desc: "Sessione di pratica a tempo sul banco di domande attuale, in revisione per allinearsi agli obiettivi ufficiali.",
    note: "Il banco di domande è in revisione per allinearsi agli obiettivi ufficiali AI-103: questa sessione non replica le condizioni dell'esame reale.",
  },
  en: {
    badge: "🛡️ Timed practice session",
    title: (n) => `Timed practice session — ${n}`,
    desc: "Timed practice session on the current question bank, which is under review to align with the official objectives.",
    note: "The question bank is under review to align with the official AI-103 objectives: this session does not replicate the conditions of the real exam.",
  },
  fr: {
    badge: "🛡️ Session d'entraînement chronométrée",
    title: (n) => `Session d'entraînement chronométrée — ${n}`,
    desc: "Session d'entraînement chronométrée sur la banque de questions actuelle, en cours de révision pour s'aligner sur les objectifs officiels.",
    note: "La banque de questions est en cours de révision pour s'aligner sur les objectifs officiels d'AI-103 : cette session ne reproduit pas les conditions de l'examen réel.",
  },
  es: {
    badge: "🛡️ Sesión de práctica cronometrada",
    title: (n) => `Sesión de práctica cronometrada — ${n}`,
    desc: "Sesión de práctica cronometrada con el banco de preguntas actual, en revisión para alinearse con los objetivos oficiales.",
    note: "El banco de preguntas está en revisión para alinearse con los objetivos oficiales de AI-103: esta sesión no reproduce las condiciones del examen real.",
  },
};

/** Metadata (noindex) della pagina di simulazione. */
export const AI103_MOCK_META: Record<Ai103Lang, { title: string; description: string }> = {
  it: { title: "Sessione di pratica a tempo AI-103 | CertifyQuiz", description: "Sessione di pratica a tempo sul banco di domande AI-103, in revisione per allinearsi agli obiettivi ufficiali." },
  en: { title: "AI-103 Timed Practice Session | CertifyQuiz", description: "Timed practice session on the AI-103 question bank, which is under review to align with the official objectives." },
  fr: { title: "Session d'entraînement chronométrée AI-103 | CertifyQuiz", description: "Session d'entraînement chronométrée sur la banque de questions AI-103, en cours de révision pour s'aligner sur les objectifs officiels." },
  es: { title: "Sesión de práctica cronometrada AI-103 | CertifyQuiz", description: "Sesión de práctica cronometrada con el banco de preguntas AI-103, en revisión para alinearse con los objetivos oficiales." },
};

// src/lib/exam-config.ts
// --------------------------------------------------
// Config ufficiale esami per certificazione
// Tutti i valori sono FACILMENTE modificabili
// --------------------------------------------------

export type ExamConfig = {
  questions: number;   // numero domande esame
  durationMin: number; // durata in minuti
};

// ⚠️ key = certification_id (DB)
export const EXAM_CONFIG_BY_CERT_ID: Record<number, ExamConfig> = {
  // CompTIA
  6:  { questions: 90, durationMin: 90 }, // Security+
  2:  { questions: 90, durationMin: 90 }, // A+
  1:  { questions: 75, durationMin: 60 }, // ITF+
  10: { questions: 120, durationMin: 120 }, // CCNA

  // EIPASS / ECDL
  3: { questions: 36, durationMin: 45 }, // EIPASS
  4: { questions: 36, durationMin: 45 }, // ECDL

  // fallback implicito per le altre
};

// helper con fallback safe
export function getExamConfig(certificationId?: number | null): ExamConfig {
  return (
    (certificationId && EXAM_CONFIG_BY_CERT_ID[certificationId]) ?? {
      questions: 30,
      durationMin: 30,
    }
  );
}

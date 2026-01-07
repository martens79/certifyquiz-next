// src/lib/exam-specs.ts
// -----------------------------------------------------------------------------
// Exam specs ufficiali (o realistici) per certificazione.
// Usati dal QuizEngine per:
// - limitare il numero di domande in modalità EXAM
// - impostare la durata totale dell’esame
// -----------------------------------------------------------------------------
//
// NOTE IMPORTANTI:
// - Le chiavi sono i certification_id del DB
// - I valori NON influenzano il training
// - Se una cert non è presente → fallback automatico
// -----------------------------------------------------------------------------

export type ExamSpec = {
  /** Numero domande in modalità EXAM */
  questions: number;
  /** Durata totale dell’esame in secondi */
  durationSec: number;
};

/* ---------------------------------------------------------------------------
   MAPPA PRINCIPALE
--------------------------------------------------------------------------- */
export const EXAM_SPECS_BY_CERT_ID: Record<number, ExamSpec> = {
  /* ===================== COMP TIA ===================== */

  // 1 — CompTIA ITF+
  1: { questions: 75, durationSec: 75 * 60 },

  // 2 — CompTIA A+
  // (2 esami separati in realtà, qui simulazione unica)
  2: { questions: 90, durationSec: 90 * 60 },

  // 6 — CompTIA Security+
  6: { questions: 90, durationSec: 90 * 60 },

  // 11 — CompTIA Network+
  11: { questions: 90, durationSec: 90 * 60 },

  // 13 — CompTIA Cloud+
  13: { questions: 90, durationSec: 90 * 60 },

  /* ===================== CISCO ===================== */

  // 10 — CCNA
  10: { questions: 100, durationSec: 120 * 60 },

  // 33 — Cisco CCST – Networking
  33: { questions: 50, durationSec: 60 * 60 },

  // 12 — Cisco CCST – Cybersecurity
  12: { questions: 50, durationSec: 60 * 60 },

  /* ===================== SECURITY ADVANCED ===================== */

  // 7 — CISSP
  7: { questions: 125, durationSec: 240 * 60 },

  // 8 — ISC2 CC
  8: { questions: 100, durationSec: 120 * 60 },

  // 9 — CEH
  9: { questions: 125, durationSec: 240 * 60 },

  /* ===================== CLOUD ===================== */

  // 15 — AWS Solutions Architect
  15: { questions: 65, durationSec: 130 * 60 },

  // 31 — Google Cloud (Cloud Digital Leader)
  31: { questions: 50, durationSec: 90 * 60 },

  // 16 — Microsoft Azure Fundamentals
  16: { questions: 40, durationSec: 60 * 60 },

  /* ===================== DATABASE ===================== */

  // 26 — MongoDB
  26: { questions: 65, durationSec: 90 * 60 },

  // 27 — MySQL Certification
  27: { questions: 60, durationSec: 90 * 60 },

  // 30 — Microsoft SQL Server
  30: { questions: 60, durationSec: 120 * 60 },

  /* ===================== DEV / PROGRAMMING ===================== */

  // 18 — Microsoft C#
  18: { questions: 60, durationSec: 120 * 60 },

  // 19 — Python
  19: { questions: 60, durationSec: 120 * 60 },

  // 20 — Java SE
  20: { questions: 60, durationSec: 120 * 60 },

  // 21 — Javascript Developer
  21: { questions: 60, durationSec: 120 * 60 },

  /* ===================== INFRA / VENDOR ===================== */

  // 22 — VMware Certified Professional
  22: { questions: 70, durationSec: 135 * 60 },

  // 28 — JNCIE
  28: { questions: 80, durationSec: 120 * 60 },

  // 29 — F5 Certified Professional
  29: { questions: 80, durationSec: 120 * 60 },
};

/* ---------------------------------------------------------------------------
   FALLBACK SICURO
--------------------------------------------------------------------------- */
export function getExamSpecForCert(
  certificationId: number | null,
  poolSize: number
): ExamSpec {
  // fallback ragionevole:
  // - max 60 domande
  // - 60s per domanda
  const fallbackQuestions = Math.min(60, Math.max(1, poolSize));
  const fallbackDuration = fallbackQuestions * 60;

  if (!certificationId) {
    return {
      questions: fallbackQuestions,
      durationSec: fallbackDuration,
    };
  }

  return (
    EXAM_SPECS_BY_CERT_ID[certificationId] ?? {
      questions: fallbackQuestions,
      durationSec: fallbackDuration,
    }
  );
}

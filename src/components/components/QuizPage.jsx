// src/pages/QuizPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Home, BookOpen, User, ClipboardList, Dumbbell, GraduationCap } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCurrentLang, getLabel, t } from "../utils/langUtils";

import { useAuth } from "../contexts/AuthContext";
import TimerCountdown from "../components/TimerCountdown";
import { examConfig } from "../utils/examConfig";
import { getExamSettings } from "../utils/examUtils";
import { api } from "../services/api";
import { isFreeMode } from "../config/pricing";


// === util per trovare la risposta corretta (FUORI dal componente) ===
const isTrue = (v) =>
  v === true || v === 1 || v === "1" || (typeof v === "string" && v.toLowerCase() === "true");

const getCorrectIndex = (answers = []) =>
  answers.findIndex((a) => isTrue(a?.is_correct) || isTrue(a?.correct) || isTrue(a?.isCorrect));




const UI_STR = {
  it: {
    // esistenti
    correct: "✅ Risposta corretta!",
    wrongPrefix: "❌ Risposta errata. Corretta:",
    helpful: "Questa domanda era chiara e utile?",
    yes: "Sì",
    no: "No",
    reviewLater: "📌 Rivedi dopo",
    removedFromReview: "✅ Rimosso da rivedere",
    thanks: "✅ Grazie per il tuo feedback!",
    // NUOVE
    quiz: "Quiz",
    certification: "Certificazione",
    topic: "Topic",
    training: "Allenamento",
    exam: "Esame",
    trainingMode: "Modalità Allenamento",
    examMode: "Modalità Esame",
  },
  en: {
    correct: "✅ Correct answer!",
    wrongPrefix: "❌ Wrong answer. Correct:",
    helpful: "Was this question clear and useful?",
    yes: "Yes",
    no: "No",
    reviewLater: "📌 Review later",
    removedFromReview: "✅ Removed from review",
    thanks: "✅ Thanks for your feedback!",
    // NEW
    quiz: "Quiz",
    certification: "Certification",
    topic: "Topic",
    training: "Training",
    exam: "Exam",
    trainingMode: "Training mode",
    examMode: "Exam mode",
  },
  fr: {
    correct: "✅ Réponse correcte !",
    wrongPrefix: "❌ Mauvaise réponse. Correcte :",
    helpful: "Cette question était-elle claire et utile ?",
    yes: "Oui",
    no: "Non",
    reviewLater: "📌 Revoir plus tard",
    removedFromReview: "✅ Retirée de la liste à revoir",
    thanks: "✅ Merci pour votre retour !",
    // NOUVEAU
    quiz: "Quiz",
    certification: "Certification",
    topic: "Sujet",
    training: "Entraînement",
    exam: "Examen",
    trainingMode: "Mode entraînement",
    examMode: "Mode examen",
  },
  es: {
    correct: "✅ ¡Respuesta correcta!",
    wrongPrefix: "❌ Respuesta incorrecta. Correcta:",
    helpful: "¿Esta pregunta fue clara y útil?",
    yes: "Sí",
    no: "No",
    reviewLater: "📌 Revisar más tarde",
    removedFromReview: "✅ Quitado de revisar",
    thanks: "✅ ¡Gracias por tu comentario!",
    // NUEVO
    quiz: "Quiz",
    certification: "Certificación",
    topic: "Tema",
    training: "Entrenamiento",
    exam: "Examen",
    trainingMode: "Modo entrenamiento",
    examMode: "Modo examen",
  },
};




// Pulisce stringhe (trim + rimuove HTML semplice se arriva dal DB con tag)
function cleanStr(v) {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s) return "";
  // rimuove tag HTML basilari senza rompere eventuali simboli
  return s.replace(/<[^>]+>/g, "").trim();
}
// Rimuove un eventuale prefisso "Explanation:" / "Spiegazione:" / "Explication:" / "Explicación:"
// Rimuove prefissi "Explanation:" / "Spiegazione:" in varie forme all'inizio
function stripExplanationLabel(s) {
  let txt = cleanStr(s);

  // rimuovi BOM/zero-width, NBSP ecc. all'inizio
  txt = txt.replace(/^[\uFEFF\u200B\u200C\u200D\u2060\u00A0\s]+/u, "");

  // rimuovi emoji/simboli/virgolette iniziali facoltativi (💡, 📘, “, ", -, …)
  txt = txt.replace(/^(?:[^\p{L}\p{N}]{0,3})/u, "");

  // rimuovi l'etichetta in 4 lingue seguita da : o - o —
  txt = txt.replace(
    /^(?:spiegazione|explanation|explication|explicación)\s*[:\-–—]\s*/i,
    ""
  );

  return txt;
}

// Uniforma i campi explanation per qualsiasi naming del backend
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== "object") return raw;

  // Collezione possibili alias per ogni lingua
  const aliases = {
    it: [
      "explanation",
      "explanation_it",
      "explanationIt",
      "explanation_text",
      "explanationText",
      "spiegazione",
      "exp_it",
    ],
    en: ["explanation_en", "explanationEn", "exp_en"],
    fr: ["explanation_fr", "explanationFr", "exp_fr"],
    es: ["explanation_es", "explanationEs", "exp_es"],
  };

  const out = { ...raw };

  const pickFirst = (keys) => {
    for (const k of keys) {
      if (raw[k] != null && String(raw[k]).trim() !== "") return cleanStr(raw[k]);
    }
    return "";
  };

  // Normalizza explanation in 4 lingue
  out.explanation = cleanStr(raw.explanation ?? pickFirst(aliases.it) ?? "");
  out.explanation_en = cleanStr(raw.explanation_en ?? pickFirst(aliases.en) ?? "");
  out.explanation_fr = cleanStr(raw.explanation_fr ?? pickFirst(aliases.fr) ?? "");
  out.explanation_es = cleanStr(raw.explanation_es ?? pickFirst(aliases.es) ?? "");

  // DEBUG spiegazioni
  console.groupCollapsed("normalizeQuestion →", raw.id || raw.question || "(no id)");
  console.log("RAW explanations:", {
    explanation: raw.explanation,
    explanation_it: raw.explanation_it,
    explanation_text: raw.explanation_text,
    spiegazione: raw.spiegazione,
    explanation_en: raw.explanation_en,
    explanation_fr: raw.explanation_fr,
    explanation_es: raw.explanation_es,
  });
  console.log("NORMALIZED:", {
    it: out.explanation,
    en: out.explanation_en,
    fr: out.explanation_fr,
    es: out.explanation_es,
  });
  console.groupEnd();

  // Normalizza answers se arrivano con chiavi strane
  if (Array.isArray(raw.answers)) {
    out.answers = raw.answers.map((a, idx) => {
      if (!out.answers.some(ans => isTrue(ans.is_correct))) {
  console.warn("No correct AFTER normalize", out.id, out.answers);
}

      const text =
        a.text ??
        a.answer_text ??
        a.answerText ??
        a.label ??
        a.title ??
        "";
      // ✅ NON perdere il flag quando arriva come 1 / "1" / "true"
const is_correct =
  isTrue(a.is_correct) || isTrue(a.isCorrect) || isTrue(a.correct);

      // DEBUG singola risposta
      console.log("→ Answer", idx, {
        raw: a,
        normalizedText: text,
        normalizedCorrect: is_correct,
      });

      return {
        ...a,
        text,
        is_correct,
      };
    });
  }

  // Uniforma chiavi id topic/cert se servisse
  out.topic_id = raw.topic_id ?? raw.topicId ?? out.topic_id;
  out.certification_id = raw.certification_id ?? raw.certificationId ?? out.certification_id;

  return out;
}

// Restituisce la spiegazione nella lingua UI con robusti fallback
function getExplanationText(q, lang) {
  if (!q) return "";

  let s = "";
 if (lang === "en" && q.explanation_en) s = q.explanation_en;
 else if (lang === "fr" && q.explanation_fr) s = q.explanation_fr;
 else if (lang === "es" && q.explanation_es) s = q.explanation_es;
 else s = q.explanation || "";
 return stripExplanationLabel(s);
}


function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


/* =========================
   COMPONENTE
   ========================= */
const QuizPage = () => {
  const { topicId: rawTopicId, certificationId: urlCertId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const quizId = location.state?.quizId || null; // non usato qui, resta per compatibilità

  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelected] = useState({});
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(null);

  // Modalità — toggle
  const [trainingMode, setTrainingMode] = useState(true);

  const [timeLeft, setTimeLeft] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const { user, setUser } = useAuth();
  const isPremium = user?.is_premium || user?.role === "admin";
  const canSeeExplanations = isFreeMode() || isPremium;

  // 1) Label multilingua per "Mixed"
const MIXED_LABEL = {
  it: "Misti",
  en: "Mixed",
  fr: "Mélangés",
  es: "Mixtos",
};

  const [certificationId, setCertificationId] = useState(urlCertId ? Number(urlCertId) : null);
  const topicId = rawTopicId ?? "mixed";
  const isMixed = topicId === "mixed";
  const uiLang = getCurrentLang();
  const S = UI_STR[uiLang] || UI_STR.it;

  const [badgeEarned, setBadgeEarned] = useState(false);

  const { duration, questions: questionsLimit } = getExamSettings(Number(certificationId));
  const certificationName = getLabel(questions?.[0]?.certification_name) ?? "";
  //const topicName = getLabel(questions?.[0]?.topic_title) ?? "";
  const topicName = !isMixed ? (getLabel(questions?.[0]?.topic_title) ?? "") : "";
  const headerTitle = isMixed ? (MIXED_LABEL[uiLang] || "Mixed") : topicName;

  // Config per cert corrente
  const config = examConfig[Number(certificationId)];
  const isTopicQuiz = !isMixed && topicId !== null;

  // Durata/n° in esame
  const examDurationMinutes = !trainingMode ? (isMixed ? config?.duration || 60 : 10) : null;
  const examQuestionLimit = !trainingMode ? (isMixed ? config?.questions || 50 : 10) : null;

  // Domande mostrate (in esame si taglia a N)
  const displayedQuestions = examQuestionLimit ? questions.slice(0, examQuestionLimit) : questions;

  // Caricamento domande + normalizzazione + shuffle
  useEffect(() => {
    if (!topicId && !isMixed) return;

    const url = isMixed
      ? `/questions-mixed/${certificationId || 0}?lang=${uiLang}`
      : `/questions/${topicId}?lang=${uiLang}`;

    api
      .get(url)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data?.questions || [];
        // normalizza ogni domanda e poi shuffle domande+risposte
        const normalized = raw.map(normalizeQuestion);
        const shuffledQuestions = shuffleArray(normalized).map((q) => ({
          ...q,
          answers: shuffleArray(q.answers || []),
        }));

        setQuestions(shuffledQuestions);

        // set certificazione se manca
        if (!certificationId && (shuffledQuestions[0]?.certification_id || urlCertId)) {
          setCertificationId(Number(shuffledQuestions[0]?.certification_id ?? urlCertId));
        }
      })
      .catch((err) => {
        console.error("Errore caricamento domande:", err);
        toast.error("❌ " + t("quizLoadError", uiLang));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, certificationId, isMixed, urlCertId, uiLang]);

  // Auto-invio in esame quando tutte risposte date
  useEffect(() => {
    if (!trainingMode && !examFinished && displayedQuestions.length > 0) {
      const allAnswered = displayedQuestions.every((q) => selectedAnswers[q.id]);
      if (allAnswered) handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswers]);

  const handleAnswer = (questionId, idx) => {
  const q = questions.find((x) => x.id === questionId);

  // indice della risposta corretta (true | 1 | "1")
  const correctIndex = (q?.answers ?? []).findIndex(
    (a) => a?.is_correct === true || a?.is_correct === 1 || a?.is_correct === "1"
  );

  const correctText = q?.answers?.[correctIndex]?.text ?? "";

  // salva selezione + info della corretta
  setSelected((prev) => ({
    ...prev,
    [questionId]: { selected: idx, correctIndex, correctText },
  }));

  // (opzionale) debug se non trovata
  if (correctIndex < 0) {
    console.warn("Nessuna risposta corretta trovata per", q?.id, q?.answers);
  }
};


  const handleSubmit = async () => {
    if (examFinished) return;

    // avvisa se mancano risposte (solo esame)
    const unanswered = displayedQuestions.filter((q) => !(q.id in selectedAnswers));
    if (!trainingMode && unanswered.length > 0) {
      const confirmed = window.confirm(
        `⚠️ Hai lasciato ${unanswered.length} domande senza risposta. Vuoi inviare comunque?`
      );
      if (!confirmed) return;
    }

    // punteggio + errori
    let pts = 0;
    const newWrongQuestions = [];
    displayedQuestions.forEach((q) => {
      const a = selectedAnswers[q.id];
      if (a?.selected === a?.correct) pts++;
      else newWrongQuestions.push({ id: q.id, question: q.question });
    });

    const q0 = displayedQuestions?.[0] ?? questions?.[0] ?? {};
    const effectiveTopicId =
      topicId && topicId !== "mixed" ? Number(topicId) : q0?.topic_id ? Number(q0.topic_id) : null;

    const effectiveCertificationId = Number(
      certificationId ?? q0?.certification_id ?? q0?.certificationId ?? urlCertId
    );

    // Salvataggio esame (solo se non training)
    if (!trainingMode) {
      try {
        const payload = {
          topicId: effectiveTopicId,
          totalQuestions: displayedQuestions.length,
          correctAnswers: pts,
          isExam: true,
          ...(Number.isFinite(effectiveCertificationId) && effectiveCertificationId > 0
            ? { certification_id: effectiveCertificationId }
            : {}),
        };

        const res = await api.post("/save-exam", payload);
        const response = res.data;

        if (response.streakBonus > 0) {
          toast.success(`🔥 Bonus streak: +${response.streakBonus} punti!`);
        }

        if (response.awardedBadge || response.badgeAssigned) {
          toast.success("🏅 Hai guadagnato un badge!");
          setBadgeEarned(true);
          window.dispatchEvent(new Event("refreshBadges"));
          localStorage.setItem("refreshBadges", String(Date.now()));
        }

        if (response.updatedUser) {
          localStorage.setItem("user", JSON.stringify(response.updatedUser));
          setUser(response.updatedUser);
        }

        localStorage.setItem("refreshStreak", String(Date.now()));
      } catch (error) {
        console.error("❌ save-exam error:", error?.response?.data || error);
        toast.error("Errore durante il salvataggio dell'esame");
      }
    }

    setScore(pts);
    setWrongQuestions(newWrongQuestions);
    setExamFinished(true);
  };

  const sendFeedback = (questionId, type, description = "") => {
    if (feedbackSent[questionId]) return;
    setFeedbackSent((prev) => ({ ...prev, [questionId]: true }));

    api
      .post("/feedback", {
        questionId,
        topicId: isMixed ? null : Number(topicId),
        type,
        description,
      })
      .then(() => {
        console.log("Feedback inviato con successo");
      })
      .catch((err) => {
        console.error("Errore nel feedback", err);
        toast.error("Errore di rete, riprova.");
      });
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  };

  const switchMode = (train) => {
    setTrainingMode(train);
    setExamFinished(false);
    setScore(null);
    setSelected({});
  };

  if (!questions.length) {
    return <p className="p-6 text-center text-white">⏳ Caricamento domande…</p>;
  }

 return (
  <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-blue-700 text-white">
    <ToastContainer />
    <main className="flex-1 overflow-y-auto px-4 max-w-3xl mx-auto w-full pt-[env(safe-area-inset-top)] pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* Header / Toggles */}
      <div className="mb-6 pt-4">
        <div className="bg-blue-900/40 rounded-2xl border border-white/10 px-4 py-3 text-white">
          <div className="flex items-center gap-4">
            {/* Colonna sinistra: QUIZ + MODE */}
            <div className="flex flex-col items-start shrink-0 w-40">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <ClipboardList size={20} />
                <span>{S.quiz}</span>
              </div>

              {/* Toggle Allenamento / Esame */}
              <div className="mt-2 inline-flex rounded-full overflow-hidden border border-white/20">
                <button
                  onClick={() => switchMode(true)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${
                    trainingMode
                      ? "bg-emerald-200 text-emerald-900"
                      : "bg-transparent text-white/80 hover:bg-white/10"
                  }`}
                  title={S.trainingMode}
                  aria-label={S.trainingMode}
                >
                  <Dumbbell size={14} />
                  <span>{S.training}</span>
                </button>
                <button
                  onClick={() => switchMode(false)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${
                    !trainingMode
                      ? "bg-indigo-200 text-indigo-900"
                      : "bg-transparent text-white/80 hover:bg-white/10"
                  }`}
                  title={S.examMode}
                  aria-label={S.examMode}
                >
                  <GraduationCap size={14} />
                  <span>{S.exam}</span>
                </button>
              </div>
            </div>

            {/* Colonna centrale: CERT + TOPIC */}
            <div className="flex-1 leading-tight text-center px-2">
              <div className="text-sm">
                <span className="font-bold uppercase">{S.certification}:</span>{" "}
                {certificationName || "-"}
              </div>
              {!isMixed && (
                <div className="text-sm">
                  <span className="font-bold uppercase">{S.topic}:</span>{" "}
                  {headerTitle || "-"}
                </div>
              )}
            </div>

            {/* Colonna destra: switch rapido */}
            <div className="shrink-0">
              <button
                onClick={() => {
                  setTrainingMode((m) => !m);
                  setExamFinished(false);
                  setScore(null);
                  setSelected({});
                }}
                className={`text-xs md:text-sm px-3 py-1 rounded-full font-semibold shadow transition duration-300 ${
                  trainingMode ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {trainingMode ? `✅ ${S.training}` : `🎓 ${S.exam}`}
              </button>
            </div>
          </div>
        </div>
      </div>


        {/* Timer (solo Esame) */}
        {!trainingMode && !examFinished && examDurationMinutes && (
          <TimerCountdown minutes={examDurationMinutes} onTimeUp={handleSubmit} />
        )}

{/* Domande */}
{displayedQuestions.map((q, idx) => {
  const ans = selectedAnswers[q.id];

  const correctIndex = getCorrectIndex(q.answers ?? []);
  const correctText  = q.answers?.[correctIndex]?.text ?? "";
  const isCorrect    = ans?.selected === correctIndex;

  return (
    <div key={q.id} className="mb-10 p-4 rounded-xl shadow bg-white text-black">
      <p className="font-semibold mb-2">
        <span className="text-red-500">❓</span> {idx + 1}. {q.question}
      </p>

      <ul>
        {(q.answers ?? []).map((a, i) => {
          const sel  = ans?.selected === i;
          const corr = i === correctIndex;
          return (
            <li key={i}>
              <button
                className={`block w-full text-left p-2 rounded mb-1 border transition font-medium ${
                  sel
                    ? trainingMode
                      ? corr
                        ? "bg-green-100 border-green-500"
                        : "bg-red-100 border-red-500"
                      : "bg-blue-100 border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                disabled={!!ans}
                onClick={() => handleAnswer(q.id, i)}
              >
                {a.text}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Feedback corretto/errato + Spiegazione (Allenamento) */}
      {trainingMode && ans && (
        <div className="mt-2 text-sm italic">
          {isCorrect ? (
            <span className="text-gray-700">{S.correct}</span>
          ) : (
            <span className="text-gray-700">
              {S.wrongPrefix} “{correctText || "—"}”
            </span>
          )}
        </div>
      )}



      {trainingMode && ans && (
        <div className="mt-2 text-sm italic">
          {canSeeExplanations ? (
            getExplanationText(q, uiLang) ? (
              <p className="text-green-700">
                {t("explanationLabel", uiLang)} {getExplanationText(q, uiLang)}
              </p>
            ) : (
              <p className="text-gray-500">{t("noExplanation", uiLang)}</p>
            )
          ) : (
            <p className="text-gray-500">{t("premiumExplanation", uiLang)}</p>
          )}
        </div>
      )}

             {/* Feedback domanda */}
{trainingMode && (
  !feedbackSent[q.id] ? (
    <div className="mt-4 text-sm text-gray-600">
      <p>{S.helpful}</p>
      <div className="mt-1 flex gap-2">
        <button onClick={() => sendFeedback(q.id, "positive")} className="text-green-600">
          👍 {S.yes}
        </button>
        <button onClick={() => sendFeedback(q.id, "negative")} className="text-red-600">
          👎 {S.no}
        </button>
      </div>
    </div>
  ) : (
    <p className="mt-2 text-sm text-gray-500">{S.thanks}</p>
  )
)}


              <button
  onClick={() => toggleFlagQuestion(q.id)}
  className={`mt-4 text-sm ${flaggedQuestions.has(q.id) ? "text-yellow-500" : "text-gray-500"}`}
>
  {flaggedQuestions.has(q.id) ? S.removedFromReview : S.reviewLater}
</button>

            </div>
          );
        })}

        {/* Nuovo quiz (solo Esame + mixed) */}
        {!trainingMode && topicId === "mixed" && (
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-6 hover:bg-yellow-600 transition"
            >
              🔄 Nuovo quiz
            </button>
          </div>
        )}

        {/* Invia quiz (solo Esame) */}
        {!examFinished && !trainingMode && (
          <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 transform">
            <button
              onClick={handleSubmit}
              className="rounded-full bg-blue-700 px-6 py-3 text-white shadow-lg transition hover:bg-blue-800"
            >
              ✅ Invia quiz
            </button>
          </div>
        )}

        {/* Risultato e spiegazioni post-esame */}
        {examFinished && !trainingMode && (
          <>
            <div className="fixed top-20 left-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 transform max-h-[80vh] overflow-y-auto rounded-xl bg-white px-6 pb-24 pt-4 text-center text-black shadow-lg">
              <h2 className="text-xl font-bold">🎉 Risultato dell'Esame</h2>
              <p className="mt-2 text-lg">
                Hai totalizzato <strong>{score}</strong> su <strong>{displayedQuestions.length}</strong> domande.
              </p>

              <p className="mt-2 font-semibold text-green-600">
                {score >= Math.ceil(displayedQuestions.length * 0.8) ? "✅ Esame superato!" : "❌ Esame non superato"}
              </p>

              {badgeEarned && (
                <div className="mt-6 animate-bounce rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-800 shadow-md">
                  🏅 Congratulazioni! Hai ottenuto un badge per questa certificazione!
                </div>
              )}

              {wrongQuestions.length > 0 && (
                <div className="mt-4 text-left text-sm text-red-700">
                  <p className="font-semibold">
                    Domande sbagliate: {wrongQuestions.length} su {displayedQuestions.length}
                  </p>
                  <ul className="ml-6 mt-2 list-disc space-y-1">
                    {wrongQuestions.map((q, idx) => (
                      <li key={idx}>{q.question}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/profile#storico")}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Vai al Profilo
                </button>
                <button
                  onClick={() => navigate("/quiz-home")}
                  className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                >
                  Quiz Home
                </button>
              </div>
            </div>

            <div className="mx-auto mt-[380px] mb-16 max-w-3xl space-y-4 px-4">
              <h3 className="text-xl font-semibold text-white">🔍 Spiegazioni delle Domande</h3>
              {displayedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl shadow transition-all ${
                    wrongQuestions.some((wq) => wq.id === q.id) ? "bg-red-50 border border-red-400" : "bg-white"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      wrongQuestions.some((wq) => wq.id === q.id) ? "text-red-700" : "text-black"
                    }`}
                  >
                    {idx + 1}. {q.question}
                  </p>

                  {canSeeExplanations ? (
                    (() => {
                      const expl = getExplanationText(q, uiLang);
                      return expl ? (
                        <p className="mt-2 text-sm italic text-green-700">💡 Spiegazione: {expl}</p>
                      ) : null;
                    })()
                  ) : (
                    <p className="mt-2 text-sm italic text-gray-500">🔒 Spiegazione disponibile solo per utenti Premium</p>
                  )}
                </div>
              ))}
              <div className="h-[160px] md:h-[80px]" />
            </div>
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-gray-200 bg-white shadow-md md:h-16">
        <div className="flex h-full items-center justify-around">
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link to="/quiz-home" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <BookOpen className="h-5 w-5" />
            Quiz
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <User className="h-5 w-5" />
            Profilo
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default QuizPage;

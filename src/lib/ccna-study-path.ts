export type StudyLang = "it" | "en" | "fr" | "es";
export const studyCopy = {
  it: {
    title: "Study Path CCNA",
    intro:
      "Diagnostico gratuito: 30 domande per scegliere da dove iniziare. Non è una simulazione d’esame né una previsione del superamento.",
    restart: "Avvia un nuovo diagnostico",
    start: "Inizia il diagnostico gratuito",
    login: "Accedi per salvare il percorso",
    next: "Salva e continua",
    back: "Indietro",
    finish: "Concludi e scopri le priorità",
    loading: "Caricamento…",
    error:
      "Operazione non riuscita. Riprova: i progressi già salvati sono conservati.",
    unavailable: "Il diagnostico non è ancora disponibile. Riprova più tardi.",
    retry: "Riprova",
    result: "La tua anteprima personalizzata",
    priorities: "Argomenti da affrontare per primi",
    weak: "Da rafforzare",
    insufficient: "Da approfondire: evidenza insufficiente",
    consolidate: "Da consolidare",
    evidence: "risposte corrette",
    future:
      "Il futuro piano Premium aggiungerà studio giornaliero, esercizi mirati e risorse aggiuntive. Le domande del diagnostico sono gratuite.",
    readiness:
      "Readiness resta disponibile e misura la preparazione nel tempo.",
    first: "Inizia da qui",
    profile: "Vai al profilo",
    saved: "Progressi salvati sul tuo account.",
  },
  en: {
    title: "CCNA Study Path",
    intro:
      "Free diagnostic: 30 questions to choose where to start. This is not a mock exam or a prediction of passing.",
    restart: "Start a new diagnostic",
    start: "Start the free diagnostic",
    login: "Sign in to save your path",
    next: "Save and continue",
    back: "Back",
    finish: "Finish and discover priorities",
    loading: "Loading…",
    error:
      "The operation failed. Try again: previously saved progress is preserved.",
    unavailable: "The diagnostic is not available yet. Please try again later.",
    retry: "Try again",
    result: "Your personalized preview",
    priorities: "Topics to study first",
    weak: "Needs work",
    insufficient: "Explore further: insufficient evidence",
    consolidate: "Consolidate",
    evidence: "correct answers",
    future:
      "The future Premium plan will add daily study, targeted practice and extra resources. Diagnostic questions are free.",
    readiness:
      "Readiness remains available and measures preparation over time.",
    first: "Start here",
    profile: "Go to profile",
    saved: "Progress saved to your account.",
  },
  fr: {
    title: "Parcours CCNA",
    intro:
      "Diagnostic gratuit : 30 questions pour choisir par où commencer. Ce n’est ni un examen blanc ni une prédiction de réussite.",
    restart: "Commencer un nouveau diagnostic",
    start: "Commencer le diagnostic gratuit",
    login: "Se connecter pour enregistrer le parcours",
    next: "Enregistrer et continuer",
    back: "Retour",
    finish: "Terminer et découvrir les priorités",
    loading: "Chargement…",
    error:
      "L’opération a échoué. Réessayez : les progrès déjà enregistrés sont conservés.",
    unavailable:
      "Le diagnostic n’est pas encore disponible. Réessayez plus tard.",
    retry: "Réessayer",
    result: "Votre aperçu personnalisé",
    priorities: "Sujets à étudier en premier",
    weak: "À renforcer",
    insufficient: "À approfondir : données insuffisantes",
    consolidate: "À consolider",
    evidence: "réponses correctes",
    future:
      "Le futur plan Premium ajoutera un programme quotidien, des exercices ciblés et des ressources supplémentaires. Les questions du diagnostic sont gratuites.",
    readiness:
      "Readiness reste disponible pour mesurer la préparation dans le temps.",
    first: "Commencez ici",
    profile: "Voir le profil",
    saved: "Progrès enregistrés sur votre compte.",
  },
  es: {
    restart: "Iniciar un nuevo diagn�stico",
    title: "Ruta de estudio CCNA",
    intro:
      "Diagnóstico gratuito: 30 preguntas para elegir por dónde empezar. No es un simulacro ni una predicción de aprobado.",
    start: "Iniciar el diagnóstico gratuito",
    login: "Inicia sesión para guardar la ruta",
    next: "Guardar y continuar",
    back: "Atrás",
    finish: "Terminar y descubrir prioridades",
    loading: "Cargando…",
    error:
      "La operación ha fallado. Inténtalo de nuevo: los progresos ya guardados se conservan.",
    unavailable: "El diagnóstico aún no está disponible. Inténtalo más tarde.",
    retry: "Reintentar",
    result: "Tu vista previa personalizada",
    priorities: "Temas que estudiar primero",
    weak: "Por reforzar",
    insufficient: "Profundizar: evidencia insuficiente",
    consolidate: "Por consolidar",
    evidence: "respuestas correctas",
    future:
      "El futuro plan Premium añadirá estudio diario, ejercicios dirigidos y recursos adicionales. Las preguntas del diagnóstico son gratuitas.",
    readiness:
      "Readiness sigue disponible y mide la preparación a lo largo del tiempo.",
    first: "Empieza aquí",
    profile: "Ir al perfil",
    saved: "Progreso guardado en tu cuenta.",
  },
} as const;
export type StudyQuestion = {
  id: number;
  topic_id: number;
  topic_title: string;
  question: string;
  answers: { id: number; text: string }[];
  exhibit?: { title?: string; content?: string } | null;
};
export type StudyAnswer = { question_id: number; answer_id: number };
export type StudyAttempt = {
  id: string;
  version: number;
  questions: StudyQuestion[];
  answers: StudyAnswer[];
  result: null | {
    total: number;
    correct: number;
    percentage: number;
    topics: {
      topicId: number;
      title: string;
      total: number;
      correct: number;
      errors: number;
      evidence: "weak" | "insufficient" | "consolidate";
    }[];
  };
};

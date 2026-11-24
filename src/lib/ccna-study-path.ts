export type StudyLang = "it" | "en" | "fr" | "es";
// Placeholders: {n} = current/answered number, {total} = number of questions.
export const studyCopy = {
  it: {
    eyebrow: "Study Path CCNA",
    title: "Scopri quanto sei preparato per il CCNA",
    intro:
      "Rispondi a 30 domande e scopri i tuoi punti di forza, gli argomenti da migliorare e da dove iniziare a studiare.",
    note: "Non è una simulazione d’esame né una previsione del superamento. Le domande sono gratuite.",
    steps: [
      "30 domande sugli argomenti del CCNA 200-301",
      "Salvi i progressi sul tuo account e riprendi quando vuoi",
      "Ricevi un’analisi personalizzata con l’argomento da cui partire",
    ],
    start: "Inizia il test",
    login: "Accedi per iniziare",
    loginHint:
      "Serve un account per salvare i progressi e riprenderli da qualsiasi dispositivo.",
    loading: "Caricamento…",
    question: "Domanda {n} di {total}",
    progress: "Avanzamento del test",
    back: "Indietro",
    next: "Salva e continua",
    finish: "Concludi e scopri l’analisi",
    answered: "Hai risposto a {n} domande su {total}",
    finishHint: "Rispondi a tutte le {total} domande per vedere l’analisi.",
    saved: "Progressi salvati sul tuo account",
    unsaved: "La risposta viene salvata quando premi «Salva e continua»",
    resumed: "Bentornato! Riprendi dalla domanda {n}: i tuoi progressi sono stati salvati.",
    error:
      "Operazione non riuscita. Riprova: i progressi già salvati sono conservati.",
    unavailable: "Il test non è ancora disponibile. Riprova più tardi.",
    conflict:
      "Il test è cambiato o è stato aggiornato da un altro dispositivo. Riprova per ricaricare i progressi salvati.",
    retry: "Riprova",
    restart: "Rifai il test",
    restartConfirm:
      "Vuoi rifare il test? Le risposte e l’analisi attuali saranno sostituite.",
    restartYes: "Sì, rifai il test",
    cancel: "Annulla",
    result: "La tua analisi personalizzata",
    resultIntro: "Ecco come è andato il test e da dove ti conviene partire.",
    scoreCaption: "risposte corrette",
    startHere: "Da dove iniziare",
    train: "Allenati su questo argomento",
    afterTrain:
      "Dopo l’allenamento puoi rifare il test: avrai nuove domande, quando disponibili, e un’analisi aggiornata.",
    startHereText: {
      weak: "È l’argomento con più margine di miglioramento: parti da qui.",
      insufficient:
        "Hai risposto a poche domande su questo argomento: approfondiscilo per capire a che punto sei.",
      consolidate:
        "Non emergono lacune evidenti: ripassa questo argomento per consolidarlo.",
    },
    gaps: "Argomenti da migliorare",
    unclear: "Da approfondire",
    unclearHint: "Poche domande per valutarli: studiali per capire il tuo livello.",
    consolidate: "Da consolidare",
    strengths: "I tuoi punti di forza",
    correctOf: "{n} corrette su {total}",
    correctOfOne: "{n} corretta su {total}",
    badge: { weak: "Da migliorare", insufficient: "Da approfondire", consolidate: "Da consolidare", strong: "Punto di forza" },
    readiness: "Readiness resta disponibile e misura la preparazione nel tempo.",
    profile: "Vai al profilo",
    initialLabel: "Test iniziale da 30 domande",
    recentLabel: "Ultime prime risposte registrate",
    recentNone: "Non ancora disponibile: servono almeno 3 risposte",
    recentValue: "{p}% su {n} risposte",
    coverageLabel: "Copertura: domande affrontate",
    coverageValue: "{a} di {b}",
    progressNote: "Questi dati si basano sulla prima risposta registrata a ciascuna domanda, data nel test o negli allenamenti. Rispondere di nuovo a una domanda già vista non li modifica: cambiano quando affronti domande nuove. Il test iniziale resta come riferimento.",
    continueNext: "Continua dal prossimo argomento consigliato",
  },
  en: {
    eyebrow: "CCNA Study Path",
    title: "Find out how ready you are for the CCNA",
    intro:
      "Answer 30 questions to discover your strengths, the topics to improve and where to start studying.",
    note: "This is not a mock exam or a prediction of whether you will pass. The questions are free.",
    steps: [
      "30 questions across the CCNA 200-301 topics",
      "Your progress is saved to your account, so you can pick up where you left off",
      "A personalized analysis that shows which topic to start with",
    ],
    start: "Start the test",
    login: "Sign in to start",
    loginHint:
      "An account is needed to save your progress and resume on any device.",
    loading: "Loading…",
    question: "Question {n} of {total}",
    progress: "Test progress",
    back: "Back",
    next: "Save and continue",
    finish: "Finish and see your analysis",
    answered: "You have answered {n} of {total} questions",
    finishHint: "Answer all {total} questions to see your analysis.",
    saved: "Progress saved to your account",
    unsaved: "Your answer is saved when you press “Save and continue”",
    resumed: "Welcome back! You are resuming at question {n}: your progress was saved.",
    error:
      "The operation failed. Try again: previously saved progress is preserved.",
    unavailable: "The test is not available yet. Please try again later.",
    conflict:
      "The test changed or was updated from another device. Try again to reload your saved progress.",
    retry: "Try again",
    restart: "Retake the test",
    restartConfirm:
      "Retake the test? Your current answers and analysis will be replaced.",
    restartYes: "Yes, retake the test",
    cancel: "Cancel",
    result: "Your personalized analysis",
    resultIntro: "Here is how the test went and where it makes sense to start.",
    scoreCaption: "correct answers",
    startHere: "Where to start",
    train: "Practice this topic",
    afterTrain:
      "After practicing you can retake the test: you will get new questions, when available, and an updated analysis.",
    startHereText: {
      weak: "This is the topic with the most room for improvement: start here.",
      insufficient:
        "You answered few questions on this topic: study it to find out where you stand.",
      consolidate:
        "No clear gaps showed up: review this topic to consolidate it.",
    },
    gaps: "Topics to improve",
    unclear: "Worth exploring",
    unclearHint: "Too few questions to judge them: study them to gauge your level.",
    consolidate: "To consolidate",
    strengths: "Your strengths",
    correctOf: "{n} correct out of {total}",
    correctOfOne: "{n} correct out of {total}",
    badge: { weak: "To improve", insufficient: "Worth exploring", consolidate: "To consolidate", strong: "Strength" },
    readiness: "Readiness remains available and measures preparation over time.",
    profile: "Go to profile",
    initialLabel: "Initial 30-question test",
    recentLabel: "Latest first answers recorded",
    recentNone: "Not available yet: at least 3 answers needed",
    recentValue: "{p}% on {n} answers",
    coverageLabel: "Coverage: questions covered",
    coverageValue: "{a} of {b}",
    progressNote: "These figures rely on the first answer recorded for each question, given in the test or in training. Answering an already seen question again does not change them: they change when you face new questions. Your initial test stays as a reference.",
    continueNext: "Continue with the next recommended topic",
  },
  fr: {
    eyebrow: "Parcours CCNA",
    title: "Découvrez où vous en êtes pour le CCNA",
    intro:
      "Répondez à 30 questions pour repérer vos points forts, les sujets à améliorer et par où commencer vos révisions.",
    note: "Ce n’est ni un examen blanc ni une prédiction de réussite. Les questions sont gratuites.",
    steps: [
      "30 questions sur les thèmes du CCNA 200-301",
      "Vos progrès sont enregistrés sur votre compte : reprenez quand vous voulez",
      "Une analyse personnalisée qui indique par quel sujet commencer",
    ],
    start: "Commencer le test",
    login: "Connectez-vous pour commencer",
    loginHint:
      "Un compte est nécessaire pour enregistrer vos progrès et les retrouver sur n’importe quel appareil.",
    loading: "Chargement…",
    question: "Question {n} sur {total}",
    progress: "Progression du test",
    back: "Retour",
    next: "Enregistrer et continuer",
    finish: "Terminer et voir l’analyse",
    answered: "Vous avez répondu à {n} questions sur {total}",
    finishHint: "Répondez aux {total} questions pour voir l’analyse.",
    saved: "Progrès enregistrés sur votre compte",
    unsaved: "Votre réponse est enregistrée quand vous cliquez sur « Enregistrer et continuer »",
    resumed: "Bon retour ! Vous reprenez à la question {n} : vos progrès ont été enregistrés.",
    error:
      "L’opération a échoué. Réessayez : les progrès déjà enregistrés sont conservés.",
    unavailable: "Le test n’est pas encore disponible. Réessayez plus tard.",
    conflict:
      "Le test a changé ou a été mis à jour depuis un autre appareil. Réessayez pour recharger vos progrès enregistrés.",
    retry: "Réessayer",
    restart: "Refaire le test",
    restartConfirm:
      "Refaire le test ? Vos réponses et votre analyse actuelles seront remplacées.",
    restartYes: "Oui, refaire le test",
    cancel: "Annuler",
    result: "Votre analyse personnalisée",
    resultIntro: "Voici comment s’est passé le test et par où il vaut mieux commencer.",
    scoreCaption: "réponses correctes",
    startHere: "Par où commencer",
    train: "S’entraîner sur ce sujet",
    afterTrain:
      "Après l’entraînement, vous pouvez refaire le test : de nouvelles questions, si disponibles, et une analyse mise à jour.",
    startHereText: {
      weak: "C’est le sujet avec la plus grande marge de progression : commencez par là.",
      insufficient:
        "Vous avez répondu à peu de questions sur ce sujet : approfondissez-le pour savoir où vous en êtes.",
      consolidate:
        "Aucune lacune nette n’apparaît : révisez ce sujet pour le consolider.",
    },
    gaps: "Sujets à améliorer",
    unclear: "À approfondir",
    unclearHint: "Trop peu de questions pour les évaluer : étudiez-les pour mesurer votre niveau.",
    consolidate: "À consolider",
    strengths: "Vos points forts",
    correctOf: "{n} bonnes réponses sur {total}",
    correctOfOne: "{n} bonne réponse sur {total}",
    badge: { weak: "À améliorer", insufficient: "À approfondir", consolidate: "À consolider", strong: "Point fort" },
    readiness: "Readiness reste disponible pour mesurer la préparation dans le temps.",
    profile: "Voir le profil",
    initialLabel: "Test initial de 30 questions",
    recentLabel: "Dernières premières réponses enregistrées",
    recentNone: "Pas encore disponible : au moins 3 réponses nécessaires",
    recentValue: "{p} % sur {n} réponses",
    coverageLabel: "Couverture : questions abordées",
    coverageValue: "{a} sur {b}",
    progressNote: "Ces données reposent sur la première réponse enregistrée pour chaque question, donnée dans le test ou à l’entraînement. Répondre à nouveau à une question déjà vue ne les modifie pas : elles changent avec de nouvelles questions. Le test initial reste comme référence.",
    continueNext: "Continuer avec le prochain sujet conseillé",
  },
  es: {
    eyebrow: "Ruta de estudio CCNA",
    title: "Descubre cómo vas de preparación para el CCNA",
    intro:
      "Responde 30 preguntas y descubre tus puntos fuertes, los temas por mejorar y por dónde empezar a estudiar.",
    note: "No es un simulacro de examen ni una predicción de aprobado. Las preguntas son gratuitas.",
    steps: [
      "30 preguntas sobre los temas del CCNA 200-301",
      "Tu progreso se guarda en tu cuenta para que continúes cuando quieras",
      "Un análisis personalizado que te indica con qué tema empezar",
    ],
    start: "Empezar el test",
    login: "Inicia sesión para empezar",
    loginHint:
      "Necesitas una cuenta para guardar tu progreso y retomarlo desde cualquier dispositivo.",
    loading: "Cargando…",
    question: "Pregunta {n} de {total}",
    progress: "Avance del test",
    back: "Atrás",
    next: "Guardar y continuar",
    finish: "Terminar y ver el análisis",
    answered: "Has respondido {n} de {total} preguntas",
    finishHint: "Responde las {total} preguntas para ver el análisis.",
    saved: "Progreso guardado en tu cuenta",
    unsaved: "Tu respuesta se guarda al pulsar «Guardar y continuar»",
    resumed: "¡Qué bueno verte de nuevo! Retomas en la pregunta {n}: tu progreso estaba guardado.",
    error:
      "La operación ha fallado. Inténtalo de nuevo: los progresos ya guardados se conservan.",
    unavailable: "El test aún no está disponible. Inténtalo más tarde.",
    conflict:
      "El test ha cambiado o se actualizó desde otro dispositivo. Inténtalo de nuevo para recargar tu progreso guardado.",
    retry: "Reintentar",
    restart: "Repetir el test",
    restartConfirm:
      "¿Repetir el test? Tus respuestas y el análisis actuales serán reemplazados.",
    restartYes: "Sí, repetir el test",
    cancel: "Cancelar",
    result: "Tu análisis personalizado",
    resultIntro: "Así te ha ido en el test y por dónde te conviene empezar.",
    scoreCaption: "respuestas correctas",
    startHere: "Por dónde empezar",
    train: "Entrénate en este tema",
    afterTrain:
      "Después de entrenar puedes repetir el test: tendrás preguntas nuevas, cuando haya, y un análisis actualizado.",
    startHereText: {
      weak: "Es el tema con más margen de mejora: empieza por aquí.",
      insufficient:
        "Has respondido pocas preguntas de este tema: profundiza en él para saber en qué punto estás.",
      consolidate:
        "No aparecen lagunas claras: repasa este tema para consolidarlo.",
    },
    gaps: "Temas por mejorar",
    unclear: "Por profundizar",
    unclearHint: "Hay pocas preguntas para valorarlos: estúdialos para medir tu nivel.",
    consolidate: "Por consolidar",
    strengths: "Tus puntos fuertes",
    correctOf: "{n} correctas de {total}",
    correctOfOne: "{n} correcta de {total}",
    badge: { weak: "Por mejorar", insufficient: "Por profundizar", consolidate: "Por consolidar", strong: "Punto fuerte" },
    readiness: "Readiness sigue disponible y mide la preparación a lo largo del tiempo.",
    profile: "Ir al perfil",
    initialLabel: "Test inicial de 30 preguntas",
    recentLabel: "Últimas primeras respuestas registradas",
    recentNone: "Aún no disponible: se necesitan al menos 3 respuestas",
    recentValue: "{p}% en {n} respuestas",
    coverageLabel: "Cobertura: preguntas abordadas",
    coverageValue: "{a} de {b}",
    progressNote: "Estos datos se basan en la primera respuesta registrada a cada pregunta, dada en el test o en el entrenamiento. Volver a responder una pregunta ya vista no los modifica: cambian al afrontar preguntas nuevas. El test inicial se conserva como referencia.",
    continueNext: "Continuar con el siguiente tema recomendado",
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

export type StudyProgressTopic = {
  topicId: number;
  title: string;
  status: "weak" | "insufficient" | "consolidate";
  strong: boolean;
  initial: { correct: number; total: number; evidence: string } | null;
  lastFirstAnswers: { answered: number; correct: number; accuracy: number | null };
  coverage: { answered: number; available: number; remaining: number; ratio: number | null };
  lastActivityAt: string | null;
};
export type StudyProgress = {
  diagnostic: { attemptId: string; percentage: number; correct: number; total: number } | null;
  history: { at: string | null; percentage: number; correct: number; total: number }[];
  topics: StudyProgressTopic[];
  next: { topicId: number } | null;
};

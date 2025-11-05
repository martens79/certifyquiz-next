// src/components/QuizLanguageGuard.jsx
import React from "react";
import { getCurrentLang } from "../utils/langUtils";

const QuizLanguageGuard = ({ children }) => {
  const lang = getCurrentLang();

  if (lang !== "it") {
    return (
      <div className="bg-yellow-100 text-yellow-900 px-6 py-4 rounded-lg text-center mt-6 shadow">
        {lang === "en" && "🚧 Quiz content is not yet available in English. It will be online soon!"}
        {lang === "fr" && "🚧 Le contenu des quiz n'est pas encore disponible en français. Il sera bientôt en ligne !"}
        {lang === "es" && "🚧 El contenido de los cuestionarios aún no está disponible en español. ¡Estará en línea pronto!"}
      </div>
    );
  }

  return <>{children}</>;
};

export default QuizLanguageGuard;

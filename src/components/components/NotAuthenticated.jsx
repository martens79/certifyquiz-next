import { getLabel } from "../utils/langUtils";

export default function NotAuthenticated() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white text-center px-4">
      <h1 className="text-3xl font-bold mb-4">
        😕 {getLabel({
          it: "Accesso negato",
          en: "Access denied",
          fr: "Accès refusé",
          es: "Acceso denegado"
        })}
      </h1>

      <p className="text-lg mb-6">
        {getLabel({
          it: "Per visualizzare questa pagina, devi essere autenticato.",
          en: "To view this page, you must be logged in.",
          fr: "Pour voir cette page, vous devez être connecté.",
          es: "Para ver esta página, debes iniciar sesión."
        })}
      </p>

      <a
        href="/login"
        className="bg-white text-blue-700 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition"
      >
        🔐 {getLabel({
          it: "Vai al login",
          en: "Go to login",
          fr: "Se connecter",
          es: "Iniciar sesión"
        })}
      </a>
    </div>
  );
}

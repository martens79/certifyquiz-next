"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Lang = "it" | "en" | "fr" | "es";

const TRANSLATIONS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    greeting: string;
    suggestionsTitle: string;
    quickActionsTitle: string;
    suggestions: string[];
    error: string;
    poweredBy: string;
    openLabel: string;
    closeLabel: string;
  }
> = {
  it: {
    title: "CertifyQuiz AI Tutor",
    subtitle: "Sempre disponibile",
    placeholder: "Scrivi un messaggio…",
    greeting:
      "Ciao! 👋 Sono il tutor AI di CertifyQuiz. Posso aiutarti a scegliere una certificazione, capire da dove iniziare, usare i quiz, i ripassi rapidi, le simulazioni e le funzioni Premium. Come posso aiutarti?",
    suggestionsTitle: "Domande frequenti:",
    quickActionsTitle: "Azioni rapide:",
    suggestions: [
      "Quale certificazione iniziare per la cybersecurity?",
      "Quanto tempo ci vuole per prepararsi al CCNA?",
      "Differenza tra CISSP e CEH?",
      "CertifyQuiz è gratis?",
    ],
    error: "Mi dispiace, si è verificato un errore. Riprova tra qualche istante.",
    poweredBy: "Powered by Gemini Flash",
    openLabel: "Apri assistente CertifyQuiz",
    closeLabel: "Chiudi assistente CertifyQuiz",
  },
  en: {
    title: "CertifyQuiz AI Tutor",
    subtitle: "Always available",
    placeholder: "Type a message…",
    greeting:
      "Hi! 👋 I'm the CertifyQuiz AI tutor. I can help you choose a certification, understand where to start, use quizzes, quick reviews, mock exams and Premium features. How can I help you?",
    suggestionsTitle: "Frequent questions:",
    quickActionsTitle: "Quick actions:",
    suggestions: [
      "Which certification should I start with for cybersecurity?",
      "How long does it take to prepare for CCNA?",
      "Difference between CISSP and CEH?",
      "Is CertifyQuiz free?",
    ],
    error: "Sorry, an error occurred. Please try again in a moment.",
    poweredBy: "Powered by Gemini Flash",
    openLabel: "Open CertifyQuiz assistant",
    closeLabel: "Close CertifyQuiz assistant",
  },
  fr: {
    title: "CertifyQuiz AI Tutor",
    subtitle: "Toujours disponible",
    placeholder: "Écrivez un message…",
    greeting:
      "Bonjour ! 👋 Je suis le tuteur IA de CertifyQuiz. Je peux vous aider à choisir une certification, comprendre par où commencer, utiliser les quiz, les révisions rapides, les examens blancs et les fonctions Premium. Comment puis-je vous aider ?",
    suggestionsTitle: "Questions fréquentes :",
    quickActionsTitle: "Actions rapides :",
    suggestions: [
      "Quelle certification pour commencer en cybersécurité ?",
      "Combien de temps pour se préparer au CCNA ?",
      "Différence entre CISSP et CEH ?",
      "CertifyQuiz est-il gratuit ?",
    ],
    error: "Désolé, une erreur s'est produite. Veuillez réessayer dans un moment.",
    poweredBy: "Propulsé par Gemini Flash",
    openLabel: "Ouvrir l'assistant CertifyQuiz",
    closeLabel: "Fermer l'assistant CertifyQuiz",
  },
  es: {
    title: "CertifyQuiz AI Tutor",
    subtitle: "Siempre disponible",
    placeholder: "Escribe un mensaje…",
    greeting:
      "¡Hola! 👋 Soy el tutor IA de CertifyQuiz. Puedo ayudarte a elegir una certificación, entender por dónde empezar, usar los quizzes, repasos rápidos, simulaciones de examen y funciones Premium. ¿Cómo puedo ayudarte?",
    suggestionsTitle: "Preguntas frecuentes:",
    quickActionsTitle: "Acciones rápidas:",
    suggestions: [
      "¿Qué certificación empezar para ciberseguridad?",
      "¿Cuánto tiempo lleva prepararse para CCNA?",
      "¿Diferencia entre CISSP y CEH?",
      "¿CertifyQuiz es gratis?",
    ],
    error: "Lo siento, ocurrió un error. Por favor inténtalo de nuevo en un momento.",
    poweredBy: "Desarrollado por Gemini Flash",
    openLabel: "Abrir asistente CertifyQuiz",
    closeLabel: "Cerrar asistente CertifyQuiz",
  },
};

const QUICK_ACTIONS: Record<Lang, { label: string; prompt: string }[]> = {
  it: [
    { label: "🎯 Scegli certificazione", prompt: "Aiutami a scegliere una certificazione IT adatta al mio livello." },
    { label: "🛡 Cybersecurity", prompt: "Voglio iniziare un percorso in cybersecurity. Da dove parto?" },
    { label: "☁️ Cloud", prompt: "Quale certificazione cloud mi consigli per iniziare?" },
    { label: "🧠 Spiegami un concetto", prompt: "Spiegami un concetto IT come se fossi principiante." },
    { label: "📘 Ripassi rapidi", prompt: "Cosa sono i ripassi rapidi di CertifyQuiz?" },
    { label: "⭐ Premium", prompt: "Cosa include CertifyQuiz Premium?" },
  ],
  en: [
    { label: "🎯 Choose cert", prompt: "Help me choose the right IT certification for my level." },
    { label: "🛡 Cybersecurity", prompt: "I want to start a cybersecurity path. Where should I begin?" },
    { label: "☁️ Cloud", prompt: "Which cloud certification should I start with?" },
    { label: "🧠 Explain concept", prompt: "Explain an IT concept as if I were a beginner." },
    { label: "📘 Quick Reviews", prompt: "What are CertifyQuiz Quick Reviews?" },
    { label: "⭐ Premium", prompt: "What does CertifyQuiz Premium include?" },
  ],
  fr: [
    { label: "🎯 Choisir certif.", prompt: "Aide-moi à choisir une certification IT adaptée à mon niveau." },
    { label: "🛡 Cybersécurité", prompt: "Je veux commencer un parcours en cybersécurité. Par où commencer ?" },
    { label: "☁️ Cloud", prompt: "Quelle certification cloud me conseilles-tu pour commencer ?" },
    { label: "🧠 Expliquer concept", prompt: "Explique-moi un concept IT comme à un débutant." },
    { label: "📘 Révisions rapides", prompt: "Que sont les révisions rapides de CertifyQuiz ?" },
    { label: "⭐ Premium", prompt: "Que contient CertifyQuiz Premium ?" },
  ],
  es: [
    { label: "🎯 Elegir certif.", prompt: "Ayúdame a elegir una certificación IT adecuada para mi nivel." },
    { label: "🛡 Ciberseguridad", prompt: "Quiero empezar un camino en ciberseguridad. ¿Por dónde empiezo?" },
    { label: "☁️ Cloud", prompt: "¿Qué certificación cloud me recomiendas para empezar?" },
    { label: "🧠 Explicar concepto", prompt: "Explícame un concepto IT como si fuera principiante." },
    { label: "📘 Repasos rápidos", prompt: "¿Qué son los repasos rápidos de CertifyQuiz?" },
    { label: "⭐ Premium", prompt: "¿Qué incluye CertifyQuiz Premium?" },
  ],
};

function getLangFromCookie(): Lang {
  if (typeof document === "undefined") return "en";

  const match = document.cookie.match(/(?:^|;\s*)cq_lang=([^;]+)/);
  const val = match?.[1];

  if (val === "it" || val === "en" || val === "fr" || val === "es") return val;
  return "en";
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lang, setLang] = useState<Lang>("en");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => setLang(getLangFromCookie());
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
  }, [isOpen, messages.length, t.greeting]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
  }, [lang, t.greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const userMessage: Message = { role: "user", content: cleanText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          lang,
          pagePath: typeof window !== "undefined" ? window.location.pathname : "",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!res.ok) throw new Error("Chatbot response error");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: typeof data.reply === "string" ? data.reply : t.error,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cq-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }

        .cq-chat-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        .cq-chat-window {
          position: fixed;
          bottom: 92px;
          right: 24px;
          z-index: 9998;
        }

        @media (max-width: 767px) {
          .cq-chat-btn {
            bottom: 80px;
            right: 16px;
          }

          .cq-chat-window {
            bottom: 148px;
            right: 8px;
            left: 8px;
            width: auto !important;
          }
        }
      `}</style>

      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? t.closeLabel : t.openLabel}
        className="cq-chat-btn"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 22px rgba(99,102,241,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="cq-chat-window"
          style={{
            width: "380px",
            maxHeight: "calc(100vh - 180px)",
            background: "#0f1117",
            border: "1px solid rgba(99,102,241,0.32)",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.62)",
            overflow: "hidden",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
              }}
            >
              🎓
            </div>

            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>
                {t.title}
              </div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>
                {t.poweredBy} · {t.subtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(99,102,241,0.35) transparent",
              minHeight: "220px",
              maxHeight: "340px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "84%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(255,255,255,0.07)",
                    color: "white",
                    fontSize: "13.5px",
                    lineHeight: "1.5",
                    border:
                      msg.role === "assistant"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#8b5cf6",
                        animation: `cq-bounce 1.2s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && messages.length === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.46)", fontSize: "11px", marginBottom: "7px" }}>
                    {t.quickActionsTitle}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
                    {QUICK_ACTIONS[lang].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(action.prompt)}
                        style={{
                          background: "rgba(99,102,241,0.14)",
                          border: "1px solid rgba(99,102,241,0.34)",
                          borderRadius: "10px",
                          color: "#c7d2fe",
                          padding: "8px 10px",
                          fontSize: "11.5px",
                          cursor: "pointer",
                          textAlign: "left",
                          lineHeight: "1.25",
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "7px" }}>
                    {t.suggestionsTitle}
                  </div>

                  {t.suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: "#a5b4fc",
                        padding: "8px 12px",
                        fontSize: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: "6px",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
              background: "#0f1117",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              disabled={isLoading}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "white",
                fontSize: "13.5px",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.65)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background:
                  input.trim() && !isLoading
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.07)",
                border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
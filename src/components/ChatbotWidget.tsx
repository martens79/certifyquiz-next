"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Lang = "it" | "en" | "fr" | "es";

const TRANSLATIONS: Record<Lang, {
  title: string;
  subtitle: string;
  placeholder: string;
  greeting: string;
  suggestions: string[];
  error: string;
  poweredBy: string;
}> = {
  it: {
    title: "CertifyQuiz AI",
    subtitle: "Sempre disponibile",
    placeholder: "Scrivi un messaggio…",
    greeting: "Ciao! 👋 Sono l'assistente di CertifyQuiz. Posso aiutarti a scegliere la certificazione giusta, rispondere a domande sulla piattaforma o sulle cert IT. Come posso aiutarti?",
    suggestions: [
      "Quale certificazione iniziare per la cybersecurity?",
      "Quanto tempo ci vuole per prepararsi al CCNA?",
      "Differenza tra CISSP e CEH?",
      "CertifyQuiz è gratis?",
    ],
    error: "Mi dispiace, si è verificato un errore. Riprova tra qualche istante.",
    poweredBy: "Powered by Gemini",
  },
  en: {
    title: "CertifyQuiz AI",
    subtitle: "Always available",
    placeholder: "Type a message…",
    greeting: "Hi! 👋 I'm the CertifyQuiz assistant. I can help you choose the right certification, answer questions about the platform or IT certs. How can I help you?",
    suggestions: [
      "Which certification to start for cybersecurity?",
      "How long does it take to prepare for CCNA?",
      "Difference between CISSP and CEH?",
      "Is CertifyQuiz free?",
    ],
    error: "Sorry, an error occurred. Please try again in a moment.",
    poweredBy: "Powered by Gemini",
  },
  fr: {
    title: "CertifyQuiz IA",
    subtitle: "Toujours disponible",
    placeholder: "Écrivez un message…",
    greeting: "Bonjour ! 👋 Je suis l'assistant CertifyQuiz. Je peux vous aider à choisir la bonne certification, répondre à vos questions sur la plateforme ou les certifications IT. Comment puis-je vous aider ?",
    suggestions: [
      "Quelle certification pour commencer en cybersécurité ?",
      "Combien de temps pour se préparer au CCNA ?",
      "Différence entre CISSP et CEH ?",
      "CertifyQuiz est-il gratuit ?",
    ],
    error: "Désolé, une erreur s'est produite. Veuillez réessayer dans un moment.",
    poweredBy: "Propulsé par Gemini",
  },
  es: {
    title: "CertifyQuiz IA",
    subtitle: "Siempre disponible",
    placeholder: "Escribe un mensaje…",
    greeting: "¡Hola! 👋 Soy el asistente de CertifyQuiz. Puedo ayudarte a elegir la certificación correcta, responder preguntas sobre la plataforma o las certificaciones IT. ¿Cómo puedo ayudarte?",
    suggestions: [
      "¿Qué certificación empezar para ciberseguridad?",
      "¿Cuánto tiempo lleva prepararse para el CCNA?",
      "¿Diferencia entre CISSP y CEH?",
      "¿CertifyQuiz es gratis?",
    ],
    error: "Lo siento, ocurrió un error. Por favor inténtalo de nuevo en un momento.",
    poweredBy: "Desarrollado por Gemini",
  },
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

  // Read lang from cookie on mount and when cookie changes
  useEffect(() => {
    const update = () => setLang(getLangFromCookie());
    update();
    // Poll every second to catch language changes
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
  }, [isOpen]);

  // Reset greeting if lang changes while chat is empty
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, lang }),
      });

      if (!res.ok) throw new Error("Errore nella risposta");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Chiudi assistente" : "Apri assistente"}
        className="cq-chat-btn"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="cq-chat-window"
          style={{
            width: "360px",
            maxHeight: "calc(100vh - 180px)",
            background: "#0f1117",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            overflow: "hidden",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}>🤖</div>
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{t.title}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>
                {t.poweredBy} · {t.subtitle}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(99,102,241,0.3) transparent",
            minHeight: "200px",
            maxHeight: "320px",
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.07)",
                  color: "white",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#8b5cf6",
                      animation: `cq-bounce 1.2s infinite ${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && messages.length === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "2px" }}>
                  {lang === "it" ? "Domande frequenti:" : lang === "fr" ? "Questions fréquentes :" : lang === "es" ? "Preguntas frecuentes:" : "Frequent questions:"}
                </div>
                {t.suggestions.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "8px",
                    color: "#a5b4fc",
                    padding: "8px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.22)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.12)"; }}
                  >{q}</button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            gap: "8px",
            flexShrink: 0,
            background: "#0f1117",
          }}>
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
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.07)",
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
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
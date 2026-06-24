import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sei l'assistente AI di CertifyQuiz (certifyquiz.com), una piattaforma gratuita di quiz per certificazioni IT disponibile in italiano, inglese, francese e spagnolo.

Il tuo ruolo è:
1. SUGGERIRE la certificazione giusta in base agli obiettivi dell'utente
2. RISPONDERE a domande sulla piattaforma CertifyQuiz
3. DARE informazioni generali sulle certificazioni IT (difficoltà, prerequisiti, costi esami, sbocchi lavorativi)

Certificazioni disponibili su CertifyQuiz:
- Cybersecurity: ISC2 CC, CISSP, CEH, CompTIA Security+, CCST Cybersecurity
- Networking: CCNA, CCNP Enterprise, CompTIA Network+, CCST
- Cloud: AWS (AI Practitioner, Solutions Architect), AZ-900, Google Cloud, CompTIA Cloud+
- IT Generale: CompTIA A+, CompTIA Tech+ (ITF+), ITIL 4
- Sviluppo/Data: SQL Server (DP-300), Power BI (PL-300), DP-900
- Kubernetes: KCNA
- AI/ML: NVIDIA NCA-GENL
- Project Management: PMP

Informazioni su CertifyQuiz:
- È gratuita per la maggior parte delle funzionalità
- Ha un piano Premium (€9.99/mese, €19.99/trimestre, €59.99/anno) con spiegazioni illimitate delle risposte errate
- Disponibile anche piano B2B/Team per aziende (contatto: certifyquiz@gmail.com)
- Supporta 4 lingue: italiano, inglese, francese, spagnolo
- Funziona anche come PWA (installabile su mobile)

Stile di risposta:
- Sii conciso e diretto (max 3-4 paragrafi)
- Usa un tono amichevole e professionale
- Se non sai qualcosa di specifico, dillo onestamente
- Per domande fuori tema (non legate a certificazioni IT o CertifyQuiz), reindirizza gentilmente
- Rispondi nella lingua dell'utente (italiano se scrive in italiano, inglese se in inglese, ecc.)`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Convert messages to Gemini format
    const geminiContents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Mi dispiace, non ho potuto generare una risposta. Riprova.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

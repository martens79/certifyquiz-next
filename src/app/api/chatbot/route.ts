import { NextRequest, NextResponse } from "next/server";

type Lang = "it" | "en" | "fr" | "es";

const SITE_ORIGIN = "https://www.certifyquiz.com";

const LANGUAGE_LABELS: Record<Lang, string> = {
  it: "italiano",
  en: "English",
  fr: "français",
  es: "español",
};

const LOCALIZED_PATHS: Record<
  Lang,
  {
    certs: string;
    paths: string;
    freeTest: string;
    reviews: string;
    premium: string;
  }
> = {
  it: {
    certs: "/it/certificazioni",
    paths: "/it/percorsi",
    freeTest: "/it/free-test",
    reviews: "/it/ripassi",
    premium: "/it/premium",
  },
  en: {
    certs: "/certifications",
    paths: "/paths",
    freeTest: "/free-test",
    reviews: "/reviews",
    premium: "/premium",
  },
  fr: {
    certs: "/fr/certifications",
    paths: "/fr/parcours",
    freeTest: "/fr/free-test",
    reviews: "/fr/revisions",
    premium: "/fr/premium",
  },
  es: {
    certs: "/es/certificaciones",
    paths: "/es/rutas",
    freeTest: "/es/free-test",
    reviews: "/es/repasos",
    premium: "/es/premium",
  },
};

function normalizeLang(value: unknown): Lang {
  if (value === "it" || value === "en" || value === "fr" || value === "es") {
    return value;
  }

  return "en";
}

function buildSystemPrompt(lang: Lang, pagePath?: string) {
  const paths = LOCALIZED_PATHS[lang];

  return `
You are CertifyQuiz AI Tutor, the official AI assistant of CertifyQuiz.

Respond in ${LANGUAGE_LABELS[lang]}.
Current user page path: ${pagePath || "unknown"}.

Your mission:
1. Help users choose the right IT certification.
2. Explain how CertifyQuiz works.
3. Guide users toward quizzes, quick reviews, mock exams, career roadmaps, Premium and future EXAM+ features.
4. Explain IT certification concepts in a clear, practical way.
5. Help beginners without making them feel stupid.

Important CertifyQuiz facts:
- CertifyQuiz is an IT certification quiz platform.
- It supports Italian, English, French and Spanish.
- It includes quizzes, topic pages, quick reviews, mock exams, career roadmaps, weak areas and PWA support.
- Quick Reviews are free study/revision pages connected to certification topics.
- Mock Exam / Simulazione d'esame / Examen blanc / Simulación de examen is used for exam-style practice.
- Exam Scenarios are planned as a Premium/EXAM+ style feature for long scenario-based questions.
- Premium can include advanced explanations, more review features and exam-oriented practice.
- CertifyQuiz has cybersecurity, networking, cloud, AI, database, programming, virtualization, fundamentals and management areas.

Available or planned certification areas:
Cybersecurity:
- ISC2 CC
- CISSP
- CEH
- CompTIA Security+
- Cisco CCST Cybersecurity

Networking:
- CCNA
- CCNP Enterprise
- CompTIA Network+
- Cisco CCST Networking

Cloud:
- AWS Cloud Practitioner
- AWS Solutions Architect
- Microsoft Azure Fundamentals AZ-900
- Google Cloud / Cloud Digital Leader
- CompTIA Cloud+

Fundamentals:
- CompTIA A+
- CompTIA Tech+ / ITF+
- ITIL 4 Foundation
- ICDL / ECDL

Data and databases:
- SQL Server
- DP-900
- PL-300 Power BI
- MySQL
- Data Analytics Foundations

AI:
- AI Foundations
- Microsoft AI Fundamentals
- AWS AI Practitioner
- NVIDIA AI certifications

Management:
- PMP
- Scrum / PSM I
- ITIL 4
- future project-management certifications

Important product positioning:
- CertifyQuiz is not only a quiz website. It is becoming a guided IT career-growth platform.
- The tone should feel like a mentor, not a generic chatbot.
- Always try to give the user a practical next step.

Localized useful links:
- Certifications page: ${SITE_ORIGIN}${paths.certs}
- Career roadmaps: ${SITE_ORIGIN}${paths.paths}
- Free test: ${SITE_ORIGIN}${paths.freeTest}
- Quick reviews: ${SITE_ORIGIN}${paths.reviews}
- Premium: ${SITE_ORIGIN}${paths.premium}

CTA rules:
- When useful, end with 1-3 suggested next actions.
- Use localized links only when they are clearly relevant.
- Do not spam links in every answer.
- Prefer short CTA labels such as:
  - Start a quiz
  - Open the roadmap
  - Read a quick review
  - Try the free test
  - View Premium

Anti-hallucination rules:
- If the user asks for exact current numbers, prices, availability or database counts and you are not given real data, say that the number may need verification on the live page.
- Do not invent exact exam prices, official exam rules or guaranteed salaries.
- You may give approximate preparation ranges, but clearly say they depend on background and study time.
- For official exam information, recommend checking the official vendor exam page.
- If the question is outside IT certifications, CertifyQuiz or study guidance, gently redirect.

Style:
- Be concise.
- Use clear paragraphs.
- Use bullets only when useful.
- Do not exceed 4 short paragraphs unless the user asks for a detailed explanation.
- Be friendly, practical and direct.
- No markdown tables unless the user explicitly asks for comparison.
`;
}

function fallbackReply(lang: Lang): string {
  const replies: Record<Lang, string> = {
    it: "Mi dispiace, non ho potuto generare una risposta. Riprova tra qualche istante.",
    en: "Sorry, I could not generate a reply. Please try again in a moment.",
    fr: "Désolé, je n'ai pas pu générer de réponse. Veuillez réessayer dans un instant.",
    es: "Lo siento, no pude generar una respuesta. Inténtalo de nuevo en un momento.",
  };

  return replies[lang];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = body?.messages;
    const lang = normalizeLang(body?.lang);
    const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const safeMessages = messages
      .filter(
        (msg: unknown) =>
          typeof msg === "object" &&
          msg !== null &&
          "role" in msg &&
          "content" in msg &&
          typeof (msg as { role?: unknown }).role === "string" &&
          typeof (msg as { content?: unknown }).content === "string"
      )
      .slice(-12)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content.slice(0, 2500) }],
      }));

    if (safeMessages.length === 0) {
      return NextResponse.json({ error: "Empty conversation" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: buildSystemPrompt(lang, pagePath) }],
          },
          contents: safeMessages,
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.45,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Gemini API error: status=${response.status} ${response.statusText} body=${errorBody}`
      );

      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackReply(lang);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot route error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { ImageResponse } from "next/og";

export const runtime = "edge";

const themes = {
  security: {
    bg: "#020617",
    panel: "#052e2b",
    accent: "#22c55e",
    badge: "#16a34a",
    icon: "🛡️",
  },
  cloud: {
    bg: "#020617",
    panel: "#0f172a",
    accent: "#38bdf8",
    badge: "#2563eb",
    icon: "☁️",
  },
  networking: {
    bg: "#020617",
    panel: "#172554",
    accent: "#60a5fa",
    badge: "#4f46e5",
    icon: "🌐",
  },
  ai: {
    bg: "#020617",
    panel: "#3b0764",
    accent: "#c084fc",
    badge: "#9333ea",
    icon: "🤖",
  },
  default: {
    bg: "#020617",
    panel: "#0f172a",
    accent: "#3b82f6",
    badge: "#2563eb",
    icon: "✅",
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "CertifyQuiz";
  const subtitle =
    searchParams.get("subtitle") || "Realistic quizzes for IT certifications";
  const type = searchParams.get("type") || "certification";
  const category = searchParams.get("category") || "default";

  const theme =
    themes[category as keyof typeof themes] || themes.default;

  const label =
    type === "topic"
      ? "TOPIC PRACTICE"
      : type === "blog"
        ? "STUDY GUIDE"
        : "PRACTICE EXAM";

  const bigIcon =
    type === "topic" ? "📘" : type === "blog" ? "✍️" : theme.icon;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.bg,
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Left colored panel */}
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "1200px",
            height: "630px",
            backgroundColor: theme.panel,
            opacity: 0.55,
          }}
        />

        {/* Big decorative circle */}
        <div
          style={{
            position: "absolute",
            right: "-150px",
            top: "-150px",
            width: "520px",
            height: "520px",
            borderRadius: "260px",
            border: `4px solid ${theme.accent}`,
            opacity: 0.35,
          }}
        />

        {/* Small decorative circle */}
        <div
          style={{
            position: "absolute",
            right: "180px",
            bottom: "95px",
            width: "210px",
            height: "210px",
            borderRadius: "105px",
            backgroundColor: theme.accent,
            opacity: 0.14,
          }}
        />

        {/* Icon card */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            bottom: "105px",
            width: "250px",
            height: "250px",
            borderRadius: "42px",
            backgroundColor: "rgba(255,255,255,0.10)",
            border: "2px solid rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "118px",
          }}
        >
          {bigIcon}
        </div>

        {/* Main content */}
        <div
          style={{
            position: "relative",
            padding: "58px 64px 96px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "835px",
            height: "630px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
  style={{
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    backgroundColor: theme.accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 900,
    marginRight: "18px",
  }}
>
  CQ
</div>

            <div
              style={{
                display: "flex",
                fontSize: "38px",
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              <span>Certify</span>
              <span style={{ color: theme.accent }}>Quiz</span>
            </div>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: "12px",
                backgroundColor: theme.badge,
                fontSize: "23px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              {label}
            </div>

            <div
              style={{
                fontSize: title.length > 30 ? "56px" : "72px",
                lineHeight: 0.98,
                fontWeight: 900,
                letterSpacing: "-2px",
                marginBottom: "22px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: "33px",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.84)",
                maxWidth: "760px",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Benefits */}
          <div
            style={{
              display: "flex",
              fontSize: "23px",
              color: "rgba(255,255,255,0.92)",
            }}
          >
           <span style={{ marginRight: "30px" }}>Realistic questions</span>
<span style={{ marginRight: "30px" }}>Clear explanations</span>
<span>Exam practice</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            left: "0px",
            bottom: "0px",
            width: "1200px",
            height: "74px",
            backgroundColor: "rgba(15,23,42,0.86)",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 64px",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          <span>Prepare smarter. Practice faster.</span>
          <span style={{ color: theme.accent }}>certifyquiz.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
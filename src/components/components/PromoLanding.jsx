// src/components/PromoLanding.jsx
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/**
 * PromoLanding.jsx — Landing multilingua (IT/EN/FR/ES) per campagne
 * Rotte:
 *   /promo            → fallback IT (o ?lang=xx)
 *   /promo/:lang      → lingua forzata (it | en | fr | es)
 *
 * - Layout conversion-oriented (nessun header/menu globali)
 * - Propagazione UTM sui link
 * - CTA → /:lang/certifications/comptia-itf-plus
 * - Helmet: title/description, noindex, canonical + hreflang
 * - Event tracking gtag/fbq sulle CTA
 */

const SUPPORTED = ["it", "en", "fr", "es"];

// Destinazioni CTA (usa gli slug del tuo CertificationLoader)
const CERT_ROUTE_BY_LANG = {
  it: "/it/certifications/comptia-itf-plus",
  en: "/en/certifications/comptia-itf-plus",
  fr: "/fr/certifications/comptia-itf-plus",
  es: "/es/certifications/comptia-itf-plus",
};
const BROWSE_ROUTE_BY_LANG = {
  it: "/it",
  en: "/en",
  fr: "/fr",
  es: "/es",
};

export default function PromoLanding() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // lingua da path /promo/:lang o query ?lang=xx; fallback "it"
  const queryLang = new URLSearchParams(location.search).get("lang")?.toLowerCase();
  const urlLang = (params.lang || queryLang || "it").toLowerCase();
  const lang = SUPPORTED.includes(urlLang) ? urlLang : "it";

  // normalizza: se :lang non supportato → /promo/it
  useEffect(() => {
    if (params.lang && !SUPPORTED.includes(params.lang.toLowerCase())) {
      navigate(`/promo/it${location.search}`, { replace: true });
    }
  }, [params.lang, location.search, navigate]);

  // smooth scroll
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    return () => document.documentElement.classList.remove("scroll-smooth");
  }, []);

  // UTM + lang nei link
  const utm = location.search || "";
  const appendLangAndUtm = (href) => {
    const base = new URL(href, window.location.origin);
    const sp = new URLSearchParams(base.search);
    const current = new URLSearchParams(utm);
    current.forEach((v, k) => {
      if (!sp.has(k)) sp.set(k, v);
    });
    sp.set("lang", lang);
    const qs = sp.toString();
    return base.pathname + (qs ? `?${qs}` : "");
  };

  // Tracking eventi CTA
  const track = (action, params = {}) => {
    try { window.gtag?.("event", action, params); } catch {}
    try { window.fbq?.("trackCustom", action, params); } catch {}
  };

  const t = TEXTS[lang];
  const certRoute = appendLangAndUtm(CERT_ROUTE_BY_LANG[lang]);
  const browseRoute = appendLangAndUtm(BROWSE_ROUTE_BY_LANG[lang]);

  // SEO / Links
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = `${origin}/promo/${lang}`;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        {/* Solo ads → noindex. Togli questa riga se vuoi indicizzarla. */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonical} />
        {/* hreflang */}
        <link rel="alternate" hrefLang="it" href={`${origin}/promo/it`} />
        <link rel="alternate" hrefLang="en" href={`${origin}/promo/en`} />
        <link rel="alternate" hrefLang="fr" href={`${origin}/promo/fr`} />
        <link rel="alternate" hrefLang="es" href={`${origin}/promo/es`} />
        <link rel="alternate" hrefLang="x-default" href={`${origin}/promo`} />

        {/* Open Graph base */}
        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
      </Helmet>

      {/* LANG SWITCH (solo su questa landing) */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold">CertifyQuiz</div>
          <LangSwitcher current={lang} />
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(1200px 500px at 10% -10%, rgba(26,115,232,0.08), transparent), radial-gradient(900px 450px at 90% 0%, rgba(16,185,129,0.08), transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          {t.badge && (
            <p className="mb-4 inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              {t.badge}
            </p>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {t.heroTitleLine1}
            <span className="block sm:inline"> {t.heroTitleLine2}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t.heroSubtitle}
          </p>

          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              to={certRoute}
              onClick={() => track("promo_cta_primary", { pos: "hero", lang })}
              data-cta="hero-primary"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold shadow-sm ring-1 ring-slate-200 hover:shadow-md bg-slate-900 text-white"
            >
              {t.ctaPrimary}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-2 h-5 w-5"><path d="M13.5 4.5l6 6m0 0l-6 6m6-6H4.5"/></svg>
            </Link>
            <Link
              to={browseRoute}
              onClick={() => track("promo_cta_secondary", { pos: "hero", lang })}
              data-cta="hero-secondary"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {t.ctaSecondary}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            {t.heroBullets.map((b) => (
              <span key={b} className="inline-flex items-center">✓ {b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-slate-200">
                <Icon name={b.icon} />
              </div>
              <h3 className="text-base font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIMITED OFFER */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">{t.offerBadge}</p>
                <h2 className="mt-2 text-2xl font-bold">{t.offerTitle}</h2>
                <p className="mt-1 max-w-2xl text-slate-600">{t.offerText}</p>
              </div>
              <Link
                to={certRoute}
                onClick={() => track("promo_cta_offer", { pos: "offer", lang })}
                data-cta="offer-cta"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm ring-1 ring-slate-200 hover:shadow-md"
              >
                {t.ctaOffer}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{t.socialProofTitle}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {t.socialLogos.map((name) => (
            <div key={name} className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h3 className="text-2xl font-bold">{t.faqTitle}</h3>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {t.faq.map((q, idx) => (
              <details key={q.q + idx} className="group p-5 [&_summary::-webkit-details-marker]:hidden" open={q.open || false}>
                <summary className="flex cursor-pointer items-center justify-between text-left font-medium">
                  <span>{q.q}</span>
                  <svg className="ml-4 h-5 w-5 transition group-open:rotate-45" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path d="M12 4v16M4 12h16"/>
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm sm:p-12">
          <h3 className="text-3xl font-bold">{t.finalCtaTitle}</h3>
          <p className="mt-2 max-w-2xl text-slate-300">{t.finalCtaText}</p>
          <div className="mt-6">
            <Link
              to={certRoute}
              onClick={() => track("promo_cta_final", { pos: "final", lang })}
              data-cta="final-cta"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold shadow-sm ring-1 ring-white/10 hover:bg-white/10"
            >
              {t.finalCtaButton}
            </Link>
          </div>
        </div>
      </section>

      {/* STICKY CTA (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 block bg-white/80 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 sm:hidden">
        <Link
          to={certRoute}
          onClick={() => track("promo_cta_sticky", { pos: "sticky", lang })}
          data-cta="sticky-mobile"
          className="mx-auto block max-w-xl rounded-xl bg-slate-900 px-5 py-3 text-center text-base font-semibold text-white shadow"
        >
          {t.ctaPrimary}
        </Link>
      </div>
    </main>
  );
}

/* -------------------- Componenti di supporto -------------------- */

function LangSwitcher({ current }) {
  const location = useLocation();

  const buildHref = (lng) => {
    const sp = new URLSearchParams(location.search);
    sp.set("lang", lng);
    const qs = sp.toString();
    return `/promo/${lng}${qs ? `?${qs}` : ""}`;
  };

  return (
    <nav className="flex items-center gap-2 text-sm">
      {SUPPORTED.map((lng) => (
        <Link
          key={lng}
          to={buildHref(lng)}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ${
            current === lng ? "ring-slate-900 bg-slate-900 text-white" : "ring-slate-200 hover:bg-slate-50"
          }`}
        >
          <span
            aria-label={lng.toUpperCase()}
            title={lng.toUpperCase()}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
              current === lng ? "border-white" : "border-slate-300"
            }`}
          >
            {flagEmoji(lng)}
          </span>
          <span className="uppercase">{lng}</span>
        </Link>
      ))}
    </nav>
  );
}

function flagEmoji(code) {
  const map = { it: "🇮🇹", en: "🇬🇧", fr: "🇫🇷", es: "🇪🇸" };
  return map[code] || "🏳️";
}

function Icon({ name }) {
  if (name === "check") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M20 22V6a2 2 0 00-2-2H7.5A2.5 2.5 0 005 6.5V20" />
      </svg>
    );
  }
  if (name === "badge") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    );
  }
  return null;
}

/* -------------------- Testi multilingua + SEO -------------------- */

const TEXTS = {
  it: {
    seoTitle: "Quiz ITF+ gratis — CertifyQuiz",
    seoDescription:
      "Prova gratis un topic ITF+ con spiegazioni premium. Badge condivisibili. Nessuna carta richiesta.",
    badge: "Nuovo • Prova gratuita senza carta",
    heroTitleLine1: "Preparati alle certificazioni IT",
    heroTitleLine2: "con quiz reali",
    heroSubtitle:
      "Allenati con domande allineate ai syllabus ufficiali. Spiegazioni premium, badge condivisibili, e web app installabile come PWA.",
    ctaPrimary: "Inizia gratis ora",
    ctaSecondary: "Sfoglia certificazioni",
    heroBullets: [
      "30 domande per topic",
      "Spiegazioni dettagliate",
      "Badge verificabili",
      "Multilingua (IT/EN/FR/ES)",
    ],
    benefits: [
      { icon: "check", title: "Quiz realistici", text: "Domande strutturate sui blueprint ufficiali (30 per topic)." },
      { icon: "book", title: "Spiegazioni premium", text: "Soluzioni commentate per capire il perché delle risposte." },
      { icon: "badge", title: "Badge verificabili", text: "Condividi i traguardi su LinkedIn con badge verificabili." },
      { icon: "globe", title: "Multilingua", text: "Italiano, inglese, francese, spagnolo. Studia come preferisci." },
    ],
    offerBadge: "Offerta limitata",
    offerTitle: "Spiegazioni premium gratuite per un periodo limitato",
    offerText:
      "Entra, scegli una certificazione e prova un topic completo con spiegazioni approfondite. Nessuna carta richiesta.",
    ctaOffer: "Prova ora gratis",
    socialProofTitle: "Basato sui syllabus ufficiali",
    socialLogos: ["CompTIA", "Cisco", "AWS", "Microsoft"],
    faqTitle: "Domande frequenti",
    faq: [
      { q: "È davvero gratis?", a: "Sì. Puoi provare un topic completo con spiegazioni premium per un periodo limitato, senza carta di credito.", open: true },
      { q: "Serve registrarsi?", a: "Puoi iniziare subito. Ti chiederemo di registrarti solo per salvare i progressi, le statistiche e i badge." },
      { q: "I quiz sono aggiornati?", a: "Sì, sono allineati ai blueprint ufficiali e vengono migliorati continuamente." },
      { q: "Posso usare lo smartphone?", a: "Certo. La web app è ottimizzata e installabile come PWA." },
    ],
    finalCtaTitle: "Inizia ora. È gratis.",
    finalCtaText: "Prova un topic completo con spiegazioni premium. Se ti piace, continua quando vuoi.",
    finalCtaButton: "Vai alla certificazione demo",
  },

  en: {
    seoTitle: "Free ITF+ quiz — CertifyQuiz",
    seoDescription:
      "Try an ITF+ topic for free with premium explanations. Shareable badges. No credit card required.",
    badge: "New • Free trial, no card",
    heroTitleLine1: "Prepare for top IT certifications",
    heroTitleLine2: "with real-world quizzes",
    heroSubtitle:
      "Train with questions aligned to official blueprints. Premium explanations, shareable badges, and an installable PWA.",
    ctaPrimary: "Start free now",
    ctaSecondary: "Browse certifications",
    heroBullets: [
      "30 questions per topic",
      "Detailed explanations",
      "Verifiable badges",
      "Multi-language (IT/EN/FR/ES)",
    ],
    benefits: [
      { icon: "check", title: "Realistic quizzes", text: "Questions structured on official blueprints (30 per topic)." },
      { icon: "book", title: "Premium explanations", text: "Commented solutions to understand the reasoning." },
      { icon: "badge", title: "Verifiable badges", text: "Share your achievements on LinkedIn with verifiable badges." },
      { icon: "globe", title: "Multi-language", text: "Italian, English, French, Spanish. Study as you prefer." },
    ],
    offerBadge: "Limited offer",
    offerTitle: "Premium explanations free for a limited time",
    offerText:
      "Jump in, pick a certification and try a full topic with deep explanations. No credit card required.",
    ctaOffer: "Try it free",
    socialProofTitle: "Aligned with official syllabuses",
    socialLogos: ["CompTIA", "Cisco", "AWS", "Microsoft"],
    faqTitle: "FAQ",
    faq: [
      { q: "Is it really free?", a: "Yes. You can try a full topic with premium explanations for a limited time, no credit card.", open: true },
      { q: "Do I need to register?", a: "You can start right away. We’ll ask you to register only to save progress, stats and badges." },
      { q: "Are quizzes updated?", a: "Yes, aligned to official blueprints and continuously improved." },
      { q: "Does it work on mobile?", a: "Absolutely. The web app is optimized and can be installed as a PWA." },
    ],
    finalCtaTitle: "Start now. It’s free.",
    finalCtaText: "Try a complete topic with premium explanations. If you like it, continue anytime.",
    finalCtaButton: "Go to the demo certification",
  },

  fr: {
    seoTitle: "Quiz ITF+ gratuit — CertifyQuiz",
    seoDescription:
      "Essayez un thème ITF+ gratuitement avec des explications premium. Badges partageables. Aucune carte requise.",
    badge: "Nouveau • Essai gratuit sans carte",
    heroTitleLine1: "Préparez les certifs IT",
    heroTitleLine2: "avec des quiz réalistes",
    heroSubtitle:
      "Entraînez-vous avec des questions alignées sur les référentiels officiels. Explications premium, badges partageables, PWA installable.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Parcourir les certifications",
    heroBullets: [
      "30 questions par thème",
      "Explications détaillées",
      "Badges vérifiables",
      "Multilingue (IT/EN/FR/ES)",
    ],
    benefits: [
      { icon: "check", title: "Quiz réalistes", text: "Questions basées sur les référentiels officiels (30 par thème)." },
      { icon: "book", title: "Explications premium", text: "Solutions commentées pour comprendre le raisonnement." },
      { icon: "badge", title: "Badges vérifiables", text: "Partagez vos réussites sur LinkedIn avec des badges vérifiables." },
      { icon: "globe", title: "Multilingue", text: "Italien, anglais, français, espagnol. Étudiez comme vous voulez." },
    ],
    offerBadge: "Offre limitée",
    offerTitle: "Explications premium gratuites pendant une période limitée",
    offerText:
      "Entrez, choisissez une certification et essayez un thème complet avec des explications approfondies. Aucune carte requise.",
    ctaOffer: "Essayer gratuitement",
    socialProofTitle: "Basé sur les référentiels officiels",
    socialLogos: ["CompTIA", "Cisco", "AWS", "Microsoft"],
    faqTitle: "FAQ",
    faq: [
      { q: "C’est vraiment gratuit ?", a: "Oui. Vous pouvez essayer un thème complet avec des explications premium pendant une période limitée, sans carte.", open: true },
      { q: "Faut-il s’inscrire ?", a: "Vous pouvez commencer tout de suite. Nous demanderons l’inscription seulement pour sauvegarder vos progrès, stats et badges." },
      { q: "Les quiz sont-ils à jour ?", a: "Oui, alignés sur les référentiels officiels et améliorés en continu." },
      { q: "Sur mobile aussi ?", a: "Bien sûr. L’application web est optimisée et installable comme PWA." },
    ],
    finalCtaTitle: "Commencez maintenant. C’est gratuit.",
    finalCtaText: "Essayez un thème complet avec des explications premium. Si ça vous plaît, continuez quand vous voulez.",
    finalCtaButton: "Aller à la certification démo",
  },

  es: {
    seoTitle: "Quiz ITF+ gratis — CertifyQuiz",
    seoDescription:
      "Prueba un tema ITF+ gratis con explicaciones premium. Insignias compartibles. Sin tarjeta.",
    badge: "Nuevo • Prueba gratis sin tarjeta",
    heroTitleLine1: "Prepárate para certificaciones IT",
    heroTitleLine2: "con cuestionarios reales",
    heroSubtitle:
      "Entrena con preguntas alineadas a los planes oficiales. Explicaciones premium, insignias compartibles y PWA instalable.",
    ctaPrimary: "Empieza gratis ahora",
    ctaSecondary: "Ver certificaciones",
    heroBullets: [
      "30 preguntas por tema",
      "Explicaciones detalladas",
      "Insignias verificables",
      "Multiidioma (IT/EN/FR/ES)",
    ],
    benefits: [
      { icon: "check", title: "Cuestionarios realistas", text: "Preguntas basadas en los planes oficiales (30 por tema)." },
      { icon: "book", title: "Explicaciones premium", text: "Soluciones comentadas para entender el porqué de las respuestas." },
      { icon: "badge", title: "Insignias verificables", text: "Comparte logros en LinkedIn con insignias verificables." },
      { icon: "globe", title: "Multiidioma", text: "Italiano, inglés, francés, español. Estudia como prefieras." },
    ],
    offerBadge: "Oferta limitada",
    offerTitle: "Explicaciones premium gratis por tiempo limitado",
    offerText:
      "Entra, elige una certificación y prueba un tema completo con explicaciones profundas. No se requiere tarjeta.",
    ctaOffer: "Probar gratis",
    socialProofTitle: "Basado en los planes oficiales",
    socialLogos: ["CompTIA", "Cisco", "AWS", "Microsoft"],
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Realmente es gratis?", a: "Sí. Puedes probar un tema completo con explicaciones premium por tiempo limitado, sin tarjeta.", open: true },
      { q: "¿Tengo que registrarme?", a: "Puedes empezar de inmediato. Te pediremos registrarte solo para guardar progreso, estadísticas e insignias." },
      { q: "¿Los cuestionarios están actualizados?", a: "Sí, alineados a los planes oficiales y mejorados continuamente." },
      { q: "¿Funciona en móvil?", a: "Claro. La app web está optimizada y puede instalarse como PWA." },
    ],
    finalCtaTitle: "Empieza ahora. Es gratis.",
    finalCtaText: "Prueba un tema completo con explicaciones premium. Si te gusta, continúa cuando quieras.",
    finalCtaButton: "Ir a la certificación demo",
  },
};

import type { Locale } from "@/lib/paths";

type Props = { lang: Locale };

type Card = { title: string; body: string };

const COPY: Record<Locale, { eyebrow: string; heading: string; cards: Card[] }> = {
  it: {
    eyebrow: "IL PROSSIMO CAPITOLO",
    heading: "Cosa potrebbero cambiare, per te, più competenze?",
    cards: [
      {
        title: "Cambia direzione",
        body: "Non devi restare nel settore da cui sei partito. Le certificazioni sono uno dei pochi titoli che ti permettono di dimostrare competenze nuove senza ricominciare da un percorso di studi.",
      },
      {
        title: "Guarda oltre il tuo mercato locale",
        body: "Una certificazione AWS, Cisco o CompTIA significa la stessa cosa a Milano, a Madrid e a Città del Messico. La tua città smette di essere il confine della tua ricerca.",
      },
      {
        title: "Punta a ruoli remoti o ibridi",
        body: "Molti ruoli che offrono lavoro remoto o ibrido richiedono esattamente queste competenze. Averle non ti garantisce il posto: non averle ti esclude in partenza.",
      },
      {
        title: "Cresci dove sei",
        body: "Non serve sempre andarsene per salire. Una certificazione è spesso la via più rapida per essere preso in considerazione per responsabilità maggiori nel team in cui sei già.",
      },
      {
        title: "Costruisci più scelta",
        body: "Ogni competenza che sai dimostrare è una porta in più che potresti aprire. Il ritorno vero è questo: non un lavoro garantito, ma un ventaglio di possibilità più ampio.",
      },
    ],
  },
  en: {
    eyebrow: "YOUR NEXT CHAPTER",
    heading: "What could more skills change for you?",
    cards: [
      {
        title: "Change direction",
        body: "You don't have to stay in the field you started in. Certifications are one of the few credentials that let you prove new skills without starting a degree over.",
      },
      {
        title: "Work beyond your local market",
        body: "An AWS, Cisco or CompTIA credential means the same thing in Milan, Madrid and Mexico City. Your city stops being the boundary of your job search.",
      },
      {
        title: "Pursue remote and hybrid roles",
        body: "Many roles that offer remote or hybrid work ask for exactly these skills. Having them doesn't guarantee the job — not having them rules you out.",
      },
      {
        title: "Grow where you are",
        body: "You don't always have to leave to move up. A certification is often the fastest way to be considered for more responsibility on the team you're already on.",
      },
      {
        title: "Create more choice",
        body: "Every skill you can prove is one more door you could open. That's the real return: not a guaranteed job, but a bigger set of options.",
      },
    ],
  },
  fr: {
    eyebrow: "VOTRE PROCHAIN CHAPITRE",
    heading: "Que pourraient changer pour vous de nouvelles compétences ?",
    cards: [
      {
        title: "Changer de direction",
        body: "Rien ne vous oblige à rester dans le domaine où vous avez commencé. Les certifications sont l'un des rares titres qui permettent de prouver de nouvelles compétences sans reprendre des études.",
      },
      {
        title: "Regardez au-delà de votre marché local",
        body: "Une certification AWS, Cisco ou CompTIA a la même valeur à Milan, à Madrid et à Mexico. Votre ville cesse d'être la limite de votre recherche.",
      },
      {
        title: "Visez des postes en télétravail ou hybrides",
        body: "Beaucoup de postes en télétravail ou hybrides demandent exactement ces compétences. Les avoir ne garantit pas le poste : ne pas les avoir vous élimine d'emblée.",
      },
      {
        title: "Évoluez là où vous êtes",
        body: "Il n'est pas toujours nécessaire de partir pour progresser. Une certification est souvent le moyen le plus rapide d'être considéré pour davantage de responsabilités dans votre équipe actuelle.",
      },
      {
        title: "Créez plus de choix",
        body: "Chaque compétence que vous pouvez prouver est une porte de plus que vous pourriez ouvrir. Le vrai bénéfice est là : pas un emploi garanti, mais un éventail d'options plus large.",
      },
    ],
  },
  es: {
    eyebrow: "TU PRÓXIMO CAPÍTULO",
    heading: "¿Qué podrían cambiar para ti más competencias?",
    cards: [
      {
        title: "Cambia de dirección",
        body: "No tienes que quedarte en el sector en el que empezaste. Las certificaciones son uno de los pocos títulos que te permiten demostrar nuevas competencias sin volver a empezar una carrera.",
      },
      {
        title: "Mira más allá de tu mercado local",
        body: "Una certificación de AWS, Cisco o CompTIA significa lo mismo en Milán, en Madrid y en Ciudad de México. Tu ciudad deja de ser el límite de tu búsqueda.",
      },
      {
        title: "Apunta a puestos remotos o híbridos",
        body: "Muchos puestos que ofrecen trabajo remoto o híbrido piden exactamente estas competencias. Tenerlas no te garantiza el puesto: no tenerlas te deja fuera desde el principio.",
      },
      {
        title: "Crece donde estás",
        body: "No siempre hay que irse para ascender. Una certificación suele ser la vía más rápida para que te tengan en cuenta para más responsabilidades en el equipo en el que ya estás.",
      },
      {
        title: "Crea más opciones",
        body: "Cada competencia que puedes demostrar es una puerta más que podrías abrir. Ese es el retorno real: no un empleo garantizado, sino un abanico de opciones más amplio.",
      },
    ],
  },
};

export default function NextChapterSection({ lang }: Props) {
  const t = COPY[lang];

  return (
    <section className="mx-auto mt-8 max-w-6xl px-4 md:mt-10">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <div className="text-xs font-bold uppercase tracking-wide text-blue-700">
          {t.eyebrow}
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          {t.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

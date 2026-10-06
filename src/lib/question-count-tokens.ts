// Segnaposto per il numero di domande nei testi statici del registry.
//
// Sintassi: `{questionCount}` oppure `{questionCount|1,400+}`. Il valore dopo `|`
// e' il testo usato quando il conteggio live non e' noto (API in errore) o quando
// il testo viene mostrato fuori da una landing (es. etichette dei filtri): deve
// restare vero anche se il corpus cambia, quindi una soglia ("1,400+"), non un
// numero esatto.

type Lang = "it" | "en" | "fr" | "es";

const NUMBER_LOCALE: Record<Lang, string> = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

const TOKEN = /\{questionCount(?:\|([^}]*))?\}/g;

export function hasQuestionCountToken(text: string): boolean {
  TOKEN.lastIndex = 0;
  return TOKEN.test(text);
}

export function resolveQuestionCountTokens(
  text: string,
  count: number | null | undefined,
  lang: Lang
): string {
  const known = typeof count === "number" && Number.isFinite(count) && count > 0;
  const formatted = known ? new Intl.NumberFormat(NUMBER_LOCALE[lang]).format(count) : null;

  return text.replace(TOKEN, (_match, fallback: string | undefined) => formatted ?? fallback ?? "");
}

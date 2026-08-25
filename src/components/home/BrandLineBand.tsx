import type { Locale } from "@/lib/paths";

type Props = { lang: Locale };

const COPY: Record<Locale, string> = {
  it: "Non possiamo prometterti dove ti porterà. Possiamo farti arrivare preparato.",
  en: "We can't promise you where this leads. We can make sure you arrive prepared.",
  fr: "Nous ne pouvons pas vous promettre où cela vous mènera. Nous pouvons faire en sorte que vous arriviez prêt.",
  es: "No podemos prometerte adónde te llevará. Podemos hacer que llegues preparado.",
};

export default function BrandLineBand({ lang }: Props) {
  return (
    <section className="mx-auto mt-6 max-w-4xl px-4 text-center md:mt-8">
      <p className="text-lg font-semibold leading-snug text-slate-700 md:text-xl">
        {COPY[lang]}
      </p>
    </section>
  );
}

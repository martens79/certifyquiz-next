# Categoria Diario

Il campo reale `article.category` dello Studio Sanity include ora `{ title: "Diario", value: "diary" }`. Il frontend accetta già categorie stringa senza un enum chiuso; le categorie delle certificazioni sono separate e non sono state modificate.

Le etichette della categoria sono centralizzate in `src/lib/blog-categories.ts`: IT Diario, EN Diary, FR Journal, ES Diario. Un badge compare solo per `diary` nelle pagine articolo e nell'indice del blog. Il generatore delle immagini social include il tema `diary` e la stessa etichetta localizzata.

Sono state aggiornate esclusivamente le bozze `drafts.certifyquiz-diario-01-{it,en,fr,es}`, da `fundamentals` a `diary`, con controllo della revisione. Il confronto completo prima/dopo ha verificato tutti gli altri campi delle quattro bozze e tutti gli altri 140 documenti articolo: invariati. Copertina e audio italiano preservati; EN/FR/ES ancora senza audio. Nessuna versione pubblicata.

Le evidenze locali sono in `../.tmp/diario-01-import/category-before.json` e `../.tmp/diario-01-import/category-verification.json`, rispetto alla cartella del repository frontend. Non contengono credenziali; il primo file è lo snapshot di ripristino degli articoli.

Controlli: `npm run typecheck`, ESLint dei file frontend modificati, `npx tsc --noEmit` nello Studio, `npx tsx --test tests/blog-category.test.tsx` e `git diff --check`. Il test verifica il markup nelle quattro lingue e l'assenza di cambiamenti al badge delle altre categorie.

Le bozze sono escluse dal frontend pubblico. La verifica delle etichette è stata eseguita tramite rendering del componente; la riconferma visiva nello Studio non è disponibile in questa sessione perché il collegamento al browser restituisce `browser.user is unavailable`.

Nessuna pubblicazione di articoli, merge o deploy. Il server Studio in sviluppo ricarica lo schema; se il menu non si aggiorna, ricaricare la scheda o riavviare `npm run dev -- --port 3333` dalla cartella `blog-certifyquiz`.

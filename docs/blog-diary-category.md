# Categoria Diario

Il campo reale `article.category` dello Studio include `{ title: "Diario", value: "diary" }`. Il frontend accetta categorie stringa senza un enum chiuso; le categorie delle certificazioni sono separate.

Le etichette sono centralizzate in `src/lib/blog-categories.ts`: IT **Diario**, EN **Diary**, FR **Journal**, ES **Diario**. Il badge appare solo per `diary` nelle pagine articolo e nell'indice del blog. Il generatore delle immagini social usa il tema `diary` e la stessa etichetta localizzata, preservando la descrizione ricevuta.

Il cambiamento dati già eseguito nello Studio ha riguardato esclusivamente le quattro bozze del Diario #01, da `fundamentals` a `diary`, con verifica delle revisioni e degli altri campi. Le bozze non sono incluse in questo repository e questa PR non le pubblica. La copertina è comune, l'audio è presente soltanto nella versione italiana.

`tests/blog-category.test.tsx` verifica il markup nelle quattro lingue e l'assenza del nuovo badge per categorie diverse. Per la procedura di verifica e rilascio vedere [blog-optional-audio.md](blog-optional-audio.md).

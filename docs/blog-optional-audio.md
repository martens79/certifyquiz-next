# Audio facoltativo del blog

Gli articoli Sanity sono documenti distinti per lingua (`it`, `en`, `fr`, `es`). La query `articleBySlugLang` filtra per lingua e slug, esclude le bozze e mantiene i fallback esistenti per corpo, copertina e data.

Il campo facoltativo `audio` è un file Sanity. La proiezione recupera `audio.asset->url` come `audioUrl`, opzionale anche nel tipo frontend. `ArticleAudio` restituisce null senza URL; altrimenti mostra controlli HTML nativi, etichetta nella lingua dell'articolo, `preload="none"` e nessun autoplay. Il lettore non richiede JavaScript client aggiuntivo.

## Studio locale

Lo Studio è un progetto separato (`blog-certifyquiz`), non incluso in questo repository frontend. Il suo schema deve contenere il campo file `audio`, con filtro e validazione MP3/WAV. Lo schema locale è già stato aggiornato e verificato nel progetto Studio.

Dalla cartella dello Studio eseguire `npm run dev -- --port 3333`, poi aprire http://localhost:3333. Se lo Studio era già avviato, ricaricare la scheda o riavviarlo. Caricare il file nel campo **Audio dell’articolo** del documento della lingua desiderata. Il dataset configurato è remoto anche quando il server Studio è locale.

Il frontend legge soltanto i contenuti pubblicati: le bozze restano escluse. Nessuna migrazione è necessaria per gli articoli senza audio. Il rilascio frontend e la pubblicazione dei contenuti sono operazioni separate; la pubblicazione degli articoli resta all'utente.

## Verifiche

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
npx tsx --tsconfig tsconfig.test.json --test tests/blog-audio.test.tsx tests/blog-category.test.tsx
npm run typecheck
npm run build
```

I test usano un WAV PCM generato in memoria: quattro lingue, assenza completa di markup senza audio, controlli nativi, niente autoplay, preload none, riproduzione, pausa, avanzamento, volume e larghezza a 1280 e 390 pixel in Chromium. Il mobile è emulato; il collaudo sui dispositivi fisici, soprattutto Safari/iOS e i controlli volume di sistema, resta un controllo di rilascio manuale.

Il workflow `Blog audio and diary` esegue lint e questi test; `Isolated frontend build` esegue la build completa con backend isolato e configurazione Sanity di test. Nessun workflow aggiunto effettua deploy o modifica contenuti Sanity.

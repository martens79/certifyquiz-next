# Audio facoltativo del blog

Branch locale in entrambe le cartelle: `codex/blog-optional-audio`.

## Struttura verificata

- Frontend: repository `martens79/certifyquiz-next`, cartella `certifyquiz-next`.
- Studio: cartella sorella `blog-certifyquiz`, inizialmente senza Git. Creato repository locale con baseline dei soli sorgenti e configurazioni necessari; nessun remote configurato e nessun file `.env` versionato.
- Sanity: documento `article`, campo `lang` con `it`, `en`, `fr`, `es`. Ogni traduzione è un documento distinto; slug verificato per lingua.
- Frontend: `src/app/[lang]/blog/[slug]/page.tsx`, query `articleBySlugLang` filtrata per lingua e slug. Inglese pubblico alla root `/blog/...`, altre lingue con prefisso.

## Utilizzo locale

Da PowerShell:

```powershell
cd C:\Users\loren\Documents\CertifyQuiz\blog-certifyquiz
npm run dev -- --port 3333
```

Aprire http://localhost:3333 e accedere con il proprio account Sanity. Se lo Studio era già avviato, riavviarlo. Nel documento della lingua desiderata, caricare il file nel campo **Audio dell’articolo**. Il campo è facoltativo; accetta MP3 o WAV e controlla estensione e MIME dell'asset. Rimuovere il file ripristina la pagina senza lettore. Non occorrono migrazioni né modifiche agli articoli esistenti.

Il server Studio è locale, mentre il dataset configurato resta quello Sanity esistente (`production`): le modifiche ai contenuti dello Studio riguardano quel dataset. Nessun contenuto è stato creato o pubblicato durante questa implementazione.

Per il frontend, in un secondo terminale:

```powershell
cd C:\Users\loren\Documents\CertifyQuiz\certifyquiz-next
npm run dev
```

Il frontend usa la prospettiva `published`: mostra l'audio quando il documento viene pubblicato dall'utente. Il codice frontend dovrà essere rilasciato separatamente per comparire sul sito pubblico; questo lavoro non effettua deploy.

## Verifiche ripetibili

```powershell
# Frontend
npm run typecheck
$env:PLAYWRIGHT_BROWSERS_PATH = 'C:\Users\loren\AppData\Local\ms-playwright'
npx tsx --test tests/blog-audio.test.tsx
npx tsx --test ../blog-certifyquiz/schemaTypes/article-audio.test.ts
npx eslint src/components/blog/ArticleAudio.tsx src/lib/sanity.types.ts src/lib/sanity.queries.ts 'src/app/[lang]/blog/[slug]/page.tsx' tests/blog-audio.test.tsx
npm run build

# Studio (dalla sua cartella)
npx tsc --noEmit
npm run build
```

Il test usa un WAV PCM locale generato in memoria, senza scritture Sanity: verifica assenza di markup per documenti senza audio, etichette nelle quattro lingue, controlli nativi, nessun autoplay, preload none, riproduzione, pausa, avanzamento, volume e larghezza a 1280 e 390 pixel in Chromium. Mobile emulato: resta da provare sul dispositivo fisico, in particolare Safari/iOS dove il volume dipende dai controlli di sistema. Non è un collaudo end-to-end con upload Sanity o con gli audio personali dell'utente.

Nessuna dipendenza aggiunta; nessuna operazione MySQL, merge, push, deploy o pubblicazione di articoli.

## Esito locale

- TypeScript frontend e Studio: superati.
- ESLint dei file frontend interessati: superato.
- Test componente: 2/2 superati; quattro lingue, desktop e mobile Chromium emulato, WAV di prova.
- Build Studio: superata con `npm run build -- --no-auto-updates`, usando `XDG_CONFIG_HOME` in una cartella temporanea scrivibile. Il flag evita il download degli aggiornamenti durante la verifica, senza cambiare la configurazione dello Studio.
- Build Next.js: tentata; download dei font Google bloccato prima dal DNS della sandbox e poi dalla catena di certificati TLS dell'ambiente (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`). Non è stata disattivata la verifica TLS.
- Da verificare con i propri file: upload MP3/WAV nello Studio e riproduzione su dispositivi mobili fisici.

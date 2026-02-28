# Course Site (Astro)

Prosty serwis kursu oparty o Astro: spis lekcji, strona każdej lekcji, podstrona promptu startowego, miejsce na osadzenie wideo i eksport PDF.

## Stack
- Astro
- Markdown (czytany lokalnie z `content/lekcje/*.md`)
- marked (render markdown -> HTML)
- Playwright (eksport PDF)

## Start
```bash
npm install
npm run dev
```

Aplikacja wystartuje domyślnie na `http://localhost:4321`.

## Build
```bash
npm run build
npm run preview
```

## PDF (każda lekcja osobno)
```bash
npm run pdf
```

Pliki pojawią się w katalogu `pdf/`.

## Gdzie edytować
- Styl: `src/styles/global.css`
- Strona główna: `src/pages/index.astro`
- Widok lekcji: `src/pages/lekcja/[slug].astro`
- Prompt startowy: `src/pages/prompt-startowy.astro`
- Lista lekcji + metadata: `src/data/lessons.json`
- Treści lekcji: `content/lekcje/*.md`
- Prompt źródłowy: `content/prompts/AGENT_INIT_PROMPT.md`

## Flow pre-launch (all-at-once)
- Użytkownik po zapisie trafia na `https://vibe.devince.dev`
- Ze strony głównej przechodzi do podstrony promptu (`/prompt-startowy/`)
- Kopiuje `AGENT_INIT_PROMPT.md` i startuje z lekcjami
- W razie blokady przechodzi na Discord (CTA na stronie)

## Embed filmów
W `src/data/lessons.json` uzupełnij `videoUrl` dla danej lekcji (np. URL embed YouTube).
Jeśli pole jest puste, pokaże się placeholder.

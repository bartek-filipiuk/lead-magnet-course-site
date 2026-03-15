# PROMPT_SCORE — Read-only Project Health Score

**Szybki odczyt stanu projektu.** Wklej do agenta AI w katalogu projektu — oblicza score 0-100 i wyświetla raport czego brakuje. Nic nie modyfikuje, nic nie commituje.

---

Przeczytaj CAŁY ten plik, a następnie oblicz Project Health Score i wyświetl raport.

## Kontekst — przeczytaj przed startem

Przeczytaj pliki w tym projekcie:
- `ARTIFACT_CHECKLIST.md` (kryteria akceptacji)
- `HANDOFF_STAGES_PLAN.md` (plan z checkboxami)
- `PRD.md` (wymagania)
- `TECH_STACK.md` (decyzje architektoniczne)

Jeśli którykolwiek z tych plików nie istnieje — **ZATRZYMAJ SIĘ** i poinformuj użytkownika:
> "Brakuje pliku [nazwa]. PROMPT_SCORE wymaga kompletnej dokumentacji planistycznej. Uruchom najpierw AGENT_INIT_PROMPT.md do odpowiedniej fazy."

## Twoja rola

Jesteś **read-only audytorem**. Twoje zadanie:
1. Obliczyć Project Health Score (0-100)
2. Wylistować top 5 problemów z największym wpływem na score
3. Wyświetlić raport w terminalu/czacie

**NIE modyfikujesz żadnych plików.** **NIE tworzysz commitów.** **NIE naprawiasz problemów.** Twój output to WYŁĄCZNIE raport w terminalu/czacie.

---

## 📊 Project Health Score (0-100)

4 wymiary × 25% wagi każdy. Oblicz każdy wymiar osobno.

### Wymiar 1: Artefakty (25%)

Dla KAŻDEGO wymaganego artefaktu (lista z `ARTIFACT_CHECKLIST.md`, dostosowana do aktualnej fazy projektu):

| Stan artefaktu | Punkty |
|----------------|--------|
| Plik istnieje + wszystkie wymagane sekcje + treść adekwatna | 100% |
| Plik istnieje + większość sekcji (>50%) | 60% |
| Plik istnieje ale pusty/placeholder | 30% |
| Plik nie istnieje | 0% |

Score = średnia punktów ze wszystkich wymaganych artefaktów dla aktualnej fazy.

**Określenie fazy:** Sprawdź które pliki istnieją i stan HANDOFF — na tej podstawie ustal czy projekt jest w Phase 1/2/3/4/5.

### Wymiar 2: Testy (25%)

1. Wykryj framework testowy z `package.json` / `pyproject.toml` / `go.mod` / `TECH_STACK.md`.
2. Jeśli możliwe — uruchom testy. Jeśli nie (brak runtime/dependencies) — użyj analizy statycznej plików testowych i zanotuj w raporcie.

| Stan testów | Punkty |
|------------|--------|
| Brak frameworku / brak plików testowych | 0 |
| Framework jest, ale 0 testów | 10 |
| Testy istnieją ale FAIL | 20 |
| Testy PASS, ale brak testów security (negative cases) | 60 |
| Testy PASS + testy security obecne | 80 |
| Testy PASS + security tests + smoke test (health + happy path + error path) | 100 |

**Detekcja testów security:** szukaj w plikach testowych: `401`, `403`, `400`, `422`, `invalid`, `unauthorized`, `forbidden`, `injection`, `xss`, `sanitiz`. Minimum 2 takie testy = obecne.

**Detekcja smoke testu:** szukaj pliku `smoke*`, `e2e*`, lub testów z opisem `smoke`, `health`, `e2e`.

### Wymiar 3: Security (25%)

Sprawdź każdy item i zsumuj punkty (max 100):

| Sprawdzenie | Punkty | Jak sprawdzić |
|------------|--------|---------------|
| `.env` w `.gitignore` | 15 | Otwórz `.gitignore`, szukaj `.env` |
| Brak hardcoded secrets w kodzie | 15 | Przeszukaj `*.ts,*.js,*.py,*.tsx,*.jsx` (pomiń node_modules, .git, dist): wzorce `API_KEY=["']`, `PASSWORD=["']`, `SECRET=["']`, `TOKEN=["']` z konkretną wartością |
| Walidacja inputu na backendzie | 15 | Szukaj: zod, yup, joi, pydantic, `Field(`, `validator`, `sanitize`. Min. 1 endpoint z walidacją |
| `docs/SECURITY.md` z treścią | 10 | Plik istnieje i ma >10 linii merytorycznych |
| CORS skonfigurowany | 10 | Szukaj: `cors`, `CORSMiddleware`, `Access-Control`, `allowedOrigins` |
| Security headers | 10 | Szukaj: `helmet`, `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy` w kodzie lub Caddyfile |
| Rate limiting | 10 | Szukaj: `rate-limit`, `rateLimit`, `throttle`, `limiter` |
| Testy security (negative cases) | 15 | Jak w Wymiarze 2 — jeśli obecne → 15 |

### Wymiar 4: Docs & Process (25%)

| Sprawdzenie | Max punkty | Jak liczyć |
|------------|-----------|------------|
| HANDOFF checkboxy `[x]` odpowiadają stanowi kodu | 25 | (checkboxy [x] / wszystkie checkboxy) × 25 |
| `docs/CHANGELOG.md` — wpisy per stage | 20 | (stages z wpisem / total stages) × 20 |
| `docs/API.md` — endpointy udokumentowane | 20 | >10 linii treści = 20, placeholder = 5, brak = 0 |
| `docs/README.md` — Quick Start obecny | 15 | Sekcja istnieje i nie jest placeholder = 15 |
| Git commity per stage | 10 | Widać commity stage'owe w `git log` = 10 |
| Git repo zainicjalizowane | 10 | `git status` działa = 10 |

### Końcowy score

```
HEALTH_SCORE = (Artefakty × 0.25) + (Testy × 0.25) + (Security × 0.25) + (Docs_Process × 0.25)
```

---

## 📋 Algorytm (liniowy, bez pętli)

1. **Określ fazę projektu** — na podstawie istniejących plików i HANDOFF.
2. **Oblicz każdy wymiar** — zgodnie z tabelami powyżej.
3. **Oblicz końcowy HEALTH_SCORE** — średnia ważona.
4. **Wylistuj TOP 5 problemów** — posortowane malejąco po wpływie na score (ile punktów zyskałby projekt gdyby problem został naprawiony).
5. **Wyświetl raport** — w formacie poniżej.

---

## 📊 Format raportu

```
═══════════════════════════════════════════════════
  PROJECT HEALTH SCORE
  Data: [YYYY-MM-DD]
  Projekt: [nazwa z PRD.md lub katalogu]
  Faza: [Phase X / Phase 3 Stage Y]
═══════════════════════════════════════════════════

  SCORE: [XX] / 100

  Artefakty:      [XX] / 100  ████████░░
  Testy:          [XX] / 100  ██████░░░░
  Security:       [XX] / 100  ████░░░░░░
  Docs & Process: [XX] / 100  █████████░

  ─── Szczegóły per wymiar ───

  Artefakty ([XX]/100):
  ✓ PRD.md — kompletny
  ✓ TECH_STACK.md — kompletny
  ✗ docs/API.md — brak pliku
  ...

  Testy ([XX]/100):
  [opis stanu testów]

  Security ([XX]/100):
  ✓ .env w .gitignore
  ✗ Brak rate limiting
  ...

  Docs & Process ([XX]/100):
  ✓ Git repo zainicjalizowane
  ✗ HANDOFF checkboxy: 5/20 (25%)
  ...

  ─── Top 5 do poprawy ───

  #  Problem                         Wpływ    Wymiar
  1. [opis]                          +[N] pkt  [wymiar]
  2. [opis]                          +[N] pkt  [wymiar]
  3. [opis]                          +[N] pkt  [wymiar]
  4. [opis]                          +[N] pkt  [wymiar]
  5. [opis]                          +[N] pkt  [wymiar]

  Napraw te 5 problemów → score wzrośnie do ~[estimated].

═══════════════════════════════════════════════════
```

**Progress bar:** 10 znaków. Każdy `█` = 10 punktów. Reszta = `░`.

---

## ⚠️ Edge cases

- **Brak git:** Zanotuj w raporcie (Docs & Process: -10 pkt). Kontynuuj bez git.
- **Brak testów (score = 0):** Wymiar Testy = 0. Zanotuj w Top 5.
- **Projekt w Phase 1-2 (brak kodu):** Licz score tylko z Artefaktów i Docs & Process (waga 50/50). Testy i Security = N/A.
- **Build się nie kompiluje:** Zanotuj, kontynuuj z analizą statyczną (nie uruchamiaj testów). Wymiar Testy: użyj analizy statycznej plików testowych.
- **HANDOFF nie ma struktury kursu:** Zanotuj brakujące sekcje w raporcie.
- **Checkbox `[x]` ale task nie ukończony w kodzie:** Zanotuj rozbieżność w raporcie.

---

## 🚀 Uruchomienie

Wklej do agenta AI w katalogu projektu:

```
Przeczytaj PROMPT_SCORE.md i oblicz score.
```

**Czas:** 1-3 minuty. **Wynik:** raport w terminalu — zero zmian w projekcie.

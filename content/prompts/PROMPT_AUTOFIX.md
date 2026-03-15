# PROMPT_AUTOFIX — Autonomiczny fixer projektu

**Prompt autonomiczny w stylu [autoresearch](https://github.com/karpathy/autoresearch).** Wklej go do agenta AI (Claude Code, Cursor, Windsurf itp.) w katalogu swojego projektu. Agent sam obliczy stan projektu, znajdzie problemy i naprawi je — commit po commicie — bez Twojej interwencji.

> Wzorzec: pętla modify → evaluate → keep/revert → repeat. Każdy fix to osobny commit — łatwy do przeglądu i cofnięcia.

---

Przeczytaj CAŁY ten plik, a następnie wykonaj pełną sesję autofix zgodnie z poniższymi instrukcjami.

## Kontekst — przeczytaj przed startem

Przeczytaj pliki w tym projekcie:
- `ARTIFACT_CHECKLIST.md` (kryteria akceptacji)
- `HANDOFF_STAGES_PLAN.md` (plan z checkboxami)
- `PRD.md` (wymagania)
- `TECH_STACK.md` (decyzje architektoniczne)

Jeśli którykolwiek z tych plików nie istnieje — **ZATRZYMAJ SIĘ** i poinformuj użytkownika:
> "Brakuje pliku [nazwa]. PROMPT_AUTOFIX wymaga kompletnej dokumentacji planistycznej. Uruchom najpierw AGENT_INIT_PROMPT.md do odpowiedniej fazy."

## Twoja rola

Jesteś autonomicznym **Project Health Fixerem**. Twoje zadanie:
1. Obliczyć Project Health Score (0-100)
2. Znaleźć najsłabszy punkt
3. Naprawić go (commit)
4. Zweryfikować, czy wynik się poprawił (keep/revert)
5. Powtarzać aż score >= 95 lub wyczerpiesz limit iteracji

**NIE pytasz użytkownika o zgodę na każdy fix.** Działasz autonomicznie. Użytkownik przegląda wynik (commity) po zakończeniu.

---

## 🔒 Pliki chronione (NEVER MODIFY)

Następujących plików **NIGDY nie modyfikujesz**:

- `PRD.md` — zatwierdzone wymagania użytkownika
- `TECH_STACK.md` — zatwierdzone decyzje architektoniczne
- `STACK_GUIDELINES.md` — zatwierdzone wytyczne
- `AGENT_INIT_PROMPT.md`, `ARTIFACT_CHECKLIST.md`, `VERIFICATION_PROMPT.md`, `PROMPT_HANDOFF_CHECK.md`, `PROMPT_AUTOFIX.md` — prompty kursu
- `.env` — sekrety użytkownika

Jeśli problem wymaga zmiany chronionego pliku — zapisz go w raporcie końcowym jako **"wymaga interwencji użytkownika"**.

## 🛡️ Safety Guards

1. **NIGDY nie usuwaj istniejących plików testowych** — możesz dodawać nowe lub naprawiać istniejące.
2. **NIGDY nie usuwaj funkcjonalności** — nie zmieniaj logiki biznesowej, nie usuwaj endpointów.
3. **Każdy fix = osobny commit** z komunikatem: `autofix: [wymiar] — [co naprawiono]`
4. **Przed sesją:** jeśli są niezacommitowane zmiany → `git add -A && git commit -m "autofix: save user work before autofix session"`
5. **Dozwolone operacje:**
   - DODAWANIE brakujących plików dokumentacji
   - UZUPEŁNIANIE brakujących sekcji w docs
   - NAPRAWIANIE broken testów (bez usuwania)
   - DODAWANIE brakujących testów (smoke, security negative cases)
   - DODAWANIE brakujących zabezpieczeń (walidacja, sanityzacja, headers)
   - AKTUALIZACJA checkboxów `[ ]` → `[x]` w HANDOFF (jeśli task jest faktycznie ukończony w kodzie)
   - DODAWANIE brakujących sekcji strukturalnych do HANDOFF (User Stories, Docs, Stage Completion — bez zmiany scope)
   - NAPRAWIANIE `.gitignore` (dodawanie brakujących wpisów)
   - TWORZENIE brakujących plików (`docs/API.md`, `docs/SECURITY.md` itp.)

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

## 🔄 Pętla naprawcza

### Preconditions

1. Sprawdź git — jeśli brak → `git init && git add -A && git commit -m "autofix: initial state"`
2. Jeśli niezacommitowane zmiany → `git add -A && git commit -m "autofix: save user work before autofix session"`
3. Oblicz **INITIAL_SCORE** — pełny raport per wymiar
4. Wyświetl raport początkowy

### Algorytm

```
iteration = 0
MAX_ITERATIONS = 20
MAX_NO_IMPROVEMENT = 3
no_improvement_count = 0

WHILE score < 95 AND iteration < MAX_ITERATIONS AND no_improvement_count < MAX_NO_IMPROVEMENT:

    iteration += 1

    1. NAJSŁABSZY WYMIAR (najniższy score; przy remisie priorytet: Security > Artefakty > Testy > Docs)

    2. ZNAJDŹ KONKRETNY FIXABLE ISSUE w tym wymiarze. Priorytet:
       a) Brakujący plik (duży wpływ, łatwy fix)
       b) Brakująca sekcja w istniejącym pliku
       c) Broken test do naprawienia
       d) Brakujący test do dodania
       e) Brakujące zabezpieczenie
       f) Checkbox do zaktualizowania (jeśli task ukończony w kodzie)

    3. WYKONAJ FIX — minimalna, skupiona zmiana (1 problem = 1 fix)

    4. COMMIT: git add -A && git commit -m "autofix: [wymiar] — [opis]"

    5. OBLICZ NOWY SCORE

    6. DECYZJA:
       - new_score > old_score → KEEP, no_improvement_count = 0
       - new_score <= old_score → git revert HEAD --no-edit, no_improvement_count += 1

    7. LOG: "Iteracja N: [fix] | Score: old → new | ✓ KEEP / ✗ REVERT"
```

### Kiedy NIE naprawiać

Jeśli problem wymaga:
- Zmiany chronionego pliku → zanotuj w REMAINING_ISSUES
- Uruchomienia serwera/bazy (brak runtime) → zanotuj
- Naprawy logiki biznesowej → zanotuj
- Tworzenia `.env` z sekretami → zanotuj
- Danych testowych z zewnętrznego API → zanotuj

Kontynuuj z kolejnym problemem.

---

## 📋 Raporty

### Raport początkowy

```
═══════════════════════════════════════════════════
  AUTOFIX — Raport początkowy
  Data: [YYYY-MM-DD]
  Projekt: [nazwa z PRD.md lub katalogu]
  Faza: [Phase X / Phase 3 Stage Y]
═══════════════════════════════════════════════════

  PROJECT HEALTH SCORE: [XX] / 100

  Artefakty:      [XX] / 100  ████████░░
  Testy:          [XX] / 100  ██████░░░░
  Security:       [XX] / 100  ████░░░░░░
  Docs & Process: [XX] / 100  █████████░

  [szczegóły per wymiar — co zdane, co nie]

  Plan: max [MAX_ITERATIONS] iteracji naprawczych
═══════════════════════════════════════════════════
```

### Log iteracji (na bieżąco)

```
--- Iteracja N / MAX ---
Wymiar: [nazwa] ([score])
Problem: [opis]
Fix: [co zrobiono]
Commit: [hash 7 znaków]
Score: [old] → [new] (+/-delta)
Status: ✓ KEEP / ✗ REVERT
```

### Raport końcowy

```
═══════════════════════════════════════════════════
  AUTOFIX — Raport końcowy
  Iteracji: [N] / [MAX]
  Powód: [score >= 95 / max iteracji / brak poprawy]
═══════════════════════════════════════════════════

  SCORE: [XX] → [YY] / 100  (+ZZ)

  Artefakty:      [XX] → [YY]  (Δ +/-ZZ)
  Testy:          [XX] → [YY]  (Δ +/-ZZ)
  Security:       [XX] → [YY]  (Δ +/-ZZ)
  Docs & Process: [XX] → [YY]  (Δ +/-ZZ)

  Wykonane fixy:
  1. ✓ [wymiar] — [opis] | score +N | commit: [hash]
  2. ✗ [wymiar] — [opis] | brak poprawy, cofnięto
  ...

  Pozostałe problemy (wymaga interwencji użytkownika):
  1. [opis + powód]

  Przegląd: git log --oneline
  Cofnij wszystko: git revert --no-edit HEAD~N..HEAD
═══════════════════════════════════════════════════
```

---

## ⚠️ Edge cases

- **Brak git:** Zainicjalizuj `git init && git add -A && git commit -m "autofix: initial commit"`. Kontynuuj.
- **Brak testów (score = 0):** Dodaj TYLKO smoke test (health endpoint) + 1 test security (niepoprawny input). To podniesie score do ~40-60.
- **Projekt w Phase 1-2 (brak kodu):** Licz score tylko z Artefaktów i Docs & Process (waga 50/50). Testy i Security = N/A.
- **Build się nie kompiluje:** Zanotuj, kontynuuj z analizą statyczną (nie uruchamiaj testów).
- **HANDOFF nie ma struktury kursu:** DODAJ brakujące sekcje (User Stories, Docs, Stage Completion) z pustymi checkboxami. To uzupełnienie struktury, nie zmiana scope.
- **Checkbox `[x]` ale task nie ukończony w kodzie:** NIE cofaj. Zanotuj rozbieżność w raporcie.

---

## 🚀 Uruchomienie

Wklej do agenta AI w katalogu projektu:

```
Przeczytaj PROMPT_AUTOFIX.md i wykonaj pełną sesję autofix.
```

**Czas:** 5-20 minut. **Po zakończeniu:** przejrzyj commity i zdecyduj czy zachować.

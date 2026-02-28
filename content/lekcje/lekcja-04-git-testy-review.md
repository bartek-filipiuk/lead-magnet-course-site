# Lekcja 4: Git, testy, przegląd kodu

**Subject line:** Git + testy + przegląd kodu — bez bólu [Lekcja 4/5]
**Preview text:** Twój kod w repo, przetestowany, po przeglądzie. Gotowy do deployu.

---

Hej!

Twoja apka działa lokalnie. Dzisiaj doprowadzimy kod do stanu, w którym możesz go spokojnie pokazać światu: będzie w repo, przetestowany i po przeglądzie.

Nie musisz być ekspertem od Gita, CI/CD ani testów. Pokażę Ci minimum, które wystarczy.

---

## Część 1: Git — Twoja siatka bezpieczeństwa

Jeśli już zrobiłeś `git init` i pierwszy commit w Lekcji 3 — świetnie. Jeśli nie — zaczynamy teraz.

### Podstawowy przepływ pracy

```bash
# 1. Zainicjuj repo (jeśli jeszcze nie)
git init
git add .
git commit -m "Stage 1: Minimal Working Installation"

# 2. Stwórz repo na GitHub
# Wejdź na github.com → New Repository → skopiuj URL

# 3. Połącz z GitHub
git remote add origin https://github.com/TWÓJ-USER/TWÓJ-PROJEKT.git
git push -u origin main
```

### Commituj po każdym stage'u

Zasada: **jeden stage = jeden commit** (minimum). Więcej commitów też OK.

```bash
# Po Stage 2:
git add .
git commit -m "Stage 2: Funkcja Habit CRUD"
git push

# Po Stage 3:
git add .
git commit -m "Stage 3: Funkcja śledzenia streaków"
git push
```

### Dlaczego to ważne

- **Backup.** Twój kod jest na GitHubie. Laptopowi może się coś stać.
- **Historia.** Możesz wrócić do dowolnego commita, jeśli coś popsujesz.
- **Portfolio.** Repo na GitHubie to Twoje CV. Rekruterzy patrzą.
- **Deploy.** Jutro będziemy deployować z GitHuba, więc repo naprawdę się przydaje.

### Czego NIE commitować

Stwórz plik `.gitignore` (AI pewnie już go stworzył):

```
node_modules/
__pycache__/
.env
*.pyc
.DS_Store
dist/
build/
```

**Nigdy nie commituj:** haseł, kluczy API, plików `.env`, danych osobowych.

---

## Część 2: Testy — minimum, które wystarczy

Nie będę Cię uczyć testowania pod 95% coverage. Ale jedna zasada jest twarda: **backend robimy przez TDD (Test -> Fail -> Kod -> Pass -> Refactor)**.

Na początek potrzebujesz trzech rzeczy:

### 1. Smoke test: "Czy apka się uruchamia?"

```bash
# Backend
docker-compose up -d
curl http://localhost:8000/api/health
# Powinno zwrócić: {"status": "ok"}

# Frontend
# Otwórz http://localhost:3000 w przeglądarce
# Czy strona się ładuje bez błędów?
```

Jeśli te dwie rzeczy działają — masz smoke test.

### 2. Happy path: "Czy główna funkcja działa?"

Przetestuj ręcznie główny flow aplikacji:

Dla habit trackera:
1. Otwórz apkę
2. Dodaj nowy nawyk ("Ćwiczenia")
3. Zaznacz nawyk jako wykonany
4. Odśwież stronę — czy nawyk nadal jest?
5. Sprawdź streak — czy się zmienił?

Jeśli to działa — Twój happy path jest OK.

### 3. TDD w praktyce (szczególnie backend)

Dla każdego nowego endpointu lub logiki backendowej:
1. Najpierw piszesz test, który failuje (Red)
2. Potem dopisujesz minimalny kod, który daje Green
3. Na końcu porządkujesz kod (Refactor)

To jest nasza stała zasada, nie opcja.

### 4. (Bonus) Proste testy automatyczne

Poproś AI:

```
"Dodaj podstawowe testy do backendu:
1. Test, czy /api/health zwraca 200
2. Test, czy POST /api/habits tworzy nawyk
3. Test, czy GET /api/habits zwraca listę nawyków

Użyj pytest (Python) / vitest (JS). Minimum kodu."
```

AI wygeneruje testy. Uruchom je:

```bash
# Python
pytest

# JavaScript
npm test
```

Zielono? Super. Czerwono? Napraw z pomocą AI.

---

## Część 3: Przegląd kodu AI

To ważny etap. AI pisze kod szybko, ale nie zawsze dobrze. Oto na co patrzeć:

## Mini-sekcja: Agent-friendly przegląd

Przegląd to nie tylko „czy działa”. To też pytanie: czy kolejna iteracja (Twoja lub agenta) będzie bezpieczna i przewidywalna?

Dlatego na etapie przeglądu sprawdzasz 4 rzeczy naraz:
- zgodność z PRD,
- twarde TDD (szczególnie backend),
- aktualność dokumentacji w `docs/*`,
- czytelność kodu pod kolejne zmiany.

### Checklista przeglądu kodu (5 minut)

**1. Bezpieczeństwo**
- [ ] Czy są hasła/klucze API wpisane na sztywno w kodzie? (powinny być w .env)
- [ ] Czy inputy użytkownika są walidowane? (np. max długość, dozwolone znaki)
- [ ] Czy są SQL injection / XSS podatności?

Poproś AI: *"Przejrzyj kod pod kątem bezpieczeństwa. Czy są sekrety wpisane na sztywno, brakujące walidacje albo podatności?"*

**2. Obsługa błędów**
- [ ] Co się stanie, jak backend nie odpowie? (fetch fail)
- [ ] Co się stanie, jak baza danych będzie niedostępna?
- [ ] Czy użytkownik widzi sensowny komunikat błędu?

**3. TDD evidence (szczególnie backend)**
- [ ] Czy dla nowych funkcji najpierw powstał test, który failował (Red)?
- [ ] Czy implementacja została dopisana dopiero po Red?
- [ ] Czy po zmianie testy są zielone (Green)?

**4. Czytelność i agent-friendliness**
- [ ] Czy nazwy zmiennych/funkcji mówią, co robią?
- [ ] Czy nie ma duplikacji kodu?
- [ ] Czy plik nie ma więcej niż ~200 linii?
- [ ] Czy kontrakty API i walidacje są jawne?

**5. Dokumentacja (`docs/*`)**
- [ ] Czy `docs/README.md` opisuje aktualny setup/run/test/deploy?
- [ ] Czy `docs/API.md` odzwierciedla faktyczne endpointy i błędy?
- [ ] Czy `docs/CHANGELOG.md` ma wpis z bieżącego stage/tasku?
- [ ] Czy dodatkowe pliki docs używane w projekcie (np. architektura, bezpieczeństwo, runbook) są aktualne?

**6. "Czy to robi to, co trzeba?"**
- [ ] Porównaj kod z checkboxami w HANDOFF_STAGES_PLAN.md
- [ ] Czy wszystkie kryteria akceptacji z PRD są spełnione?
- [ ] Czy nie ma funkcji, których NIE zamawialiśmy?

### Jak zrobić przegląd z AI

```
"Przejrzyj cały projekt pod kątem:
1. Bezpieczeństwa (sekrety wpisane na sztywno, walidacja inputów)
2. Obsługi błędów (co jeśli coś się nie uda?)
3. TDD evidence (czy było Red -> Green)
4. Dokumentacji (minimum: `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md` + inne pliki docs używane w projekcie)
5. Zgodności z PRD (czy spełnione są kryteria akceptacji?)

Wylistuj problemy z priorytetem: KRYTYCZNY / WAŻNY / DROBNY."
```

Napraw przynajmniej KRYTYCZNE i WAŻNE. DROBNE możesz zostawić na później.

---

## Podsumowanie: stan po Lekcji 4

Po dzisiejszych krokach masz:

```
[x] Kod w repozytorium na GitHub
[x] Historia commitów (jeden na stage)
[x] Smoke test przechodzi (apka się uruchamia)
[x] Happy path przechodzi (główny flow działa)
[x] Przegląd kodu zrobiony (brak krytycznych problemów)
[x] .gitignore skonfigurowany (brak sekretów w repo)
```

**To jest kod, który możesz wdrożyć.** Nie idealny i nie pokryty testami na 100%, ale działający, po przeglądzie i bezpieczny.

---

## Zadanie domowe

1. Upewnij się, że masz repo na GitHubie z aktualnym kodem
2. Uruchom smoke test (curl /api/health + otwórz frontend)
3. Przetestuj happy path (główny flow apki)
4. Zrób przegląd kodu z AI (prompt z Części 3)
5. Napraw znalezione problemy
6. Commituj i pushuj

**Ile czasu:** 30-45 minut.

---

## FAQ

### Czy naprawdę potrzebuję GitHuba już na tym etapie?
Tak, bo to jednocześnie backup, historia zmian i baza pod deploy. Nawet prosty projekt dużo zyskuje, gdy masz możliwość szybkiego powrotu do działającego commita. Brak repo zwykle kończy się chaosem przy pierwszej większej poprawce.

### Co zrobić, jeśli boję się komend Gita?
Trzymaj się minimum: `git add .`, `git commit -m "..."`, `git push`. Nie musisz znać zaawansowanych flow na start. Najważniejsze to commitować regularnie i opisywać, co faktycznie zmieniłeś.

### Ile testów to „wystarczająco” na tym poziomie?
Na start wystarczy smoke test, happy path i podstawowe testy backendu dla kluczowych endpointów. Celem nie jest 100% pokrycia, tylko pewność, że główny przepływ działa. Potem możesz dokładać testy wraz z rozwojem funkcji.

### Co jeśli testy raz przechodzą, a raz nie?
To znak niestabilnego środowiska albo testów zależnych od kolejności uruchamiania. Poproś AI o izolację testów i czyszczenie stanu między uruchomieniami. Niestabilnych testów nie ignoruj, bo dają fałszywe poczucie bezpieczeństwa.

### Jak odróżnić błąd krytyczny od drobnego w review?
Krytyczny to taki, który psuje bezpieczeństwo, dane lub podstawowe działanie funkcji. Ważny utrudnia użycie i może prowadzić do błędów później. Drobny to kosmetyka, którą możesz zaplanować na później.

### Czy review z AI wystarczy, czy muszę robić ręczny przegląd?
AI pomaga szybko znaleźć częste problemy, ale ręczny przegląd nadal jest potrzebny. Ty najlepiej wiesz, czy kod spełnia intencję z PRD i planu. Najlepszy efekt daje połączenie: AI checklista + Twoja końcowa decyzja.

### Kiedy robić commit: przed czy po review?
Najpierw domknij task, zrób szybki review i testy, a dopiero potem commit. Dzięki temu commit reprezentuje stabilny, sensowny krok. Jeśli commitujesz „w pół drogi”, trudniej wracać do dobrych punktów.

---

Jutro finał rdzenia kursu — Lekcja 5: **deploy na VPS w 30 minut**. Twoja apka będzie dostępna pod Twoją domeną, z HTTPS, za ~20 zł miesięcznie.

Do jutra!
Bartek

PS. Jeśli masz pytanie o Gita, testy albo przegląd kodu — pisz. Nie ma głupich pytań.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

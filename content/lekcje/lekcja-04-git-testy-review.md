# Lekcja 4: Git, testy, przegląd kodu

**Subject line:** Git + testy + przegląd kodu — bez bólu [Lekcja 4/5]
**Preview text:** Twój kod w repo, przetestowany, po przeglądzie. Gotowy do deployu.

---

Hej!

Twoja apka działa lokalnie. Dzisiaj doprowadzamy kod do stanu, w którym spokojnie pokażesz go światu: w repozytorium, przetestowany i po przeglądzie.

Trzy filary dzisiejszej lekcji:
- **Git** — siatka bezpieczeństwa (backup, historia, baza pod deploy)
- **Testy** — weryfikacja, że apka robi to, co ma
- **Przegląd kodu** — upewnienie się, że nic nie wybucha

---

## Czym jest Git i dlaczego go potrzebujesz

Git to system kontroli wersji. **Git to "save game" w grze.** Zapisujesz stan projektu, a potem możesz wrócić do dowolnego momentu.

Trzy powody, dla których Git jest obowiązkowy:
1. **Backup.** Twój kod jest na serwerze. Jak laptop padnie — nic nie tracisz.
2. **Historia zmian.** Zepsułeś coś? Wracasz do poprzedniej wersji jedną komendą.
3. **Baza pod deploy.** Jutro w Lekcji 5 wrzucisz kod na serwer prosto z GitHuba.

A GitHub? To magazyn w chmurze + portfolio. Rekruterzy patrzą na GitHuba. Klienci patrzą na GitHuba. Twoje repo to Twoje CV.

Nie musisz rozumieć Gita głęboko. Pokażę Ci 5 komend, które wystarczą.

---

## Instalacja i konfiguracja Gita

Jeśli masz już Gita — przeskocz do następnej sekcji.

Jeśli nie — wklej ten prompt do AI (Claude Code, Codex, Cursor itp. agent):

```
Pomóż mi zainstalować i skonfigurować Gita na moim komputerze.

Mój system operacyjny: [Windows / macOS / Linux]

Potrzebuję:
1. Sprawdzenie czy Git jest już zainstalowany (git --version)
2. Jeżeli nie — instrukcja instalacji dla mojego systemu
3. Konfiguracja użytkownika:
   - git config --global user.name "Moje Imie" (zapytaj o imię użytkownika)
   - git config --global user.email "moj@email.com" (zapytaj o email użytkownika)
4. Wygenerowanie klucza SSH (ssh-keygen -t ed25519)
5. Instrukcja jak dodać klucz publiczny do GitHuba
6. Test połączenia (ssh -T git@github.com)

Podawaj komendy krok po kroku, z wyjaśnieniem co każda robi.
Czekaj na moje potwierdzenie po każdym kroku.
```

> Prompt do pobrania: [PROMPT_GIT_SETUP.md](https://vibe.devince.dev/prompts/PROMPT_GIT_SETUP.md)

Ten krok robisz raz. Potem Git po prostu działa.

Jeśli nie masz konta na GitHubie — załóż na github.com (darmowe). Link zapasowy do instalacji Gita: git-scm.com/download

---

## Git w praktyce — 5 komend na start

Oto cały Twój przepływ pracy z Gitem:

| Komenda | Co robi |
|---------|---------|
| `git init` | Tworzy nowe repo w katalogu |
| `git add .` | Dodaje wszystkie zmiany do "poczekalni" |
| `git commit -m "opis"` | Zapisuje zmiany z opisem |
| `git push` | Wysyła na GitHuba |
| `git status` | Pokazuje co się zmieniło (bez zmieniania czegokolwiek) |

`git status` jest Twoim przyjacielem. Kiedy nie wiesz co się dzieje — odpal `git status`.

### Podstawowy przepływ

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

### Zasada: jeden stage = jeden commit (minimum)

```bash
# Po Stage 2:
git add .
git commit -m "Stage 2: Funkcja Habit CRUD"
git push

# Po Stage 3:
git add .
git commit -m "Stage 3: Śledzenie streaków"
git push
```

Więcej commitów też OK. Minimum — po każdym stage'u.

### Czego NIE commitować

AI pewnie już stworzył plik `.gitignore` w Twoim projekcie. Jeśli nie — poproś go:

```
Wygeneruj plik .gitignore dla mojego projektu.
Kontekst technologiczny znajdziesz w TECH_STACK.md.
```

Zasada numer jeden: **nigdy nie commituj sekretów** — haseł, kluczy API, plików `.env`, danych osobowych. Jak coś takiego wyląduje na GitHubie — uważaj to za wyciek.

### Dlaczego to ważne

- **Backup.** Twój kod jest na GitHubie. Laptopowi może się coś stać.
- **Historia.** Możesz wrócić do dowolnego commita, jeśli coś popsujesz.
- **Portfolio.** Repo na GitHubie to Twoje CV.
- **Deploy.** Jutro będziemy deployować z GitHuba.

---

## Testy — minimum, które wystarczy

W Lekcji 3 poznałeś TDD — pisanie testów PRZED kodem. TDD pomaga PODCZAS budowy. Testy tutaj to WERYFIKACJA po budowie: upewnij się, że całość naprawdę działa, zanim pokażesz ją światu.

Trzy poziomy testów na start:

### 1. Smoke test (2 minuty)

Smoke test = "czy apka się uruchamia i odpowiada?"

```bash
# Backend
docker-compose up -d
curl http://localhost:<PORT>/api/health
# Powinno zwrócić: {"status": "ok"}

# Frontend
# Otwórz http://localhost:<PORT> w przeglądarce
# Czy strona się ładuje bez błędów?
```

> Porty dostosuj do swojego projektu — sprawdź w `docker-compose.yml`.

Jeśli te dwie rzeczy działają — smoke test przeszedł. Jeśli nie — wklej błąd do AI. Napraw zanim idziesz dalej.

### 2. Happy path (5 minut)

Happy path = testowanie głównego scenariusza z PRD, bez edge case'ów. Otwórz PRD.md i przetestuj ręcznie główny flow Twojej apki.

Przykład (habit tracker):
1. Otwórz apkę
2. Dodaj nowy nawyk ("Ćwiczenia")
3. Zaznacz nawyk jako wykonany
4. Odśwież stronę — czy nawyk nadal jest?
5. Sprawdź streak — czy się zmienił?

Dla Twojej apki przetestuj analogiczny flow — ten najważniejszy scenariusz z PRD. Jeśli działa — happy path jest OK.

### 3. Testy automatyczne z AI (10 minut)

Testy automatyczne sprawdzają za Ciebie po każdej zmianie. Nie musisz ich pisać sam — poproś AI:

```
Dodaj podstawowe testy do mojego projektu:
1. Test, czy health endpoint zwraca 200
2. Testy głównych endpointów/funkcji opisanych w PRD.md

Kontekst technologiczny (framework, narzędzia testowe) znajdziesz w TECH_STACK.md.
Minimum kodu, maksimum pokrycia kluczowych ścieżek.
```

AI wygeneruje testy. Uruchom je:

```bash
# Komenda zależy od stacku — sprawdź w TECH_STACK.md
# Przykłady: pytest, npm test, pnpm test, go test ./...
```

Zielono? Super. Czerwono? Wklej błąd do AI i napraw.

---

## Szybki przegląd kodu z AI

AI pisze kod szybko, ale nie zawsze dobrze. Zanim wypchniesz na GitHuba, zrób szybki przegląd. Nie potrzebujesz 20-punktowej checklisty — wystarczą 3 priorytety:

### 1. Bezpieczeństwo (napraw teraz)
- Czy są hasła/klucze API wpisane na sztywno w kodzie?
- Czy inputy użytkownika są walidowane?
- Czy coś wygląda na SQL injection / XSS?

### 2. Działanie (napraw przed deployem)
- Czy kod robi to, co wg PRD powinien?
- Co się stanie, jak coś się nie uda (fetch fail, baza niedostępna)?

### 3. Porządek (fajne, ale nie blokuje)
- Czy nazwy zmiennych mówią, co robią?
- Czy nie ma duplikacji kodu?

### Prompt do przeglądu z AI

```
Przejrzyj cały projekt pod kątem:
1. Bezpieczeństwa (sekrety w kodzie, brak walidacji, podatności)
2. Działania (czy kod spełnia wymagania z PRD.md?)
3. Porządku (czytelność, obsługa błędów, duplikacja)

Wylistuj problemy z priorytetem:
- KRYTYCZNY (napraw teraz)
- WAŻNY (napraw przed deployem)
- DROBNY (możesz zostawić na później)
```

> Prompt do pobrania: [PROMPT_CODE_REVIEW.md](https://vibe.devince.dev/prompts/PROMPT_CODE_REVIEW.md)

Napraw przynajmniej KRYTYCZNE i WAŻNE. DROBNE zostawisz na później.

---

## Podsumowanie: stan po Lekcji 4

Po dzisiejszych krokach masz:

- [x] Kod w repozytorium na GitHub
- [x] Historia commitów (jeden na stage)
- [x] Smoke test przechodzi (apka się uruchamia)
- [x] Happy path przechodzi (główny flow działa)
- [x] Przegląd kodu zrobiony (brak krytycznych problemów)
- [x] .gitignore skonfigurowany (brak sekretów w repo)

To jest kod, który możesz wdrożyć. Nie idealny, nie pokryty testami na 100%, ale działający, po przeglądzie i bezpieczny.

---

## Zadanie domowe

1. Zainstaluj/skonfiguruj Gita (prompt z sekcji "Instalacja")
2. Stwórz repo na GitHubie i wypchnij kod
3. Smoke test + happy path
4. Przegląd kodu z AI (prompt z sekcji "Przegląd")
5. Napraw krytyczne problemy, commituj i pushuj

**Ile czasu:** 30-45 minut.

---

## FAQ

### Czy naprawdę potrzebuję GitHuba już na tym etapie?
Tak. To jednocześnie backup, historia zmian i baza pod deploy. Nawet prosty projekt dużo zyskuje, gdy masz możliwość szybkiego powrotu do działającego commita. Brak repo kończy się chaosem przy pierwszej większej poprawce.

### Co zrobić, jeśli boję się komend Gita?
Trzymaj się minimum: `git add .`, `git commit -m "..."`, `git push`. Nie musisz znać zaawansowanych flow na start. Commituj regularnie i opisuj, co zmieniłeś.

### Ile testów to "wystarczająco"?
Na start: smoke test, happy path i podstawowe testy backendu. Celem nie jest 100% pokrycia, tylko pewność, że główny przepływ działa. Testy dokładasz razem z rozwojem funkcji.

### Jak odróżnić błąd krytyczny od drobnego?
Krytyczny psuje bezpieczeństwo, dane lub podstawowe działanie. Ważny utrudnia użycie lub prowadzi do błędów później. Drobny to kosmetyka — zajmij się tym w wolnej chwili.

### Kiedy robić commit: przed czy po review?
Po. Najpierw domknij task, zrób szybki review i testy, a dopiero potem commit. Dzięki temu każdy commit to stabilny, sensowny krok.

### Nie mam Gita. Czy to konieczne?
Tak. Bez repo nie zrobisz deployu w Lekcji 5, nie masz backupu, nie masz historii. Prompt z sekcji "Instalacja" pomoże zainstalować w 5 minut.

### Czy mogę użyć GitLab/Bitbucket zamiast GitHuba?
Tak. Komendy Gita są identyczne. Różni się tylko adres remote. Prompt do konfiguracji działa tak samo.

---

Jutro finał rdzenia kursu — Lekcja 5: **deploy na VPS w 30 minut**. Twoja apka będzie dostępna pod Twoją domeną, z HTTPS, za ~20 zł miesięcznie.

Do jutra!
Bartek

PS. Jeśli masz pytanie o Gita, testy albo przegląd kodu — pisz. Nie ma głupich pytań.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

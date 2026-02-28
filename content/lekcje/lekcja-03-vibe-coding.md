# Lekcja 3: Vibe coding — budowanie z AI

**Subject line:** Vibe coding: budujesz apkę, AI pisze kod [Lekcja 3/5]
**Preview text:** Stage 1 gotowy w 30 minut. Jak kodować z AI i utrzymać porządek w projekcie.

---

Hej!

Masz PRD, tech stack i plan z checkboxami. Dzisiaj otwierasz edytor i **zaczynasz budować**.

Ale nie sam. Z AI jako Twoim koderem a ty nadrorujesz czy agent idzie w dobrym kierunku.

---

## Co to jest "vibe coding"?

Termin ukuł Andrej Karpathy (współzałożyciel OpenAI). Chodzi o to, że **opisujesz, co chcesz, a AI pisze kod**. Ty nawigujesz, AI koduje.

Brzmi jak magia? Czasem tak. Ale są też pułapki. Pokażę Ci, jak pracować tak, żeby nie tracić czasu na poprawki.

---

## Narzędzia

Masz dwa główne podejścia/środowiska:

**1. Claude Code (terminal), Codex, OpenCode i inne cli**
- Działa w terminalu — dajesz polecenia, AI modyfikuje pliki
- Widzi cały projekt, może uruchamiać komendy
- Najlepszy do backendów, setupów, devops
- Koszt: ~$20/mies do 200$

**2. Cursor / Windsurf (IDE)**
- Edytor kodu z wbudowanym AI
- Podświetla kod, sugeruje zmiany inline
- Najlepszy do frontendu, drobnych zmian
- Cursor/Windsurf: darmowy tier + $20/mies pro

Na początek wystarczy jedno z nich. Ja używam Claude Code do większości pracy.

---

## Jak zacząć: Stage 1

Otwórz terminal w katalogu projektu. Wklej do Claude Code (lub analogicznie do Cursor):

```
Przeczytaj pliki PRD.md, TECH_STACK.md i HANDOFF_STAGES_PLAN.md.
Wykonaj Stage 1: Minimal Working Installation.
Pracuj task po tasku, odhaczaj checkboxy w HANDOFF_STAGES_PLAN.md
po ukończeniu każdego taska.
Stosuj TDD (Test -> Fail -> Kod -> Pass), szczególnie w backendzie.
Po każdym tasku aktualizuj docs: minimum docs/README.md, docs/API.md,
docs/CHANGELOG.md oraz inne pliki adekwatne do zmian.
```

AI powinno:
1. Stworzyć strukturę katalogów
2. Zainicjować backend (np. FastAPI z /api/health)
3. Zainicjować frontend (np. React z fetchem do API)
4. Stworzyć Dockerfiles i docker-compose
5. Zweryfikować, że wszystko działa end-to-end

**Czas: 15-30 minut.**

---

## 5 zasad vibe codingu (żeby utrzymać porządek w projekcie)

### 1. Dawaj kontekst, nie komendy

```
ŹLE: "Dodaj endpoint POST /api/habits"

DOBRZE: "Według HANDOFF_STAGES_PLAN.md, Task 2.1 wymaga
endpointu POST /api/habits. Przeczytaj PRD sekcję User Stories
i zaimplementuj walidację zgodnie z kryteriami akceptacji."
```

Im lepszy kontekst, tym zwykle lepszy kod. Gdy AI rozumie DLACZEGO coś robi, łatwiej trzyma kierunek — np. doda limit długości nazwy, jeśli to wynika z PRD.

### 2. Pracuj stage po stage'u

Nie mów AI "zrób całą apkę". Pracuj stage po stage'u, task po tasku. Po każdym stage'u — sprawdź, czy działa, po prostu zapytaj agenta aby odpalił i dał Ci namiary na apkę.

```
"Wykonaj Stage 2, Task 2.1: Backend - Habits API.
Po ukończeniu pokaż mi, co zrobiłeś i czekaj na mój przegląd."
```

### 3. Przeglądaj kod — nie akceptuj ślepo

Po każdym tasku przejrzyj wygenerowany kod. Na co patrzeć:

- **Czy robi to, co trzeba?** Porównaj z checkboxami w planie.
- **Czy nie ma wartości wpisanych na sztywno?** (np. URL do API, hasła)
- **Czy obsługuje błędy?** (co jeśli fetch się nie uda?)
- **Czy jest czytelny?** Jeśli nie rozumiesz kodu — poproś AI o wyjaśnienie.

```
"Wyjaśnij mi tę funkcję — co robi każda linia?"
```

Nie musisz rozumieć każdej linijki, ale warto rozumieć, **co robi każda funkcja**.

TIP: możesz poprosić agenta AI o przejrzenie wygenerowanego kodu w danym stage pod kątem security, zgodności z planem itp.

### 4. Testuj na bieżąco

Po każdym stage'u:
- Uruchom aplikację
- Otwórz w przeglądarce
- Przetestuj ręcznie — czy działa to, co miało działać?
- Sprawdź konsolę przeglądarki (F12) — czy nie ma błędów?

Nie czekaj do końca. Błąd znaleziony po 30 minutach naprawiasz w 5 minut. Błąd znaleziony po 3 dniach naprawiasz pół dnia.

W tym kursie dokładamy jedną twardą zasadę: **najpierw test, potem kod**. Szczególnie backend powinien iść cyklem: **Test -> Fail -> Kod -> Pass**.

### 5. Commituj po każdym stage'u

```
"Zrób git commit z opisem, co zostało zrobione w tym stage'u."
```

Jeśli coś się zepsuje — możesz wrócić do ostatniego działającego commita.

---

## Mini-sekcja: Agent-friendly coding loop

Żeby agent kodujący dowoził jakość w każdym stage'u, pracuj zawsze jedną pętlą:

1. Kontekst (PRD + plan + konkretny task)
2. Test (Red)
3. Implementacja (Green)
4. Refactor
5. Aktualizacja docs w `docs/*`
6. Krótki przegląd + commit

To zmniejsza ryzyko halucynacji i zostawia projekt w stanie czytelnym dla kolejnych iteracji.

### Gotowe prompty do tej pętli

```
"Wykonaj tylko Task 2.1 zgodnie z HANDOFF_STAGES_PLAN.md.
Najpierw napisz test i pokaż, że failuje (Red).
Potem zaimplementuj minimalny kod, żeby test przeszedł (Green).
Na końcu zaktualizuj minimum docs/README.md, docs/API.md,
docs/CHANGELOG.md oraz inne pliki docs adekwatne do zmian
i pokaż mi podsumowanie zmian."
```

```
"Backend ma iść twardo w TDD.
Nie pisz kodu produkcyjnego, dopóki nie pokażesz testu, który nie przechodzi."
```

```
"Zanim zamkniesz task, sprawdź stage gate:
1) testy zielone,
2) funkcja działa,
3) docs w docs/* zaktualizowane."
```

---

## Typowe problemy i rozwiązania

### "AI wygenerowało kod, który nie działa"

Skopiuj błąd i wklej do AI:

```
"Dostałem ten błąd: [WKLEJ BŁĄD]. Napraw to."
```

AI często dobrze naprawia błędy — zwłaszcza gdy widzi pełny stack trace.

### "AI chce użyć innej technologii, niż w planie"

```
"Zostańmy przy technologiach z TECH_STACK.md.
Użyj [X] zamiast [Y]."
```

Ty jesteś szefem. AI jest asystentem. Ty decydujesz.

### "AI zrobiło za dużo / za mało"

```
"Za dużo: Cofnij ostatnie zmiany. Zrób TYLKO Task 2.1,
nic więcej."

"Za mało: Task 2.1 wymaga jeszcze walidacji danych.
Dodaj walidację zgodnie z PRD."
```

### "Nie rozumiem wygenerowanego kodu"

```
"Wyjaśnij mi ten plik linia po linii.
Dlaczego użyto [X] zamiast [Y]?"
```

Pytaj, dopóki kod nie będzie dla Ciebie jasny. Zrozumienie kodu jest ważniejsze niż szybkie domknięcie taska.

---

## Przykład sesji (habit tracker)

```
Ty: "Przeczytaj PRD.md, TECH_STACK.md, HANDOFF_STAGES_PLAN.md.
     Wykonaj Stage 1."

AI: [tworzy strukturę, FastAPI, React, Docker]
    "Stage 1 gotowy. docker-compose up uruchamia apkę
     na localhost:3000."

Ty: [testujesz w przeglądarce — działa!]
    "Świetnie. Commituj i przejdź do Stage 2, Task 2.1."

AI: [tworzy model Habit, endpoint POST /api/habits,
     testy, walidacje]
    "Task 2.1 gotowy. Endpoint przyjmuje name i frequency."

Ty: [patrzysz na kod] "Brakuje limitu długości nazwy.
     Dodaj max 100 znaków."

AI: [dodaje walidację]
    "Dodano. Chcesz przejść do Task 2.2?"

Ty: "Tak, ale najpierw commituj Task 2.1."
```

Widzisz schemat? **Ty nawigujesz, AI koduje, Ty weryfikujesz.**

---

## Zadanie domowe

1. Wybierz narzędzie: Claude Code, Cursor, lub Windsurf
2. Otwórz projekt z plikami PRD, Tech Stack, Plan
3. Wykonaj Stage 1: Minimal Working Installation
4. Przetestuj — czy apka się uruchamia?
5. Zrób `git init` i pierwszy commit

**Ile czasu:** 30-60 minut.

Po dzisiejszej lekcji masz **działającą, choć prostą aplikację**. Frontend rozmawia z backendem i to jest solidna baza pod kolejne funkcje.

---

## FAQ

### Które narzędzie wybrać na start: Claude Code, Codex, Cursor czy Windsurf?
Wybierz jedno i zostań przy nim przez pierwsze 1-2 stage’e. Najważniejsze jest utrzymanie rytmu pracy, a nie ciągłe przeskakiwanie między narzędziami. Jeśli robisz więcej backendu i setupu, zwykle wygodniej zacząć od CLI.

### Jak napisać dobry prompt, żeby AI nie odjechało?
Odwołaj się do konkretnego taska z planu i dokumentów (`PRD.md`, `TECH_STACK.md`, `HANDOFF_STAGES_PLAN.md`). Dodaj zakres: "zrób tylko Task 2.1" i poproś o podsumowanie po wykonaniu. Im jaśniejsza granica, tym mniejsze ryzyko chaosu.

### Co zrobić, gdy AI wygeneruje za dużo zmian naraz?
Zatrzymaj pracę i poproś o cofnięcie ostatniego kroku, a potem realizację tylko jednego taska. Najlepiej pracować w małych porcjach: task -> test -> przegląd -> commit. To ogranicza koszt poprawek.

### Czy naprawdę muszę robić TDD, skoro dopiero się uczę?
Tak, szczególnie na backendzie. TDD wymusza jasny cel i szybciej pokazuje, czy funkcja działa. Dla początkującej osoby to prosty sposób, żeby nie zgadywać, czy kod jest poprawny.

### Nie rozumiem części kodu od AI — co wtedy?
Poproś model o wyjaśnienie funkcji własnymi słowami i o przykład wejścia/wyjścia. Jeśli nadal niejasne, poproś o uproszczenie implementacji. Zrozumienie kierunku jest ważniejsze niż „sprytny” kod.

### Kiedy commitować: po tasku czy po całym stage’u?
Minimum po każdym stage’u, a najlepiej po każdym domkniętym tasku. Dzięki temu łatwo wrócisz do stabilnego miejsca, gdy kolejna zmiana coś popsuje.

### Co jeśli aplikacja działa lokalnie, ale testy nie przechodzą?
Traktuj to jako sygnał, że implementacja jest niepełna albo niestabilna. Najpierw napraw testy i dopiero wtedy idź dalej. Inaczej dług techniczny zacznie rosnąć już od początku.

---

Jutro w Lekcji 4: przepływ pracy w Git, testy i przegląd kodu — czyli jak upewnić się, że Twój kod jest gotowy do pokazania światu.

Do jutra!
Bartek

PS. Jeśli utknąłeś na Stage 1 — opisz problem w odpowiedzi na ten email. Pomogę.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

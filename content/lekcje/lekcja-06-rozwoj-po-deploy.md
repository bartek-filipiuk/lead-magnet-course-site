# Lekcja 6 (Bonus): Jak rozwijać apkę po deployu w uporządkowany sposób

**Subject line:** Bonus: Jak rozwijać apkę po deployu (w uporządkowany sposób)
**Preview text:** Deploy to dopiero start. Jak dodawać funkcje, trzymać jakość i utrzymać porządek w projekcie.

---

Hej!

Twoja aplikacja już działa pod domeną. Super.

Teraz zaczyna się etap, który odróżnia „jednorazowy projekt” od produktu: **świadomy rozwój po MVP**.

W tym bonusie dostajesz prosty schemat, jak dodawać nowe funkcje i utrzymać jakość projektu.

---

## Zasada główna: każdą nową funkcję traktuj jak mini-projekt

Nie dopisuj funkcji „na szybko” bez planu.

Dla każdej nowej funkcji przechodzisz mini-cykl:

1. Priorytet (czy warto to robić teraz?)
2. Mini-spec (co i jak ma działać?)
3. Plan etapu (jak to podzielić na taski?)
4. Implementacja z TDD
5. Aktualizacja dokumentacji (`docs/*`)
6. Przegląd + wdrożenie + monitoring

To samo podejście, które doprowadziło Cię do deployu, działa dalej.

---

## Krok 1: Wybierz kolejną funkcję (impact vs effort)

Zrób listę 5-10 pomysłów i oceń każdy z nich w 2 wymiarach:

- **Impact:** jak bardzo pomoże użytkownikowi / biznesowi?
- **Effort:** ile kosztuje implementacja i utrzymanie?

Najpierw rób rzeczy **wysoki impact + niski/średni effort**.

Przykład (habit tracker):
- Wysoki impact, niski effort: przypomnienie o nawyku emailem
- Niski impact, wysoki effort: animowany dashboard ze statystykami premium

---

## Gotowy prompt: audyt aplikacji i propozycje rozwoju

Jeśli chcesz zobaczyć pełny przekrój możliwości (a nie tylko 2-3 oczywiste pomysły), użyj tego promptu:

```text
Przejrzyj cały projekt i zrób audyt rozwoju aplikacji.

Kontekst do analizy:
- kod aplikacji (frontend, backend, testy, konfiguracja)
- dokumentacja (`docs/*`, minimum: `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md`)
- inne pliki projektowe (`PRD.md`, `TECH_STACK.md`, `HANDOFF_STAGES_PLAN.md`, root `README.md`)

Cel:
Chcę dostać szeroką listę potencjalnych usprawnień i nowych funkcji,
z oceną biznesową i techniczną, żebym sam mógł wybrać kierunek.

Wynik podaj w 5 częściach:

1) Szybka diagnoza stanu aplikacji (ocena 1-10 + krótki komentarz):
- wartość dla użytkownika
- UX
- jakość kodu i łatwość utrzymania
- bezpieczeństwo
- testy i dyscyplina TDD
- jakość dokumentacji
- gotowość do skalowania

2) Lista min. 12 propozycji (różne kategorie):
- szybkie usprawnienia (niski koszt, szybki efekt)
- funkcje produktowe
- jakość i techniczne usprawnienia
- bezpieczeństwo i niezawodność
- doświadczenie deweloperskie i dokumentacja

3) Dla każdej propozycji podaj tabelę:
- Nazwa propozycji
- Kategoria
- Problem, który rozwiązuje
- Potencjał biznesowy (1-10)
- Przydatność dla użytkownika (1-10)
- Effort techniczny (1-10)
- Ryzyko wdrożenia (1-10)
- Rekomendowany priorytet (High/Medium/Low)
- Uzasadnienie (2-3 zdania)

4) Zaproponuj 3 warianty planu rozwoju:
- Wariant A: konserwatywny (szybkie wygrane)
- Wariant B: zrównoważony
- Wariant C: ambitny (większe zmiany)

5) Na koniec wskaż 5 najlepszych rekomendacji „na teraz”
i dla każdej dopisz pierwszy konkretny task do HANDOFF_STAGES_PLAN.md
zgodnie z TDD i aktualizacją docs.

Pisz po polsku, konkretnie, bez lania wody.
```

Dzięki temu nie dostajesz jednej sugestii „na czuja”, tylko pełną mapę opcji z oceną i priorytetami.

---

## Krok 2: Napisz mini-spec funkcji

Nie potrzebujesz nowego wielkiego PRD. Wystarczy 1 krótki dokument funkcji (10-20 linijek):

```markdown
# Spec funkcji: Mail przypominający

## Cel
Użytkownik dostaje przypomnienie, jeśli nie odhaczył nawyku do 20:00.

## Zakres IN
- Konfiguracja godziny przypomnienia
- Jedno przypomnienie dziennie

## Zakres OUT
- Powiadomienia push
- Zaawansowane reguły segmentacji

## Akceptacja
- [ ] Można ustawić godzinę przypomnienia
- [ ] O 20:00 wysyła się email
- [ ] Dla dnia z odhaczonym nawykiem email się nie wysyła
```

To już wystarczy, żeby agent wiedział, co budować.

---

## Krok 3: Dopisz nowy stage do planu

W `HANDOFF_STAGES_PLAN.md` dodaj kolejny stage dla tej funkcji.

Pamiętaj o zasadzie: **jeden stage = jedna kompletna funkcja (backend + frontend + testy + docs)**.

Przykład:

```markdown
## Stage 6: Funkcja maila przypominającego

- [ ] Task 6.1: Backend - harmonogram i endpoint konfiguracji
- [ ] Task 6.2: Frontend - formularz ustawień przypomnienia
- [ ] Task 6.3: Integracja i test end-to-end
- [ ] Task 6.4: Dokumentacja (minimum: `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md` + inne pliki docs adekwatne do zmian)
```

---

## Krok 4: Implementacja tylko przez TDD (szczególnie backend)

Tu warto trzymać się prostej sekwencji.

Dla backendu obowiązuje twarda sekwencja:

1. **Test (Red)** — piszesz test i potwierdzasz, że failuje
2. **Kod (Green)** — dopisujesz minimalny kod, żeby test przeszedł
3. **Refactor** — upraszczasz bez zmiany zachowania

Jeśli agent próbuje pisać kod bez Red testu, zatrzymujesz go i wracasz do kroku 1.

Gotowy prompt:

```
"Wykonaj Task 6.1 w twardym TDD.
Najpierw napisz test i pokaż fail (Red),
potem dopisz minimalną implementację (Green),
a na końcu zaproponuj refactor."
```

---

## Krok 5: Domknij stage aktualizacją docs

Każdy stage kończy się aktualizacją:

- minimum: `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md`
- plus: dodatkowe pliki docs adekwatne do zmian (np. `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/RUNBOOK.md`)

Bez aktualizacji docs stage nie jest domknięty.

---

## Krok 6: Bezpieczny deploy i rollback

Po przeglądzie robisz standard:

```bash
git add .
git commit -m "Stage 6: Funkcja maila przypominającego"
git push
```

Na VPS:

```bash
git pull
docker compose up -d --build
```

I zawsze miej plan awaryjny:
- ostatni stabilny commit,
- szybki rollback,
- sprawdzenie logów po wdrożeniu.

---

## Krok 7: Monitoring minimum

Nie potrzebujesz od razu rozbudowanego observability stacka.

Na początek wystarczy:
- logi aplikacji (`docker compose logs`),
- 1-2 kluczowe metryki (np. liczba błędów API, liczba aktywnych użytkowników),
- szybka checklista po deployu (health endpoint + happy path).

---

## Plan 3/6/9 dni po MVP

- **0-3 dni:** 1-2 funkcje o największym wpływie, szybkie poprawki UX
- **3-6 dni:** stabilizacja, porządki w architekturze, mniej długu technicznego
- **6-9 dni:** większa funkcja lub monetyzacja (w zależności od celu projektu)

Zasada: małe iteracje > wielki rewrite.

---

## Co masz po tym bonusie

Po wdrożeniu tego podejścia masz:

```text
[x] Jasny sposób wyboru kolejnych funkcji
[x] Proces dodawania funkcji w uporządkowany sposób
[x] Twarde TDD (backend) w każdej iteracji
[x] Dokumentację aktualną po każdym stage'u
[x] Bezpieczny cykl: przegląd -> wdrożenie -> monitoring
```

To moment, w którym projekt zaczyna działać dłużej niż pierwszy sprint.

---

## Zadanie domowe

1. Wybierz 1 kolejną funkcję metodą impact/effort
2. Napisz mini-spec (IN/OUT + kryteria akceptacji)
3. Dopisz nowy stage do `HANDOFF_STAGES_PLAN.md`
4. Zrób pierwszy task przez TDD (Red -> Green -> Refactor)
5. Zaktualizuj minimum (`docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md`) oraz inne pliki docs adekwatne do zmian
6. Wdróż i sprawdź logi

**Ile czasu:** 45-90 minut.

---

## FAQ

### Jak wybrać „następną funkcję”, żeby nie wpaść w chaos?
Najpierw oceń pomysł w dwóch osiach: wpływ na użytkownika (impact) i koszt wdrożenia (effort). Na start wybieraj rzeczy o wysokim impact i niskim/średnim effort. To daje szybki efekt bez przepalania tygodnia pracy.

### Czy po deployu naprawdę muszę dalej prowadzić dokumentację?
Tak, bo przy kolejnych zmianach to dokumentacja trzyma porządek między Tobą a agentem AI. Minimum to `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md` po każdym stage’u. Bez tego szybko tracisz kontrolę nad tym, co działa i dlaczego.

### Co jeśli nie mam pewności, czy robić refactor, czy iść dalej z funkcjami?
Jeśli kod utrudnia dodanie kolejnej funkcji, zrób mały refactor od razu po Green. Jeśli nie blokuje postępu, zapisz to jako osobny task techniczny i jedź dalej. Klucz to małe, świadome kroki zamiast dużych przepisek.

### Czy każdą nową funkcję muszę robić przez TDD?
Na backendzie — tak, to najlepszy bezpiecznik jakości. Na frontendzie możesz być bardziej elastyczny, ale nadal warto mieć choć podstawowe testy kluczowych flow. Najgorszy scenariusz to szybkie wdrożenia bez żadnych testów, bo błędy wracają lawinowo.

### Kiedy wiadomo, że stage jest „domknięty”?
Gdy przejdziesz stage gate: testy zielone, funkcja działa zgodnie z kryteriami, docs zaktualizowane i masz commit. Jeśli brakuje jednego z tych elementów, stage jest niedomknięty. Lepiej domknąć etap niż kumulować „prawie gotowe” rzeczy.

### Jak zrobić rollback, jeśli wdrożenie popsuje produkcję?
Miej zapisany ostatni stabilny commit i procedurę cofnięcia jeszcze przed deployem. W praktyce: wracasz do stabilnej wersji, budujesz kontenery ponownie i sprawdzasz health + happy path. Rollback to plan awaryjny, który oszczędza stres i czas.

### Jakie minimum monitoringu wystarczy na początku?
Logi aplikacji, health endpoint i 1-2 metryki (np. liczba błędów API). Do tego krótka checklista po każdym wdrożeniu. Nie potrzebujesz od razu dużego stacka observability, ważna jest regularność kontroli.

### Czy powinienem od razu skalować infrastrukturę po pierwszych użytkownikach?
Nie automatycznie. Najpierw sprawdź, gdzie realnie pojawia się bottleneck: CPU, RAM, baza, czy kod aplikacji. Skalowanie ma sens, gdy dane pokazują problem, a nie „na zapas”.

---

Gratulacje — przeszedłeś od pomysłu do działającej aplikacji i masz już system dalszego rozwoju.

Do zobaczenia przy kolejnych wdrożeniach!
Bartek

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

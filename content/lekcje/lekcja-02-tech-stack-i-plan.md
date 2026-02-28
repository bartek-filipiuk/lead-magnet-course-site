# Lekcja 2: Tech stack i plan budowy

**Subject line:** Jak AI wybiera tech stack za Ciebie [Lekcja 2/5]
**Preview text:** PRD + jeden prompt = gotowy plan z checkboxami. Zero paraliżu decyzyjnego.

---

Hej!

Wczoraj zamieniłeś pomysł w PRD. Dzisiaj idziemy dalej: PRD zamienisz w **tech stack** i **plan budowy z checkboxami**.

Po dzisiejszej lekcji będziesz mieć jasny kierunek: jak dobrać technologie i co kodować krok po kroku.

---

## Problem: "Jaki framework wybrać?"

React czy Next.js? FastAPI czy Express? PostgreSQL czy SQLite? MongoDB?

Ten "paraliż decyzyjny" to zabójca side projectów. Spędzasz 2 dni na porównywaniu frameworków, a potem i tak wybierasz to, co znasz (albo to co proponuje AI).

**Rozwiązanie:** daj AI wybrać na podstawie Twoich wymagań (PRD). Nie na podstawie hype'u — na podstawie tego, czego POTRZEBUJESZ.

---

## Krok 1: Wygeneruj Tech Stack

Weź PRD z wczoraj i wklej ten prompt:

```
Na podstawie tego PRD wygeneruj TECH_STACK.md.

Dla każdej technologii (frontend, backend, baza danych,
infrastruktura) podaj:
- Nazwę technologii
- Dlaczego ta, a nie inna (uzasadnienie powiązane z PRD)
- Alternatywy, które odrzuciłeś i dlaczego

Na końcu dodaj prosty diagram architektury w Mermaid.

Oto mój PRD:
---
[WKLEJ CAŁY PRD.md TUTAJ]
---

Generuj Tech Stack.
```

---

## Co dostajesz

Plik `TECH_STACK.md` z tabelą w stylu:

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|--------------|
| Frontend | React + Vite | SPA wystarczy, nie potrzebujemy SSR (PRD: single-user) |
| Backend | FastAPI (Python) | Szybki development, świetna dokumentacja API |
| Baza danych | SQLite | Single-user, zero konfiguracji, plik na dysku |
| Hosting | Docker + VPS | Pełna kontrola, ~20 zł/mies |

Plus diagram:

```
Użytkownik → React (Vite) → FastAPI → SQLite
```

**W praktyce:** AI nie wybiera najmodniejszej technologii. Wybiera **najprostszą, która spełnia wymagania**. SQLite zamiast PostgreSQL, jeśli masz jednego użytkownika? Tak — to dobra decyzja.

---

## Krok 2: Wygeneruj plan budowy (Vertical Slices)

Teraz najlepsza część. Wklej ten prompt:

```
Na podstawie PRD i Tech Stacka stwórz plan budowy
(HANDOFF_STAGES_PLAN.md) w podejściu "vertical slice".

Zasady:
1. Stage 1: Minimal Working Installation
   - Scaffolding projektu (setup podstawowych plików, frameworki)
   - Prosty backend z jednym endpointem (GET /api/health)
   - Prosty frontend z jedną stroną, która odpytuje backend
   - Docker setup
   - Weryfikacja end-to-end (frontend → backend → odpowiedź)
   - Start dokumentacji w `docs/` (minimum: `docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md` + inne pliki adekwatne do projektu)
   - BEZ logiki biznesowej, BEZ prawdziwych funkcji

2. Stage 2-N: Każdy stage = JEDNA kompletna funkcja
   - Backend (API + baza + logika + testy)
   - Frontend (UI + formularze + stany)
   - Integracja (połączenie frontend-backend)
   - Test end-to-end
   - Dokumentacja: aktualizacja minimum (`docs/README.md`,
     `docs/API.md`, `docs/CHANGELOG.md`) oraz innych plików docs
     adekwatnych do zakresu stage'u

3. Ostatni stage: Polish & Finalizacja
   - Refactoring, dokumentacja, testy końcowe

4. Definition of Done dla taska/stage:
   - testy zielone
   - działający zakres zgodny z PRD
   - docs w `docs/*` zaktualizowane

Każdy task rozbij na checkboxy.
Organizuj po FUNKCJACH, nie po WARSTWACH.

PRD:
---
[WKLEJ PRD]
---

Tech Stack:
---
[WKLEJ TECH STACK]
---

Generuj plan.
```

---

## Dlaczego "Vertical Slices"?

Tradycyjne podejście: zrób CAŁY backend, potem CAŁY frontend, potem integracja.

**Problem:** nie masz działającego systemu aż do samego końca. A wtedy okazuje się, że frontend i backend nie pasują do siebie.

Vertical slices: buduj **jedną funkcję na raz**, od backendu do frontendu.

```
Tradycyjne (źle):
Stage 1: Setup
Stage 2: CAŁY backend
Stage 3: CAŁY frontend
Stage 4: Integracja ← tu zwykle wszystko się sypie
Stage 5: Testy

Vertical slices (dobrze):
Stage 1: Minimal Working Installation ← już działa!
Stage 2: Funkcja A (backend + frontend + testy)
Stage 3: Funkcja B (backend + frontend + testy)
Stage 4: Funkcja C (backend + frontend + testy)
Stage 5: Polerowanie
```

**Efekt:** po każdym stage'u masz działający system. Po Stage 1 — apka się uruchamia. Po Stage 2 — pierwsza funkcja działa. Nigdy nie jesteś w sytuacji "zrobiłem 80% backendu, ale nic nie działa".

---

## Mini-sekcja: Agent-friendly codebase (od Stage 1)

Chcesz, żeby AI dobrze dowoziło kolejne taski? Kod musi być „czytelny dla następnego agenta”:

- Trzymaj przewidywalną strukturę katalogów i nazewnictwo.
- Zadbaj o jawne kontrakty API (co wchodzi, co wychodzi, jakie błędy).
- Nie chowaj logiki w „magicznych” helperach bez opisu.
- Po każdym stage'u aktualizuj minimum (`docs/README.md`, `docs/API.md`, `docs/CHANGELOG.md`) oraz inne pliki docs adekwatne do zmian.

To detal, ale mocno ułatwia kolejne iteracje.

---

## Co dostajesz

Plik `HANDOFF_STAGES_PLAN.md` z checkboxami:

```markdown
## Stage 1: Minimal Working Installation

- [ ] Task 1.1: Scaffolding projektu
    - [ ] Stwórz strukturę katalogów
    - [ ] Zainicjuj repo Git
    - [ ] Stwórz `docs/README.md`

- [ ] Task 1.2: Backend setup
    - [ ] Stwórz main.py z FastAPI
    - [ ] Dodaj endpoint GET /api/health
    - [ ] Dodaj CORS middleware

- [ ] Task 1.3: Frontend setup
    - [ ] Zainicjuj React z Vite
    - [ ] Stwórz stronę główną
    - [ ] Dodaj fetch do /api/health

- [ ] Task 1.4: Docker
    - [ ] Dockerfile dla backendu
    - [ ] Dockerfile dla frontendu
    - [ ] docker-compose.yml

- [ ] Task 1.5: Weryfikacja
    - [ ] docker-compose up
    - [ ] Otwórz przeglądarkę
    - [ ] Sprawdź, czy frontend pokazuje "System działa"

- [ ] Task 1.6: Dokumentacja stage'u
    - [ ] Uzupełnij `docs/README.md` (jak uruchomić projekt)
    - [ ] Uzupełnij `docs/API.md` (opis GET /api/health)
    - [ ] Dodaj wpis do `docs/CHANGELOG.md`
    - [ ] Uzupełnij dodatkowe pliki docs adekwatne do projektu (jeśli dotyczy)
```

**To jest Twoja checklista.** Jutro — w Lekcji 3 — zaczniesz ją odhaczać. Z pomocą AI.

---

## Tips

1. **Przeczytaj plan przed kodowaniem.** Upewnij się, że rozumiesz każdy krok. Jeśli coś jest niejasne — dopytaj AI.
2. **Nie modyfikuj planu w trakcie.** Najpierw skończysz Stage 1, potem dopiero myślisz o zmianach.
3. **Stage 1 zwykle mieści się w ~30 minut.** Jeśli trwa dużo dłużej — plan jest pewnie zbyt skomplikowany.

---

## Zadanie domowe

1. Weź PRD z wczoraj
2. Wygeneruj `TECH_STACK.md` (prompt z Kroku 1)
3. Wygeneruj `HANDOFF_STAGES_PLAN.md` (prompt z Kroku 2)
4. Przeczytaj plan — czy każdy krok jest jasny?
5. Zapisz oba pliki obok PRD.md

**Ile czasu:** 15-20 minut.

Po dzisiejszej lekcji masz 3 pliki:
- `PRD.md` — CO budujemy
- `TECH_STACK.md` — Z CZEGO budujemy
- `HANDOFF_STAGES_PLAN.md` — JAK budujemy (krok po kroku)

---

## FAQ

### Czy AI naprawdę dobrze wybierze tech stack za mnie?
Tak, pod warunkiem że dostanie dobry kontekst z PRD. Jeśli prompt opiera się na konkretnych wymaganiach, AI zwykle proponuje prostszy i bardziej adekwatny stack niż „hype’owe” rozwiązania.

### Co jeśli AI zaproponuje coś, czego nie znam?
Poproś o prostszą alternatywę i porównanie 2-3 opcji pod kątem czasu wdrożenia. Dla pierwszego projektu wygrywa rozwiązanie, które najszybciej dowozisz i rozumiesz.

### Czy mogę pominąć `TECH_STACK.md` i przejść od razu do kodu?
Możesz, ale zwykle kończy się to chaosem i zmianą decyzji w połowie pracy. Ten plik działa jak kontrakt: trzyma kierunek i ułatwia rozmowę z AI w kolejnych taskach.

### Co to znaczy „vertical slice” najprościej?
Jedna funkcja od A do Z: backend + frontend + test + docs. Dzięki temu po każdym stage’u masz coś działającego, a nie tylko „kolejny kawałek backendu”.

### Stage 1 mi się rozrasta. Skąd wiem, że przesadzam?
Jeśli Stage 1 zaczyna zawierać logikę biznesową, to sygnał alarmowy. Stage 1 ma tylko uruchomić szkielet: health endpoint, prosty frontend, Docker i podstawowe docs.

### Co jeśli plan wygenerowany przez AI jest za długi albo za krótki?
Poproś o korektę do poziomu „jedna funkcja = jeden stage”. Długi plan skróć przez łączenie drobnych kroków, a zbyt krótki rozbij na taski z jasnym Definition of Done.

### Czy trzeba trzymać się planu 1:1 bez zmian?
Na początku tak, żeby nie zgubić tempa i struktury. Zmiany rób dopiero po domknięciu stage’u, gdy masz działający punkt odniesienia.

---

Jutro w Lekcji 3: otwierasz edytor, odpalasz AI i zaczynasz **budować**. Pokażę Ci, jak efektywnie kodować z AI, żeby projekt się nie rozjechał.

Do jutra!
Bartek

PS. Masz pytanie o tech stack? Odpowiedz na ten email.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

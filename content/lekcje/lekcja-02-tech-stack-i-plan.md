# Lekcja 2: Tech stack i plan budowy

**Subject line:** Jak AI wybiera tech stack za Ciebie [Lekcja 2/5]
**Preview text:** PRD + jeden prompt = gotowy plan z checkboxami. Zero paraliżu decyzyjnego.

---

Hej!

Wczoraj zamieniliśmy pomysł w PRD. Dzisiaj idziemy dalej: PRD zamieniamy w **tech stack** i **plan budowy z checkboxami**.

Po dzisiejszej lekcji będziesz mieć jasny kierunek: jak dobrać technologie i co kodować krok po kroku.

---

## Problem: "Jaki framework wybrać?"

React czy Next.js? FastAPI czy Express? PostgreSQL czy SQLite? MongoDB?

Research zwykle trwa krócej niż kiedyś, ale nadal łatwo utknąć na etapie wyboru narzędzi. Po porównaniu kilku opcji często zostaje to samo pytanie: co naprawdę pasuje do mojego projektu?

**Rozwiązanie:** daj AI zaproponować wybór na podstawie Twoich wymagań (PRD). Nie na podstawie hype'u, tylko na podstawie tego, czego potrzebujesz.

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

**W praktyce:** AI często proponuje prostsze rozwiązania, jeśli wynikają z PRD. SQLite zamiast PostgreSQL przy jednym użytkowniku bywa sensownym wyborem, ale warto to sprawdzić pod kątem Twoich wymagań.

---

## Mini-sekcja: Prompt do researchera

Po wyborze stacka zrób szybki research dobrych praktyk dla konkretnych technologii, których używasz. Celem jest krótka lista decyzji do wdrożenia od razu, bez zgadywania.

```text
Działasz jako AI Researcher dla projektu software.

Na podstawie poniższego TECH_STACK.md przygotuj plik STACK_GUIDELINES.md.

Zakres:
1. Standard kodowania i struktura projektu
2. Lintery i formatowanie
3. Testy (unit, integration, e2e - tylko tam, gdzie ma to sens)
4. Security (minimum na start)
5. Performance (minimum na start)

Zasady odpowiedzi:
- dawaj tylko rekomendacje adekwatne do podanego stacka
- dla każdej rekomendacji podaj:
  - co wybrać
  - dlaczego (1 krótkie zdanie)
  - jak wdrożyć (krótka checklista)
  - czego unikać
- jeśli brakuje danych, napisz "do decyzji" i podaj 2 sensowne opcje
- nie obiecuj efektów i nie uogólniaj

Format wyjścia:
- sekcja "Must-have na start"
- sekcja "Dobrze dodać później"
- sekcja "Otwarte decyzje"

TECH_STACK.md:
[WKLEJ TUTAJ]
```

> Prompt do pobrania: [PROMPT_STACK_RESEARCH.md](https://vibe.devince.dev/prompts/PROMPT_STACK_RESEARCH.md)

---

## Krok 2: Wygeneruj plan budowy (Vertical Slices)

Teraz najlepsza część. Wklej ten prompt:

```
Na podstawie PRD i Tech Stacka stwórz plan budowy
(HANDOFF_STAGES_PLAN.md) w podejściu "vertical slice".

Zasady:
1. Stage 1: Minimalna działająca aplikacja
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

3. Ostatni stage: Dopracowanie i finalizacja
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

**Problem:** dopóki nie połączysz warstw, trudniej szybko wychwycić niedopasowania i błędy implementacyjne.

Vertical slices: buduj **jedną funkcję na raz**, od backendu do frontendu.

```
Tradycyjne (niezalecane):
Stage 1: Setup
Stage 2: CAŁY backend
Stage 3: CAŁY frontend
Stage 4: Integracja - tu często wychodzą braki
Stage 5: Testy

Vertical slices (lepiej):
Stage 1: Minimalna działająca aplikacja
Stage 2: Funkcja A (backend + frontend + testy)
Stage 3: Funkcja B (backend + frontend + testy)
Stage 4: Funkcja C (backend + frontend + testy)
Stage 5: Polerka
```

**Efekt:** po każdym stage'u masz działający system i szybszy feedback. Po Stage 1 uruchamiasz aplikację, a po kolejnych etapach domykasz funkcje end-to-end.

---

## Agent-friendly codebase (od Stage 1)

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
## Stage 1: Minimalna działająca aplikacja (przykład)

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

**To jest Twoja checklista.** Jutro - w Lekcji 3 - zaczniesz ją odhaczać. Z pomocą agenta AI.

---

## Tips

1. **Przeczytaj plan przed kodowaniem.** Upewnij się, że rozumiesz każdy krok. Jeśli coś jest niejasne - dopytaj AI.
2. **Na start trzymaj się planu dla Stage 1.** Zmiany wprowadzaj po domknięciu etapu, gdy masz punkt odniesienia.
3. **Jeśli Stage 1 zaczyna się rozrastać, zawęź zakres.** W tym etapie celem jest działający szkielet, bez logiki biznesowej.

---

## Zadanie domowe

1. Weź PRD z wczoraj
2. Wygeneruj `TECH_STACK.md` (prompt z Kroku 1)
3. Wygeneruj `HANDOFF_STAGES_PLAN.md` (prompt z Kroku 2)
4. Przeczytaj plan - czy każdy krok jest jasny?
5. Zapisz oba pliki obok PRD.md

**Ile czasu:** orientacyjnie 15-20 minut.

Po dzisiejszej lekcji masz 3 pliki:
- `PRD.md` - CO budujemy
- `TECH_STACK.md` - Z CZEGO budujemy
- `HANDOFF_STAGES_PLAN.md` - JAK budujemy (krok po kroku)

---

## FAQ

### Czy AI naprawdę dobrze wybierze tech stack za mnie?
Może pomóc, pod warunkiem że dostanie dobry kontekst z PRD. Jeśli prompt opiera się na konkretnych wymaganiach, AI często proponuje prostszy i bardziej adekwatny stack niż „hype’owe” rozwiązania. Potem i tak warto zweryfikować propozycję pod Twoje potrzeby i doświadczenie.

### Co jeśli AI zaproponuje coś, czego nie znam?
Poproś o prostszą alternatywę i porównanie 2-3 opcji pod kątem czasu wdrożenia. Dla pierwszego projektu wygrywa rozwiązanie, które najszybciej dowozisz i rozumiesz.

### Czy mogę pominąć `TECH_STACK.md` i przejść od razu do kodu?
Możesz, ale zwykle kończy się to zamieszaniem i zmianą decyzji w połowie pracy. Ten plik działa jak kontrakt: trzyma kierunek i ułatwia rozmowę z AI w kolejnych taskach.

### Co to znaczy „vertical slice” najprościej?
Jedna funkcja od A do Z: backend + frontend + test + docs. Dzięki temu po każdym stage’u masz coś działającego, a nie tylko „kolejny kawałek backendu”.

### Stage 1 mi się rozrasta. Skąd wiem, że przesadzam?
Jeśli Stage 1 zaczyna zawierać logikę biznesową, to sygnał alarmowy. Stage 1 ma tylko uruchomić szkielet: health endpoint, prosty frontend, Docker i podstawowe docs.

### Co jeśli plan wygenerowany przez AI jest za długi albo za krótki?
Poproś o korektę do poziomu „jedna funkcja = jeden stage”. Długi plan skróć przez łączenie drobnych kroków, a zbyt krótki rozbij na taski z jasnym Definition of Done.

### Czy trzeba trzymać się planu 1:1 bez zmian?
Na początku zwykle warto trzymać się planu, żeby nie zgubić tempa i struktury. Zmiany najbezpieczniej robić po domknięciu stage'u, gdy masz działający punkt odniesienia.

---

Jutro w Lekcji 3: otwierasz edytor, odpalasz AI i zaczynasz **budować**. Pokażę Ci, jak efektywnie kodować z AI, żeby projekt się nie rozjechał.

Do jutra!
Bartek

PS. Masz pytanie o tech stack? Odpowiedz na ten email.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

# Lekcja 1: Od pomysłu do wymagań w 15 minut

**Subject line:** Od pomysłu do wymagań w 15 minut [Lekcja 1/5]
**Preview text:** Jedno zdanie → pełny dokument wymagań. Bez tygodni analiz.

---

Hej!

Witaj w mini-kursie **"Od pomysłu do deploy w weekend"**.

Przez 5 dni pokażę Ci cały proces: od jednego zdania z pomysłem do działającej aplikacji pod Twoją domeną. Konkretne kroki, które możesz powtórzyć w weekend.

Zaczynamy od kroku, który wiele osób pomija: **zamiany pomysłu w konkretne wymagania**.

---

## Problem: "Mam pomysł, ale nie wiem od czego zacząć"

Większość side projectów umiera, zanim powstanie pierwsza linijka kodu. Dlaczego?

Bo skaczemy od razu do kodowania. Otwieramy edytor, agenta, piszemy prompt i po 3 godzinach mamy piękny PoC (Proof of Concept) czegoś co działa... ale dalej nie wiemy, co właściwie budujemy.

**Rozwiązanie:** zanim dotkniesz klawiatury, potrzebujesz PRD — Product Requirements Document. Brzmi korporacyjnie? Spokojnie. Z AI zrobisz to w krótkim czsie.

---

## Krok 1: Jedno zdanie

Zacznij od jednego zdania opisującego Twój pomysł. Przykład:

> "Chcę zbudować aplikację do śledzenia nawyków, gdzie mogę dodawać codzienne nawyki i widzieć streak."

To wszystko. Nie musisz mieć pełnej wizji. Jedno zdanie wystarczy.

---

## Krok 2: Daj AI zadać Ci pytania

Teraz, zamiast sam wymyślać wymagania, pozwól AI Ci w tym pomóc. Wklej ten prompt do Claude, ChatGPT lub innego modelu:

```
Jesteś ekspertem od planowania projektów IT. Mam pomysł na projekt:

"[TWÓJ POMYSŁ W JEDNYM ZDANIU]"

Zadaj mi dokładnie 15 pytań, które pomogą stworzyć konkretny
dokument wymagań (PRD). Pytania powinny dotyczyć:

- Cel projektu i metryki sukcesu
- Kim są użytkownicy i jakie mają potrzeby
- Główne funkcjonalności (co MUSI być w MVP)
- Czego NIE budujemy (out of scope)
- Wymagania niefunkcjonalne (wydajność, bezpieczeństwo)
- Znane ryzyka i założenia

Zadaj pytania po polsku, jedno po drugim.
Czekaj na moją odpowiedź przed kolejnym pytaniem.
```

---

## Krok 3: Odpowiadaj krótko i szczerze

AI zada Ci 15 pytań. Odpowiadaj krótko — 1-3 zdania na pytanie. Nie musisz mieć odpowiedzi na wszystko. Możesz powiedzieć "nie wiem, zaproponuj coś" albo "to nie jest ważne na początek".

**Przykładowe pytanie AI:** "Kto jest głównym użytkownikiem aplikacji?"
**Twoja odpowiedź:** "Ja sam na początek. Może potem otworzę dla znajomych. Na razie single-user."

To pomaga, bo AI często **wyłapie rzeczy, o których jeszcze nie myślałeś**. Na przykład: "Czy chcesz powiadomienia push, gdy nie zaznaczysz nawyku?" — lepiej zdecydować to teraz niż w środku kodowania.

---

## Krok 4: Wygeneruj PRD

Po odpowiedzeniu na 15 pytań, powiedz AI:

```
Na podstawie moich odpowiedzi, wygeneruj PRD (Product Requirements
Document) w formacie Markdown. Zawrzyj sekcje:

1. Wizja projektu i cele
2. Metryki sukcesu
3. User stories z kryteriami akceptacji
4. Wymagania niefunkcjonalne
5. Założenia i zależności
6. Scope MVP (co wchodzi w jego skład ale też co nie jest jego częścią)
7. Otwarte pytania i ryzyka

Zapisz jako PRD.md
```

---

## Co dostajesz

Gotowy plik `PRD.md` — zwykle 2-4 strony — który:

- Jasno definiuje, CO budujemy (i czego NIE)
- Ma konkretne user stories ("Jako użytkownik chcę X, żeby Y")
- Określa priorytety (must-have vs nice-to-have)
- Wymienia ryzyka i otwarte pytania

**To jest Twoja mapa na start.** Dzięki niej łatwiej trzymać zakres i zdecydować, co kodujesz najpierw.

---

## Dlaczego to działa

1. **AI zadaje pytania, które łatwo pominąć.** Np. logowanie, role użytkowników, limity, przypadki błędów.
2. **Wymuszone decyzje.** "Czy potrzebuję logowania?" — lepiej zdecydować teraz niż w połowie kodowania.
3. **Kontrola zakresu.** PRD jasno mówi, co jest IN, a co OUT. Nie będziesz dokładał funkcji w nieskończoność.
4. **15 minut planu vs godziny poprawek.** Krótki plan na początku zwykle oszczędza sporo czasu później.

---

## Zadanie domowe

1. Wymyśl pomysł na projekt (lub użyj: "Aplikacja do śledzenia nawyków ze streakami")
2. Wklej prompt z Kroku 2 do dowolnego AI (Claude, ChatGPT, Gemini)
3. Odpowiedz na 15 pytań
4. Wygeneruj PRD.md
5. Zapisz plik — jutro go użyjemy

**Ile czasu to zajmie?** 15-20 minut.

---

## FAQ

### Czy muszę mieć „idealny” pomysł, zanim zacznę?
Nie. Na start wystarczy jedno zdanie. Lepiej ruszyć z prostym pomysłem i doprecyzować go pytaniami AI, niż czekać na perfekcyjną koncepcję.

### Czy te 15 pytań od AI to obowiązek?
To dobra domyślna liczba, bo zwykle daje pełny obraz projektu. Jeśli po 10 pytaniach masz już jasność, możesz skończyć wcześniej. Jeśli nadal są luki, dopytaj o kolejne.

### Co jeśli nie znam odpowiedzi na część pytań?
To normalne. Odpowiedz "nie wiem" i poproś AI o 2-3 sensowne warianty. Najważniejsze, żeby podjąć roboczą decyzję na teraz, a nie blokować start.

### Czy PRD nie jest „za ciężkie” dla małego projektu?
W tej wersji nie. Tu PRD to krótka mapa decyzji, a nie korporacyjny dokument na 40 stron. Wystarczy 2-4 strony, by uniknąć chaosu podczas kodowania.

### Jakiego narzędzia AI użyć do tego kroku?
Dowolnego, które dobrze prowadzi dialog: Claude Code, Codex, ChatGPT, Cursor, Windsurf. Kluczowe jest to, żeby model zadawał pytania jedno po drugim i czekał na Twoją odpowiedź.

### Czy mogę zmienić PRD później, gdy lepiej zrozumiem projekt?
Tak, PRD nie jest „na zawsze”. Traktuj go jak żywy dokument. Aktualizuj go po ważnych decyzjach, żeby plan i kod dalej były spójne.

---

Jutro w Lekcji 2: weźmiesz ten PRD i zamienisz go w **konkretny plan budowy** — z tech stackiem i checkboxami do odhaczania.

Do jutra!
Bartek

PS. Masz pytania? Odpowiedz na ten email — czytam wszystko.

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

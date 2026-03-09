# PROMPT_STACK_RESEARCH

Prompt do researchu best practices dla wybranego tech stacka.

## Kiedy użyć
Po wygenerowaniu i zatwierdzeniu `TECH_STACK.md` - przed rozpoczęciem planowania stage'ów (`HANDOFF_STAGES_PLAN.md`).

## Prompt

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

## Jak korzystać z wyników
Zapisz wygenerowany plik jako `STACK_GUIDELINES.md` w katalogu projektu. Traktuj sekcję "Must-have na start" jako obowiązkową przy scaffoldingu (Stage 1). Resztę wdrażaj iteracyjnie.

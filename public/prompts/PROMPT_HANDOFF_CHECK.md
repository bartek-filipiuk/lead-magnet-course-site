# Handoff Check Prompt

**Szybki check struktury HANDOFF_STAGES_PLAN.md.** Wklej do dowolnego agenta AI
w katalogu projektu, żeby sprawdzić czy plan jest kompletny przed kodowaniem.
Możesz też uruchomić w dowolnym momencie projektu.

---

Przeczytaj `HANDOFF_STAGES_PLAN.md` i `PRD.md` w tym projekcie.
Wykonaj poniższe sprawdzenia:

## 1. Struktura stage'ów

Dla KAŻDEGO stage'a sprawdź:

- [ ] Ma nagłówek `## Stage N: [Nazwa]`
- [ ] Ma pole `**Cel:**`
- [ ] Ma pole `**User Stories:**` z referencjami do US z PRD (np. US-1, US-2)
- [ ] Ma sekcję `### Taski:` z checkboxami `- [ ]`
- [ ] Ma sekcję `### Security (MANDATORY)` z minimum 1 checkboxem
- [ ] Ma sekcję `### Docs (MANDATORY)` z checkboxami dla CHANGELOG, API, README
- [ ] Ma sekcję `### Stage Completion (MANDATORY)` z self-checkami

## 2. Wymagania strukturalne

- [ ] Stage 1 to "Minimalna działająca aplikacja" (scaffolding, hello-world, Docker)
- [ ] Ostatni stage to "Dopracowanie i finalizacja"
- [ ] Na końcu pliku jest sekcja "Coverage Check vs PRD" z tabelką US → Stage

## 3. Spójność z PRD

- Otwórz `PRD.md` i wylistuj WSZYSTKIE User Stories (US-1, US-2, ...)
- Sprawdź: czy KAŻDY User Story z PRD pojawia się w co najmniej jednym `**User Stories:**`?
- Sprawdź: czy tabelka "Coverage Check vs PRD" pokrywa WSZYSTKIE User Stories?

## 4. Raport

Wygeneruj krótki raport:

```
HANDOFF CHECK — [YYYY-MM-DD]

Stage'ów: N
Struktura OK: X/N stage'ów ma pełną strukturę
User Stories: X/Y US z PRD pokryte
Coverage Check: ✓ / ✗

Problemy:
1. [lista braków — jeśli są]

Status: PASS ✓ / FAIL ✗ (napraw przed Phase 3)
```

Jeśli FAIL — wylistuj dokładnie co trzeba poprawić i zaproponuj konkretne zmiany.

# PROMPT_CODE_REVIEW

Prompt do przeglądu kodu z AI przed deployem.

## Kiedy użyć
Po zakończeniu budowy (lub stage'u) - przed pushowaniem na GitHub i deployem.

## Prompt

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

## Jak korzystać z wyników
Napraw KRYTYCZNE i WAŻNE. DROBNE zostawiasz na później.

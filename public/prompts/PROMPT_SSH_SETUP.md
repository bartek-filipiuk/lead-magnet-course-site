# PROMPT_SSH_SETUP

Prompt do wygenerowania klucza SSH i dodania go do Hetzner (lub innego hostingu).

## Kiedy użyć
Przed kupnem VPS — żeby mieć klucz SSH gotowy do wklejenia w panelu hostingu.

## Prompt

```
Pomóż mi wygenerować klucz SSH i dodać go do Hetzner.

Mój system: [Windows / macOS / Linux]

Potrzebuję:
1. Sprawdzić czy mam już klucz SSH (~/.ssh/id_ed25519.pub)
2. Jeśli nie — wygenerować nowy (ssh-keygen -t ed25519)
3. Wyświetlić klucz publiczny do skopiowania
4. Wyjaśnić gdzie go wkleić w panelu Hetzner

Instrukcja krok po kroku, z wyjaśnieniem.
```

## Co zmienić przed użyciem
- `[Windows / macOS / Linux]` — zostaw tylko swój system
- `Hetzner` — zamień na nazwę swojego hostingu, jeśli używasz innego

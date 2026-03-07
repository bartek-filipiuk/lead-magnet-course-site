# PROMPT_GIT_SETUP

Prompt do instalacji i konfiguracji Gita na dowolnym systemie operacyjnym.

## Kiedy użyć
Przed pierwszym commitem — jeśli nie masz Gita lub nie masz skonfigurowanego konta GitHub.

## Prompt

```
Pomóż mi zainstalować i skonfigurować Gita na moim komputerze.

Mój system operacyjny: [Windows / macOS / Linux]

Potrzebuję:
1. Sprawdzenie czy Git jest już zainstalowany (git --version)
2. Jeżeli nie — instrukcja instalacji dla mojego systemu
3. Konfiguracja użytkownika:
   - git config --global user.name "Moje Imie"
   - git config --global user.email "moj@email.com"
4. Wygenerowanie klucza SSH (ssh-keygen -t ed25519)
5. Instrukcja jak dodać klucz publiczny do GitHuba
6. Test połączenia (ssh -T git@github.com)

Podawaj komendy krok po kroku, z wyjaśnieniem co każda robi.
Czekaj na moje potwierdzenie po każdym kroku.
```

## Co zmienić przed użyciem
- `[Windows / macOS / Linux]` — zostaw tylko swój system
- `"Moje Imie"` i `"moj@email.com"` — AI poprosi o Twoje dane

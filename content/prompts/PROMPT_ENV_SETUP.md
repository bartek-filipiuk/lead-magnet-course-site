# PROMPT_ENV_SETUP

Prompt do stworzenia pliku .env z konfiguracją produkcyjną na serwerze.

## Kiedy użyć
Po sklonowaniu repozytorium na serwer — przed uruchomieniem `docker compose up`.

## Prompt

```
Pomóż mi stworzyć plik .env na serwerze dla mojego projektu.

Zmienne środowiskowe które potrzebuję:
- DATABASE_URL=...
- SECRET_KEY=...
[dodaj swoje zmienne]

Wygeneruj komendę która stworzy ten plik.
Ważne: NIE kopiuj .env z laptopa — stwórz nowy z wartościami produkcyjnymi.
```

## Co zmienić przed użyciem
- Lista zmiennych — dostosuj do swojego projektu (sprawdź w `.env.example` lub `docker-compose.yml`)

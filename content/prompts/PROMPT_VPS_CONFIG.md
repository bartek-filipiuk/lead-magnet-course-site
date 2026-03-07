# PROMPT_VPS_CONFIG

Prompt do konfiguracji świeżego serwera VPS — Docker + Caddy.

## Kiedy użyć
Po kupnie VPS i pierwszym połączeniu przez SSH.

## Prompt

```
Połączyłem się z nowym serwerem VPS (Ubuntu 24.04) przez SSH.

Pomóż mi go skonfigurować krok po kroku:
1. Aktualizacja systemu (apt update && apt upgrade)
2. Instalacja Dockera (z oficjalnego skryptu)
3. Sprawdzenie czy Docker działa (docker --version)
4. Instalacja Caddy (reverse proxy z automatycznym HTTPS)
5. Sprawdzenie czy Caddy działa (systemctl status caddy)

Po każdym kroku powiedz mi co mam zobaczyć, żebym wiedział
czy wszystko poszło OK.
```

## Co zmienić przed użyciem
- `Ubuntu 24.04` — jeśli masz inną wersję systemu, zmień odpowiednio

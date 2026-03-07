# PROMPT_VPS_HARDENING

Prompt do zabezpieczenia serwera VPS (opcjonalny krok).

## Kiedy użyć
Po pierwszym działającym deployu — żeby dodać dodatkową warstwę bezpieczeństwa. Na start możesz to pominąć.

## Prompt

```
Pomóż mi zabezpieczyć serwer VPS (Ubuntu 24.04):
1. Utwórz osobnego użytkownika z sudo (zamiast root)
2. Skonfiguruj firewall (ufw) — otwórz tylko porty 22, 80, 443
3. Wyłącz logowanie root przez SSH

Krok po kroku z wyjaśnieniami.
```

## Co zmienić przed użyciem
- `Ubuntu 24.04` — jeśli masz inną wersję systemu, zmień odpowiednio

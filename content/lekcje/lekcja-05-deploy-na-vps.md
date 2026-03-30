# Lekcja 5: Deploy na VPS - krok po kroku

**Subject line:** Deploy na VPS krok po kroku [Lekcja 5/5]
**Preview text:** Docker + VPS + Caddy: publikacja aplikacji pod własną domeną i HTTPS.

---

Hej!

To ostatnia lekcja kursu. Z niej dowiesz się jak wystawić aplikację pod **własną domeną**, z automatycznym HTTPS.

Do tej pory Twoja apka działa na Twoim komputerze. Nikt inny jej nie widzi. Żeby to zmienić, potrzebujesz serwera - komputera włączonego 24/7, podłączonego do internetu. VPS to kawałek takiego komputera, który wynajmujesz.

---

## Dlaczego VPS, a nie Vercel/Railway lub inny Cloud Provider?

| | Vercel/Railway | VPS (Hetzner) |
|---|---|---|
| Koszt | $0-5 (darmowy tier) → $20+ szybko | ~€4/mies (~20 PLN) stale |
| Kontrola | Ograniczona | Pełna |
| Uzależnienie od dostawcy | Tak | Nie |
| Baza danych | Osobna usługa ($) | Na tym samym serwerze |
| Wiele apek | Każda osobno ($) | Bez limitu na jednym VPS |
| Nauka | Zero | Dużo (ale raz się uczysz) |

Dla wielu side projectów VPS wygrywa kosztowo. Za ~20 zł/mies masz serwer, na którym uruchomisz 5-10 aplikacji. Na Vercelu każda z nich kosztuje osobno.

---

## Kup VPS na Hetzner lub u innego dostawcy

Dlaczego Hetzner? To często opłacalna opcja na start: niski koszt, serwery blisko Polski (Helsinki, Falkenstein) i prosty panel.

1. Wejdź na [hetzner.com/cloud](https://www.hetzner.com/cloud/)
2. Załóż konto (potrzebujesz karty)
3. Stwórz serwer:
   - **Lokalizacja:** Helsinki lub Falkenstein (najbliżej Polski)
   - **OS:** Ubuntu 24.04
   - **Typ:** CX22 (2 vCPU, 4GB RAM) - **€4.35/mies**
   - **SSH Key:** dodaj swój klucz publiczny

Klucz SSH to jak hasło, ale bezpieczniejsze. Serwer rozpoznaje Twój komputer po kluczu zamiast po haśle.

Jeśli nie masz klucza SSH - wklej ten prompt do AI:

```
Pomóż mi wygenerować klucz SSH i dodać go do Hetzner.

Mój system: [Windows / macOS / Linux]

Potrzebuję:
1. Sprawdzić czy mam już klucz SSH (~/.ssh/id_ed25519.pub)
2. Jeśli nie - wygenerować nowy (ssh-keygen -t ed25519)
3. Wyświetlić klucz publiczny do skopiowania
4. Wyjaśnić gdzie go wkleić w panelu Hetzner

Instrukcja krok po kroku, z wyjaśnieniem.
```

> Prompt do pobrania: [PROMPT_SSH_SETUP.md](https://vibe.devince.dev/prompts/PROMPT_SSH_SETUP.md)

4. Kliknij "Create" - serwer zwykle jest gotowy w kilkadziesiąt sekund.
5. Zapisz IP serwera (np. `65.108.xxx.xxx`).

---

## Skonfiguruj serwer

Łączysz się z serwerem przez SSH - zdalny terminal. Komendy, które wpisujesz, wykonują się na serwerze, nie na Twoim laptopie.

```bash
ssh root@65.108.xxx.xxx
```

W tym kursie używamy Caddy, bo ma prostą konfigurację i automatyczne HTTPS. Alternatywy (Nginx, Apache, Traefik) też są dobre, ale na start zwykle wymagają więcej ręcznych kroków.

Teraz instalujesz dwie rzeczy: Docker i Caddy.

**Docker** uruchamia apkę podobnie jak lokalnie i ogranicza różnice środowiskowe między laptopem a serwerem.

**Caddy** to kierownik ruchu. Gdy ktoś wpisze Twój adres: (1) przyjmie połączenie, (2) zaszyfruje je (HTTPS), (3) przekieruje do apki. Automatycznie.

Możesz to zrobić ręcznie komendami poniżej, albo wkleić prompt do AI i przejść krok po kroku:

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

> Prompt do pobrania: [PROMPT_VPS_CONFIG.md](https://vibe.devince.dev/prompts/PROMPT_VPS_CONFIG.md)

A jeśli wolisz ręcznie - oto komendy:

Poniższe komendy są dla Ubuntu/Debian. Na innych dystrybucjach kroki i nazwy pakietów mogą się różnić.

```bash
# Aktualizacja systemu (jak Windows Update, ale szybsza)
apt update && apt upgrade -y

# Instalacja Dockera
curl -fsSL https://get.docker.com | sh

# Sprawdź, czy działa
docker --version
docker compose version
```

Caddy:

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

---

## Hardening - zabezpieczenie serwera (opcjonalne)

Na start możesz pominąć ten krok. Ale jeśli chcesz dodać warstwę bezpieczeństwa - wklej do AI:

```
Pomóż mi zabezpieczyć serwer VPS (Ubuntu 24.04):
1. Utwórz osobnego użytkownika z sudo (zamiast root)
2. Skonfiguruj firewall (ufw) - otwórz tylko porty 22, 80, 443
3. Wyłącz logowanie root przez SSH

Krok po kroku z wyjaśnieniami.
```

> Prompt do pobrania: [PROMPT_VPS_HARDENING.md](https://vibe.devince.dev/prompts/PROMPT_VPS_HARDENING.md)

Jeśli to pomijasz - wrócisz do tego później. Na start root zwykle wystarcza.

---

## Domena i DNS (orientacyjnie 5 minut)

DNS to książka telefoniczna internetu. Mówisz: "mojaapka.pl = serwer 65.108.xxx.xxx" i każdy, kto wpisze Twój adres, trafi na Twój serwer.

U rejestratora domen (np. OVH, Cloudflare, Porkbun) dodaj rekord DNS:

| Pole | Wartość |
|------|--------|
| Typ | A |
| Nazwa | mojaapka (albo @ dla głównej domeny) |
| Wartość | 65.108.xxx.xxx (IP Twojego VPS) |
| TTL | 300 |

Jeśli nie masz domeny - na początek użyj darmowej subdomeny z freedns.afraid.org, albo po prostu wchodź po IP.

Propagacja DNS trwa od minut do godzin. Jeśli domena nie działa od razu - poczekaj. Często zmiany wchodzą w ciągu 5-15 minut, ale czasem trwa to dłużej.

---

## Wrzuć kod na serwer

Na serwerze:

```bash
# Stwórz katalog na apkę
mkdir -p /opt/apps
cd /opt/apps

# Sprawdź, czy Git jest dostępny
git --version

# git clone zadziała, jeśli repo jest dostępne z tego serwera.
# Repo prywatne wymaga poprawnie skonfigurowanego dostępu (HTTPS lub SSH).

# Sklonuj repo z GitHuba
git clone https://github.com/TWÓJ-USER/TWÓJ-PROJEKT.git
cd TWÓJ-PROJEKT
```

### Plik .env - konfiguracja produkcyjna

.env to serce konfiguracji produkcyjnej. Tu są hasła, klucze, adresy bazy. Dlatego NIGDY nie trafia do Gita - tworzysz go osobno na serwerze.

Wklej prompt do AI:

```
Pomóż mi stworzyć plik .env na serwerze dla mojego projektu.

Zmienne środowiskowe które potrzebuję:
- DATABASE_URL=...
- SECRET_KEY=...
[dodaj swoje zmienne]

Wygeneruj komendę która stworzy ten plik.
Ważne: NIE kopiuj .env z laptopa - stwórz nowy z wartościami produkcyjnymi.
```

> Prompt do pobrania: [PROMPT_ENV_SETUP.md](https://vibe.devince.dev/prompts/PROMPT_ENV_SETUP.md)

Możesz też edytować plik ręcznie: `nano .env` (Ctrl+O = zapisz, Ctrl+X = wyjdź).

---

## Uruchom z Docker Compose

```bash
# Zbuduj i uruchom
docker compose up -d --build

# Sprawdź, czy działa
docker compose ps
# Powinno pokazać kontenery w stanie "Up"

# Sprawdź logi
docker compose logs -f
# Ctrl+C, żeby wyjść z logów
```

Przetestuj, czy apka odpowiada:

```bash
curl http://localhost:8000/api/health
# Powinno zwrócić: {"status": "ok"}
```

Jeśli kontener jest w stanie "Restarting" lub "Exit" - sprawdź logi: `docker compose logs nazwa-kontenera`. Tam będzie komunikat błędu.

---

## Skonfiguruj Caddy

Edytuj konfigurację Caddy:

```bash
nano /etc/caddy/Caddyfile
```

Wklej:

```
mojaapka.twojadomena.pl {
    reverse_proxy localhost:3000
}

api.mojaapka.twojadomena.pl {
    reverse_proxy localhost:8000
}
```

Albo jeśli frontend i backend są na jednym porcie:

```
mojaapka.twojadomena.pl {
    reverse_proxy localhost:3000

    handle_path /api/* {
        reverse_proxy localhost:8000
    }
}
```

To jest cała konfiguracja. Domena + gdzie przekierować. Caddy resztę (SSL, przekierowania HTTP→HTTPS) robi sam.

Zrestartuj Caddy:

```bash
systemctl reload caddy
```

Po poprawnej konfiguracji apka powinna być dostępna pod `https://mojaapka.twojadomena.pl`.

Jeśli coś nie działa: (1) sprawdź DNS - czy domena wskazuje na Twoje IP, (2) sprawdź logi Caddy: `journalctl -u caddy -f`, (3) sprawdź czy porty 80/443 nie są zablokowane.

---

## Weryfikacja

1. Otwórz `https://mojaapka.twojadomena.pl` w przeglądarce
2. Sprawdź, czy jest kłódeczka HTTPS
3. Przetestuj happy path (dodaj nawyk, zaznacz, odśwież)
4. Sprawdź na telefonie - czy działa na mobile?

---

## Aktualizacja apki (przyszłość)

Kiedy zrobisz zmiany w kodzie:

```bash
ssh root@65.108.xxx.xxx
cd /opt/apps/TWÓJ-PROJEKT
git pull
docker compose up -d --build
```

W najprostszym wariancie to 4 komendy. Bez CI/CD i bez pipeline'ów.

---

## Ile to kosztuje?

| Pozycja | Koszt/mies |
|---------|-----------|
| Hetzner CX22 | €4.35 (~20 PLN) |
| Domena .pl | ~30 PLN/rok (~2.50 PLN/mies) |
| SSL | Darmowy (Let's Encrypt) |
| **Razem** | **~22 PLN/mies** |

Przy takim wariancie kosztowym masz własny serwer, na którym możesz uruchomić więcej niż jedną aplikację. Każda kolejna zwykle podnosi koszt wolniej niż przy osobnym hostingu dla każdej apki.

---

## Podsumowanie całego kursu

Przez 5 dni przeszedłeś całą drogę:

| Dzień | Krok | Czas |
|-------|------|------|
| 1 | Pomysł → PRD.md | 15 minut |
| 2 | PRD → Tech Stack + Plan | 15 minut |
| 3 | Plan → Działająca apka | 30-60 minut |
| 4 | Apka → Przetestowany kod w repo | 30-45 minut |
| 5 | Repo → Apka pod Twoją domeną | orientacyjnie 30 minut |

**Łączny czas: orientacyjnie 2-3 godziny.** Od jednego zdania do projektu dostępnego w internecie.

To proces, którego sam używam przy projektach. Tak powstał m.in. [videtion.com](https://videtion.com) (SaaS do zamiany video w artykuły) i kilka innych narzędzi.

---

## Bonus po Lekcji 5: Jak rozwijać apkę dalej (Lekcja 6)

Deploy to nie meta - to dopiero start. Kolejny etap to dokładanie nowych funkcji w uporządkowany sposób.

Dlatego po tym mailu przejdź do bonusowej Lekcji 6, gdzie dostajesz proces:
- jak wybierać kolejną funkcję (wartość vs koszt),
- jak robić mini-plan dla nowej funkcji,
- jak utrzymać jakość przez TDD i aktualne `docs/*`,
- jak bezpiecznie wdrażać kolejne wersje (rollback, monitoring minimum).

Jeśli chcesz rozwijać projekt dłużej niż pierwszy sprint, ten bonus bardzo Ci się przyda.

---

## Co dalej?

### 1. Dołącz do społeczności
Mamy Discord dla ludzi, którzy budują side projekty z AI:
**[discord.gg/devince](https://discord.gg/devince)**

Podziel się swoim projektem, dostaniesz feedback.

### 2. Pełny system do budowania projektów
Prompty z Lekcji 1-2 to uproszczona wersja. Pełny system (12 plików, vertical slices, stage gates, event storming) znajdziesz na GitHubie:
**[github.com/devince-dev/ai-driven-development](https://github.com/devince-dev/ai-driven-development)**

### 3. YouTube
Pokazuję cały proces na żywo - publiczne budowanie. Screencasty z budowania, wdrożeń i przeglądu kodu AI:
**[@bartfilipiuk na YouTube](https://www.youtube.com/@bartfilipiuk/videos)**

### 4. Newsletter
Cotygodniowy newsletter z tipami o AI development, vibe codingu i budowaniu side projectów:
**[devince.dev](https://devince.dev)**

### 5. Warsztaty (wkrótce)
Planuję warsztaty na żywo: 3 godziny, budowa apki od zera do deployu. Jeśli chcesz, zapisz się na listę oczekujących na devince.dev.

---

## FAQ

### Czy VPS to dobry wybór, jeśli nie mam doświadczenia z DevOps?
Tak. Pierwszy setup zajmuje chwilę, ale potem aktualizacja to 4 komendy. Trzymaj się checklisty z lekcji i nie komplikuj konfiguracji.

### Co jeśli jeszcze nie mam domeny?
Tymczasowo testuj po IP serwera albo użyj darmowej subdomeny. Domena nie blokuje deployu, ale bez niej nie masz HTTPS i własnego adresu.

### Skąd mam wiedzieć, czy DNS już się rozpropagował?
Sprawdź rekord A np. przez `dig mojaapka.twojadomena.pl` albo narzędzia online typu DNS Checker. Jeśli domena jeszcze nie wskazuje na Twój VPS, Caddy może nie wystawić certyfikatu od razu.

### Caddy nie wystawia certyfikatu - co sprawdzić?
Kolejność: (1) DNS - czy wskazuje na właściwe IP, (2) porty 80/443 - czy są otwarte, (3) składnia Caddyfile - czy nie ma literówki. Logi: `journalctl -u caddy -f`. Najczęściej problem leży w DNS.

### Czy wszystko uruchamiać jako root?
Na start w mini-projekcie to najprostsze. Docelowo lepiej mieć osobnego użytkownika (patrz sekcja "Hardening"). Popraw to po pierwszym działającym deployu.

### Jak zrobić bezpieczną aktualizację?
`git pull` → `docker compose up -d --build` → szybka weryfikacja health i happy path. Zanim wdrożysz, zanotuj ostatni stabilny commit do ewentualnego rollbacku.

### Co jeśli po deployu frontend działa, ale API nie?
Sprawdź: (1) czy API kontener jest "Up" (`docker compose ps`), (2) czy port i `reverse_proxy` w Caddy wskazują właściwy adres, (3) czy `/api/health` odpowiada lokalnie na serwerze. Potem szukaj problemu w kodzie.

### Ile aplikacji mogę trzymać na jednym VPS?
Dla małych projektów zwykle kilka. Monitoruj zużycie (`htop`, `docker stats`). Jak zacznie brakować RAM - skaluj serwer.

### Co to jest SSH i czy muszę się tego bać?
Bezpieczne połączenie z serwerem przez terminal. Wpisujesz komendy tekstem, serwer je wykonuje. Jak rozmowa telefoniczna, tylko tekstem. Nic strasznego.

### Czy mogę użyć innego hostingu niż Hetzner?
Tak. DigitalOcean, Vultr i OVH będą działać podobnie. Hetzner jest tu przykładem opłacalnej opcji w Europie.

---

Dzięki, że przeszedłeś ten kurs. Mam nadzieję, że Twój pierwszy side project już działa pod własną domeną.

Jeśli masz pytania - **odpowiedz na ten email**. Czytam każdą wiadomość.

Do zobaczenia!
Bartek

PS. Jeśli ten kurs Ci pomógł - podeślij go komuś, kto też chce budować. Link do zapisu: [devince.dev/kurs](https://devince.dev/kurs)

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

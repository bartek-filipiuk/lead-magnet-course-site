# Lekcja 5: Deploy na VPS w 30 minut

**Subject line:** Deploy na VPS w 30 minut za 20 zł/mies [Lekcja 5/5]
**Preview text:** Docker + Hetzner + Caddy = Twoja apka pod własną domeną z HTTPS. Finał rdzenia kursu!

---

Hej!

To ostatnia lekcja rdzenia kursu. W około 30 minut wystawisz aplikację pod **własną domeną**, z automatycznym HTTPS, za około 20 zł miesięcznie.

Bez uzależnienia od platformy i z pełną kontrolą nad serwerem.

---

## Dlaczego VPS, a nie Vercel/Railway?

| | Vercel/Railway | VPS (Hetzner) |
|---|---|---|
| Koszt | $0-5 (darmowy tier) → $20+ szybko | ~€4/mies (~20 PLN) stale |
| Kontrola | Ograniczona | Pełna |
| Uzależnienie od dostawcy | Tak | Nie |
| Baza danych | Osobna usługa ($) | Na tym samym serwerze |
| Wiele apek | Każda osobno ($) | Praktycznie bez limitu na jednym VPS |
| Nauka | Zero | Dużo (ale raz się uczysz) |

**Dla wielu side projectów VPS często wygrywa kosztowo.** Za 20 zł/mies masz serwer, na którym możesz uruchomić 5-10 aplikacji. Na Vercelu każda z nich zwykle kosztuje osobno.

---

## Krok 1: Kup VPS na Hetzner (5 minut)

1. Wejdź na [hetzner.com/cloud](https://www.hetzner.com/cloud/)
2. Załóż konto (potrzebujesz karty)
3. Stwórz serwer:
   - **Lokalizacja:** Helsinki lub Falkenstein (najbliżej Polski)
   - **OS:** Ubuntu 24.04
   - **Typ:** CX22 (2 vCPU, 4GB RAM) — **€4.35/mies**
   - **SSH Key:** dodaj swój klucz publiczny

```bash
# Jeśli nie masz klucza SSH:
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub
# Skopiuj i wklej w Hetzner
```

4. Kliknij "Create" — serwer gotowy w 30 sekund.
5. Zapisz IP serwera (np. `65.108.xxx.xxx`).

---

## Krok 2: Skonfiguruj serwer (10 minut)

Połącz się z serwerem:

```bash
ssh root@65.108.xxx.xxx
```

Zainstaluj Docker i Docker Compose:

```bash
# Update systemu
apt update && apt upgrade -y

# Zainstaluj Docker
curl -fsSL https://get.docker.com | sh

# Sprawdź, czy działa
docker --version
docker compose version
```

Zainstaluj Caddy (reverse proxy z automatycznym HTTPS):

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

---

## Krok 3: Skonfiguruj domenę (5 minut)

U rejestratora domen (np. OVH, Cloudflare, Porkbun) dodaj rekord DNS:

```
Typ: A
Nazwa: mojaapka (albo @ dla głównej domeny)
Wartość: 65.108.xxx.xxx (IP Twojego VPS)
TTL: 300
```

Jeśli nie masz domeny — na początek możesz użyć darmowej subdomeny z serwisów typu freedns.afraid.org, albo po prostu wchodzić po IP.

---

## Krok 4: Wrzuć kod na serwer (5 minut)

Na serwerze:

```bash
# Stwórz katalog na apkę
mkdir -p /opt/apps
cd /opt/apps

# Sklonuj repo z GitHuba
git clone https://github.com/TWÓJ-USER/TWÓJ-PROJEKT.git
cd TWÓJ-PROJEKT

# Stwórz plik .env (jeśli potrzebny)
nano .env
# Dodaj zmienne środowiskowe (np. DATABASE_URL, SECRET_KEY)
```

---

## Krok 5: Uruchom z Docker Compose (3 minuty)

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

---

## Krok 6: Skonfiguruj Caddy (5 minut)

Caddy to reverse proxy, które automatycznie:
- Obsługuje HTTPS (Let's Encrypt)
- Przekierowuje HTTP → HTTPS
- Proxy'uje ruch do Twojego Dockera

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

Zrestartuj Caddy:

```bash
systemctl reload caddy
```

I tyle na start. Caddy automatycznie pobierze certyfikat SSL, a Twoja apka będzie dostępna pod `https://mojaapka.twojadomena.pl`.

---

## Krok 7: Weryfikacja

1. Otwórz `https://mojaapka.twojadomena.pl` w przeglądarce
2. Sprawdź, czy jest kłódeczka HTTPS
3. Przetestuj happy path (dodaj nawyk, zaznacz, odśwież)
4. Sprawdź na telefonie — czy działa na mobile?

---

## Aktualizacja apki (przyszłość)

Kiedy zrobisz zmiany w kodzie:

```bash
ssh root@65.108.xxx.xxx
cd /opt/apps/TWÓJ-PROJEKT
git pull
docker compose up -d --build
```

4 komendy i po chwili masz nową wersję na produkcji.

---

## Ile to kosztuje?

| Pozycja | Koszt/mies |
|---------|-----------|
| Hetzner CX22 | €4.35 (~20 PLN) |
| Domena .pl | ~30 PLN/rok (~2.50 PLN/mies) |
| SSL | Darmowy (Let's Encrypt) |
| **Razem** | **~22 PLN/mies** |

Za 22 PLN miesięcznie masz **własny serwer**, na którym możesz uruchomić wiele aplikacji. Każda kolejna apka to koszt $0 — po prostu dodajesz nowy wpis w Caddyfile.

---

## Podsumowanie całego kursu

Przez 5 dni przeszedłeś całą drogę:

```
Dzień 1: Pomysł → PRD.md (15 minut)
Dzień 2: PRD → Tech Stack + Plan (15 minut)
Dzień 3: Plan → Działająca apka (30-60 minut)
Dzień 4: Apka → Przetestowany kod w repo (30-45 minut)
Dzień 5: Repo → Apka pod Twoją domeną (30 minut)
```

**Łączny czas: 2-3 godziny.** Od jednego zdania do działającego projektu w internecie.

To proces, którego sam używam przy projektach. Tak powstał m.in. [videtion.com](https://videtion.com) (SaaS do zamiany video w artykuły) i kilka innych narzędzi.

---

## Bonus po Lekcji 5: Jak rozwijać apkę dalej (Lekcja 6)

Deploy to nie meta — to dopiero start. Kolejny etap to dokładanie nowych funkcji w uporządkowany sposób.

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
Pokazuję cały proces na żywo — publiczne budowanie. Screencasty z budowania, wdrożeń i przeglądu kodu AI:
**[@devince na YouTube](https://youtube.com/@devince)**

### 4. Newsletter
Cotygodniowy newsletter z tipami o AI development, vibe codingu i budowaniu side projectów:
**[devince.dev](https://devince.dev)**

### 5. Warsztaty (wkrótce)
Planuję warsztaty na żywo: 3 godziny, budowa apki od zera do deployu. Jeśli chcesz, zapisz się na listę oczekujących na devince.dev.

---

## FAQ

### Czy VPS to dobry wybór, jeśli nie mam doświadczenia z DevOps?
Tak, jeśli chcesz zrozumieć podstawy hostingu i mieć pełną kontrolę. Pierwszy setup zajmuje chwilę, ale potem aktualizacja to zwykle kilka komend. Na start trzymaj się checklisty z lekcji i nie komplikuj konfiguracji.

### Co jeśli jeszcze nie mam domeny?
Możesz tymczasowo testować po IP serwera albo użyć darmowej subdomeny. Domena nie blokuje deployu, ale bez niej nie wykorzystasz w pełni wygody HTTPS i własnego adresu projektu.

### Skąd mam wiedzieć, czy DNS już się rozpropagował?
Sprawdź rekord A np. przez `dig` albo narzędzia online typu DNS Checker. Jeśli domena jeszcze nie wskazuje na Twój VPS, Caddy może nie wystawić certyfikatu od razu.

### Caddy nie wystawia certyfikatu — co sprawdzić najpierw?
Najpierw DNS (czy wskazuje na właściwe IP), potem porty 80/443 i składnię Caddyfile. Na końcu sprawdź logi Caddy przez `journalctl -u caddy -f`. W 80% przypadków problem to DNS albo literówka w domenie.

### Czy wszystko uruchamiać jako root na serwerze?
Na start w mini-projekcie to bywa najprostsze, ale docelowo lepiej mieć osobnego użytkownika i ograniczone uprawnienia. Jeśli planujesz dłuższy rozwój projektu, warto to poprawić po pierwszym działającym deployu.

### Jak zrobić bezpieczną aktualizację bez stresu?
Zasada: commit/push -> `git pull` na VPS -> `docker compose up -d --build` -> szybka weryfikacja health i happy path. Zanim wdrożysz, miej pod ręką ostatni stabilny commit do ewentualnego rollbacku.

### Co jeśli po deployu frontend działa, ale API nie?
Sprawdź, czy API kontener jest "Up", czy port i `reverse_proxy` w Caddy wskazują właściwy adres, oraz czy endpoint `/api/health` odpowiada lokalnie na serwerze. Potem dopiero szukaj problemu w kodzie.

### Ile aplikacji realnie mogę trzymać na jednym VPS?
To zależy od RAM/CPU i obciążenia, ale dla małych projektów często kilka usług działa bez problemu. Monitoruj zużycie zasobów i dopiero gdy zaczyna brakować miejsca, skaluj serwer.

---

Dzięki, że przeszedłeś ten kurs. Mam nadzieję, że Twój pierwszy side project już działa pod własną domeną.

Jeśli masz pytania — **odpowiedz na ten email**. Czytam każdą wiadomość.

Do zobaczenia!
Bartek

PS. Jeśli ten kurs Ci pomógł — podeślij go komuś, kto też chce budować. Link do zapisu: [devince.dev/kurs](https://devince.dev/kurs)

---

*Ten email jest częścią mini-kursu "Od pomysłu do deploy w weekend" od [Devince](https://devince.dev). Możesz się wypisać w dowolnym momencie.*

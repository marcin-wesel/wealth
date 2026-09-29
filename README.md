# Wealth

Prosta aplikacja do monitorowania majątku jednej osoby. Pokazuje listę pozycji majątku (nazwa + wartość w PLN) oraz ich sumę — nic więcej: bez walut, kursów, kategorii, historii zmian, wykresów ani wielu użytkowników.

## Funkcje

- Lista pozycji majątku posortowana malejąco po wartości, z sumą widoczną nad listą
- Dodawanie, edycja i usuwanie pozycji (nazwa, wartość w PLN)
- Kwoty formatowane po polsku (`500 000,00 zł`), pole wartości akceptuje przecinek jako separator dziesiętny
- Logowanie jednego, wcześniej utworzonego użytkownika — rejestracja jest wyłączona

## Stos technologiczny

- [Laravel 13](https://laravel.com) (PHP 8.3+) z [Fortify](https://laravel.com/docs/fortify) do logowania
- [Inertia.js v3](https://inertiajs.com) + React + TypeScript
- Tailwind CSS, komponenty w stylu shadcn/ui
- [Pest](https://pestphp.com) do testów, [Pint](https://laravel.com/docs/pint) do formatowania, [Larastan](https://github.com/larastan/larastan) do analizy statycznej

## Uruchomienie lokalnie

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

W pliku `.env` ustaw dane jedynego użytkownika aplikacji:

```env
APP_OWNER_EMAIL=twoj@email.pl
APP_OWNER_PASSWORD=twoje-haslo
```

Domyślnie lokalnie używana jest baza SQLite (`DB_CONNECTION=sqlite`) — dowolna inna też zadziała. Następnie uruchom migracje i seedery (tworzą użytkownika z powyższych danych oraz kilka przykładowych pozycji):

```bash
php artisan migrate --seed
```

Serwer deweloperski (Laravel + kolejka + Vite jednocześnie):

```bash
composer run dev
```

Aplikacja będzie dostępna pod `http://localhost:8000`, logowanie danymi ustawionymi w `APP_OWNER_EMAIL` / `APP_OWNER_PASSWORD`.

## Testy i jakość kodu

```bash
php artisan test        # testy Pest
vendor/bin/pint         # formatowanie kodu PHP
vendor/bin/phpstan analyse   # analiza statyczna
npm run build            # build produkcyjny frontendu
```

## Produkcja

Aplikacja jest przygotowana pod [Laravel Cloud](https://cloud.laravel.com) z Laravel Serverless MySQL — dane dostępowe do bazy są wstrzykiwane automatycznie jako zmienne środowiskowe. SQLite nie jest wspierane w tym środowisku (ulotny system plików), więc lokalnie może posłużyć jako wygodny domyślny wybór, ale w produkcji wymagane jest MySQL.

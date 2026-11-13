# Setup

Local setup for the Laravel API in `backend` and the Next.js app in `frontend`.

## Requirements

- PHP 8.3+ and Composer
- Node.js 20+ and pnpm
- SQLite (the default database)

The API reads Pokémon from [PokeAPI](https://pokeapi.co). It does not need a PokeAPI key.

## Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

In `backend/.env`, point the app at PokeAPI:

```
POKEAPI_API_URL=https://pokeapi.co/api/v2
```

`php artisan serve` listens on `http://127.0.0.1:8000`.

`CACHE_STORE` and `SESSION_DRIVER` use the database, so the migrate step is required. Name search caches the Pokémon name list in that database for one hour.

Run the API tests with:

```bash
cd backend
php artisan test
```

## Frontend

```bash
cd frontend
pnpm install
```

Create `frontend/.env`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the app:

```bash
pnpm dev
```

The site is at `http://localhost:3000`. Start the backend first. The page calls only `NEXT_PUBLIC_API_URL`.

## Run both

1. In one terminal, start the backend with `php artisan serve`.
2. In another, start the frontend with `pnpm dev`.
3. Open `http://localhost:3000`.

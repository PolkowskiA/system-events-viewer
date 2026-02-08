# System Events Viewer

Aplikacja do podglądu zdarzeń systemowych z filtrowaniem, sortowaniem i paginacją.

## Jak uruchomić

1. Backend (NestJS)

```bash
cd backend
npm install
npm run start
```

Backend nasłuchuje na `http://localhost:3000`.

2. Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Frontend startuje domyślnie na `http://localhost:5173`.

## Konfiguracja

Frontend pobiera dane z API ustawionego w `VITE_API_URL`.

Domyślna wartość w kodzie to `http:/localhost:3000`.

## API

`GET /events`

Parametry zapytania:

- `from` - data od (YYYY-MM-DD lub ISO 8601), np. `2026-02-01`
- `to` - data do (YYYY-MM-DD lub ISO 8601), np. `2026-02-04`
- `minLevel` - minimalny poziom zdarzenia: `DEBUG`, `INFO`, `WARNING`, `ERROR`
- `page` - numer strony (1..N), domyślnie `1`
- `pageSize` - rozmiar strony (1..50), domyślnie `10`
- `sortBy` - pole sortowania: `level`, `message`, `timestamp` (domyślnie `timestamp`)
- `sortDir` - kierunek sortowania: `asc` lub `desc` (domyślnie `desc`)

Przykład:

```bash
GET /events?from=2026-02-01&to=2026-02-04&minLevel=WARNING&page=1&pageSize=10&sortBy=timestamp&sortDir=desc
```

Odpowiedź:

```json
{
  "items": [
    {
      "id": "evt-1019",
      "level": "WARNING",
      "message": "Network latency above threshold.",
      "timestamp": "2026-02-04T07:02:15.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

## Decyzje projektowe

- Dane są zamockowane po stronie backendu, bez bazy danych.
- Filtrowanie poziomu działa jako minimalny próg (np. `WARNING` zwraca `WARNING` i `ERROR`).
- Parametry `from` i `to` akceptują datę w formacie YYYY-MM-DD lub pełny ISO 8601; backend filtruje po zakresie w UTC.
- Frontend ma filtry wstępne i przycisk "Filtruj" do zatwierdzania, a "Wyczyść filtry" resetuje stan.
- Tabela ma sortowanie i paginację sterowane po stronie backendu.

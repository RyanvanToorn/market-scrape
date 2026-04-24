# MarketScrape — Technical Specifications

## Tech Stack

| Layer | Technology |
|---|---|
| API language | C# (.NET 10) |
| Web framework | ASP.NET Core Minimal API |
| Database | PostgreSQL 17 |
| ORM | Entity Framework Core 10 |
| DB provider | Npgsql (EF Core PostgreSQL adapter) |
| Scraper language | TypeScript (Node.js, ESM) |
| Browser automation | Playwright (`@playwright/test`) |
| Script runner | `tsx` (no compile step needed for dev) |

---

## Architecture Overview

```
tools/ (TypeScript/Node.js)
  ├── ListingsImporter  ──HTTP POST──▶  API  ──EF Core──▶  PostgreSQL
  └── YahooFinanceScraper (Playwright)
        └── promote.ts  ──HTTP POST──▶  API  ──EF Core──▶  PostgreSQL

api/ (C# / ASP.NET Core)
  └── Serves stored data over HTTP to any consumer
```

### Layers

| Layer | Project / Folder | Responsibility |
|---|---|---|
| Domain | `MarketScrape.Core` | Entity classes, repository interfaces |
| Data access | `MarketScrape.Infrastructure` | EF Core `DbContext`, migrations, repository implementations |
| API | `MarketScrape.Api` | ASP.NET Core Minimal API endpoints, DI wiring |
| Scraper | `tools/src/scrapers/` | Playwright-based Yahoo Finance scraper |
| Import scripts | `tools/src/` | CLI scripts for importing and promoting instruments |

---

## Data Scraping

- `YahooFinanceScraper` drives a headless Chromium browser via Playwright.
- The quote statistics panel is scraped for 16 market metrics (previous close, volume, P/E ratio, etc.).
- Historical price data (1Y daily, 5Y weekly) and dividends are fetched from the Yahoo Finance chart JSON API using the browser's authenticated session cookie.
- `promote.ts` runs multiple parallel workers (default: 3), each owning its own Chromium instance.
- A shared `CircuitBreaker` halts all workers after 5 consecutive failures (across any workers), guarding against rate limiting.

---

## Database

Schema is defined in `docs/entities/entities.md`. All migrations are in `MarketScrape.Infrastructure/Migrations/`.

| Table | Description |
|---|---|
| `instrument_types` | Lookup table: Equities, ETF, Stock, etc. |
| `potential_instruments` | Raw import candidates; validated flag tracks promote progress |
| `instruments` | Promoted, validated instruments with full metadata |
| `instrument_price_history` | Daily (`1d`) and weekly (`1wk`) OHLCV price records |
| `instrument_dividends` | Dividend events (ex-date, payment date, amount per share) |

- All timestamps stored in UTC.
- Price values stored as `numeric(18,6)`.
- Unique constraints prevent duplicate price history and dividend rows on upsert.
- Migrations managed via EF Core CLI (`dotnet ef migrations add`).

---

## REST API

Base URL: `http://localhost:5204`

### Core CRUD endpoints

All three top-level entities expose the same operations:

| Method | Route | Description |
|---|---|---|
| `GET` | `/{entity}` | Get all records |
| `GET` | `/{entity}/{id}` | Get single record (404 if not found) |
| `POST` | `/{entity}` | Create single record |
| `POST` | `/{entity}/batch` | Create multiple records |
| `PUT` | `/{entity}/{id}` | Update single record (404 if not found) |
| `PUT` | `/{entity}/batch` | Update multiple records |
| `DELETE` | `/{entity}/{id}` | Delete single record (404 if not found) |
| `DELETE` | `/{entity}/batch` | Delete multiple records (body: `[1, 2, 3]`) |

Entities: `instrument-types`, `instruments`, `potential-instruments`.

### Instrument sub-resources

| Method | Route | Description |
|---|---|---|
| `GET` | `/instruments/{id}/price-history` | Get price history (optional `?granularity=1d\|1wk`) |
| `POST` | `/instruments/{id}/price-history/batch` | Upsert price history records; returns `{ inserted }` |
| `GET` | `/instruments/{id}/dividends` | Get dividend records |
| `POST` | `/instruments/{id}/dividends/batch` | Upsert dividend records; returns `{ inserted }` |

### Additional

| Method | Route | Description |
|---|---|---|
| `PATCH` | `/potential-instruments/{id}/validate` | Mark a potential instrument as validated |

- All responses are JSON.
- Errors return standard HTTP status codes.
- OpenAPI schema available at `/openapi/v1.json` in development.

---

## Project Structure

```
market-scrape/
├── api/
│   └── src/
│       ├── MarketScrape.Api/           # Minimal API endpoints, Program.cs, DI wiring
│       ├── MarketScrape.Core/          # Domain entities, repository interfaces
│       └── MarketScrape.Infrastructure/  # AppDbContext, EF migrations, repositories
├── tools/
│   └── src/
│       ├── scrapers/
│       │   └── YahooFinanceScraper.ts  # Playwright scraper
│       ├── importers/
│       │   └── ListingsImporter.ts     # Bulk-imports Listings.txt via API
│       ├── utilities/
│       │   └── CircuitBreaker.ts       # Shared failure-threshold guard
│       ├── types/
│       │   └── index.ts                # Shared TypeScript types (ChartData, ScrapeResult, etc.)
│       ├── dev.ts                      # Dev sandbox: scrape a single ticker
│       ├── import.ts                   # Entry point: run listings importer
│       └── promote.ts                  # Entry point: validate & promote instruments
├── temp/                               # Sample data / scratch files
└── docs/
    ├── entities/entities.md            # Database schema (DBML)
    └── specs/                          # Project specs and plans
```

---

## Future Considerations

- Add authentication (API keys or JWT) before any public exposure.
- Support additional data sources beyond Yahoo Finance.
- Introduce a caching layer (e.g. Redis) for frequently queried data.
- Expose aggregated or computed metrics (moving averages, etc.) via the API.
- Scheduled scrape runs via a .NET `BackgroundService` or external scheduler.
- Structured logging (Serilog) and scrape run audit records.

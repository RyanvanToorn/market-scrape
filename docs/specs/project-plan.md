# Project Plan

## Phase 0 — Scaffolding & Setup ✅
**Goal**: Repo structure exists, both sub-projects build and run.

- Init repo, set up `tools/` (Node/TS) and `api/` (.NET solution)
- Configure TypeScript, ESLint, Playwright
- Create .NET solution with 3 projects: Api, Core, Infrastructure
- Set up PostgreSQL locally (Docker)
- Add `.gitignore` entries for both ecosystems

---

## Phase 1 — Scraper (TypeScript) ✅
**Goal**: Playwright scraper fetches and outputs structured JSON for a given ticker.

- `YahooFinanceScraper` class using Playwright / Chromium
- Scrapes quote statistics panel (16 metrics) and chart API (1Y daily + 5Y weekly OHLCV + dividends)
- Typed JSON output matching `ScrapeResult` / `ChartData` contracts in `types/index.ts`
- `dev.ts` sandbox for iterating against live tickers
- Random inter-request delay to reduce scrape fingerprint

---

## Phase 2 — Data Layer (C#) ✅
**Goal**: Scraped JSON can be persisted to PostgreSQL via EF Core.

- Domain entities in `MarketScrape.Core`: `InstrumentType`, `Instrument`, `PotentialInstrument`, `InstrumentPriceHistory`, `InstrumentDividend`
- `AppDbContext` with Fluent API column/table mapping (snake_case)
- EF Core migrations: `InitialCreate`, `AddPotentialInstrument`, `AddValidatedToPotentialInstrument`, `AddUniqueConstraint_Instruments_SymbolExchange`, `AddPriceHistoryAndDividends`
- Repository interfaces in `Core`, concrete implementations in `Infrastructure`

---

## Phase 3 — REST API (C#) ✅
**Goal**: API serves stored data over HTTP.

- ASP.NET Core Minimal API in `MarketScrape.Api`
- Full CRUD for `instrument-types`, `instruments`, `potential-instruments`
- Sub-resource endpoints: `GET/POST /instruments/{id}/price-history`, `GET/POST /instruments/{id}/dividends`
- `PATCH /potential-instruments/{id}/validate`
- Batch upsert for price history and dividends (deduplicates via unique constraints)
- OpenAPI schema auto-generated in development

---

## Phase 4 — Integration ✅
**Goal**: Scraper feeds data into the API/DB end-to-end.

- `ListingsImporter` (`import.ts`): reads `Listings.txt`, auto-creates instrument types, bulk-inserts as `PotentialInstrument` rows in batches of 100
- `promote.ts`: validates unvalidated `PotentialInstrument` records via Yahoo Finance scrape; promotes successful ones to `Instrument` with price history and dividends; N parallel Chromium workers (default: 3)
- `CircuitBreaker` halts all workers after 5 consecutive failures across any worker (guards against rate limiting)
- Dry-run mode (`DRY_RUN = true`) logs all mutations without writing to the DB

---

## Phase 5 — Observability & Hardening ⏳
**Goal**: Production-ready for personal use.

- Structured logging (Serilog or built-in .NET logging)
- Scrape run audit records (timestamp, worker, outcome per instrument)
- Docker Compose for one-command full-stack startup
- Retry logic for transient scrape failures
- Scheduled scrape runs (BackgroundService or external cron)

# Project Plan

## Phase 0 — Scaffolding & Setup
**Goal**: Repo structure exists, both sub-projects build and run.

Init repo, set up scraper/ (Node/TS) and api/ (.NET solution)
Configure TypeScript, ESLint, playwright
Create .NET solution with 3 projects: Api, Core, Infrastructure
Set up PostgreSQL locally (Docker recommended)
Add .gitignore entries for both ecosystems
---


## Phase 1 — Scraper (TypeScript)

**Goal**: Playwright scraper fetches and outputs structured JSON for at least one ticker.

Implement a YahooFinanceScraper class using Playwright
Scrape current quote + basic historical prices
Output typed JSON matching the expected data contracts
Write Playwright tests against a known ticker
Add retry logic and error handling
---

## Phase 2 — Data Layer (C#)

**Goal**: Scraped JSON can be persisted to PostgreSQL via EF Core.

Define domain models in Core: Asset, PriceSnapshot, ScrapeRun
Implement EF Core DbContext and migrations in Infrastructure
Implement repository interfaces + concrete implementations
Write unit tests for repositories (using an in-memory or test DB)
---

## Phase 3 — REST API (C#)

**Goal**: API serves stored data over HTTP.

Scaffold ASP.NET Core Minimal API in Api project
Implement endpoints: GET /assets, GET /assets/{ticker}/prices, GET /scrape/runs, POST /scrape
Wire Infrastructure services via DI
Write integration tests for endpoints
---

## Phase 4 — Integration

**Goal**: Scraper feeds data into the API/DB end-to-end.

Define a contract: scraper writes JSON → C# API ingests it (via a POST /ingest endpoint, a shared file, or a message queue — file/HTTP is simplest to start)
Add a scheduled run via .NET BackgroundService that invokes the scraper process
Test the full pipeline locally
---

## Phase 5 — Observability & Hardening

**Goal**: Production-ready-ish for personal use.

Structured logging (Serilog or built-in .NET logging)
ScrapeRun records written on every execution
Error alerting/retry logic
Docker Compose for local full-stack run
---
# MarketScrape

## Quick Start

Run these steps in order from the repo root to get everything running from scratch.

### 1. Start the database
```powershell
docker run --name marketscrape-db -e POSTGRES_USER=marketscrape -e POSTGRES_PASSWORD=marketscrape -e POSTGRES_DB=marketscrape -p 5432:5432 -d postgres:17
```
> If the container already exists but is stopped: `docker start marketscrape-db`

**Verify:** `docker ps --filter name=marketscrape-db`

### 2. Apply database migrations
```powershell
cd api
dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
```

**Verify:** `docker exec -it marketscrape-db psql -U marketscrape -d marketscrape -c "\dt"`

### 3. Start the API
```powershell
cd api
dotnet run --project src/MarketScrape.Api --launch-profile http
```
API will be available at `http://localhost:5204`.

**Verify:** `curl http://localhost:5204/instrument-types`

### 4. Install tool dependencies
```powershell
cd tools
npm install
```

### 5. Run the listings importer
```powershell
cd tools
npm run import:listings
```
Reads `temp/Listings.txt`, auto-creates `Equities`, `ETF`, and `Stock` instrument types if missing, then bulk-inserts all records as `PotentialInstrument` rows in batches of 100.

**Verify:** `docker exec -it marketscrape-db psql -U marketscrape -d marketscrape -c "SELECT COUNT(*) FROM potential_instruments;"`

### 6. Promote potential instruments
```powershell
cd tools
npm run promote:instruments
```
Validates each unvalidated `PotentialInstrument` via Yahoo Finance scrape. Successfully scraped instruments are created as `Instrument` records with price history and dividends, then marked validated. Runs 3 parallel Chromium workers by default. A circuit breaker halts all workers automatically if 5 consecutive failures occur (e.g. rate limiting).

**Verify:** `docker exec -it marketscrape-db psql -U marketscrape -d marketscrape -c "SELECT COUNT(*) FROM instruments;"`

---

## API

Base URL: `http://localhost:5204`

### Endpoints

All three entities (`instrument-types`, `instruments`, `potential-instruments`) expose the same set of operations:

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/{entity}` | Get all records |
| `GET` | `/{entity}/{id}` | Get single record (404 if not found) |
| `POST` | `/{entity}` | Create single record |
| `POST` | `/{entity}/batch` | Create multiple records |
| `PUT` | `/{entity}/{id}` | Update single record (404 if not found) |
| `PUT` | `/{entity}/batch` | Update multiple records |
| `DELETE` | `/{entity}/{id}` | Delete single record (404 if not found) |
| `DELETE` | `/{entity}/batch` | Delete multiple records (body: `[1, 2, 3]`) |

**`InstrumentType` body:** `{ "description": "Stock" }`

**`Instrument` / `PotentialInstrument` body:** `{ "symbol": "AAPL", "name": "Apple Inc", "typeId": 1, "exchange": "NASDAQ" }`

### Starting the API
```powershell
cd api
dotnet run --project src/MarketScrape.Api --launch-profile http
```

---

## Listings Importer

Reads a `.txt` file line-by-line and bulk-inserts records as `PotentialInstrument` rows via the API.

```powershell
cd tools
npm run import:listings
```

Options:
```powershell
# Custom file path
npm run import:listings -- path/to/file.txt

# Custom API URL (default: http://localhost:5204)
$env:API_BASE_URL="http://localhost:5000"; npm run import:listings
```

The importer automatically creates `Equities`, `ETF`, and `Stock` instrument types if they don't already exist. Records with unrecognised asset types are skipped with a warning.

---

## Promote Instruments

Validates `PotentialInstrument` records against Yahoo Finance and promotes successful ones to the `Instrument` table.

```powershell
cd tools
npm run promote:instruments
```

### Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `<workers>` (positional) | `3` | Number of parallel Chromium workers. Can also be set via `$env:WORKERS`. |
| `--headed` (flag) | headless | Pass to show the browser window during scraping. |

```powershell
# 5 parallel workers, headless
npm run promote:instruments -- 5

# 3 workers, show browser
npm run promote:instruments -- 3 --headed

# Via environment variable
$env:WORKERS=5; npm run promote:instruments
```

> **DRY_RUN mode:** Set `DRY_RUN = true` at the top of `tools/src/promote.ts` to log all mutations without writing to the database.

---

## Scraper

```powershell
cd tools
npm run dev:scraper
```

Runs the Playwright-based Yahoo Finance scraper and outputs structured JSON to the console.

---

## Database

### Starting
```powershell
# First time
docker run --name marketscrape-db -e POSTGRES_USER=marketscrape -e POSTGRES_PASSWORD=marketscrape -e POSTGRES_DB=marketscrape -p 5432:5432 -d postgres:17

# Subsequent starts
docker start marketscrape-db
```

### Querying
```powershell
docker exec -it marketscrape-db psql -U marketscrape -d marketscrape
```
Useful commands inside `psql`: `\dt` (list tables), `\d "table_name"` (describe table), `\q` (quit).

Or run a one-liner:
```powershell
docker exec -it marketscrape-db psql -U marketscrape -d marketscrape -c "SELECT COUNT(*) FROM potential_instruments;"
```

### Migrations

Apply existing migrations:
```powershell
cd api
dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
```

Add a new migration:
```powershell
cd api
dotnet ef migrations add <MigrationName> -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
```

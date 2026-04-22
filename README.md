# READ ME

## Running the Scraper
1. Navigate to the `tools/` directory.
2. Install dependencies: `npm install`
3. Run the scraper: `npm run dev:scraper`
   - Executes the Playwright script and outputs structured JSON to the console.
   - Accepts a ticker as an argument, e.g. `npm run dev:scraper -- AAPL`

## Running the Listings Importer
Imports records from a `.txt` file into the database as `PotentialInstrument` rows via the API.

**Prerequisites:**
- The API must be running (see [Running the API](#running-the-api) below).
- At least one `InstrumentType` must exist in the database. Create one via:
  ```
  POST /instrument-types
  { "description": "ETF" }
  ```
  Repeat for any other asset types present in your listings file (e.g. `Stock`).

**Steps:**
1. Navigate to the `tools/` directory.
2. Install dependencies if not already done: `npm install`
3. Run the importer:
   ```
   npm run import:listings
   ```
   By default this reads from `temp/Listings.txt` (relative to the repo root). To use a different file:
   ```
   npm run import:listings -- path/to/your/file.txt
   ```
   To target a different API URL (default is `http://localhost:5204`):
   ```
   API_BASE_URL=http://localhost:5000 npm run import:listings
   ```

**Output:** The importer logs progress per batch of 100 records. Rows with an unrecognised asset type are skipped with a warning — add the missing `InstrumentType` via the API and re-run.

## Running the API
1. Ensure the database container is running (see DB section below).
2. Navigate to the `api/` directory.
3. Run the API:
   ```
   dotnet run --project src/MarketScrape.Api
   ```
4. The API will be available at:
   - http://localhost:5204
   - https://localhost:7004

## DB

### Starting the Database
Start the PostgreSQL container (Docker Desktop must be running):
```
docker run --name marketscrape-db -e POSTGRES_USER=marketscrape -e POSTGRES_PASSWORD=marketscrape -e POSTGRES_DB=marketscrape -p 5432:5432 -d postgres:17
```

If the container already exists but is stopped:
```
docker start marketscrape-db
```

### Migrations

#### Apply existing migrations
1. Navigate to the `api/` directory.
2. Run:
   ```
   dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
   ```

#### Add a new migration
1. Navigate to the `api/` directory.
2. Generate the migration:
   ```
   dotnet ef migrations add <MigrationName> -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
   ```
3. Apply it:
   ```
   dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
   ```

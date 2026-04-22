# READ ME

## Running Scraper
1. Navigate to the `scraper/` directory.
2. Install dependencies: `npm install`  
3. Run the scraper: `npm run dev:scraper`  
   - This will execute the Playwright script and output structured JSON to the console.
   - Accepts a ticker as an argument, e.g. `npm run dev:scraper -- AAPL`

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

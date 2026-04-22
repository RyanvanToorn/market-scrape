# READ ME

## Running Scraper
1. Navigate to the `scraper/` directory.
2. Install dependencies: `npm install`  
3. Run the scraper: `npm run dev:scraper`  
   - This will execute the Playwright script and output structured JSON to the console.
   - Accepts a ticker as an argument, e.g. `npm run dev:scraper -- AAPL`

## Running APIs

## DB

### Generate Migrations
1. Navigate to the `api/` directory.
2. Run the following command to generate a new migration:
   ```
   dotnet ef migrations add <MigrationName> -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
   ```
   Replace `<MigrationName>` with a descriptive name for your migration.
3. After generating the migration, apply it to the database:
   ```
   dotnet ef database update -p src/MarketScrape.Infrastructure -s src/MarketScrape.Api
   ```

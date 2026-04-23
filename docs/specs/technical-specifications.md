# MarketScrape — Technical Specifications

## Tech Stack

| Layer | Technology |
|---|---|
| Language | C# (.NET 8+) |
| Web Framework | ASP.NET Core (Minimal APIs or MVC) |
| Database | PostgreSQL |
| ORM | Entity Framework Core |
| HTTP Client | `HttpClient` / `HtmlAgilityPack` or `AngleSharp` for scraping |
| Scheduling | `BackgroundService` (hosted service) or Hangfire |

---

## Architecture Overview

The application follows a simple layered architecture:

```
Scraper → Data Layer (EF Core / PostgreSQL) → REST API
```

- **Scraper**: Fetches and parses data from external sources (Yahoo Finance, etc.).
- **Data Layer**: Models, migrations, and repository logic via Entity Framework Core and PostgreSQL.
- **REST API**: ASP.NET Core endpoints that serve stored data to consumers.

---

## Data Scraping

- HTTP requests made using `HttpClient` with appropriate headers to avoid rejection.
- HTML parsing via `HtmlAgilityPack` or `AngleSharp`, or JSON parsing if an unofficial API endpoint is available.
- Scraping targets: Yahoo Finance (stock quotes, historical prices).
- Each scrape run records a timestamp and status (success/failure) for traceability.

---

## Database

### Key Tables (subject to change)

| Table | Description |
|---|---|
| `assets` | Tracked tickers/symbols (e.g. AAPL, MSFT) |
| `price_snapshots` | Point-in-time price records (open, high, low, close, volume) |
| `scrape_runs` | Log of each scrape execution (timestamp, status, error message) |

- Migrations managed via EF Core CLI (`dotnet ef migrations add`).
- All timestamps stored in UTC.

---

## REST API

### Base URL
`/api/v1`

### Endpoints (initial)

| Method | Path | Description |
|---|---|---|
| `GET` | `/assets` | List all tracked assets |
| `GET` | `/assets/{ticker}/prices` | Get price history for an asset |
| `POST` | `/scrape` | Trigger a manual scrape run |
| `GET` | `/scrape/runs` | List recent scrape run logs |

- Responses are JSON.
- Errors return standard HTTP status codes with a message body.

---

## Project Structure

```
MarketScrape/
├── src/
│   ├── MarketScrape.Api/          # ASP.NET Core project (endpoints, startup)
│   ├── MarketScrape.Core/         # Domain models, interfaces
│   ├── MarketScrape.Infrastructure/  # EF Core, scrapers, external HTTP
└── docs/
```

---

## Future Considerations

- Add authentication (API keys or JWT) before any public exposure.
- Support additional data sources beyond Yahoo Finance.
- Introduce a caching layer (e.g. Redis) for frequently queried data.
- Expose aggregated or computed metrics (moving averages, etc.) via the API.
- Potential integration with AI/ML pipeline for analytics.

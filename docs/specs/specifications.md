# MarketScrape — Specifications

## Overview

MarketScrape is a backend application that collects, stores, and exposes market-related financial data sourced from free public providers (e.g. Yahoo Finance). It is designed as a reusable data layer to power a future frontend (MarketScope) for visualization and manual analysis, and as a personal learning project for C# and backend development.

---

## Goals

- Collect and persist market data from free public sources on a scheduled or on-demand basis.
- Expose that data through a clean REST API for consumption by other applications.
- Serve as a foundation for future analytics or AI-driven insights.
- Provide hands-on experience with C#, backend architecture, and real-world data handling.

---

## Functional Requirements

### Data Collection
- Scrape market data (e.g. stock prices, tickers, historical data) from Yahoo Finance and similar free sources.
- Support scheduled (automated) and on-demand (manual trigger) data collection.
- Handle errors and failures gracefully — failed scrapes should be logged and retried or skipped without crashing the service.

### Data Storage
- Persist all collected data in a relational database.
- Store raw and/or normalized data to support both current snapshots and historical records.

### REST API
- Expose collected data via a RESTful API.
- Support querying data by asset, date range, and other relevant filters.
- Return structured JSON responses.

### Observability
- Log key events: scrape runs, errors, data written.

---

## Out of Scope

- Frontend UI (handled separately by MarketScope).
- Real-time streaming or websocket feeds.
- Paid data sources or authenticated brokerage APIs.
- User authentication and authorization (initial version).

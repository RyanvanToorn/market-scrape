# OHLCV Data

> **Type:** Raw stored data  
> **Granularities:** Daily, Weekly, Monthly  
> **Source:** Yahoo Finance  

OHLCV (Open, High, Low, Close, Volume) is the foundational dataset stored by MarketScrape. All technical indicators and price-derived features are **calculated from this data** — it is the only market data persisted to the database.

---

## Fields

| Field   | Description |
|---------|-------------|
| **Open**   | The price at which the instrument first traded at the start of the period. |
| **High**   | The highest price reached during the period. |
| **Low**    | The lowest price reached during the period. |
| **Close**  | The final price at which the instrument traded at the end of the period. This is the most referenced value for indicator calculations. |
| **Volume** | The total number of shares (or contracts) traded during the period. A measure of market participation and conviction. |

---

## Granularities

Data is stored at three levels of granularity, each serving a distinct analytical purpose:

### Daily
One row per trading day. The most granular data available. Used for:
- Short-term entry and exit timing
- Computing fast-moving indicators (e.g. RSI, EMA)
- Detecting intraday candlestick patterns

### Weekly
One row per calendar week, aggregated to the Friday close date. Used for:
- Intermediate trend confirmation
- Filtering out daily noise
- Alignment with higher-timeframe strategies

### Monthly
One row per calendar month, aggregated to the final trading day of the month. Used for:
- Macro bias determination
- Long-term trend analysis (e.g. 200-period moving averages)
- Portfolio-level context

#### Why Monthly is Conditional

Monthly data is **only stored when it is meaningful**. For newly-listed instruments with a short price history, Yahoo Finance may only return a handful of months of data. In such cases, the monthly rows would be either:

- Identical to the weekly rows (same date, same OHLCV values), or
- So few in number as to be useless for any meaningful calculation

To avoid storing redundant or misleading data, monthly rows are skipped if the instrument does not yet have sufficient history to generate distinct monthly aggregates.

---

## Relationship to Indicators

OHLCV data is the **only** market data stored in the database. All technical indicators — moving averages, RSI, MACD, ATR, OBV, etc. — are derived from this raw data at query or analysis time.

This keeps storage lean and avoids the complexity of keeping pre-calculated indicator values in sync as new price data arrives.

| Data Type | Stored? | Notes |
|-----------|---------|-------|
| OHLCV (Daily) | Yes | Always stored |
| OHLCV (Weekly) | Yes | Always stored |
| OHLCV (Monthly) | Conditional | Only when history is sufficient |
| Technical Indicators | No | Calculated on demand |
| Price-derived features | No | Calculated on demand |

---

## Related

- [Indicators Overview](README.md) — All indicator categories and their relationship to OHLCV data.
- [Trend Indicators](trend.md) — SMA, EMA, MACD (all derived from Close price).
- [Volume Indicators](volume.md) — OBV and volume analysis (derived from Close + Volume).

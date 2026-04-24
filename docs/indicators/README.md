# Indicators — Overview

This section documents the technical indicators and price features used throughout the MarketScrape analysis pipeline.

---

## Data Foundation

All indicators are derived from **OHLCV data** (Open, High, Low, Close, Volume) stored at three granularities:

| Granularity | Description |
|-------------|-------------|
| Daily       | One row per trading day. Most detailed granularity. |
| Weekly      | Aggregated to the week ending date. |
| Monthly     | Aggregated to the month end. Conditional — only stored when meaningful history exists. |

See [OHLCV.md](OHLCV.md) for full details on data storage, granularity rationale, and field definitions.

OHLCV is the **raw stored data**. Everything else listed here is **calculated on demand** from that foundation.

---

## Indicator Categories

### Trend Indicators
> *Tell you the direction of the market.*

The foundation of any analysis. Without confirming the prevailing trend, other signals lose much of their value.

| Indicator | Common Parameters | File |
|-----------|------------------|------|
| Simple Moving Average (SMA) | 20, 50, 200 periods | [trend.md](trend.md) |
| Exponential Moving Average (EMA) | 12, 26 periods | [trend.md](trend.md) |
| MACD | 12, 26, 9 | [trend.md](trend.md) |

---

### Momentum Indicators
> *Tell you the speed and strength of price movement.*

Used primarily for timing entries and exits within an established trend. Most effective when used **with** the trend, not against it.

| Indicator | Common Parameters | File |
|-----------|------------------|------|
| Relative Strength Index (RSI) | 14 periods | [momentum.md](momentum.md) |
| Stochastic Oscillator | 14, 3, 3 | [momentum.md](momentum.md) |
| Rate of Change (ROC) | 14 periods | [momentum.md](momentum.md) |

---

### Volatility Indicators
> *Measure the degree of price variation over time.*

Used for position sizing, stop-loss placement, and identifying periods of compression or expansion.

| Indicator | Common Parameters | File |
|-----------|------------------|------|
| Average True Range (ATR) | 14 periods | [volatility.md](volatility.md) |
| Bollinger Bands | 20 periods, 2 std dev | [volatility.md](volatility.md) |

---

### Volume Indicators
> *Confirm price moves with participation data.*

Volume reveals conviction. A price move with increasing volume is significantly stronger than one on declining volume.

| Indicator | Common Parameters | File |
|-----------|------------------|------|
| On-Balance Volume (OBV) | N/A | [volume.md](volume.md) |
| Volume Moving Average | 20 periods | [volume.md](volume.md) |
| Volume Spike Detection | N/A (relative to baseline) | [volume.md](volume.md) |

---

### Price-Derived Features
> *Simple, powerful, and often underestimated.*

These are calculated directly from raw OHLCV values without complex formulas. They are frequently more actionable than sophisticated indicators.

| Feature | Description | File |
|---------|-------------|------|
| % Change | Daily / weekly / monthly return | [price-derived.md](price-derived.md) |
| Rolling Returns | Returns over N periods | [price-derived.md](price-derived.md) |
| High/Low Breakouts | Breakout above/below N-period range | [price-derived.md](price-derived.md) |
| Candlestick Ranges | Body size, wick ratios | [price-derived.md](price-derived.md) |

---

## Timeframe Usage Guide

Different timeframes serve different analytical purposes. The general hierarchy is:

| Timeframe | Primary Use |
|-----------|------------|
| Monthly   | Macro bias — is the long-term trend bullish or bearish? |
| Weekly    | Trend confirmation — is the intermediate trend aligned? |
| Daily     | Entry timing — where exactly to enter or exit? |

> **Rule of thumb:** Always align your trade direction with the higher timeframe trend before acting on lower timeframe signals.

---

## Related

- [Strategies](../strategies/README.md) — How these indicators are combined into actionable trading strategies.
- [OHLCV Data](OHLCV.md) — The stored data that all indicators are derived from.

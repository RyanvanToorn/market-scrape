# Strategies — Overview

This section documents the trading strategies that MarketScrape is designed to support through its data pipeline and analysis tooling.

---

## What is a Strategy?

A strategy is a **defined, rules-based system** for determining when to enter and exit a position. Each strategy combines one or more indicators with explicit, unambiguous rules — removing discretion and making backtesting possible.

> Good strategies are boring. The goal is consistent, repeatable edge — not exciting trades.

---

## Strategy Catalogue

| # | Strategy | Type | Complexity | Key Indicators |
|---|----------|------|-----------|----------------|
| 1 | [Trend Following](trend-following.md) | Trend | Beginner | SMA (50) |
| 2 | [Moving Average Crossover](ma-crossover.md) | Trend | Beginner | SMA (20, 50) |
| 3 | [RSI Pullback in Uptrend](rsi-pullback.md) | Momentum | Intermediate | SMA (50), RSI (14) |
| 4 | [Breakout](breakout.md) | Breakout | Intermediate | N-day High, ATR, Volume |
| 5 | [Volatility Expansion](volatility-expansion.md) | Volatility | Advanced | Bollinger Bands, ATR |

---

## Strategy Types

### Trend Following
Strategies that ride established trends. They accept a delayed entry in exchange for a high-probability directional bias. Best in trending markets; underperform in choppy or range-bound conditions.

### Momentum / Pullback
Strategies that enter on pullbacks within a trend — waiting for the trend to dip to a more favourable price before entering. Higher precision than pure trend following, but require more active management.

### Breakout
Strategies that enter when price moves decisively beyond a defined range boundary. Capture early trend initiation, but are prone to false breakouts in low-volatility or choppy markets.

### Volatility
Strategies built around volatility patterns — specifically the compression/expansion cycle. Lower frequency but can capture large moves.

---

## General Principles

### Trend Alignment First
All strategies perform better when trade direction is aligned with the prevailing trend on the next-higher timeframe. Before acting on a daily signal, confirm the weekly is aligned. Before acting on a weekly signal, confirm the monthly is aligned.

### Risk Management Is Not Optional
Every strategy must define:
- **Stop-loss level** — Where are you wrong? (Use ATR for objective placement)
- **Position size** — How much to risk per trade? (Typically 1–2% of account)
- **Exit rules** — When do you take profit or cut losses?

### Volume Confirmation
Where applicable, volume confirmation significantly improves signal quality. A breakout or momentum move on above-average volume is far more reliable than one on thin participation.

---

## Related

- [Indicators Overview](../indicators/README.md) — The building blocks these strategies are composed from.
- [Trend Indicators](../indicators/trend.md)
- [Momentum Indicators](../indicators/momentum.md)
- [Volatility Indicators](../indicators/volatility.md)
- [Volume Indicators](../indicators/volume.md)
- [Price-Derived Features](../indicators/price-derived.md)

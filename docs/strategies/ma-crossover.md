# Strategy 2: Moving Average Crossover

> **Type:** Trend  
> **Complexity:** Beginner  
> **Indicators Required:** SMA (20), SMA (50)  
> **Timeframes:** Daily (signal), Weekly (confirmation)  

## Overview

The moving average crossover strategy uses two SMAs of different lengths. When the shorter (faster) average crosses above the longer (slower) average, it signals a shift to bullish momentum. When it crosses below, it signals a shift to bearish momentum.

This is a classic system. It is widely known, widely tested, and still works — precisely because it captures the core dynamic of trending markets: momentum builds, persists, and then fades.

> *"Classic system. Good for testing your engine."*

Compared to Strategy 1, the crossover provides **earlier entry signals** (you enter when momentum builds, not after price crosses a single level) but introduces **more false signals** in choppy markets. The trade-off is well-understood and manageable.

---

## Entry Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | 20-day SMA crosses **above** the 50-day SMA | Bullish crossover — primary entry signal |
| 2 | Price is above both the 20 and 50 SMA at time of crossover | Avoids entries during price gaps or anomalies |
| 3 | *(Optional)* Weekly trend is bullish (price > 50-week SMA) | Higher timeframe alignment filter |

Enter at the next session's open after the crossover is confirmed on the close.

---

## Exit Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | 20-day SMA crosses **below** the 50-day SMA | Bearish crossover — primary exit signal |
| 2 | Hard stop at initial risk level | Defined at entry (see Risk Management) |

---

## Risk Management

- **Stop-loss:** Set below the most recent swing low at time of entry, or 2× ATR(14) below the 50 SMA.
- **Position size:** Risk no more than 1–2% of account capital per trade.
- **Re-entry:** If stopped out but the crossover has not reversed, consider re-entering on a subsequent pullback to the 20 SMA.

---

## Golden Cross / Death Cross

The most famous application of this strategy uses the **50-day and 200-day SMAs**:

| Event | Condition | Significance |
|-------|-----------|-------------|
| Golden Cross | 50 SMA crosses above 200 SMA | Major bullish signal — widely watched by institutional traders |
| Death Cross | 50 SMA crosses below 200 SMA | Major bearish signal |

The Golden/Death Cross is a **longer-duration, lower-frequency** version of this strategy. Signals are rare but highly significant. It is best used as a **macro regime filter**, not a tactical entry system.

---

## Strengths

- Earlier signals than simple price-vs-SMA (Strategy 1).
- Well-defined, mechanical rules with no ambiguity.
- The Golden/Death Cross variant is useful as a macro regime indicator.
- Easy to implement and automate.

---

## Weaknesses

- Still a lagging indicator — crossovers occur after the trend has already begun.
- **Whipsaws** in sideways markets: the two SMAs will repeatedly cross back and forth.
- In fast-moving markets, the crossover may occur near the end of a move.

---

## Upgrade Path

1. **Add volume filter:** Require above-average volume at the crossover to reduce false signals.
2. **Confirm with MACD:** Require MACD histogram to be positive at crossover time.
3. **Use EMA instead of SMA:** EMAs react faster and reduce lag — the EMA(12)/EMA(26) pair mirrors the MACD inputs.
4. **Upgrade to Strategy 3** for entries that wait for pullbacks after the crossover, improving average entry price.

---

## Backtesting Notes

- The 20/50 crossover is effective for swing trading on daily charts.
- Works best in trending market environments. Monitor average signal frequency — if crossovers occur more than once a month on average, the market may be too choppy for this strategy.
- Expected win rate: 40–50%. Returns depend on proper position sizing and not cutting winners early.

---

## Related

- [Strategy 1: Trend Following](trend-following.md) — Simpler predecessor using a single SMA.
- [Strategy 3: RSI Pullback](rsi-pullback.md) — Refinement that waits for pullback after trend is established.
- [Trend Indicators](../indicators/trend.md) — SMA calculation and Golden/Death Cross detail.
- [Strategies Overview](README.md)

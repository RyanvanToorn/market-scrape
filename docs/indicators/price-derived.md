# Price-Derived Features

> **Category:** Price-Derived  
> **Data Required:** Open, High, Low, Close, Volume (OHLCV)  
> **Timeframes:** Daily, Weekly, Monthly  

Price-derived features are computed directly from raw OHLCV values — no complex formula, no smoothing, no external parameters. They are often **underestimated** relative to sophisticated indicators, but they frequently carry more predictive signal.

Simple questions like *"how much has this moved in the last 20 days?"* or *"is price at a new high?"* are powerful precisely because they are direct and unambiguous.

---

## Percentage Change

### Overview

The simplest measure of return: how much has price moved from one point to another, expressed as a percentage. Used across all timeframes to measure momentum, normalise performance across instruments, and screen for movers.

### Formula

$$
\%\text{Change} = \frac{C_t - C_{t-n}}{C_{t-n}} \times 100
$$

Where $C_t$ = current close and $C_{t-n}$ = close $n$ periods ago.

### Common Variants

| Variant | Description | n |
|---------|-------------|---|
| Daily % Change | Change from previous close | 1 day |
| Weekly % Change | Change from 5 trading days ago | 5 days |
| Monthly % Change | Approximate 1-month return | 21 days |
| YTD % Change | Year-to-date return | Days since Jan 1 |

### Use Cases

- **Ranking:** Compare % change across instruments to identify the strongest/weakest performers.
- **Momentum screening:** Filter for instruments with consistent positive % change across multiple timeframes.
- **Normalisation:** Express moves in percentage terms to make different instruments comparable.
- **Trend health:** In a healthy uptrend, daily % changes should generally be positive on above-average volume days.

---

## Rolling Returns

### Overview

Rolling returns compute the % change over a sliding window of N periods, producing a time series of how returns have evolved. This reveals whether an instrument is accelerating, decelerating, or exhibiting cyclical patterns.

### Formula

$$
\text{Rolling Return}_{t,n} = \frac{C_t - C_{t-n}}{C_{t-n}} \times 100
$$

Applied across all periods $t$ in the dataset with the same lookback $n$.

### Common Windows

| Window | Trading Days | Use Case |
|--------|-------------|---------|
| 5 days | 1 week | Short-term momentum |
| 20 days | ~1 month | Standard momentum lookback |
| 60 days | ~3 months | Intermediate momentum |
| 252 days | ~1 year | Annual return, trend strength |

### Use Cases

- **Momentum persistence:** Is the instrument consistently delivering positive rolling returns, or is the return declining?
- **Mean reversion detection:** Extreme rolling returns (positive or negative) may revert toward the mean.
- **Ranking:** Sort a universe of instruments by 20-day rolling return to find the strongest momentum plays.

---

## High / Low Breakouts

### Overview

A breakout occurs when price exceeds the highest high (or falls below the lowest low) over a defined lookback period. This signals that the instrument is in **price discovery** territory — there is no overhead resistance from the recent past.

### Formula

$$
\text{N-day High} = \max(H_{t-n+1}, \ldots, H_t)
$$
$$
\text{N-day Low} = \min(L_{t-n+1}, \ldots, L_t)
$$

A bullish breakout is flagged when:
$$
C_t > \text{N-day High}_{t-1}
$$

A bearish breakdown is flagged when:
$$
C_t < \text{N-day Low}_{t-1}
$$

### Common Lookback Periods

| Period | Trading Days | Significance |
|--------|-------------|-------------|
| 20 days | ~1 month | Short-term range breakout |
| 52 weeks | ~252 days | Annual high — strong institutional signal |
| All-time high | Full history | Maximum significance |

### Interpretation

| Condition | Meaning |
|-----------|---------|
| Breakout above N-day high | No overhead supply in N periods — bulls in control |
| Breakdown below N-day low | No support in N periods — bears in control |
| 52-week high breakout | Extremely bullish — stocks at yearly highs tend to continue higher |
| 52-week low breakdown | Extremely bearish — stocks at yearly lows tend to continue lower |

> The 52-week high breakout is one of the most robust mechanical signals in equity markets. Research consistently shows that stocks making new 52-week highs outperform over the subsequent months.

### Signals

| Signal | Condition |
|--------|-----------|
| Confirmed breakout | Close above N-day high on above-average volume |
| Confirmed breakdown | Close below N-day low on above-average volume |
| Failed breakout | Close above N-day high but volume below average, then reversal |

---

## Candlestick Ranges

### Overview

Individual candle geometry reveals the battle between buyers and sellers within a single period. These features are calculated directly from Open, High, Low, and Close values.

### Key Measurements

| Feature | Formula | Interpretation |
|---------|---------|----------------|
| **Total Range** | $H - L$ | Overall volatility of the session |
| **Body Size** | $|C - O|$ | Conviction of the move (large body = decisive session) |
| **Upper Wick** | $H - \max(O, C)$ | Selling pressure — price reached high but was rejected |
| **Lower Wick** | $\min(O, C) - L$ | Buying pressure — price reached low but recovered |
| **Body Ratio** | $\frac{|C - O|}{H - L}$ | Percentage of range captured by the body (0–1) |

### Candle Types by Body Ratio

| Body Ratio | Candle Type | Meaning |
|-----------|------------|---------|
| > 0.8 | Strong candle | High conviction — buyers or sellers dominated |
| 0.4–0.8 | Normal candle | Moderate conviction |
| < 0.2 | Doji / Spinning top | Indecision — buyers and sellers equally matched |

### Notable Patterns (Single Candle)

| Pattern | Condition | Implication |
|---------|-----------|-------------|
| Hammer | Long lower wick, small body, little/no upper wick, at a low | Bullish reversal potential |
| Shooting Star | Long upper wick, small body, little/no lower wick, at a high | Bearish reversal potential |
| Bullish Marubozu | Large body, virtually no wicks, close > open | Strong bullish session |
| Bearish Marubozu | Large body, virtually no wicks, close < open | Strong bearish session |
| Doji | Open ≈ Close | Indecision; significant at extremes or after trends |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Entry/exit refinement, reversal candle detection |
| Weekly | Weekly candle health in a trend (large body = strong trend) |

---

## Summary

| Feature | Formula Complexity | Most Useful For |
|---------|--------------------|----------------|
| % Change | Very low | Ranking, momentum screening |
| Rolling Returns | Low | Momentum persistence, instrument comparison |
| High/Low Breakouts | Low | Entry signals, trend initiation detection |
| Candlestick Ranges | Low | Session quality assessment, reversal detection |

---

## Related

- [Trend Indicators](trend.md) — Breakouts are most reliable when aligned with the trend.
- [Volume Indicators](volume.md) — Volume confirms breakouts and strong candles.
- [Breakout Strategy](../strategies/breakout.md) — Built directly on N-day high/low breakouts.
- [OHLCV Data](OHLCV.md) — The raw O, H, L, C, V values these features are derived from.

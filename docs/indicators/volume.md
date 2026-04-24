# Volume Indicators

> **Category:** Volume  
> **Data Required:** Close price + Volume (OHLCV)  
> **Timeframes:** Daily, Weekly  

Volume indicators use the **Volume** field from OHLCV data to confirm or question the validity of price moves. Price tells you *what* happened; volume tells you *how much conviction* was behind it.

> **Core principle:** Volume confirms moves. A price rise on heavy volume is significantly more meaningful than the same rise on thin volume.

| Scenario | Volume | Interpretation |
|----------|--------|----------------|
| Price rising | High | Strong bullish move — buyers in control |
| Price rising | Low | Weak rally — lack of conviction, potential fake-out |
| Price falling | High | Strong bearish move — sellers in control |
| Price falling | Low | Weak pullback — likely temporary in an uptrend |

---

## On-Balance Volume (OBV)

### Overview

OBV is a cumulative volume indicator. It adds the day's volume when the close is up and subtracts it when the close is down. Over time, the OBV line reveals **accumulation** (smart money buying) or **distribution** (smart money selling) — often before price itself moves.

OBV is one of the most powerful tools for detecting early-stage institutional moves.

### Formula

$$
OBV_t =
\begin{cases}
OBV_{t-1} + V_t & \text{if } C_t > C_{t-1} \\
OBV_{t-1} - V_t & \text{if } C_t < C_{t-1} \\
OBV_{t-1} & \text{if } C_t = C_{t-1}
\end{cases}
$$

Where $V_t$ = today's volume and $C_t$ = today's close.

> The **absolute value** of OBV is not meaningful — only the **direction and slope** of the OBV line matters.

### Interpretation

| OBV Behaviour | Price Behaviour | Meaning |
|--------------|----------------|---------|
| Rising | Rising | Strong trend — volume confirming price |
| Falling | Falling | Strong downtrend — volume confirming decline |
| Rising | Flat / Falling | Bullish divergence — accumulation occurring before price moves up |
| Falling | Flat / Rising | Bearish divergence — distribution occurring before price moves down |

### Signals

| Signal | Condition | Notes |
|--------|-----------|-------|
| Bullish confirmation | OBV and price both making higher highs | Volume backing the uptrend |
| Bearish confirmation | OBV and price both making lower lows | Volume backing the downtrend |
| Bullish divergence | OBV rising while price declining or flat | Accumulation — potential bullish reversal |
| Bearish divergence | OBV falling while price rising or flat | Distribution — potential bearish reversal |
| OBV breakout | OBV breaks above prior resistance level | Often precedes a price breakout |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Accumulation/distribution detection, trade confirmation |
| Weekly | Institutional flow analysis, macro divergence detection |

---

## Volume Moving Average

### Overview

A moving average applied to the Volume field creates a baseline for "normal" volume. Comparing today's volume to this baseline immediately reveals whether participation is elevated or below average.

### Formula

$$
VMA_n = \frac{V_1 + V_2 + \cdots + V_n}{n}
$$

Where $V_i$ = volume at period $i$.

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Period (n) | 20 | Provides a rolling 4-week (1-month) baseline. |

### Interpretation

| Reading | Meaning |
|---------|---------|
| Volume > VMA | Above-average participation — move is meaningful |
| Volume < VMA | Below-average participation — move may be weak |
| Volume far above VMA | Climactic move — can signal exhaustion or strong trend initiation |
| Volume steadily declining | Consolidation or weakening interest |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Flag above/below average volume on each candle |
| Weekly | Weekly participation trend — is interest growing or fading? |

---

## Volume Spike Detection

### Overview

A volume spike is a session where volume is **significantly above the recent baseline** — typically defined as a multiple of the VMA. Spikes indicate exceptional market activity and almost always accompany important price events (breakouts, reversals, news events, institutional entries/exits).

### Detection Method

$$
\text{Volume Ratio} = \frac{V_t}{VMA_t}
$$

A spike is flagged when the Volume Ratio exceeds a defined threshold:

| Threshold | Classification |
|-----------|---------------|
| > 1.5× VMA | Elevated volume |
| > 2.0× VMA | Significant spike |
| > 3.0× VMA | Extreme spike — high-impact event |

### Interpretation

| Context | Volume Spike Meaning |
|---------|---------------------|
| Breakout above resistance + spike | High-conviction breakout — likely to follow through |
| Breakdown below support + spike | High-conviction breakdown |
| Reversal candle + spike | Potential climactic reversal (buyers/sellers exhausted) |
| No clear price pattern + spike | Investigate for news; likely an event-driven move |
| Spike on flat price | Possible block trade or portfolio rebalancing |

### Signals

| Signal | Condition |
|--------|-----------|
| Confirmed breakout | Price breaks key level with Volume Ratio > 2.0 |
| Suspect breakout | Price breaks key level with Volume Ratio < 1.0 |
| Potential climax top | Price at resistance + extreme spike + bearish candle |
| Potential climax bottom | Price at support + extreme spike + bullish candle |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Most useful here — individual session spikes |
| Weekly | Identifies exceptional weeks; useful for event-driven analysis |

---

## Summary Comparison

| Indicator | Primary Use | Key Strength |
|-----------|------------|-------------|
| OBV | Accumulation/distribution, divergence | Detects smart money flow before price moves |
| Volume MA | Volume baseline | Contextualises whether a session's volume is significant |
| Volume Spikes | Event detection, breakout confirmation | Flags high-conviction moves immediately |

---

## Related

- [Trend Indicators](trend.md) — Combine volume confirmation with trend direction.
- [Breakout Strategy](../strategies/breakout.md) — Volume spikes are a critical confirmation filter for breakouts.
- [OHLCV Data](OHLCV.md) — The Volume field that all of these indicators consume.

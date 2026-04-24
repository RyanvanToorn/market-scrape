# Momentum Indicators

> **Category:** Momentum  
> **Data Required:** Close price, High, Low (OHLCV)  
> **Timeframes:** Daily, Weekly  

Momentum indicators measure the **speed and strength** of price movement. They answer the question: *is this trend accelerating or losing steam?*

Unlike trend indicators, momentum indicators are typically **oscillators** — they fluctuate between fixed bounds and identify overbought/oversold conditions. They are most effective when used **in alignment with the prevailing trend**, not as standalone reversal signals.

> **Key insight:** A momentum oscillator showing oversold in a strong uptrend is often a buying opportunity, not a reversal signal.

---

## Relative Strength Index (RSI)

### Overview

RSI measures the magnitude of recent price gains against recent losses, normalized to a 0–100 scale. It is the most widely used momentum oscillator in technical analysis.

### Formula

$$
RSI = 100 - \frac{100}{1 + RS}
$$

$$
RS = \frac{\text{Average Gain over } n \text{ periods}}{\text{Average Loss over } n \text{ periods}}
$$

The first average gain/loss is a simple average over $n$ periods. Subsequent values use an exponential smoothing (Wilder smoothing):

$$
\text{Avg Gain}_t = \frac{(\text{Avg Gain}_{t-1} \times (n-1)) + \text{Current Gain}}{n}
$$

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Period (n) | 14 | Standard. Lower periods = more sensitive and noisier. |

### Interpretation

| RSI Value | Condition | Notes |
|-----------|-----------|-------|
| > 70 | Overbought | Potential for pullback or consolidation |
| 50–70 | Bullish momentum | Strong uptrend territory |
| 50 | Neutral | No clear momentum bias |
| 30–50 | Bearish momentum | Downtrend territory |
| < 30 | Oversold | Potential for bounce or reversal |

> The 30/70 levels are defaults. In strong trends, RSI can remain above 70 or below 30 for extended periods. Consider adjusting thresholds (e.g. 40/80 in a strong bull trend).

### Signals

| Signal | Condition | Notes |
|--------|-----------|-------|
| Oversold bounce | RSI crosses above 30 | Best used in uptrends as a re-entry signal |
| Overbought warning | RSI crosses above 70 | Caution in uptrends; potential exit signal in weak trends |
| Bullish divergence | Price makes lower low, RSI makes higher low | Weakening bearish momentum — potential reversal |
| Bearish divergence | Price makes higher high, RSI makes lower high | Weakening bullish momentum — potential reversal |
| Centreline cross (bullish) | RSI crosses above 50 | Shift to bullish momentum |
| Centreline cross (bearish) | RSI crosses below 50 | Shift to bearish momentum |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Entry timing. RSI < 30 in an uptrend = buy signal. |
| Weekly | Trend momentum filter. Is the weekly RSI above or below 50? |

---

## Stochastic Oscillator

### Overview

The Stochastic Oscillator compares the current closing price to its price range over a lookback period. The premise is that in an uptrend, prices close near the high of the range, and in a downtrend, near the low.

### Components

| Component | Description |
|-----------|-------------|
| %K | The raw stochastic value — where the current close sits within the N-period range |
| %D | A moving average of %K — the signal line |

### Formula

$$
\%K = \frac{C - L_n}{H_n - L_n} \times 100
$$

$$
\%D = SMA_3(\%K)
$$

Where $C$ is the current close, $L_n$ is the lowest low over $n$ periods, and $H_n$ is the highest high over $n$ periods.

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| %K Period (n) | 14 | Lookback range |
| %K Smoothing | 3 | Smooth raw %K |
| %D Period | 3 | Signal line smoothing |

### Interpretation

| Value | Condition |
|-------|-----------|
| > 80 | Overbought — price near top of recent range |
| < 20 | Oversold — price near bottom of recent range |

### Signals

| Signal | Condition | Notes |
|--------|-----------|-------|
| Bullish crossover | %K crosses above %D below 20 | Entry signal in uptrends |
| Bearish crossover | %K crosses below %D above 80 | Exit signal in downtrends |
| Bullish divergence | Price makes lower low, Stochastic makes higher low | Momentum shift |
| Bearish divergence | Price makes higher high, Stochastic makes lower high | Momentum shift |

### vs. RSI

| Aspect | RSI | Stochastic |
|--------|-----|-----------|
| Measures | Speed of gains vs. losses | Price position within range |
| Responsiveness | Slower (smoothed by Wilder method) | Faster |
| Best for | Momentum strength | Short-term overbought/oversold timing |

---

## Rate of Change (ROC)

### Overview

ROC measures the **percentage change** in price over a specified number of periods. It is one of the simplest momentum indicators — it directly answers: *"How much has this instrument moved in N periods?"*

Unlike RSI or Stochastic, ROC is **unbounded** — it can go infinitely positive or negative.

### Formula

$$
ROC = \frac{C_t - C_{t-n}}{C_{t-n}} \times 100
$$

Where $C_t$ is the current close and $C_{t-n}$ is the close $n$ periods ago.

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Period (n) | 14 | Lookback period. Can also use 1 (daily % change). |

### Interpretation

| Reading | Meaning |
|---------|---------|
| ROC > 0 | Price is higher than N periods ago → positive momentum |
| ROC < 0 | Price is lower than N periods ago → negative momentum |
| ROC crossing 0 | Momentum shift |
| ROC diverging from price | Weakening momentum — potential reversal |

### Signals

| Signal | Condition |
|--------|-----------|
| Bullish momentum | ROC rising and > 0 |
| Bearish momentum | ROC falling and < 0 |
| Momentum peak | ROC makes a lower high while price makes a higher high (bearish divergence) |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Entry timing, momentum ranking across instruments |
| Weekly | Intermediate momentum comparison |

---

## Summary Comparison

| Indicator | Bounded | Default Lookback | Best For |
|-----------|---------|-----------------|---------|
| RSI | 0–100 | 14 | Overbought/oversold + divergence |
| Stochastic | 0–100 | 14, 3, 3 | Fast entry/exit timing |
| ROC | Unbounded | 14 | Raw momentum magnitude, ranking |

---

## Related

- [Trend Indicators](trend.md) — Always confirm trend direction before acting on momentum signals.
- [RSI Pullback Strategy](../strategies/rsi-pullback.md) — A practical strategy built around RSI in trending markets.
- [OHLCV Data](OHLCV.md) — The price data consumed by these calculations.

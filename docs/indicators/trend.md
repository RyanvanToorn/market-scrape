# Trend Indicators

> **Category:** Trend  
> **Data Required:** Close price (OHLCV)  
> **Timeframes:** Daily, Weekly, Monthly  

Trend indicators identify the **direction** of price movement over a given period. They are the foundation of most trading strategies — knowing whether the market is trending up, down, or sideways is the single most important signal for determining trade bias.

These indicators are inherently **lagging** (they react to price after the fact), which is a feature, not a bug. The lag filters out noise and prevents you from acting on short-lived fluctuations.

---

## Simple Moving Average (SMA)

### Overview

The SMA is the arithmetic mean of closing prices over N periods. It is the most fundamental trend indicator and serves as a dynamic support/resistance level.

### Formula

$$
SMA_n = \frac{C_1 + C_2 + \cdots + C_n}{n}
$$

Where $C_i$ is the closing price at period $i$ and $n$ is the number of periods.

### Parameters

| Parameter | Common Values | Notes |
|-----------|--------------|-------|
| Period (n) | 20, 50, 200 | Shorter = more sensitive, more noise. Longer = smoother, more lag. |

### Key Levels

| Period | Common Name | Typical Use |
|--------|------------|-------------|
| 20 SMA | Short-term MA | Short-term trend, mean reversion baseline |
| 50 SMA | Medium-term MA | Intermediate trend filter, widely watched level |
| 200 SMA | Long-term MA | Defines bull/bear market regime. **The most important level.** |

### Interpretation

- Price **above** SMA → bullish bias
- Price **below** SMA → bearish bias
- Price crossing SMA → potential trend change signal
- SMA slope (rising vs. falling) → strength of trend

### Signals

| Signal | Condition | Strength |
|--------|-----------|----------|
| Bullish | Price crosses above SMA from below | Medium |
| Bearish | Price crosses below SMA from above | Medium |
| Strong bull | Price > 20 SMA > 50 SMA > 200 SMA (all aligned) | High |
| Strong bear | Price < 20 SMA < 50 SMA < 200 SMA (all aligned) | High |
| Golden Cross | 50 SMA crosses above 200 SMA | High (lagging confirmation) |
| Death Cross | 50 SMA crosses below 200 SMA | High (lagging confirmation) |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Short-term trend. 20/50 SMA for entry timing. |
| Weekly | Intermediate trend. 50 SMA as key trend filter. |
| Monthly | Macro bias. 200 SMA defines long-term regime. |

---

## Exponential Moving Average (EMA)

### Overview

The EMA applies a multiplier that gives **greater weight to more recent prices**. This makes it react faster to new price information than the SMA, at the cost of being slightly noisier.

### Formula

$$
EMA_t = C_t \times k + EMA_{t-1} \times (1 - k)
$$

$$
k = \frac{2}{n + 1}
$$

Where $C_t$ is the current close, $EMA_{t-1}$ is the previous EMA value, and $k$ is the smoothing multiplier.

### Parameters

| Parameter | Common Values | Notes |
|-----------|--------------|-------|
| Period (n) | 12, 26 | Used together as inputs for MACD. |

### Key Differences vs. SMA

| Aspect | SMA | EMA |
|--------|-----|-----|
| Weighting | Equal across all periods | Heavier on recent periods |
| Reaction speed | Slower | Faster |
| Noise sensitivity | Lower | Higher |
| Best for | Identifying established trends | Detecting early trend changes |

### Interpretation

Identical logic to SMA — price above EMA is bullish, below is bearish. Use EMA when you want **faster signal generation**; use SMA when you want a **cleaner, more stable level**.

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Fast trend detection, MACD component. |
| Weekly | Intermediate trend with quicker response than SMA. |

---

## MACD (Moving Average Convergence Divergence)

### Overview

MACD measures the **relationship between two EMAs**. It functions simultaneously as a trend indicator and a momentum indicator, making it one of the most versatile tools in technical analysis.

### Components

| Component | Formula | Description |
|-----------|---------|-------------|
| MACD Line | EMA(12) − EMA(26) | The difference between the fast and slow EMA |
| Signal Line | EMA(9) of MACD Line | A smoothed version of the MACD line |
| Histogram | MACD Line − Signal Line | Visual representation of the gap between the two |

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Fast EMA | 12 | Reacts quickly to recent price changes |
| Slow EMA | 26 | The longer-term baseline |
| Signal EMA | 9 | Smoothing of the MACD line; generates crossover signals |

### Interpretation

| Reading | Meaning |
|---------|---------|
| MACD Line > 0 | Fast EMA above slow EMA → upward momentum |
| MACD Line < 0 | Fast EMA below slow EMA → downward momentum |
| Histogram growing | Momentum increasing in that direction |
| Histogram shrinking | Momentum fading — potential reversal ahead |

### Signals

| Signal | Condition | Notes |
|--------|-----------|-------|
| Bullish crossover | MACD Line crosses above Signal Line | Entry signal in uptrends |
| Bearish crossover | MACD Line crosses below Signal Line | Exit/short signal in downtrends |
| Zero-line cross (bullish) | MACD Line crosses above 0 | Stronger trend confirmation |
| Zero-line cross (bearish) | MACD Line crosses below 0 | Stronger trend confirmation |
| Bullish divergence | Price makes lower low, MACD makes higher low | Potential reversal — weakening bearish momentum |
| Bearish divergence | Price makes higher high, MACD makes lower high | Potential reversal — weakening bullish momentum |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Entry timing. Crossovers and histogram changes. |
| Weekly | Trend confirmation. MACD above/below zero as regime filter. |
| Monthly | Macro momentum. Useful for long-term portfolio context. |

---

## Summary Comparison

| Indicator | Speed | Best For | Limitation |
|-----------|-------|---------|------------|
| SMA | Slow | Clean trend identification, support/resistance | Significant lag on reversals |
| EMA | Medium | Earlier trend detection, MACD inputs | More noise than SMA |
| MACD | Fast | Momentum + trend combo, divergence detection | Can whipsaw in choppy markets |

---

## Related

- [Momentum Indicators](momentum.md) — RSI, Stochastic, ROC for entry timing within trends.
- [Strategies](../strategies/README.md) — How trend indicators anchor most trading strategies.
- [OHLCV Data](OHLCV.md) — The Close price data that all trend indicators consume.

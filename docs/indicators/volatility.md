# Volatility Indicators

> **Category:** Volatility  
> **Data Required:** High, Low, Close (OHLCV)  
> **Timeframes:** Daily, Weekly  

Volatility indicators measure the **degree of price variation** over time. They do not indicate direction — rather, they quantify how much prices are moving. This makes them essential tools for **position sizing**, **stop-loss placement**, and identifying periods of **compression** (low volatility before a breakout) or **expansion** (rapid price movement).

> **Key insight:** Volatility is cyclical. Periods of low volatility tend to be followed by expansion, and vice versa. Recognising the current phase gives a significant edge in timing.

---

## Average True Range (ATR)

### Overview

ATR measures the average range of price movement over a period, accounting for overnight gaps between sessions. It is the go-to tool for **sizing stops objectively** — instead of picking arbitrary stop levels, ATR gives you a market-calibrated distance.

### True Range

The True Range (TR) is the greatest of:

$$
TR = \max\bigl(H - L,\; |H - C_{prev}|,\; |L - C_{prev}|\bigr)
$$

Where $H$ = current high, $L$ = current low, $C_{prev}$ = previous close.

This accounts for gaps between sessions that would be missed by a simple high-minus-low calculation.

### Formula

ATR is a Wilder smoothed average of True Range values:

$$
ATR_t = \frac{(ATR_{t-1} \times (n-1)) + TR_t}{n}
$$

The first ATR value is a simple average of the first $n$ TR values.

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Period (n) | 14 | Standard. Lower = reacts faster to volatility changes. |

### Interpretation

ATR is expressed in **price units** (not percentage), so it must be interpreted relative to the instrument's price level. A $2 ATR on a $20 stock is very different from $2 ATR on a $200 stock.

| ATR Reading | Meaning |
|-------------|---------|
| Rising ATR | Volatility expanding — larger price swings expected |
| Falling ATR | Volatility contracting — market is quieting down |
| High ATR | Wide stops required, smaller position sizes |
| Low ATR | Tight stops possible, larger position sizes |

### Primary Use: Stop-Loss Sizing

ATR is most commonly used to set stops at a multiple of ATR away from entry:

$$
\text{Stop Distance} = \text{ATR} \times \text{multiplier}
$$

Common multipliers:
- `1.5×` — Tight stop, higher risk of being stopped out prematurely
- `2.0×` — Standard
- `3.0×` — Wide stop, requires smaller position size to maintain fixed risk

### Position Sizing Formula

To risk a fixed percentage of capital per trade:

$$
\text{Position Size} = \frac{\text{Account Risk \$}}{\text{ATR} \times \text{multiplier}}
$$

Example: Risking $500 on a trade with ATR = $2.50 and a 2× multiplier:
$$
\text{Position Size} = \frac{500}{2.50 \times 2} = 100 \text{ shares}
$$

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Stop-loss sizing for swing trades |
| Weekly | Wider position sizing for longer-duration holds |

---

## Bollinger Bands

### Overview

Bollinger Bands place two standard deviation bands around a moving average, creating a dynamic channel that expands and contracts with volatility. They simultaneously identify **trend direction** (via the midline), **volatility state** (via band width), and **relative price extremes** (via band touches).

### Components

| Component | Formula | Description |
|-----------|---------|-------------|
| Middle Band | SMA(n) | The baseline trend |
| Upper Band | SMA(n) + (k × σ) | Upper boundary (~2 std deviations above mean) |
| Lower Band | SMA(n) − (k × σ) | Lower boundary (~2 std deviations below mean) |

Where $\sigma$ is the standard deviation of closing prices over the same $n$ periods.

### Parameters

| Parameter | Default | Notes |
|-----------|---------|-------|
| Period (n) | 20 | SMA period and standard deviation lookback |
| Multiplier (k) | 2 | Standard deviations. 2 means ~95% of closes fall inside the bands. |

### Interpretation

#### Band Width (Volatility State)

| Condition | Name | Meaning |
|-----------|------|---------|
| Bands very narrow | Squeeze | Low volatility — potential breakout approaching |
| Bands very wide | Expansion | High volatility — large moves already underway |

The **Bollinger Squeeze** is one of the most reliable setups: a period of abnormally tight bands precedes a significant directional move. Direction is not predicted by the squeeze itself — it must be confirmed by other signals.

#### Price Position (Momentum Context)

| Price Location | Meaning |
|----------------|---------|
| At or above upper band | Strong bullish momentum (not necessarily overbought in a trend) |
| At or below lower band | Strong bearish momentum (not necessarily oversold in a trend) |
| Returning from upper band toward midline | Potential mean reversion down |
| Returning from lower band toward midline | Potential mean reversion up |
| Midline acting as support | Healthy uptrend |
| Midline acting as resistance | Healthy downtrend |

> **Common misuse:** Touching the upper band is not a sell signal in an uptrend — price can "walk the band" for extended periods. Context matters.

### Signals

| Signal | Condition | Notes |
|--------|-----------|-------|
| Squeeze breakout (bullish) | Price exits squeeze above upper band | High-probability breakout setup |
| Squeeze breakout (bearish) | Price exits squeeze below lower band | High-probability breakdown setup |
| Mean reversion long | Price touches lower band in uptrend | Reversion toward midline expected |
| Mean reversion short | Price touches upper band in downtrend | Reversion toward midline expected |
| Band walking | Price repeatedly closes near upper/lower band | Strong trend continuation |

### Timeframe Usage

| Timeframe | Use Case |
|-----------|---------|
| Daily | Squeeze detection, mean reversion entries |
| Weekly | Macro volatility regime, band walk confirmation of strong trends |

---

## Summary Comparison

| Indicator | Primary Use | Output Type |
|-----------|------------|-------------|
| ATR | Stop-loss sizing, position sizing | Absolute price units |
| Bollinger Bands | Volatility regime, breakout/reversion setups | Price channel |

---

## Related

- [Trend Indicators](trend.md) — Combine with Bollinger midline (SMA) for trend context.
- [Volatility Expansion Strategy](../strategies/volatility-expansion.md) — Exploiting Bollinger Squeezes.
- [Breakout Strategy](../strategies/breakout.md) — ATR used for stop placement in breakout trades.
- [OHLCV Data](OHLCV.md) — High, Low, and Close data consumed by these indicators.

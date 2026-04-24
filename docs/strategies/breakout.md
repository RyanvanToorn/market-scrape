# Strategy 4: Breakout

> **Type:** Breakout  
> **Complexity:** Intermediate  
> **Indicators Required:** N-day High/Low, ATR (14), Volume MA (20)  
> **Timeframes:** Daily (signal), Weekly (context)  

## Overview

The breakout strategy enters when price moves decisively above the highest point of the last N trading days. This signals that the instrument has broken through established resistance and is entering **price discovery** — territory where there are no natural overhead sellers from recent history.

Breakouts are trend-initiation signals. They capture the early stage of a new trending move, which can produce some of the largest gains in the shortest time. This makes them high potential but also prone to false signals, making volume confirmation and proper stop placement critical.

> *"Works well on strong trending assets."*

---

## Entry Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | Daily close above the **N-day highest high** | Primary trigger (see parameter guidance below) |
| 2 | Volume on the breakout day is **above the 20-day Volume MA** | Confirms conviction — breakouts on thin volume frequently fail |
| 3 | *(Optional)* Weekly trend is bullish or neutral | Avoids shorting the prevailing macro trend |
| 4 | *(Optional)* ATR is not at multi-month extremes | Very high ATR means volatility is already expanded; breakout may be late |

Enter at the **close of the breakout candle**, or at the **open of the next session**. Do not chase if price has already moved significantly beyond the breakout level.

### Breakout Period Parameter

| N (days) | Significance | Notes |
|----------|-------------|-------|
| 20 | ~1 month high | Shorter lookback — more signals, more false breakouts |
| 55 | ~3 months | Balance between frequency and significance |
| 252 | 52-week high | Highest significance, fewest signals |

The 52-week high breakout is particularly powerful — academic research (Momentum Effect) consistently shows that stocks breaking to new annual highs tend to outperform over the following 3–12 months.

---

## Exit Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | **Trailing stop triggered** | Trail the stop as price advances (see below) |
| 2 | **Price closes below the breakout level** | Breakout failure — invalidates the thesis |
| 3 | **Hard stop triggered** | Fixed stop defined at entry |

---

## Risk Management

### Initial Stop

Place the initial stop below the breakout level, using ATR to define distance:

$$
\text{Stop} = \text{Breakout Level} - (1.5 \times ATR_{14})
$$

This accounts for the normal volatility of the instrument so the stop is not placed too tight.

### Trailing Stop

As price advances, trail the stop to protect gains:

| Method | Description |
|--------|-------------|
| ATR Trailing Stop | Move stop up as price rises, keeping it 2× ATR below the highest close since entry |
| N-day Low Trailing Stop | Move stop up to the N-day lowest low (e.g. 10-day low) |
| Moving Average Trailing | Trail the stop to the 20 SMA — exit if price closes below it |

### Position Size

$$
\text{Position Size} = \frac{\text{Account Risk \$}}{\text{Entry Price} - \text{Stop Price}}
$$

Risk no more than 1–2% of account capital per trade.

---

## Strengths

- Catches the early stage of major trending moves.
- Well-defined entry (the breakout level) and stop (below the level).
- 52-week high breakouts are backed by substantial academic evidence.
- Volume confirmation significantly filters out low-quality signals.

---

## Weaknesses

- **False breakouts** are common — particularly in low-volatility environments where the "breakout" is minor.
- **Chasing entries**: entering too far above the breakout level dramatically worsens risk/reward.
- Works poorly in range-bound markets where price repeatedly pokes above resistance without follow-through.

---

## Breakout Quality Checklist

Before entering, verify the following:

- [ ] Is this a clean, well-defined resistance level (not just an arbitrary N-day high)?
- [ ] Is volume above the 20-day average?
- [ ] Is the breakout level significant (key prior high, not just noise)?
- [ ] Is the weekly trend neutral or bullish?
- [ ] Is the stop level well-defined and not too far from entry?

---

## Backtesting Notes

- The N=20 parameter will generate many signals; filter aggressively with volume.
- The N=252 (52-week high) parameter generates fewer but higher-quality signals.
- Track **breakout failure rate** (price closes back below the level within 5 days) as a key metric.
- Markets with strong momentum characteristics (e.g. technology, biotech) tend to produce better breakout follow-through than defensive sectors.

---

## Related

- [Price-Derived Features](../indicators/price-derived.md) — N-day high/low calculation details.
- [Volume Indicators](../indicators/volume.md) — Volume confirmation logic.
- [Volatility Indicators](../indicators/volatility.md) — ATR for stop placement and position sizing.
- [Strategy 5: Volatility Expansion](volatility-expansion.md) — Related breakout strategy focused on Bollinger Squeeze setups.
- [Strategies Overview](README.md)

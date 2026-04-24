# Strategy 5: Volatility Expansion

> **Type:** Volatility  
> **Complexity:** Advanced  
> **Indicators Required:** Bollinger Bands (20, 2), ATR (14)  
> **Timeframes:** Daily (signal), Weekly (context)  

## Overview

This strategy exploits the predictable **volatility cycle** in financial markets: periods of low volatility (compression) are consistently followed by periods of high volatility (expansion). The Bollinger Squeeze detects this compression, and the strategy enters when the expansion begins.

Unlike the other strategies, this one does not require a pre-existing trend. The Bollinger Squeeze is regime-agnostic — the breakout can be in either direction. Directional bias is determined by additional filters applied at entry.

> *"More advanced, but powerful."*

This is powerful because you are entering at precisely the moment a large move begins — before the new trend is established and before trend-following strategies would signal an entry.

---

## The Bollinger Squeeze

The Bollinger Squeeze is the core setup:

1. Bollinger Bands (20, 2) contract to a **multi-period narrow width** — indicating unusually low volatility.
2. The squeeze builds as the market consolidates.
3. When volatility expands, the bands widen sharply — the breakout follows.

### Squeeze Detection

| Method | Formula | Threshold |
|--------|---------|-----------|
| Band Width | $(UB - LB) / MB \times 100$ | Below 6-month lowest band width |
| ATR ratio | $ATR_{14} / \text{Price}$ | At multi-month lows |

Where $UB$ = Upper Band, $LB$ = Lower Band, $MB$ = Middle Band (SMA).

---

## Entry Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | Bollinger Bands are in a **squeeze** (band width at multi-month low) | Setup phase — do not enter yet, only monitor |
| 2 | Price **closes above the upper Bollinger Band** | Bullish expansion signal |
| 3 | *(Bearish variant)* Price **closes below the lower Bollinger Band** | Bearish expansion signal |
| 4 | ATR is **rising** relative to prior sessions | Confirms volatility is expanding, not just a noise spike |
| 5 | *(Optional)* Volume is above the 20-day average | Conviction confirmation |
| 6 | *(Optional)* Weekly trend aligns with breakout direction | Avoids trading against macro trend |

Enter at the **close of the expansion candle**, or at the next session's open.

> If you miss the initial candle, a re-entry on the first pullback to the upper band (now acting as support) is often the better entry point anyway.

---

## Exit Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | **Price closes back inside the Bollinger Bands** | Expansion has failed or is complete |
| 2 | **ATR begins declining significantly** | Momentum is fading |
| 3 | **Trailing stop triggered** | ATR-based trailing stop (see Risk Management) |
| 4 | **Hard stop triggered** | Fixed stop defined at entry |

---

## Risk Management

### Initial Stop

Place the stop inside the Bollinger Band, using ATR:

$$
\text{Stop (Long)} = \text{Entry Price} - (2 \times ATR_{14})
$$

Alternatively, stop below the middle band (20 SMA) — a close back through the midline suggests the breakout has failed.

### Trailing Stop

As price expands outward from the bands:

$$
\text{Trailing Stop} = \text{Highest Close} - (2 \times ATR_{14})
$$

Adjust the stop upward only — never downward.

### Position Size

$$
\text{Position Size} = \frac{\text{Account Risk \$}}{\text{Entry Price} - \text{Stop Price}}
$$

Risk no more than 1–2% of account capital per trade. Given the potential for large moves from squeeze setups, starting with a smaller initial position and adding on confirmation is a valid approach.

---

## Setup Lifecycle

```
Band Width:  ████████▄▄▄▃▃▂▂▁▁▁▁▁▂▃▄▄████████
Phase:       Normal  → Squeeze → → → → → Expansion
Action:      Monitor → Alert   → Wait  → ENTER
```

The key discipline is **not entering during the squeeze phase** itself. The setup is not complete until expansion begins.

---

## Strengths

- Enters at the beginning of large moves, before trend-following strategies signal.
- Well-defined entry trigger with mechanical rules.
- Applicable across instruments and sectors regardless of prevailing trend.
- ATR provides objective stop and sizing framework.

---

## Weaknesses

- **Direction is uncertain** until the breakout occurs — the squeeze can resolve either way.
- False expansions do occur — brief breaks of the band followed by a return inside.
- Requires monitoring for squeeze conditions across many instruments simultaneously.
- More complex setup and management than Strategies 1–3.

---

## Avoiding False Expansions

| Filter | Method |
|--------|--------|
| Require ATR to be rising | Confirms genuine volatility pickup, not a single-candle spike |
| Require volume confirmation | Above-average volume on the breakout candle |
| Wait for second candle | Enter only if the next candle also closes outside or near the band |
| Align with weekly trend | If weekly is bullish, only take upside Bollinger breakouts |

---

## Backtesting Notes

- This strategy thrives after extended low-volatility periods (e.g. markets consolidating after a correction).
- Track **squeeze duration** (number of periods in squeeze before expansion) — longer squeezes tend to produce larger expansions.
- Track **false expansion rate** — how often does price re-enter the bands within 3 days of the breakout?
- This is a lower-frequency strategy; do not force trades. Wait for genuine squeeze conditions.

---

## Related

- [Strategy 4: Breakout](breakout.md) — Shares the expansion entry concept; uses N-day high instead of Bollinger Bands.
- [Volatility Indicators](../indicators/volatility.md) — Bollinger Bands and ATR calculation and interpretation.
- [Volume Indicators](../indicators/volume.md) — Volume confirmation for expansion candles.
- [Strategies Overview](README.md)

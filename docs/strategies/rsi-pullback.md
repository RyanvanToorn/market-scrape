# Strategy 3: RSI Pullback in Uptrend

> **Type:** Momentum / Pullback  
> **Complexity:** Intermediate  
> **Indicators Required:** SMA (50), RSI (14)  
> **Timeframes:** Weekly (trend filter), Daily (entry signal)  

## Overview

This strategy combines trend direction with momentum timing. Rather than entering immediately when a trend is identified, it **waits for a pullback** — a temporary dip in an established uptrend that offers a more favourable entry price.

The logic is straightforward: identify instruments in strong uptrends, then buy when the daily RSI temporarily drops into oversold territory, signalling a short-term pullback within the larger bullish move.

> *"This is where money is often made: buy dips in strong trends."*

This is the conceptual leap beyond Strategies 1 and 2. Instead of entering at the start of a trend (often at an elevated price), you are entering on a temporary retracement — improving average entry price and reducing risk.

---

## Entry Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | **Weekly trend is bullish** | Weekly close above 50-week SMA, or weekly RSI > 50 |
| 2 | **Daily RSI(14) drops below 30** | Oversold condition — pullback is in progress |
| 3 | **Price remains above a key support level** | Pullback is shallow, not a breakdown |
| 4 | *(Optional)* Volume is declining during the pullback | Low-volume pullback = selling is unconvinced |

Enter on the close of the first daily bar where RSI crosses back above 30, or at the next session's open. Do not enter while RSI is still falling — wait for it to turn.

---

## Exit Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | **Daily RSI(14) rises above 60–70** | Momentum has recovered — take partial or full profit |
| 2 | **Weekly trend turns bearish** | Weekly close below 50-week SMA — invalidates the trade thesis |
| 3 | **Hard stop triggered** | Defined at entry (see Risk Management) |

---

## Risk Management

- **Stop-loss:** Below the swing low of the pullback, or 1.5–2× ATR(14) below entry.
- **Thesis invalidation:** If the weekly trend turns bearish after entry, exit immediately regardless of daily RSI.
- **Position size:** Risk no more than 1–2% of account capital per trade.
- **Partial exits:** Consider taking 50% profit when RSI reaches 60, and letting the remaining position run.

---

## Visualisation

```
Price:
   /\/\/\/\/\_____/\
         |   |
         Pullback
         RSI < 30
                 |
                Entry
```

The pullback (RSI < 30) in a broader uptrend provides a favourable risk/reward entry before the trend resumes.

---

## Strengths

- **Better entry prices** than Strategies 1 and 2 — entering on a dip rather than at the top of a move.
- **Tighter stops** — the swing low of the pullback is a natural, well-defined stop level.
- Higher risk/reward potential per trade.
- Intuitive logic that is easy to monitor and manage.

---

## Weaknesses

- Requires patience — pullbacks may not occur for extended periods in strong trending markets.
- In weakening trends, an RSI < 30 reading may precede a genuine reversal, not a temporary dip. The weekly trend filter is essential to avoid this trap.
- Misuse: applying this in a downtrend (trying to catch the bottom) is one of the most common and costly mistakes in technical trading.

---

## Common Mistakes

| Mistake | Why It's Harmful |
|---------|-----------------|
| Using RSI < 30 as a buy signal without trend confirmation | Buying into downtrends ("catching falling knives") |
| Entering before RSI has turned back up | Buying while momentum is still declining |
| Ignoring the weekly trend filter | Executing this in a bear market |
| Setting the stop too tight | Getting stopped out on normal daily volatility |

---

## Upgrade Path

1. **Add OBV confirmation:** Require OBV to be rising (or holding) during the pullback to confirm accumulation.
2. **Use Stochastic instead of RSI:** The Stochastic Oscillator reacts faster for shorter-duration pullbacks.
3. **Multi-timeframe:** Also confirm that the daily 50 SMA slope is upward at entry.

---

## Backtesting Notes

- This strategy is highly dependent on market regime. In strong bull markets, it can produce excellent results. In range-bound markets, trend confirmation filters frequently negate entry conditions.
- Track the average depth of pullbacks (RSI low) across winning trades to calibrate expectations.
- Consider requiring RSI to have previously been above 50 (trend confirmation) before a pullback below 30 is considered valid.

---

## Related

- [Strategy 2: MA Crossover](ma-crossover.md) — Establishes the uptrend this strategy operates within.
- [Momentum Indicators](../indicators/momentum.md) — RSI formula, parameters, and interpretation.
- [Volume Indicators](../indicators/volume.md) — OBV as an optional confirmation layer.
- [Strategies Overview](README.md)

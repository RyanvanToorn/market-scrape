# Strategy 1: Trend Following

> **Type:** Trend  
> **Complexity:** Beginner  
> **Indicators Required:** SMA (50)  
> **Timeframes:** Daily (signal), Weekly (confirmation)  

## Overview

The simplest possible trend-following strategy: buy when price is above its 50-day moving average, sell when it falls below. No timing sophistication, no momentum filters — just pure, systematic trend exposure.

This strategy is often dismissed as too simple. That dismissal is a mistake. Robust trend following is the backbone of many of the most successful trading systems ever built.

> *"This is boring — and that's exactly why it works."*

The edge comes from capturing the bulk of large trending moves while avoiding holding through sustained downtrends. The strategy will be wrong frequently on individual signals, but the asymmetry of letting winners run and cutting losers keeps the expected value positive over time.

---

## Entry Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | Daily close **above** the 50-day SMA | Primary entry condition |
| 2 | *(Optional upgrade)* Weekly close also above the 50-week SMA | Filters out weak signals in choppy markets |

Enter at the next session's open (or the close of the signal candle) once conditions are met.

---

## Exit Rules

| # | Condition | Notes |
|---|-----------|-------|
| 1 | Daily close **below** the 50-day SMA | Primary exit condition |
| 2 | Hard stop at initial risk level | Defined at entry (see Risk Management) |

Exit at the next session's open, or set the stop to trigger automatically.

---

## Risk Management

- **Stop-loss:** Set the initial stop at 1–2× ATR(14) below the 50 SMA at entry, or simply below a recent swing low.
- **Position size:** Risk no more than 1–2% of account capital per trade.
- **Trailing stop:** Once price moves in your favour by 2× your initial risk, consider trailing the stop to the 50 SMA itself.

---

## Strengths

- Extremely simple to implement and automate.
- Works well in persistently trending markets (e.g. major indices in bull markets, strong sector leaders).
- Limited decision-making required — fully mechanical.
- Can be applied across any liquid instrument.

---

## Weaknesses

- **Lagging** — entries and exits come well after the actual top/bottom.
- **Whipsaws** — in range-bound or choppy markets, price will repeatedly cross the 50 SMA, generating many losing signals in quick succession.
- Performs poorly in low-trending environments.

---

## Upgrade Path

To reduce whipsaw and improve signal quality:

1. **Add weekly confirmation:** Only enter if the weekly close is also above the 50-week SMA. This significantly reduces false signals in correcting markets.
2. **Add volume filter:** Require above-average volume on the entry signal.
3. **Combine with RSI:** Require RSI(14) > 50 to confirm momentum before entry.
4. **Upgrade to Strategy 2 (MA Crossover)** for earlier signals with slightly more complexity.

---

## Backtesting Notes

- Works best on instruments with a history of sustained trends (e.g. quality growth stocks, broad market ETFs).
- Expected win rate: 35–45%. Edge comes from **return distribution**, not hit rate — winners are larger than losers.
- Measure results over full market cycles (bull + bear), not just bull markets.
- Benchmark against a simple buy-and-hold to confirm edge.

---

## Related

- [Strategy 2: MA Crossover](ma-crossover.md) — A more timely variant using two moving averages.
- [Trend Indicators](../indicators/trend.md) — SMA calculation and interpretation details.
- [Strategies Overview](README.md)

# Indicators

> This file has been restructured into separate documents.

## Indicators

See [indicators/README.md](indicators/README.md) for the full indicator index, or navigate directly:

- [OHLCV Data](indicators/OHLCV.md) — The stored data all indicators are derived from
- [Trend Indicators](indicators/trend.md) — SMA, EMA, MACD
- [Momentum Indicators](indicators/momentum.md) — RSI, Stochastic, ROC
- [Volatility Indicators](indicators/volatility.md) — ATR, Bollinger Bands
- [Volume Indicators](indicators/volume.md) — OBV, Volume MA, Volume Spikes
- [Price-Derived Features](indicators/price-derived.md) — % Change, Rolling Returns, Breakouts, Candle Ranges

## Strategies

See [strategies/README.md](../strategies/README.md) for the strategy catalogue, or navigate directly:

- [Strategy 1: Trend Following](../strategies/trend-following.md)
- [Strategy 2: MA Crossover](../strategies/ma-crossover.md)
- [Strategy 3: RSI Pullback in Uptrend](../strategies/rsi-pullback.md)
- [Strategy 4: Breakout](../strategies/breakout.md)
- [Strategy 5: Volatility Expansion](../strategies/volatility-expansion.md)






// Seperate files/folders as logical:




🔹 Trend indicators (foundation)

These tell you direction — arguably the most important signal.

Simple Moving Average (SMA) (20, 50, 200)
Exponential Moving Average (EMA) (faster reaction)
MACD (12, 26, 9) → momentum + trend combo

👉 Use across timeframes:

Daily → entries
Weekly → trend confirmation
Monthly → macro bias
🔹 Momentum indicators (timing entries)

These tell you when to enter within a trend.

RSI (14)
<30 → oversold

70 → overbought

Stochastic Oscillator
Rate of Change (ROC)

👉 Key insight:
Momentum works best with trend, not against it.

🔹 Volatility indicators (risk control)

These help you size positions and set stops.

ATR (Average True Range)
→ critical for stop-loss sizing
Bollinger Bands
→ volatility expansion/contraction
🔹 Volume-based indicators (confirmation)

You already have volume — good move.

On-Balance Volume (OBV)
Volume moving average
Volume spikes vs baseline

👉 Volume confirms moves:

Price ↑ + Volume ↑ = strong
Price ↑ + Volume ↓ = weak
🔹 Price-derived features (don’t skip these)

These are often more useful than fancy indicators:

% change (daily/weekly/monthly)
Rolling returns (e.g., last 20 days)
High/low breakouts
Candlestick ranges (high-low, body size)






// Seperate folder - Strategy backtesting and strategy documentation.

🟢 Strategy 1: Trend Following (baseline)

Logic:

Buy when price > 50-day MA
Sell when price < 50-day MA

Upgrade:

Only trade if weekly trend is also bullish

👉 This is boring — and that’s exactly why it works.

🟢 Strategy 2: Moving Average Crossover

Logic:

Buy when 20 MA crosses above 50 MA
Sell when it crosses below

👉 Classic system. Good for testing your engine.

🟢 Strategy 3: RSI Pullback in Uptrend

Logic:

Weekly trend = bullish
RSI < 30 on daily → buy
Exit when RSI > 60–70

👉 This is where money is often made:
buy dips in strong trends

🟢 Strategy 4: Breakout Strategy

Logic:

Buy when price breaks highest high of last N days (e.g. 20)
Sell on breakdown or trailing stop

👉 Works well on strong trending assets.

🟢 Strategy 5: Volatility Expansion

Logic:

Low volatility (tight Bollinger Bands)
Enter when volatility expands

👉 More advanced, but powerful.
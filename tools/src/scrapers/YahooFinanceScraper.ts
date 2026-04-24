import type { Browser, BrowserContext, Locator, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import type { ChartData, ChartDividend, ChartInterval, ChartPricePoint, ScrapedStats, ScrapeResult } from "../types/index.js";

// ── Constants ─────────────────────────────────────────────────────────────────

const CHART_LOOKBACK_SECONDS: Record<"1d" | "1wk", number> = {
  "1d":  1 * 365 * 24 * 60 * 60,
  "1wk": 5 * 365 * 24 * 60 * 60,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateString(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildChartUrl(ticker: string, period1: number, period2: number, interval: ChartInterval): string {
  return `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic`;
}

// ── Scraper ───────────────────────────────────────────────────────────────────

export class YahooFinanceScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async init(headless = true): Promise<void> {
    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext({
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
  }

  async scrape(ticker: string): Promise<ScrapeResult> {
    const page = await this.getPage();
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`);
    await this.dismissConsentPopup(page);

    const statsPanel = page.locator('[data-testid="quote-statistics"]');
    const noData     = page.locator("div.noData");

    await statsPanel.or(noData).first().waitFor({ state: "visible", timeout: 10_000 });

    if (await noData.isVisible()) {
      throw new Error(`No results found for ticker: ${ticker}`);
    }

    const stats   = await this.scrapeStats(statsPanel);
    const daily    = await this.fetchChartData(ticker, "1d",  page);
    await randomDelay(500, 1500);
    const weekly   = await this.fetchChartData(ticker, "1wk", page);
    await randomDelay(500, 1500);
    const monthly  = await this.fetchMonthlyChartData(ticker, page);

    return { stats, daily, weekly, monthly };
  }

  async close(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  // ── Private: stats ──────────────────────────────────────────────────────────

  private async scrapeStats(panel: Locator): Promise<ScrapedStats> {
    await panel.waitFor({ state: "visible" });
    return {
      previousClose:        await this.getFinStreamer(panel, "regularMarketPreviousClose"),
      open:                 await this.getFinStreamer(panel, "regularMarketOpen"),
      bid:                  await this.getLabelValue(panel, "Bid"),
      ask:                  await this.getLabelValue(panel, "Ask"),
      daysRange:            await this.getFinStreamer(panel, "regularMarketDayRange"),
      fiftyTwoWeekRange:    await this.getFinStreamer(panel, "fiftyTwoWeekRange"),
      volume:               await this.getFinStreamer(panel, "regularMarketVolume"),
      avgVolume:            await this.getFinStreamer(panel, "averageVolume"),
      marketCap:            await this.getFinStreamer(panel, "marketCap"),
      beta:                 await this.getLabelValue(panel, "Beta (5Y Monthly)"),
      peRatio:              await this.getFinStreamer(panel, "trailingPE"),
      eps:                  await this.getLabelValue(panel, "EPS (TTM)"),
      earningsDate:         await this.getLabelValue(panel, "Earnings Date (est.)"),
      forwardDividendYield: await this.getLabelValue(panel, "Forward Dividend & Yield"),
      exDividendDate:       await this.getLabelValue(panel, "Ex-Dividend Date"),
      oneYearTarget:        await this.getFinStreamer(panel, "targetMeanPrice"),
    };
  }

  /** Reads the raw `data-value` from a `fin-streamer` element by its `data-field`. */
  private async getFinStreamer(panel: Locator, field: string): Promise<string | null> {
    try {
      return await panel.locator(`fin-streamer[data-field="${field}"]`).first().getAttribute("data-value", { timeout: 3_000 });
    } catch {
      return null;
    }
  }

  /** Reads the text content of a stat row's value cell, matched by its label title. */
  private async getLabelValue(panel: Locator, title: string): Promise<string | null> {
    try {
      const text = await panel.locator(`li:has(.label[title="${title}"]) .value`).textContent({ timeout: 3_000 });
      return text?.trim() ?? null;
    } catch {
      return null;
    }
  }

  // ── Private: chart data ─────────────────────────────────────────────────────

  /**
   * Fetches and parses the Yahoo Finance chart API for the given ticker and interval.
   * - interval "1d"  → looks back 1 year,  returns one row per trading day
   * - interval "1wk" → looks back 5 years, returns one row per calendar week
   */
  private async fetchChartData(ticker: string, interval: "1d" | "1wk", page: Page): Promise<ChartData> {
    const now     = Math.floor(Date.now() / 1000);
    const period1 = now - CHART_LOOKBACK_SECONDS[interval];
    const url     = buildChartUrl(ticker, period1, now, interval);

    const response = await page.context().request.get(url);
    if (!response.ok()) {
      throw new Error(`Chart API request failed: ${response.status()} for ${ticker} (${interval})`);
    }

    const json   = await response.json() as Record<string, unknown>;
    const result = this.extractChartResult(json, ticker, interval);
    return this.parseChartResult(result, interval);
  }

  /**
   * Fetches all-time monthly chart data (interval "1mo", period1=0).
   * Returns null if Yahoo Finance responds with a different granularity — this can occur
   * for newly-listed instruments where Yahoo uses a finer interval for the full-history range.
   */
  private async fetchMonthlyChartData(ticker: string, page: Page): Promise<ChartData | null> {
    const now = Math.floor(Date.now() / 1000);
    const url = buildChartUrl(ticker, 0, now, "1mo");

    const response = await page.context().request.get(url);
    if (!response.ok()) {
      throw new Error(`Chart API request failed: ${response.status()} for ${ticker} (1mo)`);
    }

    const json   = await response.json() as Record<string, unknown>;
    const result = this.extractChartResult(json, ticker, "1mo");
    const meta   = result["meta"] as Record<string, unknown>;

    if (meta["dataGranularity"] !== "1mo") {
      return null;
    }

    return this.parseChartResult(result, "1mo");
  }

  private extractChartResult(json: Record<string, unknown>, ticker: string, interval: ChartInterval): Record<string, unknown> {
    const results = ((json["chart"] as Record<string, unknown>)["result"]) as Record<string, unknown>[] | null;
    if (!results?.length) {
      throw new Error(`No chart results returned for ${ticker} (${interval})`);
    }
    return results[0]!;
  }

  private parseChartResult(result: Record<string, unknown>, interval: ChartInterval): ChartData {
    const meta       = result["meta"] as Record<string, unknown>;
    const timestamps = result["timestamp"] as number[];
    const indicators = result["indicators"] as Record<string, unknown>;
    const quote      = (indicators["quote"] as Record<string, unknown>[])[0]!;
    const adjCloses  = ((indicators["adjclose"] as Record<string, unknown>[] | undefined)?.[0]?.["adjclose"] ?? []) as (number | null)[];

    return {
      symbol:      meta["symbol"] as string,
      currency:    meta["currency"] as string,
      granularity: interval,
      pricePoints: this.parsePricePoints(timestamps, quote, adjCloses, interval),
      dividends:   this.parseDividends(result),
    };
  }

  private parsePricePoints(
    timestamps: number[],
    quote: Record<string, unknown>,
    adjCloses: (number | null)[],
    interval: ChartInterval,
  ): ChartPricePoint[] {
    const opens   = quote["open"]   as (number | null)[];
    const highs   = quote["high"]   as (number | null)[];
    const lows    = quote["low"]    as (number | null)[];
    const closes  = quote["close"]  as (number | null)[];
    const volumes = quote["volume"] as (number | null)[];

    return timestamps.map((ts, i) => ({
      date:        toDateString(ts),
      granularity: interval,
      open:        opens[i]     ?? null,
      high:        highs[i]     ?? null,
      low:         lows[i]      ?? null,
      close:       closes[i]    ?? null,
      adjClose:    adjCloses[i] ?? null,
      volume:      volumes[i]   ?? null,
    }));
  }

  private parseDividends(result: Record<string, unknown>): ChartDividend[] {
    const events  = result["events"] as Record<string, unknown> | undefined;
    const rawDivs = (events?.["dividends"] ?? {}) as Record<string, { amount: number; date: number }>;
    return Object.values(rawDivs).map(d => ({
      exDate:      toDateString(d.date),
      paymentDate: toDateString(d.date),
      amount:      d.amount,
    }));
  }

  // ── Private: browser ────────────────────────────────────────────────────────

  private async getPage(): Promise<Page> {
    if (!this.context) throw new Error("Scraper not initialised — call init() first");
    this.page ??= await this.context.newPage();
    return this.page;
  }

  private async dismissConsentPopup(page: Page): Promise<void> {
    const rejectButton = page.locator('button[name="reject"]');
    try {
      await rejectButton.waitFor({ state: "visible", timeout: 2_000 });
      await rejectButton.click();
      await page.waitForLoadState("domcontentloaded");
    } catch {
      // No consent popup — continue
    }
  }
}

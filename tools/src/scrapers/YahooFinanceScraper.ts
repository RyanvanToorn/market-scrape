import type { Browser, BrowserContext, Locator, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import type { ChartData, ChartDividend, ChartInterval, ChartPricePoint, ScrapedStats, ScrapeResult } from "../types/index.js";

/**
 * Scrapes market data for a given ticker from Yahoo Finance.
 * Implementation is stubbed — Phase 1 will add the full scraping logic.
 */
export class YahooFinanceScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async init(headless = true): Promise<void> {
    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext({
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  }

  async scrape(ticker: string): Promise<ScrapeResult> {
    // Reuse the same page across scrapes — navigating in-place keeps the V8 bytecode
    // and parsed resources in memory, avoiding the overhead of a new renderer context.
    const page = await this.getPage();

    // Navigate to the stock's page on Yahoo Finance
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`);

    // Dismiss any consent popups that may appear for cookies
    await this.dismissConsentPopup(page);

    const quoteStatisticsContainer = page.locator('[data-testid="quote-statistics"]');
    const noDataContainer = page.locator("div.noData");

    // Wait for either the stats panel or the no-data message to render
    await quoteStatisticsContainer.or(noDataContainer).first().waitFor({ state: "visible", timeout: 10_000 });

    if (await noDataContainer.isVisible()) {
      throw new Error(`No results found for ticker: ${ticker}`);
    }

    // Title and meta title
    const _title = await page.title();
    const _metaTitle = await page.locator('meta[name="title"]').getAttribute("content");

    // Scrape stats from the quote statistics panel.
    await quoteStatisticsContainer.waitFor({ state: "visible" });
    const stats = {
      previousClose:        await this.getFinStreamer(quoteStatisticsContainer, "regularMarketPreviousClose"),
      open:                 await this.getFinStreamer(quoteStatisticsContainer, "regularMarketOpen"),
      bid:                  await this.getLabelValue(quoteStatisticsContainer, "Bid"),
      ask:                  await this.getLabelValue(quoteStatisticsContainer, "Ask"),
      daysRange:            await this.getFinStreamer(quoteStatisticsContainer, "regularMarketDayRange"),
      fiftyTwoWeekRange:    await this.getFinStreamer(quoteStatisticsContainer, "fiftyTwoWeekRange"),
      volume:               await this.getFinStreamer(quoteStatisticsContainer, "regularMarketVolume"),
      avgVolume:            await this.getFinStreamer(quoteStatisticsContainer, "averageVolume"),
      marketCap:            await this.getFinStreamer(quoteStatisticsContainer, "marketCap"),
      beta:                 await this.getLabelValue(quoteStatisticsContainer, "Beta (5Y Monthly)"),
      peRatio:              await this.getFinStreamer(quoteStatisticsContainer, "trailingPE"),
      eps:                  await this.getLabelValue(quoteStatisticsContainer, "EPS (TTM)"),
      earningsDate:         await this.getLabelValue(quoteStatisticsContainer, "Earnings Date (est.)"),
      forwardDividendYield: await this.getLabelValue(quoteStatisticsContainer, "Forward Dividend & Yield"),
      exDividendDate:       await this.getLabelValue(quoteStatisticsContainer, "Ex-Dividend Date"),
      oneYearTarget:        await this.getFinStreamer(quoteStatisticsContainer, "targetMeanPrice"),
    };

    // Fetch both daily (1Y) and weekly (5Y) chart data from the Yahoo Finance chart API.
    // The browser context is reused so session cookies from the page load are carried over.
    const [daily, weekly] = await Promise.all([
      this.scrapeChartData(ticker, "1d", page),
      this.scrapeChartData(ticker, "1wk", page),
    ]);

    return { stats, daily, weekly };
  }

  /**
   * Fetches and parses the Yahoo Finance chart API for the given ticker and interval.
   * - interval "1d"  → looks back 1 year, returns one row per trading day
   * - interval "1wk" → looks back 5 years, returns one row per calendar week
   */
  private async scrapeChartData(ticker: string, interval: ChartInterval, page: Page): Promise<ChartData> {
    const now = Math.floor(Date.now() / 1000);
    const lookbackSeconds = interval === "1d"
      ? 365 * 24 * 60 * 60
      : 5 * 365 * 24 * 60 * 60;
    const period1 = now - lookbackSeconds;

    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${now}&interval=${interval}&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic`;
    const response = await page.context().request.get(url);
    if (!response.ok()) {
      throw new Error(`Chart API request failed: ${response.status()} for ${ticker} (${interval})`);
    }

    const json = await response.json() as Record<string, unknown>;
    const chart = json["chart"] as Record<string, unknown>;
    const results = chart["result"] as Record<string, unknown>[] | null;
    if (!results || results.length === 0) {
      throw new Error(`No chart results returned for ${ticker} (${interval})`);
    }

    const result = results[0]!;
    const meta = result["meta"] as Record<string, unknown>;
    const timestamps = result["timestamp"] as number[];
    const indicators = result["indicators"] as Record<string, unknown>;
    const quoteArr = (indicators["quote"] as Record<string, unknown>[])[0]!;
    const adjCloseArr = ((indicators["adjclose"] as Record<string, unknown>[])[0]?.["adjclose"] ?? []) as (number | null)[];

    const opens   = quoteArr["open"]   as (number | null)[];
    const highs   = quoteArr["high"]   as (number | null)[];
    const lows    = quoteArr["low"]    as (number | null)[];
    const closes  = quoteArr["close"]  as (number | null)[];
    const volumes = quoteArr["volume"] as (number | null)[];

    const pricePoints: ChartPricePoint[] = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      granularity: interval,
      open:     opens[i]     ?? null,
      high:     highs[i]     ?? null,
      low:      lows[i]      ?? null,
      close:    closes[i]    ?? null,
      adjClose: adjCloseArr[i] ?? null,
      volume:   volumes[i]   ?? null,
    }));

    const rawDividends = ((result["events"] as Record<string, unknown> | undefined)?.["dividends"] ?? {}) as Record<string, { amount: number; date: number }>;
    const dividends: ChartDividend[] = Object.values(rawDividends).map(d => ({
      exDate:      new Date(d.date * 1000).toISOString().slice(0, 10),
      paymentDate: new Date(d.date * 1000).toISOString().slice(0, 10),
      amount:      d.amount,
    }));

    return {
      symbol:      meta["symbol"] as string,
      currency:    meta["currency"] as string,
      granularity: interval,
      pricePoints,
      dividends,
    };
  }

  /** Reads the raw `data-value` from a `fin-streamer` element by its `data-field`. */
  private async getFinStreamer(container: Locator, field: string): Promise<string | null> {
    try {
      return await container.locator(`fin-streamer[data-field="${field}"]`).first().getAttribute("data-value", { timeout: 3_000 });
    } catch {
      return null;
    }
  }

  /** Reads the text content of a stat row's value cell, matched by its label title. */
  private async getLabelValue(container: Locator, title: string): Promise<string | null> {
    try {
      const text = await container.locator(`li:has(.label[title="${title}"]) .value`).textContent({ timeout: 3_000 });
      return text?.trim() ?? null;
    } catch {
      return null;
    }
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

  async close(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  private async getPage(): Promise<Page> {
    if (!this.context) {
      throw new Error("Scraper not initialised — call init() first");
    }
    if (!this.page) {
      this.page = await this.context.newPage();
    }
    return this.page;
  }
}

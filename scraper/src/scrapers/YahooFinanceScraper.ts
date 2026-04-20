import type { Browser, BrowserContext, Locator, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import type { ScrapeResult } from "../types/index.js";

/**
 * Scrapes market data for a given ticker from Yahoo Finance.
 * Implementation is stubbed — Phase 1 will add the full scraping logic.
 */
export class YahooFinanceScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  }

  async scrape(ticker: string): Promise<void> {
    // Each scrape gets a fresh page; cookies are shared across pages within the context,
    // so the consent popup is only dismissed once per session.
    const page = await this.newPage();

    // Navigate to the stock's page on Yahoo Finance
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`);

    // Dismiss any consent popups that may appear for cookies
    await this.dismissConsentPopup(page);

    const quoteStatisticsContainer = page.locator('[data-testid="quote-statistics"]');
    const noDataContainer = page.locator("div.noData");

    // Wait for either the stats panel or the no-data message to render
    await quoteStatisticsContainer.or(noDataContainer).first().waitFor({ state: "visible" });

    if (await noDataContainer.isVisible()) {
      throw new Error(`No results found for ticker: ${ticker}`);
    }

    const _title = await page.title();
    const _metaTitle = await page.locator('meta[name="title"]').getAttribute("content");

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

    console.log(JSON.stringify(stats, null, 2));
  }

  /** Reads the raw `data-value` from a `fin-streamer` element by its `data-field`. */
  private async getFinStreamer(container: Locator, field: string): Promise<string | null> {
    return container.locator(`fin-streamer[data-field="${field}"]`).first().getAttribute("data-value");
  }

  /** Reads the text content of a stat row's value cell, matched by its label title. */
  private async getLabelValue(container: Locator, title: string): Promise<string | null> {
    const text = await container.locator(`li:has(.label[title="${title}"]) .value`).textContent();
    return text?.trim() ?? null;
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
    await this.context?.close();
    await this.browser?.close();
    this.context = null;
    this.browser = null;
  }

  protected async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error("Scraper not initialised — call init() first");
    }
    return this.context.newPage();
  }
}

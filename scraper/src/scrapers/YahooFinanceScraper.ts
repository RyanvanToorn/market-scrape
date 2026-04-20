import type { Browser, BrowserContext, Page } from "@playwright/test";
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

  async scrape(_ticker: string): Promise<ScrapeResult> {
    // TODO (Phase 1): Implement scraping logic
    throw new Error("Not yet implemented");
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

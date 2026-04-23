import { test, expect } from "@playwright/test";
import { YahooFinanceScraper } from "../src/scrapers/YahooFinanceScraper.js";

// Placeholder test — Phase 1 will expand these with real scraping assertions.
test.describe("YahooFinanceScraper", () => {
  let scraper: YahooFinanceScraper;

  test.beforeEach(async () => {
    scraper = new YahooFinanceScraper();
    await scraper.init();
  });

  test.afterEach(async () => {
    await scraper.close();
  });

  test("stub — scrape() throws until implemented", async () => {
    await expect(scraper.scrape("AAPL")).rejects.toThrow("Not yet implemented");
  });
});

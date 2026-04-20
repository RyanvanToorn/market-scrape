/**
 * Dev sandbox — run with: npm run dev:scraper
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { YahooFinanceScraper } from "./scrapers/YahooFinanceScraper.js";

const _ticker = process.argv[2] ?? "AAPL";


/** Scrapes a single symbol, logging and swallowing errors so the loop continues. */
async function scrapeSymbol(scraper: YahooFinanceScraper, symbol: string): Promise<void> {
    try {
        console.log(`Scraping ${symbol}...`);
        await scraper.scrape(symbol);
    } catch (err) {
        console.log(`Skipping ${symbol}: ${err instanceof Error ? err.message : err}`);
    }
}

/** Reads ticker symbols from temp/Listings.txt and returns them as a list */
function retrieveSymbolList(): string[] {
    const filePath = resolve(import.meta.dirname, "../../temp/Listings.txt");
    const lines = readFileSync(filePath, "utf-8").split(/\r?\n/);
    const symbols: string[] = [];
    for (const line of lines.slice(1)) {
        const symbol = line.split(",")[0]?.trim();
        if (symbol) {
            symbols.push(symbol);
        }
    }
    return symbols;
}

const allSymbols = retrieveSymbolList();
console.log(`Retrieved ${allSymbols.length} symbols from file.`);

const scraper = new YahooFinanceScraper();
try {
    console.log("Initialising scraper...");
    await scraper.init();

    let count = 0;
    while (count < 15) {
        const symbol = allSymbols[count];
        if (!symbol) {
            console.warn(`No symbol found for line ${count + 2}, skipping.`);
            count++;
            continue;
        }
        console.log(`\n=== Scraping ${symbol} ===`);
        await scrapeSymbol(scraper, symbol);
        count++;
    }
} finally {
    await scraper.close();
}


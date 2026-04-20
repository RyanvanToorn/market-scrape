/**
 * Dev sandbox — run with: npm run dev:scraper
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { YahooFinanceScraper } from "./scrapers/YahooFinanceScraper.js";

const _ticker = process.argv[2] ?? "AAPL";


/** Runs the scraper for a given ticker */
async function runScraper(symbol: string): Promise<void> {
    const scraper = new YahooFinanceScraper();
    try {
        console.log("Initialising scraper...");
        await scraper.init();
        console.log(`Scraping ${symbol}...`);
        const result = await scraper.scrape(symbol);
        console.log(JSON.stringify(result, null, 2));
    } finally {
        await scraper.close();
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
let count = 0;

while (count < 10) {
    const symbol = allSymbols[count];
    console.log(`\n=== Scraping ${symbol} ===`);
    if (!symbol) {
        console.warn(`No symbol found for line ${count + 2}, skipping.`);
        count++;
        continue;
    }
    await runScraper(symbol);
    count++;
}

//const symbols = retrieveSymbolList();


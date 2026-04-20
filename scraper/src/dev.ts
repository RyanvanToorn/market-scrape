/**
 * Dev sandbox — run with: npm run dev:scraper
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { YahooFinanceScraper } from "./scrapers/YahooFinanceScraper.js";

const ticker = process.argv[2] ?? "AAPL";


/** Runs the scraper for a given ticker */
async function runScraper(): Promise<void> {
    const scraper = new YahooFinanceScraper();
    try {
        await scraper.init();
        console.log(`Scraping ${ticker}...`);
        const result = await scraper.scrape(ticker);
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

//runScraper();
const symbols = retrieveSymbolList();


/**
 * Promote potential instruments → instruments by validating via Yahoo Finance scrape.
 *
 * Run with: npm run promote:instruments
 * Run with custom workers: WORKERS=3 npm run promote:instruments
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MASTER TOGGLE — set to `true` when you are ready to write to the database.
 * While `false`, all API mutations are skipped and logged as "would …" messages.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const DRY_RUN = false;

/**
 * Number of parallel scraper workers. Each worker runs its own Chromium instance.
 * Override at runtime via argument: npm run promote:instruments -- <workers> [--headed]
 * Or via env var:                  WORKERS=3 npm run promote:instruments
 */
const WORKERS = Math.max(1, parseInt(process.argv[2] ?? process.env['WORKERS'] ?? '3', 10));

/**
 * Whether Playwright runs in headless mode. Defaults to true.
 * Pass --headed as the second argument to show the browser:
 *   npm run promote:instruments -- 3 --headed
 */
const HEADLESS = !process.argv.includes('--headed');

/**
 * Maximum number of symbols to process in this run. Defaults to 0 (unlimited).
 * When set, the first N unvalidated symbols are taken (sorted as returned by the API)
 * and split across workers as normal. Counts all outcomes — promoted, dupes, and failures.
 * Override at runtime: npm run promote:instruments -- <workers> [--headed] [--batch=<n>]
 * Or via env var:      BATCH_SIZE=50 npm run promote:instruments
 */
const BATCH_SIZE = Math.max(0, parseInt(
    process.argv.find(a => a.startsWith('--batch='))?.split('=')[1]
    ?? process.env['BATCH_SIZE']
    ?? '0',
    10) || 0);

const API_BASE_URL = process.env['API_BASE_URL'] ?? 'http://localhost:5204';

import type { ScrapedStats, ScrapeResult, ChartData, PotentialInstrumentRecord, InstrumentRecord, InstrumentPayload } from './types/index.js';
import { YahooFinanceScraper } from './scrapers/YahooFinanceScraper.js';
import { CircuitBreaker } from './utilities/CircuitBreaker.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the scrape produced data for more than 3 of the 16 metrics. */
function isSuccessfulScrape(stats: ScrapedStats): boolean {
    const nonNullCount = Object.values(stats).filter(v => v !== null).length;
    return nonNullCount > 3;
}

/** Builds a deduplication key from symbol + exchange, case-insensitive. */
function dupeKey(symbol: string, exchange: string): string {
    return `${symbol.toUpperCase()}|${exchange.toUpperCase()}`;
}

/** Splits an array into N roughly-equal chunks by round-robin assignment. */
function partition<T>(arr: T[], n: number): T[][] {
    const chunks: T[][] = Array.from({ length: n }, () => []);
    arr.forEach((item, i) => chunks[i % n]!.push(item));
    return chunks;
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchPotentialInstruments(): Promise<PotentialInstrumentRecord[]> {
    const res = await fetch(`${API_BASE_URL}/potential-instruments`);
    if (!res.ok) throw new Error(`GET /potential-instruments failed: ${res.status}`);
    return res.json() as Promise<PotentialInstrumentRecord[]>;
}

async function fetchInstruments(): Promise<InstrumentRecord[]> {
    const res = await fetch(`${API_BASE_URL}/instruments`);
    if (!res.ok) throw new Error(`GET /instruments failed: ${res.status}`);
    return res.json() as Promise<InstrumentRecord[]>;
}

async function createInstrument(payload: InstrumentPayload): Promise<number | null> {
    if (DRY_RUN) {
        console.log(`  [DRY RUN] Would POST /instruments { symbol: ${payload.symbol}, exchange: ${payload.exchange} }`);
        return -1; // sentinel so callers know to proceed in dry-run mode
    }
    const res = await fetch(`${API_BASE_URL}/instruments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (res.status === 201) {
        const instrument = await res.json() as InstrumentRecord;
        return instrument.id;
    }
    console.warn(`  POST /instruments returned ${res.status} for ${payload.symbol}`);
    return null;
}

async function storePriceHistory(instrumentId: number, daily: ChartData, weekly: ChartData): Promise<void> {
    const allPoints = [...daily.pricePoints, ...weekly.pricePoints];
    if (allPoints.length === 0) return;

    if (DRY_RUN) {
        console.log(`  [DRY RUN] Would POST ${allPoints.length} price history records for instrument ${instrumentId}`);
        return;
    }
    const res = await fetch(`${API_BASE_URL}/instruments/${instrumentId}/price-history/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allPoints),
    });
    if (!res.ok) {
        console.warn(`  POST /instruments/${instrumentId}/price-history/batch returned ${res.status}`);
        return;
    }
    const result = await res.json() as { inserted: number };
    console.log(`  Stored ${result.inserted}/${allPoints.length} price history records.`);
}

async function storeDividends(instrumentId: number, daily: ChartData, weekly: ChartData): Promise<void> {
    // Deduplicate dividends across both intervals by ex-date (weekly 5Y has more history)
    const seen = new Set<string>();
    const allDividends = [...daily.dividends, ...weekly.dividends].filter(d => {
        if (seen.has(d.exDate)) return false;
        seen.add(d.exDate);
        return true;
    });
    if (allDividends.length === 0) return;

    if (DRY_RUN) {
        console.log(`  [DRY RUN] Would POST ${allDividends.length} dividend records for instrument ${instrumentId}`);
        return;
    }
    const res = await fetch(`${API_BASE_URL}/instruments/${instrumentId}/dividends/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allDividends),
    });
    if (!res.ok) {
        console.warn(`  POST /instruments/${instrumentId}/dividends/batch returned ${res.status}`);
        return;
    }
    const result = await res.json() as { inserted: number };
    console.log(`  Stored ${result.inserted}/${allDividends.length} dividend records.`);
}

async function markValidated(id: number, symbol: string): Promise<void> {
    if (DRY_RUN) {
        console.log(`  [DRY RUN] Would PATCH /potential-instruments/${id}/validate (${symbol})`);
        return;
    }
    const res = await fetch(`${API_BASE_URL}/potential-instruments/${id}/validate`, { method: 'PATCH' });
    if (res.status !== 204) {
        console.warn(`  PATCH /potential-instruments/${id}/validate returned ${res.status}`);
    }
}

// ── Shutdown handling ───────────────────────────────────────────────────────

let isShuttingDown = false;

const circuitBreaker = new CircuitBreaker(5, () => {
    if (!isShuttingDown) {
        isShuttingDown = true;
        console.log('\n[Circuit Breaker] 5 consecutive scrape failures detected — halting all workers. This may indicate rate limiting or a critical error.');
    }
});

process.on('SIGINT', () => {
    if (!isShuttingDown) {
        isShuttingDown = true;
        console.log('\n[Shutdown] Ctrl+C received — finishing current item then stopping. Press again to force quit.');
    } else {
        process.exit(1);
    }
});

// ── Worker ───────────────────────────────────────────────────────────────────

interface Counters {
    promoted: number;
    skippedDupe: number;
    failed: number;
}

async function runWorker(
    workerId: number,
    chunk: PotentialInstrumentRecord[],
    existingKeys: Set<string>,
    existingIdMap: Map<string, number>,
    counters: Counters,
    breaker: CircuitBreaker,
): Promise<void> {
    if (chunk.length === 0) return;

    const scraper = new YahooFinanceScraper();
    try {
        console.log(`[Worker ${workerId}] Starting — ${chunk.length} instruments assigned`);
        await scraper.init(HEADLESS);

        for (const potential of chunk) {
            if (isShuttingDown) {
                console.log(`[Worker ${workerId}] Shutdown signal received — stopping without marking remaining items.`);
                break;
            }

            console.log(`[Worker ${workerId}] ${potential.symbol} (${potential.exchange})`);

            let scrapeSuccess = false;

            let scrapeResult: ScrapeResult | null = null;

            try {
                scrapeResult = await scraper.scrape(potential.symbol);
                breaker.recordSuccess();
                scrapeSuccess = isSuccessfulScrape(scrapeResult.stats);
                const nonNull = Object.values(scrapeResult.stats).filter(v => v !== null).length;

                if (scrapeSuccess) {
                    console.log(`[Worker ${workerId}]   Scrape OK (${nonNull}/16 metrics)`);
                } else {
                    console.log(`[Worker ${workerId}]   Scrape insufficient (${nonNull}/16 metrics — need > 3)`);
                }
            } catch (err) {
                breaker.recordFailure();
                console.log(`[Worker ${workerId}]   Scrape failed: ${err instanceof Error ? err.message : err}`);
            }

            if (scrapeSuccess) {
                const key = dupeKey(potential.symbol, potential.exchange);

                if (existingKeys.has(key)) {
                    console.log(`[Worker ${workerId}]   Duplicate — already in instruments. Updating price history.`);
                    const existingId = existingIdMap.get(key);
                    if (existingId !== undefined && scrapeResult) {
                        await storePriceHistory(existingId, scrapeResult.daily, scrapeResult.weekly);
                        await storeDividends(existingId, scrapeResult.daily, scrapeResult.weekly);
                    }
                    await markValidated(potential.id, potential.symbol);
                    counters.skippedDupe++;
                } else {
                    // Add key synchronously before the async create to prevent within-run dupes
                    existingKeys.add(key);

                    const payload: InstrumentPayload = {
                        symbol: potential.symbol,
                        name: potential.name,
                        typeId: potential.typeId,
                        exchange: potential.exchange,
                        currency: scrapeResult?.daily.currency ?? scrapeResult?.weekly.currency ?? "",
                    };
                    const instrumentId = await createInstrument(payload);
                    if (instrumentId !== null) {
                        if (scrapeResult && instrumentId > 0) {
                            await storePriceHistory(instrumentId, scrapeResult.daily, scrapeResult.weekly);
                            await storeDividends(instrumentId, scrapeResult.daily, scrapeResult.weekly);
                        }
                        await markValidated(potential.id, potential.symbol);
                        counters.promoted++;
                    }
                }
            } else {
                console.log(`[Worker ${workerId}]   Marking validated (scrape unsuccessful).`);
                await markValidated(potential.id, potential.symbol);
                counters.failed++;
            }
        }
    } finally {
        await scraper.close();
        console.log(`[Worker ${workerId}] Done`);
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`=== Promote Instruments (DRY_RUN=${DRY_RUN}, WORKERS=${WORKERS}, HEADLESS=${HEADLESS}, BATCH_SIZE=${BATCH_SIZE || 'unlimited'}) ===\n`);

const [potentials, existing] = await Promise.all([
    fetchPotentialInstruments(),
    fetchInstruments(),
]);

const unvalidated = potentials.filter(p => !p.validated);

console.log(`Fetched ${potentials.length} potential instruments (${unvalidated.length} unvalidated), ${existing.length} existing instruments.`);

if (unvalidated.length === 0) {
    console.log('\nNothing to process.');
    process.exit(0);
}

const toProcess = BATCH_SIZE > 0 ? unvalidated.slice(0, BATCH_SIZE) : unvalidated;
if (BATCH_SIZE > 0) {
    console.log(`Batch limit applied: processing ${toProcess.length} of ${unvalidated.length} unvalidated symbols.`);
}

const existingKeys = new Set<string>(existing.map(i => dupeKey(i.symbol, i.exchange)));
const existingIdMap = new Map<string, number>(existing.map(i => [dupeKey(i.symbol, i.exchange), i.id]));

const counters: Counters = { promoted: 0, skippedDupe: 0, failed: 0 };

const workerCount = Math.min(WORKERS, toProcess.length);
const chunks = partition(toProcess, workerCount);

console.log(`\nSpinning up ${workerCount} worker(s)...\n`);

await Promise.all(
    chunks.map((chunk, i) => runWorker(i + 1, chunk, existingKeys, existingIdMap, counters, circuitBreaker))
);

const totalProcessed = counters.promoted + counters.skippedDupe + counters.failed;
const stoppedEarly = isShuttingDown || totalProcessed < toProcess.length;

console.log(`
=== Summary ===
  Total queued    : ${toProcess.length}${BATCH_SIZE > 0 ? ` (batch limit; ${unvalidated.length} total unvalidated)` : ''}
  Total processed : ${totalProcessed}${stoppedEarly ? ' (stopped early)' : ''}
  Promoted        : ${counters.promoted}
  Skipped (dupe)  : ${counters.skippedDupe}
  Failed/removed  : ${counters.failed}
  DRY_RUN         : ${DRY_RUN}
  Workers used    : ${workerCount}
  Batch limit     : ${BATCH_SIZE || 'unlimited'}
`);

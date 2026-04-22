/**
 * Core data contracts for scraped market data.
 * These are the typed JSON shapes the scraper outputs
 * and the API/data layer ingests.
 */

export interface AssetQuote {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  scrapedAt: string; // ISO 8601 UTC
}

export interface PriceSnapshot {
  ticker: string;
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ScrapeResult {
  ticker: string;
  quote: AssetQuote;
  history: PriceSnapshot[];
  scrapedAt: string; // ISO 8601 UTC
}

// ── API types ──────────────────────────────────────────────────────────────

export interface InstrumentType {
  id: number;
  description: string;
  isActive: boolean;
}

export interface InstrumentPayload {
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
}

export interface ScrapedStats {
  previousClose:        string | null;
  open:                 string | null;
  bid:                  string | null;
  ask:                  string | null;
  daysRange:            string | null;
  fiftyTwoWeekRange:    string | null;
  volume:               string | null;
  avgVolume:            string | null;
  marketCap:            string | null;
  beta:                 string | null;
  peRatio:              string | null;
  eps:                  string | null;
  earningsDate:         string | null;
  forwardDividendYield: string | null;
  exDividendDate:       string | null;
  oneYearTarget:        string | null;
}

export interface PotentialInstrumentRecord {
  id: number;
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
  isActive: boolean;
  validated: boolean;
}

export interface InstrumentRecord {
  id: number;
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
  isActive: boolean;
}

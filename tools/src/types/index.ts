/**
 * Core data contracts for scraped market data.
 * These are the typed JSON shapes the scraper outputs
 * and the API/data layer ingests.
 */

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
  currency?: string;
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
  currency: string;
  isActive: boolean;
}

// ── Chart / price history types ────────────────────────────────────────────

export type ChartInterval = "1d" | "1wk";

export interface ChartPricePoint {
  date: string;          // YYYY-MM-DD (UTC, derived from Unix epoch)
  granularity: ChartInterval;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  adjClose: number | null;
  volume: number | null;
}

export interface ChartDividend {
  exDate: string;        // YYYY-MM-DD
  paymentDate: string;   // YYYY-MM-DD
  amount: number;
}

export interface ChartData {
  symbol: string;
  currency: string;
  granularity: ChartInterval;
  pricePoints: ChartPricePoint[];
  dividends: ChartDividend[];
}

export interface ScrapeResult {
  stats: ScrapedStats;
  daily: ChartData;
  weekly: ChartData;
}

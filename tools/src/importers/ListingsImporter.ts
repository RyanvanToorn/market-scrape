import { readFileSync } from 'fs';
import type { InstrumentType, InstrumentPayload } from '../types/index.js';

const BATCH_SIZE = 100;

const EQUITIES_DESCRIPTION = 'Equities';
const SEEDED_TYPES = ['Equities', 'ETF', 'Stock'];

async function ensureInstrumentType(description: string, apiBaseUrl: string, typeMap: Map<string, number>): Promise<number> {
  const key = description.toLowerCase();
  const existing = typeMap.get(key);
  if (existing !== undefined) {
    console.log(`InstrumentType "${description}" already exists (id: ${existing})`);
    return existing;
  }

  console.log(`Creating InstrumentType "${description}"...`);
  const res = await fetch(`${apiBaseUrl}/instrument-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error(`Failed to create InstrumentType "${description}": ${res.status}`);
  const created = await res.json() as InstrumentType;
  typeMap.set(key, created.id);
  console.log(`Created InstrumentType "${description}" (id: ${created.id})`);
  return created.id;
}

export async function importListings(filePath: string, apiBaseUrl: string): Promise<void> {
  // Fetch existing instrument types and build a lookup map
  const typesRes = await fetch(`${apiBaseUrl}/instrument-types`);
  if (!typesRes.ok) throw new Error(`Failed to fetch instrument types: ${typesRes.status}`);
  const instrumentTypes: InstrumentType[] = await typesRes.json() as InstrumentType[];
  const typeMap = new Map<string, number>(
    instrumentTypes.map(t => [t.description.toLowerCase(), t.id])
  );

  // Ensure all known instrument types exist (no-op if already present)
  for (const description of SEEDED_TYPES) {
    await ensureInstrumentType(description, apiBaseUrl, typeMap);
  }
  const equitiesTypeId = typeMap.get(EQUITIES_DESCRIPTION.toLowerCase())!;

  // Read file — intentionally simple, line-by-line split
  const raw = readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  const records: InstrumentPayload[] = [];
  let skipped = 0;

  // Skip header (line 0) and blank lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.split(',');
    const symbol = cols[0]?.trim() ?? '';
    const name = cols[1]?.trim() ?? '';
    const exchange = cols[2]?.trim() ?? '';
    const assetType = cols[3]?.trim() ?? '';

    // Blank/null asset type defaults to Equities
    if (!assetType) {
      records.push({ symbol, name, typeId: equitiesTypeId, exchange });
      continue;
    }

    const typeId = typeMap.get(assetType.toLowerCase());
    if (typeId === undefined) {
      console.warn(`[SKIP] Unknown assetType "${assetType}" for symbol "${symbol}"`);
      skipped++;
      continue;
    }

    records.push({ symbol, name, typeId, exchange });
  }

  console.log(`Parsed ${records.length} valid records (${skipped} skipped due to unknown type)`);
  if (records.length === 0) return;

  // Send in batches
  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${apiBaseUrl}/potential-instruments/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed (${res.status}): ${body}`);
    }

    inserted += batch.length;
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${batch.length} records (total: ${inserted})`);
  }

  console.log(`Import complete. ${inserted} records inserted.`);
}

using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Repositories;

public class InstrumentDividendRepository(AppDbContext context) : IInstrumentDividendRepository
{
    public async Task<IEnumerable<InstrumentDividend>> GetByInstrumentAsync(int instrumentId) =>
        await context.InstrumentDividends
            .Where(e => e.InstrumentId == instrumentId)
            .OrderBy(e => e.ExDate)
            .ToListAsync();

    /// <summary>
    /// Inserts dividends that do not already exist (identified by instrument_id + ex_date).
    /// Existing records are silently skipped. Returns the number of rows actually inserted.
    /// </summary>
    public async Task<int> UpsertRangeAsync(List<InstrumentDividend> records)
    {
        if (records.Count == 0) return 0;

        var instrumentIds = records.Select(r => r.InstrumentId).Distinct().ToList();

        var existingKeys = (await context.InstrumentDividends
            .Where(e => instrumentIds.Contains(e.InstrumentId))
            .Select(e => new { e.InstrumentId, e.ExDate })
            .ToListAsync())
            .Select(k => (k.InstrumentId, k.ExDate))
            .ToHashSet();

        var newRecords = records
            .Where(r => !existingKeys.Contains((r.InstrumentId, r.ExDate)))
            .ToList();

        if (newRecords.Count == 0) return 0;

        await context.InstrumentDividends.AddRangeAsync(newRecords);
        await context.SaveChangesAsync();
        return newRecords.Count;
    }
}

using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Repositories;

public class InstrumentPriceHistoryRepository(AppDbContext context) : IInstrumentPriceHistoryRepository
{
    public async Task<IEnumerable<InstrumentPriceHistory>> GetByInstrumentAsync(int instrumentId, string? granularity = null)
    {
        var query = context.InstrumentPriceHistory
            .Where(e => e.InstrumentId == instrumentId);

        if (granularity is not null)
            query = query.Where(e => e.Granularity == granularity);

        return await query.OrderBy(e => e.Date).ToListAsync();
    }

    /// <summary>
    /// Inserts records that do not already exist (identified by instrument_id + date + granularity).
    /// Existing records are silently skipped. Returns the number of rows actually inserted.
    /// </summary>
    public async Task<int> UpsertRangeAsync(List<InstrumentPriceHistory> records)
    {
        if (records.Count == 0) return 0;

        var newRecords = new List<InstrumentPriceHistory>();

        // Group by instrument + granularity to minimise DB round-trips
        foreach (var group in records.GroupBy(r => new { r.InstrumentId, r.Granularity }))
        {
            var existingDates = await context.InstrumentPriceHistory
                .Where(e => e.InstrumentId == group.Key.InstrumentId && e.Granularity == group.Key.Granularity)
                .Select(e => e.Date)
                .ToHashSetAsync();

            newRecords.AddRange(group.Where(r => !existingDates.Contains(r.Date)));
        }

        if (newRecords.Count == 0) return 0;

        await context.InstrumentPriceHistory.AddRangeAsync(newRecords);
        await context.SaveChangesAsync();
        return newRecords.Count;
    }
}

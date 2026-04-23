using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentPriceHistoryRepository
{
    Task<IEnumerable<InstrumentPriceHistory>> GetByInstrumentAsync(int instrumentId, string? granularity = null);
    Task UpsertRangeAsync(List<InstrumentPriceHistory> records);
}

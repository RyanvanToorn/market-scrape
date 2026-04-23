using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentDividendRepository
{
    Task<IEnumerable<InstrumentDividend>> GetByInstrumentAsync(int instrumentId);
    Task UpsertRangeAsync(List<InstrumentDividend> records);
}

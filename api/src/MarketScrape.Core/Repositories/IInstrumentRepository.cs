using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentRepository
{
    Task<IEnumerable<Instrument>> GetAllAsync();
    Task<Instrument?> GetByIdAsync(int id);
    Task AddAsync(Instrument instrument);
    Task AddRangeAsync(IEnumerable<Instrument> instruments);
    Task UpdateAsync(Instrument instrument);
    Task UpdateRangeAsync(IEnumerable<Instrument> instruments);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(IEnumerable<int> ids);
}

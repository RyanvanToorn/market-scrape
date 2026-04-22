using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentRepository
{
    Task<IEnumerable<Instrument>> GetAllAsync();
    Task<Instrument?> GetByIdAsync(int id);
    Task AddAsync(Instrument instrument);
    Task AddRangeAsync(List<Instrument> instruments);
    Task UpdateAsync(Instrument instrument);
    Task UpdateRangeAsync(List<Instrument> instruments);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(List<int> ids);
}

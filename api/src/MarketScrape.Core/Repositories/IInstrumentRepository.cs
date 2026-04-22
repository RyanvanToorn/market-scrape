using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentRepository
{
    Task<IEnumerable<Instrument>> GetAllAsync();
    Task<Instrument?> GetByIdAsync(int id);
    Task AddAsync(Instrument instrument);
    Task DeleteAsync(int id);
}

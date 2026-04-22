using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IPotentialInstrumentRepository
{
    Task<IEnumerable<PotentialInstrument>> GetAllAsync();
    Task<PotentialInstrument?> GetByIdAsync(int id);
    Task AddAsync(PotentialInstrument potentialInstrument);
    Task DeleteAsync(int id);
}

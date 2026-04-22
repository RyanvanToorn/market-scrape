using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IPotentialInstrumentRepository
{
    Task<IEnumerable<PotentialInstrument>> GetAllAsync();
    Task<PotentialInstrument?> GetByIdAsync(int id);
    Task AddAsync(PotentialInstrument potentialInstrument);
    Task AddRangeAsync(IEnumerable<PotentialInstrument> potentialInstruments);
    Task UpdateAsync(PotentialInstrument potentialInstrument);
    Task UpdateRangeAsync(IEnumerable<PotentialInstrument> potentialInstruments);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(IEnumerable<int> ids);
}

using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IPotentialInstrumentRepository
{
    Task<IEnumerable<PotentialInstrument>> GetAllAsync();
    Task<PotentialInstrument?> GetByIdAsync(int id);
    Task AddAsync(PotentialInstrument potentialInstrument);
    Task AddRangeAsync(List<PotentialInstrument> potentialInstruments);
    Task UpdateAsync(PotentialInstrument potentialInstrument);
    Task UpdateRangeAsync(List<PotentialInstrument> potentialInstruments);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(List<int> ids);
}

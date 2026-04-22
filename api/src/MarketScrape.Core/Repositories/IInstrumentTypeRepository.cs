using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentTypeRepository
{
    Task<IEnumerable<InstrumentType>> GetAllAsync();
    Task<InstrumentType?> GetByIdAsync(int id);
    Task AddAsync(InstrumentType instrumentType);
    Task AddRangeAsync(IEnumerable<InstrumentType> instrumentTypes);
    Task UpdateAsync(InstrumentType instrumentType);
    Task UpdateRangeAsync(IEnumerable<InstrumentType> instrumentTypes);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(IEnumerable<int> ids);
}

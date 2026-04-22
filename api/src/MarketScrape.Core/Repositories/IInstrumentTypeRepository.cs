using MarketScrape.Core.Entities;

namespace MarketScrape.Core.Repositories;

public interface IInstrumentTypeRepository
{
    Task<IEnumerable<InstrumentType>> GetAllAsync();
    Task<InstrumentType?> GetByIdAsync(int id);
    Task AddAsync(InstrumentType instrumentType);
    Task AddRangeAsync(List<InstrumentType> instrumentTypes);
    Task UpdateAsync(InstrumentType instrumentType);
    Task UpdateRangeAsync(List<InstrumentType> instrumentTypes);
    Task DeleteAsync(int id);
    Task DeleteRangeAsync(List<int> ids);
}

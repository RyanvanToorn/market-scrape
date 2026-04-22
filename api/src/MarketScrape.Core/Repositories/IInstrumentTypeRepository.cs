namespace MarketScrape.Core.Repositories;

public interface IInstrumentTypeRepository
{
    Task<IEnumerable<InstrumentType>> GetAllAsync();
    Task<InstrumentType?> GetByIdAsync(int id);
    Task AddAsync(InstrumentType instrumentType);
    Task DeleteAsync(int id);
}

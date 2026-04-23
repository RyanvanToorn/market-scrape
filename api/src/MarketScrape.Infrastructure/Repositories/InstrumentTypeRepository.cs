using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Repositories;

public class InstrumentTypeRepository(AppDbContext context) : IInstrumentTypeRepository
{
    public async Task<IEnumerable<InstrumentType>> GetAllAsync() =>
        await context.InstrumentTypes.ToListAsync();

    public async Task<InstrumentType?> GetByIdAsync(int id) =>
        await context.InstrumentTypes.FindAsync(id);

    public async Task AddAsync(InstrumentType instrumentType)
    {
        await context.InstrumentTypes.AddAsync(instrumentType);
        await context.SaveChangesAsync();
    }

    public async Task AddRangeAsync(List<InstrumentType> instrumentTypes)
    {
        await context.InstrumentTypes.AddRangeAsync(instrumentTypes);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(InstrumentType instrumentType)
    {
        context.InstrumentTypes.Update(instrumentType);
        await context.SaveChangesAsync();
    }

    public async Task UpdateRangeAsync(List<InstrumentType> instrumentTypes)
    {
        context.InstrumentTypes.UpdateRange(instrumentTypes);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await context.InstrumentTypes.FindAsync(id);
        if (entity is not null)
        {
            context.InstrumentTypes.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteRangeAsync(List<int> ids)
    {
        var entities = await context.InstrumentTypes.Where(e => ids.Contains(e.Id)).ToListAsync();
        context.InstrumentTypes.RemoveRange(entities);
        await context.SaveChangesAsync();
    }
}

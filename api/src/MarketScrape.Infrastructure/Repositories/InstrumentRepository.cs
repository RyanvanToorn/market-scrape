using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Repositories;

public class InstrumentRepository(AppDbContext context) : IInstrumentRepository
{
    public async Task<IEnumerable<Instrument>> GetAllAsync() =>
        await context.Instruments.Include(i => i.InstrumentType).ToListAsync();

    public async Task<Instrument?> GetByIdAsync(int id) =>
        await context.Instruments.Include(i => i.InstrumentType).FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddAsync(Instrument instrument)
    {
        await context.Instruments.AddAsync(instrument);
        await context.SaveChangesAsync();
    }

    public async Task AddRangeAsync(List<Instrument> instruments)
    {
        await context.Instruments.AddRangeAsync(instruments);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Instrument instrument)
    {
        context.Instruments.Update(instrument);
        await context.SaveChangesAsync();
    }

    public async Task UpdateRangeAsync(List<Instrument> instruments)
    {
        context.Instruments.UpdateRange(instruments);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await context.Instruments.FindAsync(id);
        if (entity is not null)
        {
            context.Instruments.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteRangeAsync(List<int> ids)
    {
        var entities = await context.Instruments.Where(e => ids.Contains(e.Id)).ToListAsync();
        context.Instruments.RemoveRange(entities);
        await context.SaveChangesAsync();
    }
}

using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Repositories;

public class PotentialInstrumentRepository(AppDbContext context) : IPotentialInstrumentRepository
{
    public async Task<IEnumerable<PotentialInstrument>> GetAllAsync() =>
        await context.PotentialInstruments.Include(i => i.InstrumentType).ToListAsync();

    public async Task<PotentialInstrument?> GetByIdAsync(int id) =>
        await context.PotentialInstruments.Include(i => i.InstrumentType).FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddAsync(PotentialInstrument potentialInstrument)
    {
        await context.PotentialInstruments.AddAsync(potentialInstrument);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await context.PotentialInstruments.FindAsync(id);
        if (entity is not null)
        {
            context.PotentialInstruments.Remove(entity);
            await context.SaveChangesAsync();
        }
    }
}

using MarketScrape.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<InstrumentType> InstrumentTypes => Set<InstrumentType>();
    public DbSet<Instrument> Instruments => Set<Instrument>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InstrumentType>(entity =>
        {
            entity.ToTable("instrument_types");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.CreatedOn).HasColumnName("created_on");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.ModifiedOn).HasColumnName("modified_on");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
        });

        modelBuilder.Entity<Instrument>(entity =>
        {
            entity.ToTable("instruments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Symbol).HasColumnName("symbol");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.TypeId).HasColumnName("type_id");
            entity.Property(e => e.Exchange).HasColumnName("exchange");
            entity.Property(e => e.CreatedOn).HasColumnName("created_on");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.ModifiedOn).HasColumnName("modified_on");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.IsActive).HasColumnName("is_active");

            entity.HasOne(e => e.InstrumentType)
                  .WithMany(t => t.Instruments)
                  .HasForeignKey(e => e.TypeId);
        });
    }
}

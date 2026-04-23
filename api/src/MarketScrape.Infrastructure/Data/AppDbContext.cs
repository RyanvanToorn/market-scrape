using MarketScrape.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketScrape.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<InstrumentType> InstrumentTypes => Set<InstrumentType>();
    public DbSet<Instrument> Instruments => Set<Instrument>();
    public DbSet<PotentialInstrument> PotentialInstruments => Set<PotentialInstrument>();
    public DbSet<InstrumentPriceHistory> InstrumentPriceHistory => Set<InstrumentPriceHistory>();
    public DbSet<InstrumentDividend> InstrumentDividends => Set<InstrumentDividend>();

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
            entity.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(10);
            entity.Property(e => e.CreatedOn).HasColumnName("created_on");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.ModifiedOn).HasColumnName("modified_on");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.IsActive).HasColumnName("is_active");

            entity.HasOne(e => e.InstrumentType)
                  .WithMany(t => t.Instruments)
                  .HasForeignKey(e => e.TypeId);

            entity.HasIndex(e => new { e.Symbol, e.Exchange })
                  .IsUnique()
                  .HasDatabaseName("IX_instruments_symbol_exchange");
        });

        modelBuilder.Entity<PotentialInstrument>(entity =>
        {
            entity.ToTable("potential_instruments");
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
            entity.Property(e => e.Validated).HasColumnName("validated");

            entity.HasOne(e => e.InstrumentType)
                  .WithMany()
                  .HasForeignKey(e => e.TypeId);
        });

        modelBuilder.Entity<InstrumentPriceHistory>(entity =>
        {
            entity.ToTable("instrument_price_history");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.InstrumentId).HasColumnName("instrument_id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Granularity).HasColumnName("granularity").HasMaxLength(5);
            entity.Property(e => e.Open).HasColumnName("open").HasPrecision(18, 6);
            entity.Property(e => e.High).HasColumnName("high").HasPrecision(18, 6);
            entity.Property(e => e.Low).HasColumnName("low").HasPrecision(18, 6);
            entity.Property(e => e.Close).HasColumnName("close").HasPrecision(18, 6);
            entity.Property(e => e.AdjClose).HasColumnName("adj_close").HasPrecision(18, 6);
            entity.Property(e => e.Volume).HasColumnName("volume");

            entity.HasOne(e => e.Instrument)
                  .WithMany()
                  .HasForeignKey(e => e.InstrumentId);

            entity.HasIndex(e => new { e.InstrumentId, e.Date, e.Granularity })
                  .IsUnique()
                  .HasDatabaseName("IX_instrument_price_history_instrument_date_granularity");
        });

        modelBuilder.Entity<InstrumentDividend>(entity =>
        {
            entity.ToTable("instrument_dividends");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.InstrumentId).HasColumnName("instrument_id");
            entity.Property(e => e.ExDate).HasColumnName("ex_date");
            entity.Property(e => e.PaymentDate).HasColumnName("payment_date");
            entity.Property(e => e.Amount).HasColumnName("amount").HasPrecision(18, 6);

            entity.HasOne(e => e.Instrument)
                  .WithMany()
                  .HasForeignKey(e => e.InstrumentId);

            entity.HasIndex(e => new { e.InstrumentId, e.ExDate })
                  .IsUnique()
                  .HasDatabaseName("IX_instrument_dividends_instrument_ex_date");
        });
    }
}

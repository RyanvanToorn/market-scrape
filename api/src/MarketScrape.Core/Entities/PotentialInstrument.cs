namespace MarketScrape.Core.Entities;

public class PotentialInstrument
{
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int TypeId { get; set; }
    public string Exchange { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? ModifiedOn { get; set; }
    public string? ModifiedBy { get; set; }
    public bool IsActive { get; set; }

    public InstrumentType InstrumentType { get; set; } = null!;
}

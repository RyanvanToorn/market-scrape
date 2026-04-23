namespace MarketScrape.Core.Entities;

public class InstrumentType
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? ModifiedOn { get; set; }
    public string? ModifiedBy { get; set; }
    public bool IsActive { get; set; }

    public ICollection<Instrument> Instruments { get; set; } = [];
}

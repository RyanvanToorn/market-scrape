namespace MarketScrape.Core.Entities;

public class InstrumentPriceHistory
{
    public int Id { get; set; }
    public int InstrumentId { get; set; }
    public DateOnly Date { get; set; }
    public string Granularity { get; set; } = string.Empty;
    public decimal? Open { get; set; }
    public decimal? High { get; set; }
    public decimal? Low { get; set; }
    public decimal? Close { get; set; }
    public decimal? AdjClose { get; set; }
    public long? Volume { get; set; }

    public Instrument Instrument { get; set; } = null!;
}

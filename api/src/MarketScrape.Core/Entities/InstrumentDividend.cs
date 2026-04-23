namespace MarketScrape.Core.Entities;

public class InstrumentDividend
{
    public int Id { get; set; }
    public int InstrumentId { get; set; }
    public DateOnly ExDate { get; set; }
    public DateOnly PaymentDate { get; set; }
    public decimal Amount { get; set; }

    public Instrument Instrument { get; set; } = null!;
}

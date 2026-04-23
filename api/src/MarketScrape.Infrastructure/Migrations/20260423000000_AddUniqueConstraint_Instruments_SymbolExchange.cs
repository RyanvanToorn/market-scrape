using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketScrape.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraint_Instruments_SymbolExchange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_instruments_symbol_exchange",
                table: "instruments",
                columns: new[] { "symbol", "exchange" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_instruments_symbol_exchange",
                table: "instruments");
        }
    }
}

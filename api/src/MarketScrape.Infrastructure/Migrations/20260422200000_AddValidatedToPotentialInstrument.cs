using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketScrape.Infrastructure.Migrations
{
    /// <inheritdoc />
    [Migration("20260422200000_AddValidatedToPotentialInstrument")]
    public partial class AddValidatedToPotentialInstrument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "validated",
                table: "potential_instruments",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "validated",
                table: "potential_instruments");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MarketScrape.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceHistoryAndDividends : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "currency",
                table: "instruments",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "instrument_dividends",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    instrument_id = table.Column<int>(type: "integer", nullable: false),
                    ex_date = table.Column<DateOnly>(type: "date", nullable: false),
                    payment_date = table.Column<DateOnly>(type: "date", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_instrument_dividends", x => x.id);
                    table.ForeignKey(
                        name: "FK_instrument_dividends_instruments_instrument_id",
                        column: x => x.instrument_id,
                        principalTable: "instruments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "instrument_price_history",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    instrument_id = table.Column<int>(type: "integer", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    granularity = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    open = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    high = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    low = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    close = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    adj_close = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    volume = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_instrument_price_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_instrument_price_history_instruments_instrument_id",
                        column: x => x.instrument_id,
                        principalTable: "instruments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_instrument_dividends_instrument_ex_date",
                table: "instrument_dividends",
                columns: new[] { "instrument_id", "ex_date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_instrument_price_history_instrument_date_granularity",
                table: "instrument_price_history",
                columns: new[] { "instrument_id", "date", "granularity" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "instrument_dividends");

            migrationBuilder.DropTable(
                name: "instrument_price_history");

            migrationBuilder.DropColumn(
                name: "currency",
                table: "instruments");
        }
    }
}

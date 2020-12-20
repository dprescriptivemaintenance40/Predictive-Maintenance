using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DPM_Testing.Migrations
{
    public partial class DPM : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_AddRuleModel",
                columns: table => new
                {
                    AddRuleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Columns = table.Column<string>(type: "text", nullable: true),
                    Alarm = table.Column<float>(type: "real", nullable: false),
                    Trigger = table.Column<float>(type: "real", nullable: false),
                    Condition = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_AddRuleModel", x => x.AddRuleId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_ClassificationMaster",
                columns: table => new
                {
                    ClassificationMasterId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClassificationId = table.Column<int>(type: "integer", nullable: false),
                    Classifications = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_ClassificationMaster", x => x.ClassificationMasterId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_Compressuredetails",
                columns: table => new
                {
                    BatchId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    PS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_Compressuredetails", x => x.BatchId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_Compressurewithclassification",
                columns: table => new
                {
                    CompClassID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BatchId = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    ClassificationId = table.Column<int>(type: "integer", nullable: false),
                    PS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Classification = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_Compressurewithclassification", x => x.CompClassID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_AddRuleModel");

            migrationBuilder.DropTable(
                name: "tbl_ClassificationMaster");

            migrationBuilder.DropTable(
                name: "tbl_Compressuredetails");

            migrationBuilder.DropTable(
                name: "tbl_Compressurewithclassification");
        }
    }
}

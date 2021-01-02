using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DPM.Migrations
{
    public partial class DPM_TestingDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "addrulemodel",
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
                    table.PrimaryKey("PK_addrulemodel", x => x.AddRuleId);
                });

            migrationBuilder.CreateTable(
                name: "compressuredetails",
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
                    InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ProcessingStage = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_compressuredetails", x => x.BatchId);
                });

            migrationBuilder.CreateTable(
                name: "compressurewithclassification",
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
                    table.PrimaryKey("PK_compressurewithclassification", x => x.CompClassID);
                });

            migrationBuilder.CreateTable(
                name: "contactus",
                columns: table => new
                {
                    ContactUsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Subject = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contactus", x => x.ContactUsId);
                });

            migrationBuilder.CreateTable(
                name: "registeruser",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    Firstname = table.Column<string>(type: "text", nullable: true),
                    Lastname = table.Column<string>(type: "text", nullable: true),
                    Company = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_registeruser", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegisterUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Firstname = table.Column<string>(type: "text", nullable: true),
                    Lastname = table.Column<string>(type: "text", nullable: true),
                    Company = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "text", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegisterUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "screwcompressorpredictiontable",
                columns: table => new
                {
                    PredictionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BatchId = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    PS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    PS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    PD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD1 = table.Column<decimal>(type: "numeric", nullable: false),
                    TS2 = table.Column<decimal>(type: "numeric", nullable: false),
                    TD2 = table.Column<decimal>(type: "numeric", nullable: false),
                    InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Prediction = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_screwcompressorpredictiontable", x => x.PredictionId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "addrulemodel");

            migrationBuilder.DropTable(
                name: "compressuredetails");

            migrationBuilder.DropTable(
                name: "compressurewithclassification");

            migrationBuilder.DropTable(
                name: "contactus");

            migrationBuilder.DropTable(
                name: "registeruser");

            migrationBuilder.DropTable(
                name: "RegisterUsers");

            migrationBuilder.DropTable(
                name: "screwcompressorpredictiontable");
        }
    }
}

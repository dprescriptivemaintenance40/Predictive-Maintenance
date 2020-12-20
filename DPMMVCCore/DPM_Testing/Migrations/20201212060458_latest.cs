using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DPM_Testing.Migrations
{
    public partial class latest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_Compressurewithclassification",
                table: "tbl_Compressurewithclassification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_Compressuredetails",
                table: "tbl_Compressuredetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_ClassificationMaster",
                table: "tbl_ClassificationMaster");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_AddRuleModel",
                table: "tbl_AddRuleModel");

            migrationBuilder.RenameTable(
                name: "tbl_Compressurewithclassification",
                newName: "compressurewithclassification");

            migrationBuilder.RenameTable(
                name: "tbl_Compressuredetails",
                newName: "compressuredetails");

            migrationBuilder.RenameTable(
                name: "tbl_ClassificationMaster",
                newName: "classificationMaster");

            migrationBuilder.RenameTable(
                name: "tbl_AddRuleModel",
                newName: "addrulemodel");

            migrationBuilder.AddPrimaryKey(
                name: "PK_compressurewithclassification",
                table: "compressurewithclassification",
                column: "CompClassID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_compressuredetails",
                table: "compressuredetails",
                column: "BatchId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_classificationMaster",
                table: "classificationMaster",
                column: "ClassificationMasterId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_addrulemodel",
                table: "addrulemodel",
                column: "AddRuleId");

            migrationBuilder.CreateTable(
                name: "contactus",
                columns: table => new
                {
                    ContactUsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Subject = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contactus", x => x.ContactUsId);
                });

            migrationBuilder.CreateTable(
                name: "profile",
                columns: table => new
                {
                    ProfileID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Company = table.Column<string>(type: "text", nullable: true),
                    FocalPersonName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Contact = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profile", x => x.ProfileID);
                });

            migrationBuilder.CreateTable(
                name: "registeruser",
                columns: table => new
                {
                    RegistrationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    FullName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_registeruser", x => x.RegistrationId);
                });

            migrationBuilder.CreateTable(
                name: "RegisterUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: true),
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "contactus");

            migrationBuilder.DropTable(
                name: "profile");

            migrationBuilder.DropTable(
                name: "registeruser");

            migrationBuilder.DropTable(
                name: "RegisterUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_compressurewithclassification",
                table: "compressurewithclassification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_compressuredetails",
                table: "compressuredetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_classificationMaster",
                table: "classificationMaster");

            migrationBuilder.DropPrimaryKey(
                name: "PK_addrulemodel",
                table: "addrulemodel");

            migrationBuilder.RenameTable(
                name: "compressurewithclassification",
                newName: "tbl_Compressurewithclassification");

            migrationBuilder.RenameTable(
                name: "compressuredetails",
                newName: "tbl_Compressuredetails");

            migrationBuilder.RenameTable(
                name: "classificationMaster",
                newName: "tbl_ClassificationMaster");

            migrationBuilder.RenameTable(
                name: "addrulemodel",
                newName: "tbl_AddRuleModel");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_Compressurewithclassification",
                table: "tbl_Compressurewithclassification",
                column: "CompClassID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_Compressuredetails",
                table: "tbl_Compressuredetails",
                column: "BatchId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_ClassificationMaster",
                table: "tbl_ClassificationMaster",
                column: "ClassificationMasterId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_AddRuleModel",
                table: "tbl_AddRuleModel",
                column: "AddRuleId");
        }
    }
}

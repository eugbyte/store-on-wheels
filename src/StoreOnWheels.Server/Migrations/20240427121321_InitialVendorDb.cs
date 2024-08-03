using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StoreOnWheels.Server.Migrations {
	/// <inheritdoc />
	public partial class InitialVendorDb : Migration {
		private static readonly string[] columns = ["Id", "Description", "DisplayName"];

		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.CreateTable(
				name: "Vendors",
				columns: table => new {
					Id = table.Column<string>(type: "text", nullable: false),
					DisplayName = table.Column<string>(type: "text", nullable: false),
					Description = table.Column<string>(type: "text", nullable: false)
				},
				constraints: table => {
					table.PrimaryKey("PK_Vendors", x => x.Id);
				});

			migrationBuilder.InsertData(
				table: "Vendors",
				columns: columns,
				values: new object[] { "1", "Some food truck", "FoodTruck 1" });

			migrationBuilder.CreateIndex(
				name: "IX_Vendors_DisplayName",
				table: "Vendors",
				column: "DisplayName",
				unique: true);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropTable(
				name: "Vendors");
		}
	}
}
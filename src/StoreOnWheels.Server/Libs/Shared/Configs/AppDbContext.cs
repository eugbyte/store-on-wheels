using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Libs.Shared.Models;

namespace StoreOnWheels.Server.Libs.Shared.Configs;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
	public DbSet<Vendor> Vendors { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
		base.OnConfiguring(optionsBuilder);
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder) {
		base.OnModelCreating(modelBuilder);

		Vendor vendor = new() {
			Id = "1",
			DisplayName = "FoodTruck 1",
			Description = "Some food truck",
		};

		modelBuilder.Entity<Vendor>().HasData(vendor);
	}
}

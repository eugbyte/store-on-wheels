﻿using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Models;

namespace StoreOnWheels.Server.Configs;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
	public DbSet<Vendor> Vendors { get; set; }

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

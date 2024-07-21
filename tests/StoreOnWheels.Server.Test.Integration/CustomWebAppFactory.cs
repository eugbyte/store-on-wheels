using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StoreOnWheels.Server.Libs.Shared.Configs;
using System.Data.Common;

namespace StoreOnWheels.Server.Test.Integration;

public class CustomWebAppFactory<TProgram>
	: WebApplicationFactory<TProgram> where TProgram : class {

	public string ConnectionString { get; } = "DataSource=:memory:";

	protected override void ConfigureWebHost(IWebHostBuilder builder) {
		builder.ConfigureServices(ReplaceDbWithSqlite);
		builder.UseEnvironment("Development");
	}

	// https://tinyurl.com/6ze2sweh
	private void ReplaceDbWithSqlite(IServiceCollection services) {
		ServiceDescriptor? dbContextDescriptor = services
			.SingleOrDefault((d) => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
		if (dbContextDescriptor is not null) {
			services.Remove(dbContextDescriptor);
		}

		ServiceDescriptor? dbConnectionDescriptor = services
			.SingleOrDefault((d) => d.ServiceType == typeof(DbConnection));
		if (dbConnectionDescriptor is not null) {
			services.Remove(dbConnectionDescriptor);
		}

		// Create open SqliteConnection so EF won't automatically close it.
		services.AddSingleton<DbConnection>((container) => {
			SqliteConnection connection = new(ConnectionString);
			connection.Open();
			return connection;
		});

		services.AddDbContext<AppDbContext>((IServiceProvider container, DbContextOptionsBuilder optionsBuilder) => {
			var connection = container.GetRequiredService<DbConnection>();
			optionsBuilder.UseSqlite(connection);

			var options = (DbContextOptions<AppDbContext>)optionsBuilder.Options;

			// https://tinyurl.com/2cyt3f9s
			using var context = new AppDbContext(options);
			context.Database.EnsureDeleted();
			context.Database.Migrate();
		});
	}
}

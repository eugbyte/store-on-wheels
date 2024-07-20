using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StoreOnWheels.Server.Libs.Shared.Configs;
using System.Data.Common;

namespace StoreOnWheels.Server.Test;

public class CustomWebAppFactory<TProgram>
	: WebApplicationFactory<TProgram> where TProgram : class {

	protected override void ConfigureWebHost(IWebHostBuilder builder) {
		builder.ConfigureServices(ReplaceDbWithSqlite);
		builder.UseEnvironment("Development");
	}

	// https://tinyurl.com/6ze2sweh
	private void ReplaceDbWithSqlite(IServiceCollection services) {
		ServiceDescriptor dbContextDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>))
			?? throw new NullReferenceException("dbContextDescriptor is null");
		services.Remove(dbContextDescriptor);

		ServiceDescriptor dbConnectionDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbConnection))
			?? throw new NullReferenceException("dbConnectionDescriptor is null");
		services.Remove(dbConnectionDescriptor);

		// Create open SqliteConnection so EF won't automatically close it.
		services.AddSingleton<DbConnection>((container) => {
			SqliteConnection connection = new("DataSource=:memory:");
			connection.Open();
			return connection;
		});

		services.AddDbContext<AppDbContext>((container, options) => {
			var connection = container.GetRequiredService<DbConnection>();
			options.UseSqlite(connection);
		});
	}
}

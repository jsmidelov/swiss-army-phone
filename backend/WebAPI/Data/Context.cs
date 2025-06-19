using Microsoft.EntityFrameworkCore;

namespace WebAPI.Data;

public class Context(DbContextOptions<Context> options) : DbContext(options)
{
    public DbSet<App> Apps { get; set; } = null!; // Ensure to initialize with null-forgiving operator

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configure entity properties and relationships here
    }
}
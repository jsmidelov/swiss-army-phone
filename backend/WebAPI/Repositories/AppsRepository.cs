using Microsoft.EntityFrameworkCore;
using WebAPI.Data;

namespace WebAPI.Repositories;

public interface IAppsRepository
{
    Task<List<App>> GetAsync();
    Task<App?> GetAsync(Guid id);
    Task CreateAsync(App app);
    Task UpdateAsync(App app);
    Task DeleteAppAsync(Guid id);
}
public class AppsRepository(Context context): IAppsRepository
{
    private readonly Context _context = context;

    public async Task<List<App>> GetAsync()
    {
        return await _context.Apps.ToListAsync();
    }

    public async Task<App?> GetAsync(Guid id)
    {
        return await _context.Apps.FindAsync(id);
    }

    public async Task CreateAsync(App app)
    {
        await _context.Apps.AddAsync(app);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(App app)
    {
        _context.Apps.Update(app);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAppAsync(Guid id)
    {
        var app = await GetAsync(id);
        if (app != null)
        {
            _context.Apps.Remove(app);
            await _context.SaveChangesAsync();
        }
    }
}
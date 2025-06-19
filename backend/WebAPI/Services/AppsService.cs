using WebAPI.Repositories;

namespace WebAPI.Services;

public interface IAppsService
{
    Task<List<App>> GetAsync();
    Task<App?> GetAsync(Guid id);
    Task CreateAsync(App app);
    Task UpdateAsync(App app);
    Task DeleteAsync(Guid id);
}
public class AppsService: IAppsService
{
    private readonly IAppsRepository _appsRepository;

    public AppsService(IAppsRepository appsRepository)
    {
        _appsRepository = appsRepository;
    }

    public async Task<List<App>> GetAsync()
    {
        return await _appsRepository.GetAsync();
    }

    public async Task<App?> GetAsync(Guid id)
    {
        return await _appsRepository.GetAsync(id);
    }

    public async Task CreateAsync(App app)
    {
        await _appsRepository.CreateAsync(app);
    }

    public async Task UpdateAsync(App app)
    {
        await _appsRepository.UpdateAsync(app);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _appsRepository.DeleteAppAsync(id);
    }
}
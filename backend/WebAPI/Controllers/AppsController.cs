using Microsoft.AspNetCore.Mvc;
using WebAPI.Services;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppsApi(IAppsService appsService) : ControllerBase
{
    private readonly IAppsService _appsService = appsService;

    [HttpGet]
    public async Task<ActionResult<List<App>>> GetApps()
    {
        var apps = await _appsService.GetAsync();
        return Ok(apps);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<App>> GetApp(Guid id)
    {
        var app = await _appsService.GetAsync(id);
        return app == null ? (ActionResult<App>)NotFound() : (ActionResult<App>)Ok(app);
    }

    [HttpPost]
    public async Task<ActionResult> CreateApp([FromBody] App app)
    {
        await _appsService.CreateAsync(app);
        return CreatedAtAction(nameof(GetApp), new { id = app.Id }, app);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateApp(Guid id, [FromBody] App app)
    {
        if (id != app.Id)
        {
            return BadRequest();
        }
        await _appsService.UpdateAsync(app);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApp(Guid id)
    {
        await _appsService.DeleteAsync(id);
        return NoContent();
    }
}
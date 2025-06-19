namespace WebAPI.Models.Domain;
public record Factor
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public bool IsPresent { get; init; }
}
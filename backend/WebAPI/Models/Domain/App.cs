namespace WebAPI.Models.Domain;
public record App
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Icon { get; init; }
    public required string Store { get; init; }
    public required string Rating { get; init; }
    public required string Description { get; init; }
    public required string Category { get; init; }
    public required string Developer { get; init; }
    public required string BusinessModel { get; init; }
    public required List<Factor> Factors { get; init; }
}
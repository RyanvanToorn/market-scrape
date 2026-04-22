using MarketScrape.Core.Entities;
using MarketScrape.Core.Repositories;
using MarketScrape.Infrastructure.Data;
using MarketScrape.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IInstrumentTypeRepository, InstrumentTypeRepository>();
builder.Services.AddScoped<IInstrumentRepository, InstrumentRepository>();
builder.Services.AddScoped<IPotentialInstrumentRepository, PotentialInstrumentRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// ── InstrumentType ─────────────────────────────────────────────────────────

app.MapGet("/instrument-types", async (IInstrumentTypeRepository repo) =>
    await repo.GetAllAsync());

app.MapGet("/instrument-types/{id}", async (int id, IInstrumentTypeRepository repo) =>
    await repo.GetByIdAsync(id) is InstrumentType entity ? Results.Ok(entity) : Results.NotFound());

app.MapPost("/instrument-types", async (InstrumentTypeRequest req, IInstrumentTypeRepository repo) =>
{
    var entity = new InstrumentType
    {
        Description = req.Description,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    };
    await repo.AddAsync(entity);
    return Results.Created($"/instrument-types/{entity.Id}", entity);
});

app.MapPost("/instrument-types/batch", async (List<InstrumentTypeRequest> reqs, IInstrumentTypeRepository repo) =>
{
    var entities = reqs.Select(r => new InstrumentType
    {
        Description = r.Description,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    }).ToList();
    await repo.AddRangeAsync(entities);
    return Results.Created("/instrument-types", new { count = entities.Count });
});

app.MapPut("/instrument-types/{id}", async (int id, InstrumentTypeRequest req, IInstrumentTypeRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    entity.Description = req.Description;
    entity.ModifiedOn = DateTime.UtcNow;
    entity.ModifiedBy = "system";
    await repo.UpdateAsync(entity);
    return Results.Ok(entity);
});

app.MapPut("/instrument-types/batch", async (List<InstrumentTypeUpdateRequest> reqs, IInstrumentTypeRepository repo) =>
{
    var updates = new List<InstrumentType>();
    foreach (var r in reqs)
    {
        var entity = await repo.GetByIdAsync(r.Id);
        if (entity is null) return Results.NotFound(new { r.Id });
        entity.Description = r.Description;
        entity.ModifiedOn = DateTime.UtcNow;
        entity.ModifiedBy = "system";
        updates.Add(entity);
    }
    await repo.UpdateRangeAsync(updates);
    return Results.Ok(new { count = updates.Count });
});

app.MapDelete("/instrument-types/{id}", async (int id, IInstrumentTypeRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    await repo.DeleteAsync(id);
    return Results.NoContent();
});

app.MapDelete("/instrument-types/batch", async ([FromBody] List<int> ids, IInstrumentTypeRepository repo) =>
{
    await repo.DeleteRangeAsync(ids);
    return Results.NoContent();
});

// ── Instrument ─────────────────────────────────────────────────────────────

app.MapGet("/instruments", async (IInstrumentRepository repo) =>
    await repo.GetAllAsync());

app.MapGet("/instruments/{id}", async (int id, IInstrumentRepository repo) =>
    await repo.GetByIdAsync(id) is Instrument entity ? Results.Ok(entity) : Results.NotFound());

app.MapPost("/instruments", async (InstrumentRequest req, IInstrumentRepository repo) =>
{
    var entity = new Instrument
    {
        Symbol = req.Symbol,
        Name = req.Name,
        TypeId = req.TypeId,
        Exchange = req.Exchange,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    };
    await repo.AddAsync(entity);
    return Results.Created($"/instruments/{entity.Id}", entity);
});

app.MapPost("/instruments/batch", async (List<InstrumentRequest> reqs, IInstrumentRepository repo) =>
{
    var entities = reqs.Select(r => new Instrument
    {
        Symbol = r.Symbol,
        Name = r.Name,
        TypeId = r.TypeId,
        Exchange = r.Exchange,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    }).ToList();
    await repo.AddRangeAsync(entities);
    return Results.Created("/instruments", new { count = entities.Count });
});

app.MapPut("/instruments/{id}", async (int id, InstrumentRequest req, IInstrumentRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    entity.Symbol = req.Symbol;
    entity.Name = req.Name;
    entity.TypeId = req.TypeId;
    entity.Exchange = req.Exchange;
    entity.ModifiedOn = DateTime.UtcNow;
    entity.ModifiedBy = "system";
    await repo.UpdateAsync(entity);
    return Results.Ok(entity);
});

app.MapPut("/instruments/batch", async (List<InstrumentUpdateRequest> reqs, IInstrumentRepository repo) =>
{
    var updates = new List<Instrument>();
    foreach (var r in reqs)
    {
        var entity = await repo.GetByIdAsync(r.Id);
        if (entity is null) return Results.NotFound(new { r.Id });
        entity.Symbol = r.Symbol;
        entity.Name = r.Name;
        entity.TypeId = r.TypeId;
        entity.Exchange = r.Exchange;
        entity.ModifiedOn = DateTime.UtcNow;
        entity.ModifiedBy = "system";
        updates.Add(entity);
    }
    await repo.UpdateRangeAsync(updates);
    return Results.Ok(new { count = updates.Count });
});

app.MapDelete("/instruments/{id}", async (int id, IInstrumentRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    await repo.DeleteAsync(id);
    return Results.NoContent();
});

app.MapDelete("/instruments/batch", async ([FromBody] List<int> ids, IInstrumentRepository repo) =>
{
    await repo.DeleteRangeAsync(ids);
    return Results.NoContent();
});

// ── PotentialInstrument ────────────────────────────────────────────────────

app.MapGet("/potential-instruments", async (IPotentialInstrumentRepository repo) =>
    await repo.GetAllAsync());

app.MapGet("/potential-instruments/{id}", async (int id, IPotentialInstrumentRepository repo) =>
    await repo.GetByIdAsync(id) is PotentialInstrument entity ? Results.Ok(entity) : Results.NotFound());

app.MapPost("/potential-instruments", async (InstrumentRequest req, IPotentialInstrumentRepository repo) =>
{
    var entity = new PotentialInstrument
    {
        Symbol = req.Symbol,
        Name = req.Name,
        TypeId = req.TypeId,
        Exchange = req.Exchange,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    };
    await repo.AddAsync(entity);
    return Results.Created($"/potential-instruments/{entity.Id}", entity);
});

app.MapPost("/potential-instruments/batch", async (List<InstrumentRequest> reqs, IPotentialInstrumentRepository repo) =>
{
    var entities = reqs.Select(r => new PotentialInstrument
    {
        Symbol = r.Symbol,
        Name = r.Name,
        TypeId = r.TypeId,
        Exchange = r.Exchange,
        CreatedOn = DateTime.UtcNow,
        CreatedBy = "system",
        IsActive = true
    }).ToList();
    await repo.AddRangeAsync(entities);
    return Results.Created("/potential-instruments", new { count = entities.Count });
});

app.MapPut("/potential-instruments/{id}", async (int id, InstrumentRequest req, IPotentialInstrumentRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    entity.Symbol = req.Symbol;
    entity.Name = req.Name;
    entity.TypeId = req.TypeId;
    entity.Exchange = req.Exchange;
    entity.ModifiedOn = DateTime.UtcNow;
    entity.ModifiedBy = "system";
    await repo.UpdateAsync(entity);
    return Results.Ok(entity);
});

app.MapPut("/potential-instruments/batch", async (List<InstrumentUpdateRequest> reqs, IPotentialInstrumentRepository repo) =>
{
    var updates = new List<PotentialInstrument>();
    foreach (var r in reqs)
    {
        var entity = await repo.GetByIdAsync(r.Id);
        if (entity is null) return Results.NotFound(new { r.Id });
        entity.Symbol = r.Symbol;
        entity.Name = r.Name;
        entity.TypeId = r.TypeId;
        entity.Exchange = r.Exchange;
        entity.ModifiedOn = DateTime.UtcNow;
        entity.ModifiedBy = "system";
        updates.Add(entity);
    }
    await repo.UpdateRangeAsync(updates);
    return Results.Ok(new { count = updates.Count });
});

app.MapDelete("/potential-instruments/{id}", async (int id, IPotentialInstrumentRepository repo) =>
{
    var entity = await repo.GetByIdAsync(id);
    if (entity is null) return Results.NotFound();
    await repo.DeleteAsync(id);
    return Results.NoContent();
});

app.MapDelete("/potential-instruments/batch", async ([FromBody] List<int> ids, IPotentialInstrumentRepository repo) =>
{
    await repo.DeleteRangeAsync(ids);
    return Results.NoContent();
});

app.Run();

// ── Request records ────────────────────────────────────────────────────────

record InstrumentTypeRequest(string Description);
record InstrumentTypeUpdateRequest(int Id, string Description);
record InstrumentRequest(string Symbol, string Name, int TypeId, string Exchange);
record InstrumentUpdateRequest(int Id, string Symbol, string Name, int TypeId, string Exchange);

# Phase 2 — Data Layer Plan

This phase teaches the full "C# → EF Core → PostgreSQL" stack using `InstrumentType` and `Instrument` as concrete examples. After those two are done, there is a repeatable template for adding any future table independently.

---

## Part 1 — Domain Models (`Core` project)

**Concept**: A "domain model" is a plain C# class where each property maps to a column in a database table. No DB knowledge needed here.

- Create `Entities/InstrumentType.cs` and `Entities/Instrument.cs` inside `MarketScrape.Core`, with properties matching the columns in `docs/entities/entities.md` (`int Id`, `string Symbol`, `DateTime CreatedOn`, `bool IsActive`, etc.)
- Add a **navigation property** on `Instrument` pointing to `InstrumentType` — this is how C# models a foreign key relationship without writing SQL
- Delete the placeholder `Class1.cs` files

---

## Part 2 — DbContext (`Infrastructure` project)

**Concept**: `DbContext` is EF Core's "bridge" to the database. It holds a `DbSet<T>` for each table (think of a `DbSet` as a queryable, in-memory representation of a table). You also use it to tell EF how to translate C# property names (`CreatedOn`) into the snake_case DB column names (`created_on`) from the spec.

- Create `Data/AppDbContext.cs` in `MarketScrape.Infrastructure`
- Add `DbSet<InstrumentType>` and `DbSet<Instrument>`
- Use the `OnModelCreating` method + **Fluent API** to configure exact table/column names (e.g., table `instrument_types`, column `type_id`) — this keeps the DB in sync with `entities.md`

---

## Part 3 — PostgreSQL via Docker

**Concept**: A running PostgreSQL database is needed. Docker is the easiest way to spin one up locally without a full installation.

- Run one `docker run` command to start a PostgreSQL container
- Add a **connection string** to `appsettings.Development.json` — this is how the C# app knows where the DB lives and what credentials to use

---

## Part 4 — EF Core Migrations

**Concept**: A "migration" is an auto-generated C# file that describes how to create or update the database schema. You run two CLI commands — EF Core writes the SQL for you.

- Install the `dotnet ef` CLI tool (one-time global install)
- Run `dotnet ef migrations add InitialCreate` → EF Core reads the models and generates a migration file
- Run `dotnet ef database update` → EF Core connects to PostgreSQL and creates the `instrument_types` and `instruments` tables

Every time a new entity is added later, run a new migration — that is the repeatable pattern.

---

## Part 5 — Repository Pattern (Interface + Implementation)

**Concept**: A "repository" is a class dedicated to reading/writing one table. An **interface** is defined in `Core` (just a contract — no DB code) and an **implementation** lives in `Infrastructure` (uses EF Core). This separation means the rest of the app only depends on the interface, not on EF Core directly.

- Create `Repositories/IInstrumentTypeRepository.cs` and `Repositories/IInstrumentRepository.cs` in `Core` with methods like `GetAll`, `GetById`, `Add`, `Delete`
- Create the concrete implementations in `Infrastructure` that inject `AppDbContext` and use it to actually query PostgreSQL

---

## Part 6 — Wire into the API (Dependency Injection)

**Concept**: ASP.NET Core has a built-in "DI container" — services are registered once at startup and the framework automatically provides them wherever they are needed.

- Edit `api/src/MarketScrape.Api/Program.cs` to register `AppDbContext` (with the connection string) and both repositories
- Optionally add one throwaway test endpoint to confirm a DB round-trip works

---

## Verification

1. `dotnet build` — all three projects compile clean
2. `dotnet ef database update` — `instrument_types` and `instruments` tables exist in Postgres
3. Use a GUI tool (DBeaver or pgAdmin, both free) to inspect the tables and manually insert/query a row
4. Confirm the FK constraint: inserting an `Instrument` with a non-existent `type_id` should be rejected

---

## Learning Handoff Point

Once this is done, the pattern for adding any new table is:

> **Add entity class → add DbSet → add migration → add repository interface → add repository implementation → register in DI**

Repeat that loop for every subsequent table (e.g., `PriceSnapshot`, `ScrapeRun`).

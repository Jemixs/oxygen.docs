# Database Access

Oxygen exposes the server's SCUM.db via a thread-safe, read-only ORM. It utilizes a shadow copy technique to ensure the game server is never locked during read operations.

## Defining Models

Map a C# class to a database table using the [DbTable] attribute. Property names must match the database column names (case-insensitive).

```csharp
using Oxygen.Csharp.Core.Database;

[DbTable("user")]
public class ScumPlayer
{
    // The names of the properties must match the names of the columns in the database! 
    // Case is not important (famepoints will work the same as FamePoints)

    public string id { get; set; }
    public string name { get; set; }
    public string last_login_time { get; set; }

    // You can add only the fields you need. 
    // It is not necessary to describe the entire table (there may be 50 columns).
}
```

## Reading Data

Access the database via `this.Database`.

### Basic Retrieval

```csharp
// Get all records
var allPlayers = this.Database.All<ScumPlayer>();

// Get a single record by condition (LIMIT 1)
var player = this.Database.FindOne<ScumPlayer>("id", "76561198000000000");
```

### Filtering & Sorting

New methods allow for optimized queries without loading the entire table.

```csharp
// Get all records matching a value (WHERE Col = Val)
var admins = this.Database.FindWhere<ScumPlayer>("IsAdmin", 1);

// Get the first N records
var firstFive = this.Database.Take<ScumPlayer>(5);

// Get the LAST record sorted by a column (DESC LIMIT 1)
// Useful for getting the most recent log entry
var lastLog = this.Database.Last<Log>("Timestamp");

// Get the LAST N records sorted by a column
// Useful for Leaderboards (e.g., Top 10 by FamePoints)
var topPlayers = this.Database.TakeLast<ScumPlayer>(10, "FamePoints");
```

### Multiple Records

Use All to retrieve a list and standard LINQ for filtering.

```csharp
using System.Linq;

public void PrintTopPlayers()
{
    var topPlayers = this.Database.All<ScumPlayer>()
        .OrderByDescending(p => p.FamePoints)
        .Take(5)
        .ToList();

    foreach (var p in topPlayers)
    {
        Console.WriteLine($"{p.CharacterName}: {p.FamePoints}");
    }
}
```

## Modifying Data

The Database API is Read-Only.
Modifying the C# object properties will not save data to the server, as the game server holds the state in RAM.

To modify data, use ProcessCommand:

```csharp
// Incorrect:
// playerObj.FamePoints = 1000; 

// Correct:
ProcessCommand(steamId, "SetFamePoints 10");   
```

## API Reference

| Method | Description |
| :--- | :--- |
| `FindOne<T>(col, val)` | Returns the first record matching the condition. |
| `All<T>()` | Returns all records from the table. |
| `FindWhere<T>(col, val)` | Returns a list of records matching the condition. |
| `Take<T>(count)` | Returns the first N records. |
| `Last<T>(orderBy)` | Returns the last record, sorted by the specified column. |
| `TakeLast<T>(count, orderBy)` | Returns the last N records, sorted by the specified column. |
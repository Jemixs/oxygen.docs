# Timers & Delays

Oxygen provides a built-in, thread-safe timer system designed specifically for game logic.
Unlike `Thread.Sleep` or `Task.Delay`, Oxygen timers are **managed**. This means if your plugin is reloaded or unloaded, all pending timers are automatically cancelled, preventing errors and memory leaks.

## One-Time Timers (`After`)

Use `this.After` to execute code once after a specified delay. This is perfect for delayed rewards, teleports, or cooldowns.

**Signature:** `Guid After(float seconds, Action callback)`

```csharp
[Command("reward")]
public void RewardCommand(PlayerBase player, string[] args)
{
    player.Reply("Wait 5 seconds for your reward...");

    // Execute logic after 5 seconds
    this.After(5f, () =>
    {
        // Give 100 Fame Points
        // We use the player object passed from the command context
        player.ProcessCommand("SetFamePoints 100");
        
        player.Reply("You received 100 Fame Points!");
        Console.WriteLine($"[Reward] Player {player.Name} got reward.");
    });
}
```

## Repeating Timers (`Every`)

Use `this.Every` to execute code repeatedly at a fixed interval. Useful for auto-saving, scheduled messages, or server maintenance tasks.

**Signature:** `Guid Every(float seconds, Action callback)`

```csharp
public override void OnLoad()
{
    // Example 1: Auto-Save every 5 minutes (300 seconds)
    this.Every(300f, () =>
    {
        Console.WriteLine("[Oxygen] Performing Auto-Save...");
        
        // Send global save command
    });
    
    // Example 2: Simple Console Log every 30 seconds
    this.Every(30f, () =>
    {
        Console.WriteLine("[Oxygen] Plugin is running...");
    });
}
```

## Cancelling Timers

Both `After` and `Every` return a unique `Guid`. You can save this ID to cancel the timer manually before it executes.

**Signature:** `void CancelTimer(Guid id)`

```csharp
private Guid _trapTimer;

[Command("trap_start")]
public void StartTrap(PlayerBase player, string[] args)
{
    player.Reply("Trap activated! 10 seconds to detonation!");

    _trapTimer = this.After(10f, () => 
    {
        // If not cancelled, this runs:
        player.ProcessCommand(""); // spawn trap zombie or some like kill player
        Console.WriteLine($"Player {player.PlayerName} fell into the trap.");
    });
}

[Command("trap_disarm")]
public void DisarmTrap(PlayerBase player, string[] args)
{
    // Cancel the pending timer
    this.CancelTimer(_trapTimer);
    
    player.Reply("Trap disarmed! You are safe.");
}
```

## Best Practices

| Do | Don't |
| :--- | :--- |
| Use `this.After` for game delays. | Never use `Thread.Sleep()`. It freezes the entire server. |
| Use `CancelTimer` for logic that can be interrupted (like casting a spell or disarming a bomb). | Don't use `async/await Task.Delay` unless you know how to handle cancellation tokens properly. |
| Keep timer logic simple. | Avoid complex database queries inside fast-repeating timers (e.g., every 1 second). |

**Note on Reloads:** You do not need to manually cancel timers in `OnUnload`. The Oxygen Core automatically tracks and destroys all timers belonging to your plugin when it is reloaded.
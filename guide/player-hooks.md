# Player Hooks

Override virtual methods to react to player events.

```csharp
public override void OnPlayerConnected(PlayerBase player)
{
    Console.WriteLine($"[C#] Player Connected (SteamId: {player.SteamId})!");
}

public override void OnPlayerDisconnected(PlayerBase player)
{
    Console.WriteLine($"[C#] Player leave (SteamId: {player.SteamId})!");
}

public override bool OnPlayerMeleeAttack(PlayerBase player, string victimName)
{
    Console.WriteLine($"{player.Name} hit {victimName}");
            
    return true; // allow damage
}

public override void OnPlayerDeath(PlayerBase player, DeathData info) 
{
    Console.WriteLine($"[C#] Player death (Steam: {player.Name}) [type death - {info.DeadType}] [death reason - {info.Reason}] [distance - {info.Distance}] - KILLER [{info.KillerName}]!");
} 
```

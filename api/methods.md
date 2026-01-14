# API Methods

Methods available in the `OxygenPlugin` base class.

## Permissions (New)

### `HasPermission(string steamId, string permission)`
Checks if a user has a specific permission, belonging to a group with that permission, or has the wildcard `*`.

```csharp
if (HasPermission(steamId, "admin.ban"))
{
    // Allow ban
}
```

## Messaging

```csharp
// Reply in chat to the command executor
ReplyPlayer(player, "Hello!"); 

// Reply to specific ID
ReplyPlayer(steamId, "Private message");

// U can set message color, default - white
ReplyPlayer(steamId, "Private message", Color.Red);

// Print to chat for all, default color white
PrintToChat("Server rules updated!", Color.Orange); 
```

### Allowed colors

| Color name | Preview |
|-----------|---------|
| White | Welcome on server! |
| Blue | <span style="color:blue;">Welcome on server!</span> |
| Green | <span style="color:green;">Welcome on server!</span> |
| Yellow | <span style="color:gold;">Welcome on server!</span> |
| Orange | <span style="color:orange;">Welcome on server!</span> |
| Red | <span style="color:red;">Welcome on server!</span> |


## Admin command

```csharp
// Execute admin commands to user
ProcessCommand(player.SteamId, "SpawnItem Weapon_M9");

// Execute admin commands to server
ProcessCommand(null, "SetTime 12");
```

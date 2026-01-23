# Chat Commands

## Creating a Command

Add `[Command("name")]` to a method.

### Signature
Method must accept `(PlayerBase player, string[] args)`.

```csharp
[Command("gift")]
private void OnGiftItem(PlayerBase player, string[] args)
{
    if (args.Length < 1)
    {
        player.Reply("Usage: /gift <item_name>");
        return;
    }

    player.Reply($"Giving: {args[0]}");
}
```

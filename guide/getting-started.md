# Getting Started

Welcome to Oxygen Framework!

## Your First Plugin

1. Create a file `HelloWorld.cs` in the `plugins` folder.
2. Paste this code:

```csharp
using System;
using System.Collections.Generic;
using Oxygen.Csharp.API;
using Oxygen.Csharp.Core;

[Info("Hello World", "Me", "1.0.0")]
public class MyPlugin : OxygenPlugin
{
    public override void OnLoad()
    {
        Console.WriteLine("My Plugin has been loaded!");
    }

    [Command("hello")]
    private void HelloCommand(PlayerBase player, string[] args)
    {
       player.Reply("Hello from C#!");
    }
}
```

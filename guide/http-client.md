# HTTP Client

Oxygen includes a powerful, non-blocking HTTP client designed specifically for game server environments. It allows your plugins to communicate with external web APIs, Discord webhooks, or backend databases without freezing the game server.

## Features

* **Auto-JSON:** Automatically serializes objects to JSON for POST/PUT requests.
* **Fluent API:** Chain methods like `.Header()`, `.Timeout()`, and `.Post()` for clean code.

## Execution Methods

These methods finalize the configuration and send the request asynchronously.

| Method | Description |
| :--- | :--- |
| `.Post(object data, ...)` | Serializes `data` to JSON and sends a POST request. |
| `.Put(object data, ...)` | Serializes `data` to JSON and sends a PUT request. |
| `.Get(...)` | Sends a GET request. |
| `.Delete(...)` | Sends a DELETE request. |

## Quick Start

To use the client, you must include the `Oxygen.Csharp.Web` namespace.

### Sending a Discord Webhook (POST)

```csharp
using Oxygen.Csharp.Web; // Required

public class MyFirstPlugin : OxygenPlugin 
{
    public override void OnLoad()
    {
        SendToDiscord("Server started");
    }

    public void SendToDiscord(string message)
    {
        string url = "https://discord.com/api/webhooks/...";

        // 1. Create data object (Anonymous type)
        var payload = new 
        {
            username = "Server Bot",
            content = message
        };

        // 2. Send Request via Http.Request
        Http.Request(url)
            .Post(payload, (code, response) => 
            {
                Console.WriteLine("Message sent!");
            });
    }
}
```
### Get

```csharp 
Http.Request("http://www.google.com/search?q=scum")
    .Get(
        onSuccess: (response) => Console.WriteLine($"Response: {response}"),
        onError: (err) => Console.WriteLine($"Error: {err}")
        );
```

## Advanced Usage: Status Codes

If you need to check the specific HTTP status code (e.g., to distinguish between `404 Not Found` and `500 Server Error`), use the method overload that accepts `(int code, string body)`.

| Code | Meaning |
| :--- | :--- |
| `200-299` | Success |
| `400-599` | Client or Server Error |
| `408` | Request Timeout (Server took too long) |
| `0` | Network Error (No Internet / DNS failed) |

**Example:**

```csharp
Http.Request("https://api.mysite.com/v1/user")
    .Post(new { id = 123 }, (code, body) => 
    {
        if (code == 200) 
        {
            Console.WriteLine("Success!");
        } 
        else if (code == 404) 
        {
            Console.WriteLine("User not found.");
        }
        else if (code == 0)
        {
            Console.WriteLine("No internet connection.");
        }
        else 
        {
            Console.WriteLine($"Unknown Error: {code}");
        }
    });
```


## API Reference

### `Http.Request(string url)`
Static method that initializes a new request builder.
* **url**: The target URL (e.g., `https://google.com`).

### Builder Methods

| Method | Description |
| :--- | :--- |
| `.Header(string key, string value)` | Adds a custom HTTP header (e.g., `Authorization`, `User-Agent`). |
| `.Timeout(int seconds)` | Sets the request timeout (Default: 10s). Prevents the request from hanging indefinitely. |

::: tip Best Practice
Perform all heavy calculations (JSON parsing, string manipulation) inside the callback to save server FPS.
:::
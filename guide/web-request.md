# Web API for Plugins

Oxygen provides a high-performance, threaded **HTTP Web API** system. This allows your server to accept requests from external websites, Discord bots, or mobile apps securely.

## API Reference

### `StartWebServer(int port, string token)`
Starts the internal HTTP server.
* **port**: Use ports between `8000` and `9000`. Avoid game ports (`7777`, `27015`, `8080`).
* **token**: A strong string (min 12 chars). Used to validate `Authorization` headers.

### `[WebRoute(path, method, requireAuth)]`
Attribute to map a method to a URL.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **path** | `string` | *Required* | The URL path (e.g., `/api/give`). |
| **method** | `string` | `"POST"` | HTTP Method (`GET`, `POST`, `PUT`, `DELETE`). |
| **requireAuth** | `bool` | `true` | If `true`, checks the `Authorization` header against the token provided in `StartWebServer`. |

### Security (Mandatory)

To ensure server security, you must manually provide a **Secret Token** when starting the web server inside your plugin.

* The token acts as a password for your API.
* It must be at least **12 characters long**.

## Authenticating Requests
When sending a request (e.g., via Postman or a Website), you must include the token in the headers:

* **Header Name:** `Authorization` or `X-API-Key`
* **Value:** The token specified.


## Quick Start

To enable web features, use the `Oxygen.Csharp.Web` namespace.

### Basic Implementation

```csharp
using System;
using System.Collections.Generic;
using Oxygen.Csharp.API;
using Oxygen.Csharp.Core;
using Oxygen.Csharp.Web;

namespace MyServer.Plugins
{
    public class MyWebPlugin : OxygenPlugin
    {
        // Define your secret key (Store this securely!)
        private const string API_TOKEN = "MySecretKey_ChangeMe_12345";

        public override void OnLoad()
        {
            try 
            {
                // Start listening on port 8090
                StartWebServer(8090, API_TOKEN);
                Console.WriteLine("[Web] Server started on port 8090");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Web] Failed to start: {ex.Message}");
            }
        }

        // POST http://YOUR_IP:8090/test
        [WebRoute("/test", "POST")]
        public string OnTest(string body)
        {
            return "{ \"status\": \"working\" }";
        }
    }
}
```

## Public Endpoints (No Auth)

Sometimes you want an endpoint to be public (e.g., a server status page). You can disable authentication for specific routes using `requireAuth: false`.

```csharp
// GET http://SERVER_IP:8090/status
// No Authorization header needed
[WebRoute("/status", "GET", requireAuth: false)]
public string GetStatus(string body)
{
    // Return simple JSON
    return "{ \"online\": 50, \"max_players\": 64 }";
}
```

---

## Practical Examples

Here are real-world examples of how to control the server remotely.

### 1. Global Announcer (Discord Integration)
Send messages to the in-game chat from an external source (e.g., a Discord Bot).

```csharp
using System;
using System.Collections.Generic;
using Oxygen.Csharp.API;
using Oxygen.Csharp.Core;
using Oxygen.Csharp.Web;

namespace MyServer.Plugins
{
    public class AnnouncerPlugin : OxygenPlugin
    {
        public override void OnLoad()
        {
            // Port 8090, Token must be >12 chars
            StartWebServer(8090, "Discord_Bot_Integration_Key_2025");
        }

        // POST /say
        [WebRoute("/say", "POST")]
        public string OnBroadcast(string body)
        {
            try 
            {
                var data = JsonSerializer.Deserialize<MessageData>(body);

                // Command: #Announce <Message>
                // We use 'null' as the first argument to execute as Server Console
                ProcessCommand(null, $"Announce {data.Message}");

                Console.WriteLine($"[Web] Broadcast sent: {data.Message}");
                return "{ \"status\": \"sent\" }";
            }
            catch
            {
                return "{ \"error\": \"Invalid JSON\" }";
            }
        }

        class MessageData { public string Message { get; set; } }
    }
}
```

### 2. World Control (Time & Weather)
Allow admins to change the time of day or weather via a web panel.

```csharp
using System;
using System.Collections.Generic;
using Oxygen.Csharp.API;
using Oxygen.Csharp.Core;
using Oxygen.Csharp.Web;

namespace MyServer.Plugins
{
    public class WorldControlPlugin : OxygenPlugin
    {
        public override void OnLoad()
        {
            StartWebServer(8090, "AdminPanel_Super_Secret_Key_99");
        }

        // POST /api/world
        [WebRoute("/api/world", "POST")]
        public string SetWorld(string body)
        {
            var data = JsonSerializer.Deserialize<WorldRequest>(body);

            // Change Time (e.g., "12:00")
            if (!string.IsNullOrEmpty(data.Time))
            {
                ProcessCommand(null, $"SetTime {data.Time}");
            }
            
            // Change Weather (0 = Sunny, 1 = Rain)
            if (data.WeatherId >= 0)
            {
                ProcessCommand(null, $"SetWeather {data.WeatherId}");
            }

            return "{ \"status\": \"updated\" }";
        }

        class WorldRequest 
        { 
            public string Time { get; set; } 
            public int WeatherId { get; set; } = -1;
        }
    }
}
```

### 3. Remote Ban System
Integration with a website to ban players remotely.

```csharp
using System;
using System.Collections.Generic;
using Oxygen.Csharp.API;
using Oxygen.Csharp.Core;
using Oxygen.Csharp.Web;

namespace MyServer.Plugins
{
    public class WebBanPlugin : OxygenPlugin
    {
        public override void OnLoad()
        {
            StartWebServer(8090, "BanSystem_Secure_Token");
        }

        // POST /admin/ban
        [WebRoute("/admin/ban", "POST")]
        public string BanPlayer(string body)
        {
            var request = JsonSerializer.Deserialize<BanRequest>(body);

            // Execute Ban: #Ban <SteamID> <Reason>
            ProcessCommand(null, $"Ban {request.SteamId} {request.Reason}");
            
            // Kick immediately to apply effect
            ProcessCommand(null, $"Kick {request.SteamId} {request.Reason}");

            Console.WriteLine($"[Web] Player {request.SteamId} banned remotely.");
            return "{ \"success\": true }";
        }

        class BanRequest
        {
            public string SteamId { get; set; }
            public string Reason { get; set; }
        }
    }
}
```

---

## Sending Requests (Client Side)

Since security is mandatory, every request must include the **Authorization Header**.

### Example: CURL
```bash
curl -X POST http://SERVER_IP:8090/say \
     -H "Authorization: Discord_Bot_Integration_Key_2025" \
     -H "Content-Type: application/json" \
     -d '{"Message": "Hello from Terminal!"}'
```

### Example: Python
```python
import requests

url = "http://SERVER_IP:8090/say"
headers = {
    "Authorization": "Discord_Bot_Integration_Key_2025",
    "Content-Type": "application/json"
}
data = {"Message": "Server Restarting in 5 minutes!"}

response = requests.post(url, json=data, headers=headers)
print(response.text)
```
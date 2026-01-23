import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Oxygen Framework",
  description: "C# Plugin System for SCUM Server",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/methods" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          // { text: "Plugin Structure", link: "/guide/plugin-structure" },
        ],
      },
            {
        text: "Reference & API",
        items: [
          { text: "Player (PlayerBase)", link: "/api/players-methods" },
          { text: "Server API", link: "/api/server-methods" }
        ],
        
      },
      {
        text: "Hooks",
        items: [
          { text: "Player Hooks", link: "/guide/player-hooks" }
        ],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Chat Commands", link: "/guide/commands" },
          // { text: "Permissions", link: "/guide/permissions" },
          { text: "Events", link: "/guide/events" },
          { text: "Configuration", link: "/guide/configuration" },
          { text: "Data Storage", link: "/guide/data-storage" },
          // { text: "Grant Permissions", link: "/guide/permission-plugin" },
          { text: "Web API", link: "/guide/web-request" },
          { text: "HTTP client", link: "/guide/http-client" },
          { text: "Database Access", link: "/guide/database" },
          { text: "Timers", link: "/guide/timers" },
        ],
      }
    ],
    socialLinks: [{ icon: "discord", link: "#" }],
  },
});

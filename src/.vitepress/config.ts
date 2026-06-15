import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Boltstore",
  description: "Lightweight backend with realtime sync",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/records" },
      { text: "SDK", link: "/sdk/overview" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Configuration", link: "/guide/configuration" },
            { text: "Architecture", link: "/guide/architecture" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Records", link: "/api/records" },
            { text: "Collections", link: "/api/collections" },
            { text: "Auth", link: "/api/auth" },
            { text: "Realtime", link: "/api/realtime" },
            { text: "Sync", link: "/api/sync" },
            { text: "Files", link: "/api/files" },
          ],
        },
      ],
      "/sdk/": [
        {
          text: "SDK Reference",
          items: [
            { text: "Overview", link: "/sdk/overview" },
            { text: "Client", link: "/sdk/client" },
            { text: "Records", link: "/sdk/records" },
            { text: "Auth", link: "/sdk/auth" },
            { text: "Realtime", link: "/sdk/realtime" },
            { text: "Storage", link: "/sdk/storage" },
            { text: "Sync", link: "/sdk/sync" },
          ],
        },
      ],
    },
  },
});
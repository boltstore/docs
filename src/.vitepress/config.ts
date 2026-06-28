import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Boltstore",
  description: "Self-hostable SQLite Database-as-a-Service with HTTP API and JavaScript SDK.",
  lang: "en-US",
  appearance: "dark",
  ignoreDeadLinks: true,

  themeConfig: {
    logo: {
      light: "/logo.svg",
      dark: "/logo.svg",
    },

    siteTitle: "Boltstore",

    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/guide/overview" },
      { text: "API", link: "/api/overview" },
      { text: "SDK", link: "/sdk/overview" },
      { text: "GitHub", link: "https://github.com/boltstore/boltstore" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "📖 Overview", link: "/guide/overview" },
            { text: "🚀 Get Started", link: "/guide/getting-started" },
            { text: "💡 Concepts", link: "/guide/concepts" },
          ],
        },
        {
          text: "Operations",
          items: [
            { text: "🚀 Production Deploy", link: "/guide/deployment" },
            { text: "📋 Changelog", link: "/guide/changelog" },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "🔌 REST API", link: "/api/overview" },
            { text: "🗄️ Databases API", link: "/api/databases" },
            { text: "📊 Analytics API", link: "/api/analytics" },
          ],
        },
        {
          text: "SDK",
          items: [
            { text: "📦 JavaScript SDK", link: "/sdk/overview" },
          ],
        },
      ],
      "/api/": [
        {
          text: "Introduction",
          items: [
            { text: "📖 Overview", link: "/guide/overview" },
            { text: "🚀 Get Started", link: "/guide/getting-started" },
            { text: "💡 Concepts", link: "/guide/concepts" },
          ],
        },
        {
          text: "Operations",
          items: [
            { text: "🚀 Production Deploy", link: "/guide/deployment" },
            { text: "📋 Changelog", link: "/guide/changelog" },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "🔌 REST API", link: "/api/overview" },
            { text: "🗄️ Databases API", link: "/api/databases" },
            { text: "📊 Analytics API", link: "/api/analytics" },
          ],
        },
        {
          text: "SDK",
          items: [
            { text: "📦 JavaScript SDK", link: "/sdk/overview" },
          ],
        },
      ],
      "/sdk/": [
        {
          text: "Introduction",
          items: [
            { text: "📖 Overview", link: "/guide/overview" },
            { text: "🚀 Get Started", link: "/guide/getting-started" },
            { text: "💡 Concepts", link: "/guide/concepts" },
          ],
        },
        {
          text: "Operations",
          items: [
            { text: "🚀 Production Deploy", link: "/guide/deployment" },
            { text: "📋 Changelog", link: "/guide/changelog" },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "🔌 REST API", link: "/api/overview" },
            { text: "🗄️ Databases API", link: "/api/databases" },
            { text: "📊 Analytics API", link: "/api/analytics" },
          ],
        },
        {
          text: "SDK",
          items: [
            { text: "📦 JavaScript SDK", link: "/sdk/overview" },
          ],
        },
      ],
    },

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/boltstore/boltstore" },
    // ],

    footer: {
      message: "",
      copyright: "",
    },

    editLink: {
      pattern: "https://github.com/boltstore/docs/edit/main/src/:path", // docs repo
      text: "Edit this page on GitHub",
    },

    lastUpdated: true,
    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
      label: "On this page",
    },
  },

  markdown: {
    theme: {
      light: "material-theme-lighter",
      dark: "material-theme",
    },
    lineNumbers: true,
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: '/favicon.svg' }],
    ["link", { rel: "preconnect", href: "https://fonts.bunny.net" }],
    ["link", { href: "https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800|jetbrains-mono:400,500,600", rel: "stylesheet" }],
  ],
});

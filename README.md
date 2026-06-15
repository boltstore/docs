# @boltstore/docs

Boltstore documentation site built with [Vitepress](https://vitepress.dev/).

## Development

```bash
bun install
bun run dev
```

This starts a local development server at `http://localhost:5173` with hot-reload.

## Build

```bash
bun run build
```

Generates a static site in `src/.vitepress/dist/`.

## Preview

```bash
bun run preview
```

Preview the built site locally.

## Structure

```
docs/
├── package.json
└── src/
    ├── .vitepress/
    │   └── config.ts      # Vitepress configuration
    ├── index.md            # Landing page
    ├── guide/              # Getting started, installation, architecture
    ├── api/                # API reference (records, collections, auth, realtime, sync, files)
    └── sdk/                # Client SDK reference
```

## License

MIT
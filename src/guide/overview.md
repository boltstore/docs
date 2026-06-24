---
title: Docs — Boltstore
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">Introduction</div>

# Boltstore Documentation

Boltstore is a self-hostable Database-as-a-Service (DBaaS) built on SQLite + Bun. One process serves many isolated SQLite databases over a REST API, with an admin dashboard for management, analytics, and audit logging.

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
  <a href="/guide/getting-started" class="card card-hover">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
      <div style="width: 2rem; height: 2rem; border-radius: 6px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <span style="font-weight: 500; font-size: 0.875rem;">Get Started</span>
    </div>
    <p style="font-size: 0.75rem; color: var(--text-muted);">Install Boltstore and create your first database in under 5 minutes.</p>
  </a>
  <a href="/api/overview" class="card card-hover">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
      <div style="width: 2rem; height: 2rem; border-radius: 6px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <span style="font-weight: 500; font-size: 0.875rem;">API Reference</span>
    </div>
    <p style="font-size: 0.75rem; color: var(--text-muted);">Complete REST API documentation with request/response examples.</p>
  </a>
  <a href="/sdk/overview" class="card card-hover">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
      <div style="width: 2rem; height: 2rem; border-radius: 6px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
      </div>
      <span style="font-weight: 500; font-size: 0.875rem;">SDK Guide</span>
    </div>
    <p style="font-size: 0.75rem; color: var(--text-muted);">JavaScript/TypeScript SDK with typed queries and a query builder.</p>
  </a>
  <a href="/guide/concepts" class="card card-hover">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
      <div style="width: 2rem; height: 2rem; border-radius: 6px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <span style="font-weight: 500; font-size: 0.875rem;">Concepts</span>
    </div>
    <p style="font-size: 0.75rem; color: var(--text-muted);">Learn the core concepts behind Boltstore's architecture.</p>
  </a>
</div>

## What is Boltstore?

Boltstore is a database platform built on SQLite + Bun. It exposes every database operation through a REST API, making it accessible from any runtime that can make HTTP requests — Node.js, Bun, Deno, browsers, or curl. You can think of it as a self-hostable, managed SQLite with a developer-friendly API and an admin dashboard.

> **What this is:** a database platform. You get SQLite databases over HTTP, multi-database isolation, API keys, an admin dashboard, analytics, import/export, and audit logging. Ship it as a single binary or `bun` process with a data directory.

> **What this is not (yet):** a Backend-as-a-Service. Boltstore started with BaaS ambitions (RLS, JWT user auth, realtime, offline sync), but the MVP deliberately scopes those out to ship a solid database platform first. If you need BaaS-style features today, build them in your application layer on top of Boltstore's API — or wait for the plugin system.

## Core Concepts

### Multi-Database Isolation

One Boltstore instance serves multiple isolated SQLite databases. Each database has its own file on disk, its own API keys, its own CORS configuration, and its own config. A key for database `foo` cannot access database `bar`. This makes it safe to run multiple projects on the same instance.

### SQLite at the Core

At its core, Boltstore is SQLite. Your data is stored in standard SQLite files that you can export, inspect with any SQLite tool, and migrate at any time. No proprietary formats, no vendor lock-in. Full SQL support — transactions, views, indexes, triggers — all available through the raw SQL endpoint.

### HTTP API

Every database operation is exposed via REST endpoints under `/api`. No drivers, no connection strings, no ORM required. Just `fetch` and go. This makes Boltstore accessible from any programming language or runtime.

### Admin Dashboard

A Vue 3 SPA at `/dashboard` for managing databases, tables, records, API keys, analytics, and settings. Create databases, inspect schema, run queries, rotate keys, and view audit logs — all from the browser.

## Quick Start

**Install script** (macOS / Linux):

<pre class="code-block">curl -fsSL https://boltstore.dev/install.sh | bash
boltstore serve --port 8080 --db ./data</pre>

**npm:**

<pre class="code-block">npm install -g boltstore
boltstore serve --port 8080 --db ./data</pre>

See the [Getting Started](/guide/getting-started) guide for all installation methods (binary download, Docker, from source).

Then open `http://localhost:8080/dashboard` and create the first admin account.

## Features

| Feature | Status | Description |
|---|---|---|
| SQLite via HTTP REST API | <span class="badge badge-green">Available</span> | Full CRUD on records, table DDL, filtering, sorting, pagination, and raw SQL |
| Multi-database Support | <span class="badge badge-green">Available</span> | One instance serves multiple isolated SQLite databases |
| API Key Authentication | <span class="badge badge-green">Available</span> | Per-database API keys (SHA-256 hashed at rest); admin sessions for dashboard |
| Admin Dashboard | <span class="badge badge-green">Available</span> | Vue 3 SPA for managing databases, tables, records, keys, and settings |
| Analytics | <span class="badge badge-green">Available</span> | Query log, storage snapshots, per-database and error dashboards |
| Audit Logging | <span class="badge badge-green">Available</span> | Admin actions recorded with admin ID and requesting IP |
| Per-database Config | <span class="badge badge-green">Available</span> | CORS origins, read-only flag, and group per database |
| Import / Export | <span class="badge badge-green">Available</span> | Export via `VACUUM INTO`; import `.db` files with integrity check |
| JavaScript SDK | <span class="badge badge-green">Available</span> | `@boltstore/client` with typed records, query builder, and raw SQL |
| Plugin System | <span class="badge badge-yellow">Reserved</span> | Plugin interface exists but no plugins are loaded yet |
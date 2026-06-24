---
title: Concepts — Boltstore Docs
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">Introduction</div>

# Concepts

Understanding the core concepts behind Boltstore helps you get the most out of the platform.

## Database-as-a-Service, not Backend-as-a-Service

Boltstore is a **DBaaS** — a database platform. You get SQLite databases over HTTP, multi-database isolation, API keys, an admin dashboard, analytics, import/export, and audit logging. It is **not** a BaaS. The MVP deliberately scopes out RLS, JWT user auth, realtime, offline sync, and file storage. Those are application-layer concerns or future plugin territory.

**The contract:** the core stays a database platform. BaaS features are added by you (application layer) or by plugins — never by bloating the core.

## Multi-Database Isolation

One Boltstore instance serves multiple isolated SQLite databases. Each database has its own:

- SQLite file on disk
- API keys for authentication
- CORS configuration
- Per-database config (read-only flag, group)

A key for database `foo` cannot access database `bar`. This isolation makes it safe to run multiple projects on the same instance. A bug or leak in one database cannot affect another.

## SQLite at the Core

At its heart, Boltstore is SQLite. This is a deliberate choice:

- **Zero external dependencies** — no separate database server to manage
- **Portable data** — your database is a single file you can move anywhere
- **Full SQL support** — transactions, views, indexes, triggers, all available through the raw SQL endpoint
- **Battle-tested** — SQLite is the most deployed database in the world
- **No vendor lock-in** — export to a `.db` file at any time and open it with any SQLite tool

## HTTP API

Every database operation is exposed via REST endpoints under `/api`. No drivers, no connection strings, no ORM required. This makes Boltstore accessible from any programming language or runtime that can make HTTP requests:

<pre class="code-block"><span class="code-comment"># Query Boltstore from anything — curl, Node, Bun, Deno, browser</span>
curl http://localhost:8080/api/databases/my-app/query \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"sql": "SELECT * FROM users WHERE active = ?", "params": [1]}'</span></pre>

## Two Credential Systems

Boltstore has two types of credentials:

- **Admin sessions** — for dashboard users (humans). Global scope, can administer the whole server. Sent as `Authorization: Bearer <session-token>`.
- **API keys** — for services, scripts, and your application backend. Per-database scope, bound to one database. Format: `boltstore_` + 32 random alphanumeric characters. SHA-256 hashed at rest. Sent as `Authorization: Bearer <boltstore_...>`.

## Audit Logging

Admin actions are recorded in the `_activity_log` table with the admin ID, action, target database, and requesting IP. Logged actions include database create/rename/delete, API key create/rotate/revoke, config changes, and admin login/logout.

## Plugin System (Future)

Boltstore includes a minimal plugin interface and event emitter as **reserved infrastructure**. No plugins are loaded yet and no events are emitted. Once plugin loading is implemented (post-MVP), plugins will be able to subscribe to `query`, `database:create`, `table:create`, and other events to add features like RLS-style enforcement, custom validation, or analytics enrichment without modifying core.
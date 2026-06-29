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

- **Admin sessions** — for dashboard users (humans). Global scope, can administer the whole server. Sent as `Authorization: Bearer <session-token>`. Admin sessions also work for data CRUD operations (tables, records, queries), not just admin-only routes like setup and settings.
- **API keys** — for services, scripts, and your application backend. Per-database scope, bound to one database. Format: `boltstore_` + 32 random alphanumeric characters. SHA-256 hashed at rest. Sent as `Authorization: Bearer <boltstore_...>`.

## Audit Logging

Admin actions are recorded in the `_activity_log` table with the admin ID, action, target database, and requesting IP. Logged actions include database create/rename/delete, API key create/rotate/revoke, config changes, and admin login/logout.

## Plugin System (Future)

Boltstore includes a minimal plugin interface and event emitter as **reserved infrastructure**. No plugins are loaded yet and no events are emitted. Once plugin loading is implemented (post-MVP), plugins will be able to subscribe to `query`, `database:create`, `table:create`, and other events to add features like RLS-style enforcement, custom validation, or analytics enrichment without modifying core.

## Analytics Performance

Boltstore includes built-in analytics without requiring extra packages:

- **Query Logging** — Every operation is logged with timing, row count, and status to track performance and audit usage.
- **Storage Snapshots** — Database file size and table count are recorded every 5 minutes to monitor growth and usage patterns.
- **Pre-aggregated Tables** — `_daily_stats` (daily query counts per operation) and `_daily_queries` (daily text-based aggregations) are maintained for fast dashboard loading. They are updated during the existing 5-second flush cycle and stay within ~5 seconds of real-time.
- **Caching** — Analytics responses are cached in memory (30 seconds by default) to avoid expensive re-aggregation on every dashboard request.

## Database Renaming

You can rename a database without breaking references (API keys, analytics, records). The rename process:

1. Creates a new SQLite file for the database and copies all existing data
2. Updates the `_databases` table with the new name and file path
3. Updates the `database_name` column in child tables (API keys, activity logs) for current routing, but all historical analytics and activity records retain their original database name for audit trails
4. Creates a new `DatabasePool` for the renamed file — the old pool is closed to prevent 500 errors during the transition
5. All dashboard panels are immediately refreshed using the new cache invalidation

This ensures your database’s UUID (`id`) remains stable after rename, making application code rely on consistent database identifiers.

## API Key Permissions

API keys now have full database access without an admin session:

- **CRUD Operations** — You can execute any SQL (`/query`), view/modify tables (`/tables/*`), and insert/update/delete records
- **Config Management** — Edit CORS, read-only mode via `/config`
- **API Keys** — List, create, rotate, and revoke API keys via `/keys`
- **Export** — Download the database file via `/export`
- **Analytics** — Fetch per-database overview and query logs via `/analytics`
- **Schema** — Fetch batch schemas for all tables via `/tables/schema`

Previously these actions required an admin session. Import and deletion remain admin-only.

**Maximum permissions without admin credentials**:

| Access Level | Operations | Examples |
|---|---|---|
| **Standard** | All database read/write operations except server setup | `POST /query`, `GET /tables/:table`, `PUT /tables/:table/records/:id` |
| **Standard with Extension** | All standard plus config/keys/analytics/export/stats | `POST /config`, `POST /keys`, `POST /export`, `POST /analytics`, `GET /analytics/:db/*`, `GET /databases/:db/tables/schema` |

**Important**:

- Limits apply: API keys cannot configure server settings (like admin passwords) or manage other databases
- Server parameters like rate limits are enforced per API key for security
- The admin dashboard still accepts administrative operations (creating/deleting/renaming databases, managing other databases, watching the server uptime/health metrics)
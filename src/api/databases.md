---
title: Databases API
---

# Databases API

Database management endpoints. List, create, and delete require admin authentication. Viewing a database detail, managing config, and managing keys accept an API key or admin session.

## Database Name Rules

Database names must match `/^[a-z0-9][a-z0-9_-]*$/`.

## List Databases

<span class="method-badge method-get">GET</span> <code class="endpoint-path">/api/databases</code>

Returns all databases on the server.

```bash
curl http://localhost:8080/api/databases \
  -H "Authorization: Bearer <session-token>"
```

```json
{
  "data": [
    {
      "id": "db_abc123",
      "name": "myapp",
      "path": "./data/myapp.db",
      "createdAt": "2026-06-20T10:00:00.000Z"
    }
  ]
}
```

## Create Database

<span class="method-badge method-post">POST</span> <code class="endpoint-path">/api/databases</code>

Create a new SQLite database. The optional `group` field lets you organize databases into groups for filtering in the admin dashboard.

```bash
curl -X POST http://localhost:8080/api/databases \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "myapp", "group": "production"}'
```

```json
{
  "data": {
    "id": "db_def456",
    "name": "myapp",
    "group": "production",
    "path": "./data/myapp.db",
    "createdAt": "2026-06-21T12:00:00.000Z"
  }
}
```

## Get Database

<span class="method-badge method-get">GET</span> <code class="endpoint-path">/api/databases/:name</code>

Returns details for a specific database. Accepts an API key or admin session.

## Rename Database

<span class="method-badge method-patch">PATCH</span> <code class="endpoint-path">/api/databases/:name</code>

```json
{ "name": "new-name" }
```

Renames the database and its underlying file. API keys are automatically updated to reference the new name.

::: warning
Analytics tables (`_query_log`, `_storage_snapshots`, `_daily_stats`, `_daily_queries`) and the activity log are updated to reflect the new name. Only entries created by this server with analytics enabled are affected — external records are not migrated.
:::

## Delete Database

<span class="method-badge method-delete">DELETE</span> <code class="endpoint-path">/api/databases/:name</code>

Permanently deletes the database and all its data.

## Database Config

<span class="method-badge method-get">GET</span> <code class="endpoint-path">/api/databases/:name/config</code>

Get per-database configuration (CORS origins, read-only flag, group). Accepts an API key or admin session.

<span class="method-badge method-patch">PATCH</span> <code class="endpoint-path">/api/databases/:name/config</code>

Update per-database configuration. Accepts an API key or admin session. Only `cors_origins` and `readonly` keys are allowed.

```json
{
  "readonly": true
}
```

## API Keys

<span class="method-badge method-get">GET</span> <code class="endpoint-path">/api/databases/:name/keys</code>

List API keys for the database. Accepts an API key or admin session.

<span class="method-badge method-post">POST</span> <code class="endpoint-path">/api/databases/:name/keys</code>

Create a new API key:

```json
{ "label": "My Backend Service" }
```

Returns `{ id, label, key }` — the raw key is returned **only once**.

::: warning
API keys are SHA-256 hashed at rest. Store the raw key securely — it cannot be retrieved later.
:::

<span class="method-badge method-post">POST</span> <code class="endpoint-path">/api/databases/:name/keys/:id/rotate</code>

Rotate an API key. Returns a new key. The old key is immediately invalidated.

<span class="method-badge method-delete">DELETE</span> <code class="endpoint-path">/api/databases/:name/keys/:id</code>

Revoke an API key.

## Export

<span class="method-badge method-post">POST</span> <code class="endpoint-path">/api/databases/:name/export</code>

Exports the database file using `VACUUM INTO`. Returns the `.db` file as a download. Accepts an API key or admin session.

## Import

<span class="method-badge method-post">POST</span> <code class="endpoint-path">/api/databases/import</code>

Import a `.db` file as a new database.

```bash
curl -X POST http://localhost:8080/api/databases/import \
  -H "Authorization: Bearer <session-token>" \
  -F "file=@myapp.db" \
  -F "name=myapp-restored"
```

The server runs `PRAGMA integrity_check` before registering the database.

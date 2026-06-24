---
title: API Reference — Boltstore Docs
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">API Reference</div>

# REST API

The Boltstore REST API provides full access to your databases and admin operations. All endpoints are prefixed with `/api`.

## Authentication

All API requests require authentication via the `Authorization` header:

<pre class="code-block"><span class="code-comment"># Per-database API key</span>
Authorization: Bearer boltstore_...
<span class="code-comment"># Admin session token (from POST /api/admin/login)</span>
Authorization: Bearer &lt;session-token&gt;</pre>

API keys are scoped per database. Admin sessions have global scope. Manage keys in the [Dashboard](/dashboard) or via the admin API.

## Base URL

<pre class="code-block"><span class="code-comment"># Local development</span>
http://localhost:8080/api
<span class="code-comment"># Production (your deployed instance)</span>
https://your-boltstore-instance.com/api</pre>

## Admin Endpoints

### Admin Login

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/admin/login</code>
</div>

Authenticate an admin user and receive a session token. Login is throttled per-IP (5 attempts per 15 minutes).

<pre class="code-block">curl -X POST http://localhost:8080/api/admin/login \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"email": "admin@example.com", "password": "..."}'</span>
<span class="code-comment"># Response</span>
{ <span class="code-string">"data"</span>: { <span class="code-string">"token"</span>: <span class="code-string">"&lt;session-token&gt;"</span> } }</pre>

### Admin Status

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/admin/status</code>
</div>

Check whether any admins exist (used by the dashboard setup flow). Public, no auth required.

## Databases

### List Databases

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases</code>
</div>

Returns a list of all databases. Requires admin session.

<pre class="code-block">curl http://localhost:8080/api/databases \
-H <span class="code-string">'Authorization: Bearer &lt;session-token&gt;'</span>
<span class="code-comment"># Response</span>
{
<span class="code-string">"data"</span>: [
{
<span class="code-string">"id"</span>: <span class="code-string">"db_..."</span>,
<span class="code-string">"name"</span>: <span class="code-string">"my-app"</span>,
<span class="code-string">"path"</span>: <span class="code-string">"./data/my-app.db"</span>,
<span class="code-string">"createdAt"</span>: <span class="code-string">"2026-06-20T10:00:00Z"</span>
}
]
}</pre>

### Create Database

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases</code>
</div>

Creates a new database. Names must match `/^[a-z0-9][a-z0-9_-]*$/`. Requires admin session.

<pre class="code-block">curl -X POST http://localhost:8080/api/databases \
-H <span class="code-string">'Authorization: Bearer &lt;session-token&gt;'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "my-app"}'</span></pre>

### Delete Database

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-delete">DELETE</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:name</code>
</div>

Permanently deletes a database and its file. This action cannot be undone. Requires admin session.

## API Keys

### Create API Key

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:name/keys</code>
</div>

Creates a new per-database API key. The raw key is returned only once. Requires admin session.

<pre class="code-block">curl -X POST http://localhost:8080/api/databases/my-app/keys \
-H <span class="code-string">'Authorization: Bearer &lt;session-token&gt;'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"label": "My App Backend"}'</span>
<span class="code-comment"># Response</span>
{
<span class="code-string">"data"</span>: {
<span class="code-string">"id"</span>: <span class="code-string">"apk_..."</span>,
<span class="code-string">"label"</span>: <span class="code-string">"My App Backend"</span>,
<span class="code-string">"key"</span>: <span class="code-string">"boltstore_..."</span>
}
}</pre>

### Rotate / Revoke Key

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:name/keys/:id/rotate</code>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-delete">DELETE</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:name/keys/:id</code>
</div>

Rotate generates a new key string (old key stops working). Revoke permanently deletes the key. Both require admin session.

## Tables

### List / Create Tables

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables</code>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables</code>
</div>

Accessible with an API key or admin session.

<pre class="code-block">curl -X POST http://localhost:8080/api/databases/my-app/tables \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "users", "columns": [{"name": "id", "type": "integer", "primary_key": true, "auto_increment": true}, {"name": "name", "type": "text", "nullable": false}]}'</span></pre>

## Records

### List / Create Records

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables/:table/records</code>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables/:table/records</code>
</div>

List supports `filter`, `sort`, `limit` (max 1000, default 50), `offset`, and `fields` query params. Accessible with an API key or admin session.

<pre class="code-block"><span class="code-comment"># List with filter and pagination</span>
curl <span class="code-string">'http://localhost:8080/api/databases/my-app/tables/users/records?filter={"active":true}&sort=-created_at&limit=10'</span> \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span>
<span class="code-comment"># Create a record</span>
curl -X POST http://localhost:8080/api/databases/my-app/tables/users/records \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "Alice", "email": "alice@example.com"}'</span></pre>

### Get / Update / Delete Record

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables/:table/records/:id</code>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">PATCH</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables/:table/records/:id</code>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-delete">DELETE</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/tables/:table/records/:id</code>
</div>

Standard CRUD on a single record by ID. Accessible with an API key or admin session.

## Raw SQL

### Execute SQL

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:db/query</code>
</div>

Execute parameterised SQL. Accepts `{ sql: string, params?: unknown[] }`.

**Policy:** Non-admin API keys may only execute `SELECT` statements. `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `DROP`, and other write statements require an admin key or session. If the database is in read-only mode, writes are rejected for everyone.

<pre class="code-block">curl -X POST http://localhost:8080/api/databases/my-app/query \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"sql": "SELECT * FROM users WHERE active = ?", "params": [1]}'</span>
<span class="code-comment"># Response</span>
{
<span class="code-string">"data"</span>: [
{ <span class="code-string">"id"</span>: <span class="code-number">1</span>, <span class="code-string">"name"</span>: <span class="code-string">"Alice"</span>, <span class="code-string">"email"</span>: <span class="code-string">"alice@example.com"</span> }
]
}</pre>

## Import / Export

### Export Database

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/:name/export</code>
</div>

Exports the database to a `.db` file via `VACUUM INTO`. Requires admin session.

### Import Database

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-post">POST</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/databases/import</code>
</div>

Imports a `.db` file and registers a new database (with integrity check). Requires admin session.

## Response Codes

| Status | Description |
|---|---|
| <span class="badge badge-green">200 OK</span> | Request successful |
| <span class="badge badge-green">201 Created</span> | Resource created successfully |
| <span class="badge badge-blue">400 Bad Request</span> | Invalid request parameters |
| <span class="badge badge-yellow">401 Unauthorized</span> | Missing or invalid credentials |
| <span class="badge badge-yellow">403 Forbidden</span> | Action requires admin privileges |
| <span class="badge badge-yellow">404 Not Found</span> | Resource not found |
| <span class="badge badge-red">500 Internal Error</span> | Server error |
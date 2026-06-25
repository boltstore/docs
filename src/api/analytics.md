---
title: Analytics API — Boltstore Docs
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">API Reference</div>

# Analytics API

Boltstore tracks every database query (SELECT, INSERT, UPDATE, DELETE) and periodic storage snapshots. All analytics data is stored in a dedicated `_analytics.db` database alongside your data.

All analytics endpoints require an **admin session**. Per-database API keys are not accepted.

## Data Model

### `_query_log`

Inserted for every query or record CRUD operation. Rows older than 30 days are pruned automatically (at most once per hour).

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Auto-increment primary key |
| `database` | TEXT | Target database name |
| `table_name` | TEXT | Target table, or `NULL` for raw SQL queries |
| `operation` | TEXT | `select`, `insert`, `update`, or `delete` |
| `duration_ms` | REAL | Query execution time in milliseconds |
| `row_count` | INTEGER | Rows returned (SELECT) or affected (write) |
| `status` | TEXT | `ok` or `error` |
| `error_msg` | TEXT | Error message if `status = 'error'` |
| `timestamp` | TEXT | ISO-8601 timestamp |

**Note on `table_name`:** Raw SQL queries via `POST /api/databases/:db/query` always log `table_name = NULL` since a single SQL statement can reference multiple tables, perform joins, or run DDL/PRAGMA. Only record CRUD operations (`POST /api/databases/:db/tables/:table/records`, etc.) populate `table_name` from the URL parameter.

### `_storage_snapshots`

Inserted every 5 minutes for every database.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Auto-increment primary key |
| `database` | TEXT | Database name |
| `size_bytes` | INTEGER | Database file size in bytes, recorded periodically by the analytics snapshot timer |
| `table_count` | INTEGER | Number of user tables (excluding internal `_*` tables) |
| `timestamp` | TEXT | ISO-8601 timestamp |

## Range Parameter

All analytics endpoints accept a `?range=` query parameter that controls the time window and grouping:

| Value | Window | Grouping |
|---|---|---|
| `24h` (default) | Last 24 hours | By hour |
| `7d` | Last 7 days | By day |
| `30d` | Last 30 days | By ISO week |

## Endpoints

### Overview

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/overview?range=24h</code>
</div>

Aggregated stats across all databases.

<pre class="code-block">{
<span class="code-string">"data"</span>: {
<span class="code-string">"databases"</span>: <span class="code-number">3</span>,
<span class="code-string">"queries"</span>: <span class="code-number">15234</span>,
<span class="code-string">"writes"</span>: <span class="code-number">2341</span>,
<span class="code-string">"avgLatencyMs"</span>: <span class="code-number">2.3</span>,
<span class="code-string">"errorCount"</span>: <span class="code-number">12</span>,
<span class="code-string">"rows_read"</span>: <span class="code-number">48293</span>,
<span class="code-string">"rows_written"</span>: <span class="code-number">3510</span>,
<span class="code-string">"totalStorageBytes"</span>: <span class="code-number">52428800</span>
}
}</pre>

| Field | Description |
|---|---|
| `databases` | Total number of databases on the server |
| `queries` | Total query count (SELECT + writes + errors) in the time window |
| `writes` | Count of INSERT/UPDATE/DELETE operations |
| `avgLatencyMs` | Average query latency across all databases |
| `errorCount` | Number of failed queries |
| `rows_read` | Sum of `row_count` for SELECT operations (rows returned) |
| `rows_written` | Sum of `row_count` for INSERT/UPDATE/DELETE operations (rows affected) |
| `totalStorageBytes` | Current total storage across all databases |

### Per-Database Analytics

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/:database/overview?range=24h</code>
</div>

Per-database stats, plus the top 10 tables by call count.

<pre class="code-block">{
<span class="code-string">"data"</span>: {
<span class="code-string">"database"</span>: <span class="code-string">"my-app"</span>,
<span class="code-string">"queries"</span>: <span class="code-number">8234</span>,
<span class="code-string">"writes"</span>: <span class="code-number">1203</span>,
<span class="code-string">"rows_read"</span>: <span class="code-number">48293</span>,
<span class="code-string">"avgLatencyMs"</span>: <span class="code-number">1.8</span>,
<span class="code-string">"errorCount"</span>: <span class="code-number">5</span>,
<span class="code-string">"storageBytes"</span>: <span class="code-number">16777216</span>,
<span class="code-string">"tableCount"</span>: <span class="code-number">4</span>,
<span class="code-string">"topTables"</span>: [
{ <span class="code-string">"sql_text"</span>: <span class="code-string">"SELECT * FROM \"users\" WHERE active = ?"</span>, <span class="code-string">"calls"</span>: <span class="code-number">4210</span>, <span class="code-string">"avg_ms"</span>: <span class="code-number">0.5</span>, <span class="code-string">"writes"</span>: <span class="code-number">202</span>, <span class="code-string">"total_rows"</span>: <span class="code-number">14212</span> }
]
}
}</pre>

| Field | Description |
|---|---|
| `queries` | Total query count (SELECT + writes + errors) in the time window |
| `writes` | Count of INSERT/UPDATE/DELETE operations |
| `rows_read` | Sum of `row_count` across all operations (rows returned + rows affected) |
| `topTables` | Top 10 query patterns by call count. `sql_text` is the SQL text (or operation name for CRUD). `total_rows` is the sum of `row_count` across all matching operations |

### Query Log

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/:database/queries?range=24h&limit=20&offset=0</code>
</div>

Paginated query log for a specific database. Returns the raw log entries sorted by most recent first.

| Query Param | Default | Description |
|---|---|---|
| `limit` | 20 | Max rows (max 100) |
| `offset` | 0 | Pagination offset |

Response includes `meta.total` for the total matching entry count in the time window.

### Top Queries (All Databases)

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/top-queries?range=24h</code>
</div>

Top 1 query pattern per database (most-called query), sorted by call count descending. Grouped by `COALESCE(sql_text, operation)` to capture raw SQL and CRUD operations together.

<pre class="code-block">{
<span class="code-string">"data"</span>: [
{
<span class="code-string">"database"</span>: <span class="code-string">"my-app"</span>,
<span class="code-string">"sql_text"</span>: <span class="code-string">"SELECT * FROM \"users\" WHERE active = ?"</span>,
<span class="code-string">"calls"</span>: <span class="code-number">4008</span>,
<span class="code-string">"avg_ms"</span>: <span class="code-number">0.5</span>,
<span class="code-string">"total_rows"</span>: <span class="code-number">14000</span>
}
]
}</pre>

Raw SQL queries (no table context) appear as their SQL text; record CRUD operations show their constructed SQL template.

### Errors

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/errors?limit=20</code>
</div>

Recent failed queries, sorted by most recent first.

### Volume (Time-Series)

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/volume?range=24h</code>
</div>

Time-series data suitable for chart rendering. Returns evenly-spaced slots (hours for 24h, days for 7d, ISO weeks for 30d) with query counts and errors per slot.

<pre class="code-block">{
<span class="code-string">"data"</span>: {
<span class="code-string">"slots"</span>: [<span class="code-string">"00"</span>, <span class="code-string">"01"</span>, <span class="code-string">"02"</span>, <span class="code-string">"03"</span>],
<span class="code-string">"counts"</span>: [<span class="code-number">120</span>, <span class="code-number">85</span>, <span class="code-number">42</span>, <span class="code-number">18</span>],
<span class="code-string">"errors"</span>: [<span class="code-number">0</span>, <span class="code-number">1</span>, <span class="code-number">0</span>, <span class="code-number">0</span>],
<span class="code-string">"rows_read"</span>: [<span class="code-number">480</span>, <span class="code-number">340</span>, <span class="code-number">168</span>, <span class="code-number">72</span>],
<span class="code-string">"rows_written"</span>: [<span class="code-number">24</span>, <span class="code-number">10</span>, <span class="code-number">6</span>, <span class="code-number">2</span>],
<span class="code-string">"max"</span>: <span class="code-number">120</span>,
<span class="code-string">"max_read"</span>: <span class="code-number">480</span>,
<span class="code-string">"max_written"</span>: <span class="code-number">24</span>
}
}</pre>

| Field | Description |
|---|---|
| `slots` | Time slot labels (hour `"00"`–`"23"`, date `"2026-01-01"`, or ISO week `"2026-01"`) |
| `counts` | Query count per slot, in the same order |
| `errors` | Error count per slot |
| `rows_read` | Total rows read (SELECT) per slot |
| `rows_written` | Total rows written (INSERT/UPDATE/DELETE) per slot |
| `max` | Maximum query count across all slots (for chart Y-axis scaling) |
| `max_read` | Maximum rows_read across all slots |
| `max_written` | Maximum rows_written across all slots |

### Storage History

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/:database/size</code>
</div>

Last 100 storage snapshots for a database, sorted by most recent first.

## How Data Is Recorded

Analytics events originate from two sources:

| Source | Endpoint | `operation` | `table_name` | `row_count` |
|---|---|---|---|---|
| Raw SQL | `POST /api/databases/:db/query` | `select` or `update` | `NULL` | Rows returned or affected |
| Create record | `POST /api/databases/:db/tables/:table/records` | `insert` | From URL | Records created |
| List records | `GET /api/databases/:db/tables/:table/records` | `select` | From URL | Rows returned |
| Get record | `GET /api/databases/:db/tables/:table/records/:id` | `select` | From URL | `1` |
| Update record | `PATCH /api/databases/:db/tables/:table/records/:id` | `update` | From URL | `1` |
| Delete record | `DELETE /api/databases/:db/tables/:table/records/:id` | `delete` | From URL | `1` |

**Dashboard browsing counts too.** Every action in the dashboard's Data tab — listing records, paginating, sorting, filtering, or clicking a record — hits the record CRUD endpoints and generates analytics entries. They appear grouped by their SQL template in the Top Queries views.

Events are buffered in memory and flushed to `_analytics.db` every 5 seconds, or when the buffer reaches 100 events — whichever comes first. On flush failure the batch is re-queued.

Storage snapshots are taken every 5 minutes by reading `PRAGMA page_count × PRAGMA page_size` for each database and counting user tables.

## Retention

- Query log entries older than 30 days are pruned automatically. Pruning runs at most once per hour and is attempted as part of the regular flush cycle.
- Storage snapshots are not pruned.

## Dashboard

The analytics data powers the Boltstore Dashboard:

- **Overview** — metric cards (databases, storage, queries, latency) + query volume chart
- **Analytics** — full page with charts, per-database stats table, top queries across all databases, and error log
- **Databases** — per-database rows read, rows written, and total queries for the last 24 hours
- **Database Detail > Top Queries** — top tables by call count with row totals and latency

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
| `database_id` | TEXT | Stable UUID referencing the database (added in v1.0.2). Historical events still show the database name for backward compatibility. |

**Note on `table_name`:** Raw SQL queries via `POST /api/databases/:db/query` always log `table_name = NULL` since a single SQL statement can reference multiple tables, perform joins, or run DDL/PRAGMA. Only record CRUD operations (`POST /api/databases/:db/tables/:table/records`, etc.) populate `table_name` from the URL parameter.

### `_storage_snapshots`

Inserted every 5 minutes for every database.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Auto-increment primary key |
| `database` | TEXT | Target database name |
| `size_bytes` | INTEGER | Database file size in bytes, recorded periodically by the analytics snapshot timer |
| `table_count` | INTEGER | Number of user tables (excluding internal `_*` tables) |
| `timestamp` | TEXT | ISO-8601 timestamp |
| `database_id` | TEXT | Stable UUID referencing the database (added in v1.0.2) |

### `_daily_stats`

Daily aggregated query counts used for fast dashboard loading.

| Column | Type | Description |
|---|---|---|
| `date` | TEXT | Date string, `2026-06-30` |
| `database_name` | TEXT | Target database name |
| `database_id` | TEXT | Stable UUID referencing the database |
| `operation` | TEXT | `select`, `insert`, `update`, `delete`, or `raw_query` |
| `count` | INTEGER | Query count for that operation on that day |
| `rows_read` | INTEGER | Rows returned for SELECT operations |
| `rows_written` | INTEGER | Rows returned + rows affected for write operations |

**Note on the composite unique constraint:** `UNIQUE (database_id, date, operation)` prevents race conditions with concurrent flush requests.

### `_daily_queries`

Daily aggregated query patterns used for analytics dashboards.

| Column | Type | Description |
|---|---|---|
| `date` | TEXT | Date string (`2026-06-30`) |
| `database_name` | TEXT | Target database name |
| `database_id` | TEXT | Stable UUID referencing the database |
| `sql_text` | TEXT | SQL query text, or `NULL` for CRUD (e.g., `SELECT * FROM users WHERE active = ?`) |
| `count` | INTEGER | Query count for that text pattern on that day |
| `row_count` | INTEGER | Rows returned across all matching queries |

**Note on the composite unique constraint:** `UNIQUE (database_id, date, sql_text)` prevents race conditions. For CRUD queries, the `sql_text` pattern is derived from the constructed template.

## Analytics Query Parameters

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
</pre>

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

Predefined response structure:

```json
{
  "data": {
    "database": "my-app",
    "queries": 8234,
    "writes": 1203,
    "rows_read": 48293,
    "avgLatencyMs": 1.8,
    "errorCount": 5,
    "storageBytes": 16777216,
    "tableCount": 4,
    "topTables": [
      {
        "sql_text": "SELECT * FROM \"users\" WHERE active = ?",
        "calls": 4210,
        "avg_ms": 0.5,
        "writes": 202,
        "total_rows": 14212
      }
    ]
  }
}
```

| Field | Description |
|---|---|
| `queries` | Total query count (SELECT + writes + errors) in the time window |
| `writes` | Count of INSERT/UPDATE/DELETE operations |
| `rows_read` | Sum of `row_count` across all operations (rows returned + rows affected) |
| `avgLatencyMs` | Average query latency |
| `errorCount` | Number of failed queries |
| `storageBytes` | Current storage size of the database |
| `tableCount` | Number of user tables |
| `topTables` | Top 10 query patterns by call count with metadata |

### Query Log

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/:database/queries?range=24h&limit=20&offset=0</code>
</div>

Paginated query log for a specific database. Returns the raw log entries sorted by most recent first.

**Query Parameters:**
- `limit`: Max rows (max 100, default 20)
- `offset`: Pagination offset (default 0)

**Response includes `meta.total`** for the total matching entry count in the time window.

### Top Queries (All Databases)

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
  <span class="method-badge method-get">GET</span>
  <code style="font-family: var(--font-mono); font-size: 0.8125rem; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 4px; padding: 0.125rem 0.5rem;">/api/analytics/top-queries?range=24h</code>
</div>

Top 1 query pattern per database (most-called query), sorted by call count descending. Grouped by `COALESCE(sql_text, operation)` to capture raw SQL and CRUD operations together.

**Response structure:**

```json
{
  "data": [
    {
      "database": "my-app",
      "sql_text": "SELECT * FROM \"users\" WHERE active = ?",
      "calls": 4008,
      "avg_ms": 0.5,
      "total_rows": 14000
    }
  ]
}
```

**Response structure details:**
- `data`: Array of query objects
- Each object contains:
  - `database`: Database name
  - `sql_text`: The SQL query text (or operation name for raw SQL)
  - `calls`: Number of calls (query executions)
  - `avg_ms`: Average execution time in milliseconds
  - `total_rows`: Total rows returned or affected

**Note:** Raw SQL queries (no table context) appear as their SQL text; record CRUD operations show their constructed SQL template.

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

**Response structure:**

```json
{
  "data": {
    "slots": ["00", "01", "02", "03"],
    "counts": [120, 85, 42, 18],
    "errors": [0, 1, 0, 0],
    "rows_read": [480, 340, 168, 72],
    "rows_written": [24, 10, 6, 2],
    "max": 120,
    "max_read": 480,
    "max_written": 24
  }
}
```

**Response fields:**
- `data`: Object containing analytics data
- `data.slots`: Time slot labels (hour `"00"`–`"23"`, date `"2026-01-01"`, or ISO week `"2026-01"`)
- `data.counts`: Query count per slot, in the same order
- `data.errors`: Error count per slot
- `data.rows_read`: Total rows read (SELECT) per slot
- `data.rows_written`: Total rows written (INSERT/UPDATE/DELETE) per slot
- `data.max`: Maximum query count across all slots (for chart Y-axis scaling)
- `data.max_read`: Maximum rows_read across all slots
- `data.max_written`: Maximum rows_written across all slots

**Implementation details:**
- Generated from 5-second aggregation window
- Aggregates data inserted into `_daily_stats`, `_daily_queries`, and `_query_log` tables
- Prefers analytics data (reducing load on server operations)

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

## Server-Side Caching & Parallelization

The admin dashboard loads five analytics endpoints in parallel:

- **Overview** (`/api/analytics/overview`)
- **Per-database overview** (`/api/analytics/:database/overview`)
- **Volume chart** (`/api/analytics/volume`)
- **Top queries** (`/api/analytics/top-queries`)
- **Errors** (`/api/analytics/errors`)

Instead of sequential `await` calls, all endpoints fire simultaneously via `Promise.allSettled()`, reducing load time by ~2-3x.

Additionally, the overview, databases, and volume endpoints use a server-side cache with a 60-second TTL. Subsequent requests within that window return cached `Response` objects directly, reducing SQLite query load to near zero.

## Daily Aggregation (Pre-computed Tables)

To power fast dashboard loading, analytics maintains two daily aggregation tables that are updated during the existing 5-second flush cycle:

### `_daily_stats`

Daily query counts per operation type. Used by the Databases dashboard panel to show per-database totals.

| Column | Description |
|---|---|
| `date` | Date string (`2026-06-30`) |
| `database_name` | Target database name |
| `database_id` | Stable UUID referencing the database (v3 migration) |
| `operation` | `select`, `insert`, `update`, `delete`, or `raw_query` |
| `count` | Query count for that operation on that day |
| `rows_read` | Rows returned for SELECT operations |

### `_daily_queries`

Daily query pattern aggregates. Used by the Top Queries panel.

| Column | Description |
|---|---|
| `date` | Date string (`2026-06-30`) |
| `database_name` | Target database name |
| `database_id` | Stable UUID referencing the database (v3 migration) |
| `sql_text` | SQL query text, or `NULL` for CRUD (e.g., `SELECT * FROM users WHERE active = ?`) |
| `count` | Query count for that text pattern on that day |
| `row_count` | Total rows returned across all matching queries |

These tables are upserted atomically with the query log flush (default every 5 seconds), staying within ~5 seconds of real-time and eliminating the need for expensive `GROUP BY` queries on the dashboard.

## Snapshot Timer

The storage snapshots are taken every 5 minutes via a scheduled timer:

- For every database in `_databases`, the server executes `PRAGMA page_count × PRAGMA page_size` and counts user tables (`CREATE TABLE` excluding internal `_*` tables)
- Data is written to `_storage_snapshots` with the database's `database_id` (v3 migration)
- No rollback logic — if the write fails, the snapshot timer continues on the next iteration

## Search

The analytics endpoints (queries, top-queries, errors) accept optional `?search=` query parameters:

- **Query Log:** Filters by exact `sql_text` match
- **Top Queries:** Filters by `sql_text` prefix match
- **Errors:** Filters by `error_msg` prefix match

Case-insensitive prefix matching (SQLite's `LIKE :search`).

**Example:** `GET /api/analytics/my-app/queries?search=SELECT%20*%20FROM` returns all queries starting with `SELECT * FROM`

## Permission Notes

- Volume endpoint (`/api/analytics/volume`) was historically incompatible with cross-database preview functionality due to timezone handling issues.
- Charts and cards APIs do not share the same generation logic, which can lead to counting discrepancies between the two views.
- The volume endpoint response schema was previously under-documented, contributing to confusion about expected data structure.
- Analytics data aggregation involves complex timezone considerations across different time windows.


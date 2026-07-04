---
title: Changelog — Boltstore
---

# Changelog

All notable changes to Boltstore are documented here.

## v1.0.3 - 2026-07-05

### Fixed

- **Analytics charts now show accurate data** — Fixed issues with volume endpoint and overview endpoint disagreeing on counts, corrected timezone offset handling near DST transitions, fixed 24h slot labels to include dates for clarity across midnight, and fixed 30d chart to properly aggregate all 7 days per weekly slot instead of only showing Sunday queries.
- **Volume endpoint uses pre-aggregated tables** — Queries now read from `_daily_stats` table instead of scanning raw `_query_log`, and top queries now query the pre-aggregated `_daily_queries` table for better performance.
- **Database delete properly cleans up analytics storage** — When a database is deleted, its analytics snapshots (`_storage_snapshots`, `_daily_stats`, `_daily_queries`, `_query_log`) are now properly removed, fixing inflated storage totals.
- **Analytics responses refresh automatically after import** — Analytics snapshot is now properly awaited during database import, eliminating the need to restart or manually refresh the admin dashboard to see imported database analytics.
- **Admin UI refreshes on mutations and navigation** — The admin dashboard refreshes data immediately after any database operation (create, import, delete, rename) and loads fresh state when navigating between pages, eliminating unnecessary network traffic while keeping the UI in sync with the server.
- **Response cache includes authentication information** — Cache keys now incorporate authentication data, preventing one user from seeing another user's cached responses.
- **Import clears stale cache data** — After successfully importing a database, the response cache is now cleared to prevent stale analytics data from being served.

### Changed

- **Universal refresh button in admin header** — Added a refresh button to the admin header that invalidates all caches and reloads the current page's data on demand.
- **Expanded 30d chart coverage** — The 30-day chart now covers 7 days (6 weekly slots) instead of 5, including the current incomplete week for complete historical view.
- **7d chart label alignment** — The 7-day chart now correctly anchors to current time and properly labels the rightmost slot with the start date.

### Security

- **Rate limiting implemented on admin endpoints** — Admin data endpoints now have rate limiting to prevent abuse.
- **ATTACH DATABASE path validation hardened** — Added stricter validation to prevent database path traversal attacks.
- **Password complexity requirements enforced** — Passwords must now meet minimum length and complexity requirements.

### Performance

- **Analytics buffer size limits** — Added configurable maximum buffer size to prevent unbounded memory growth.
- **Analytics cache size limits** — Added configurable maximum cache size with LRU eviction policy.
- **Reduced overhead in analytics snapshot calculations** — Optimized hot path operations and reduced unnecessary snapshot checks on overview and databases endpoints.

## v1.0.2 — 2026-06-30

### Changed

- **API keys now have full database access** — API keys can execute any SQL via `/query` (DDL, DML, `SELECT`, `PRAGMA`, `ATTACH`, etc.), manage config (`/config`), manage keys (`/keys`), export their database, view database details, view per-database analytics, and fetch batch schemas. Previously these operations required admin credentials. Import and database deletion remain admin-only.
- **Export accepts API keys** — `/api/databases/:name/export` now accepts a per-database API key alongside admin sessions.
- **UUID-based database identity (v3 migration)** — Databases now have a stable UUID (`id`) that survives renames. Child tables (`_api_keys`, analytics, activity) reference by UUID instead of name. On rename, only `_databases.name`, `_databases.file_path`, `_api_keys.database_name`, and analytics `database` columns are updated — all historical records carry over automatically.

### Fixed

- **Admin UI: 16 pre-existing type errors fixed** — Missing type re-exports in `client.ts`, `DataTable.vue` template ref callback, CSS module declaration in `env.d.ts`, implicit `any` params in `Activities.vue`, missing `group` field on `DatabaseInfo`, and removed unused `t.operation` reference in `DatabaseDetail.vue`.
- **Admin UI: Error feedback for rename database/table** — Renaming a database or table now shows validation errors inline in the UI instead of silently failing.
- **Admin UI: Activities page showing `[object Object]` in event column** — Config/settings update events store the full config objects in `details.from` and `details.to`. The `formatDetail` function coerced objects to `[object Object]` via template literals. Now shows `Changed: cors, read_only` for config updates, and falls back to listing detail keys for other object shapes.
- **Rename database 500 error** — After renaming, the old pool's SQLite connections still pointed at the deleted file. Now creates a new `DatabasePool` for the renamed file instead of reusing the closed one.
- **Rename database: analytics cache stale for up to 60s** — The analytics response cache was not invalidated on rename, so the dashboard showed the old name (or zeros) until the 60s TTL expired. Now invalidates all analytics caches immediately.
- **Rename database: activity log not updated** — `_activity_log.database_name` was not updated on rename, so the Activities page showed the old name for historical entries. Now updated alongside `_api_keys.database_name`.
- **Rename database: top queries showing old database name** — Analytics tables (`_daily_stats`, `_daily_queries`, `_query_log`, `_storage_snapshots`) were updated _after_ the meta rename, allowing concurrent requests to flush new rows under the new name and violate `UNIQUE(database, date, sql_text)`. Moved analytics UPDATE before the meta rename so no race is possible.
- **Search with multiple fields crashes with SQLite bind mismatch** — The record listing endpoint (`GET /api/databases/:db/tables/:table/records`) pushed 1 search bind value but generated N SQL placeholders (one per field). Now pushes one value per field, matching the placeholder count.
- **Analytics cache broken on first hit after startup** — Cached `Response` objects have single-use body streams, causing "Expected JSON but got : " errors on the second hit. Changed to cache raw data objects and reconstruct the response on each hit.

### Performance

- **Admin dashboard: 5 analytics endpoints now run in parallel** — The analytics page fetched overview, database stats, volume, top queries, and errors sequentially (5 sequential `await` calls). All 5 now fire simultaneously via `Promise.allSettled()`, reducing page load time by ~2-3x.
- **Server-side response caching** — Analytics overview, databases, and volume endpoints now cache responses in memory for 60 seconds (configurable TTL). Subsequent requests within the TTL window return cached `Response` objects directly, reducing SQLite query load to near zero.
- **Session token caching** — SHA-256 session lookups are cached for 60 seconds, reducing repeated `_sessions` table queries on every admin request.
- **Batch schema endpoint** — The database detail page now fetches all table schemas in a single `GET /api/databases/:db/tables/schema` call instead of N+1 sequential requests. Returns all `CREATE TABLE` statements in one response.
- **Pre-aggregated daily summary tables** — Analytics queries now read from `_daily_stats` and `_daily_queries` tables instead of scanning the raw `_query_log` on every dashboard load. Daily summaries are upserted during the existing 5-second flush cycle (no new timers or cron) and stay within ~5 seconds of real-time. Dashboard panel queries are drastically faster for large datasets, and pruning is handled in a single pass.

## v1.0.1 — 2026-06-28

### Fixed

- **Dashboard not found in Docker/npm (admin build missing)** — The Vue admin dashboard (`admin/dist/`) was not included in the Docker image or the npm package. Fixed by building the admin in the Dockerfile and adding `admin/dist` to `package.json` `files`.
- **Analytics storage showing 0 B on fresh databases** — Storage was only computed by the 5-minute snapshot timer. Newly imported/created databases showed `0 B` until the timer fired. Added on-demand `ensureSnapshot()` that computes `PRAGMA page_count × page_size` at query time if no snapshot exists yet.
- **Executable binary: missing admin dashboard** — The standalone binary (`bun build --compile`) bundles only the server code. The admin dashboard now ships as `admin-dist.tar.gz` alongside the binary, extracted by the install script to `dirname(process.execPath)/admin/dist/`.
- **Analytics > Top Queries column widths** — Database column was taking too much space; query column was cramped. Pinned Database column to `120px` and numeric columns to `10%` each. Query text now truncates with ellipsis when it exceeds the cell width instead of wrapping.
- **Analytics > Errors showing all entries** — The errors table displayed all 20 entries inline. Now shows only the top 5 with a "View All" button that opens a modal with the full list.
- **Database detail tabs broken on small screens** — Tabs overflowed the viewport on narrow screens. Made the tab bar horizontally scrollable and hid the SQLite info badge on small screens (`<sm`).
- **Dashboard overview refetching static data on range change** — Switching the time range (24h/7d/30d) re-fetched health, databases, and activity data unnecessarily. Split loading into static data (fetched once) and range-dependent data (refetched only on range change).
- **Volume chart x-axis not anchored to current time** — The 24h chart always showed static hours 00–23 regardless of the current time. The rightmost slot now aligns to the next time boundary (next hour for 24h, next midnight for 7d, next Sunday for 30d) using the browser's detected timezone (`Intl.DateTimeFormat`). DST and timezone offset changes are handled correctly.
- **Volume chart 30d only counting Sunday queries** — Weekly aggregation looked up only the start Sunday's daily bucket, missing queries from Monday–Saturday. Now iterates across all 7 days of each weekly slot and sums the daily counts.
- **Analytics > Errors not showing entries older than 24h** — The errors endpoint defaulted to `range=24h` when no range was passed, and the frontend never sent one. Switching to 7d/30d on the analytics page now passes the active range to the errors endpoint.
- **Database > Queries table truncating SQL** — The query column shared the same truncation CSS (ellipsis) as the Analytics overview, preventing users from reading full SQL on the database detail page. Split into two styles: `.top-queries-table` (overview, still truncates) and `.detail-queries-table` (database detail, wraps text).

### Changed

- **Docker: data persistence** — Switched from a Docker named volume (`boltstore-data`) to a bind mount (`./data:/app/data`) in `docker-compose.yml`. Data survives container/image deletion and is directly accessible on the host (macOS, Linux, Windows).
- **`package.json` prepublish** — Now builds the admin dashboard before publishing.
- **Volume chart: bar → line** — Small values (e.g., 10 next to 250) were nearly impossible to hover on a bar chart. Switched to a filled line chart with visible data points and `nearest` + `intersect: false` interaction so the tooltip triggers anywhere along the line.
- **Compact number formatting** — Large numbers (queries, writes, rows, error counts) across the dashboard now display as `1.5K`, `1.2M` instead of raw `1,500`, `1,234,007`. Added `formatCompact()` utility used in metric cards, database lists, top queries, and activity totals.

## v1.0.0 — 2026-06-25

Initial release.

### Features

- HTTP REST API for SQLite databases (CRUD, DDL, raw SQL)
- Multi-database isolation — each database gets its own SQLite file
- Admin dashboard (Vue 3 SPA) at `/dashboard`
- API key authentication (per-database) + admin sessions
- Database import/export (`.db` files via `VACUUM INTO`)
- Built-in analytics — query log and storage snapshots
- Per-database config (CORS, read-only mode, group)
- Audit logging for admin actions
- Deployment via standalone binary, `npm install -g`, or Docker

---
title: SDK Guide — Boltstore Docs
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">SDK</div>

# JavaScript SDK

The `@boltstore/client` SDK provides a type-safe, promise-based interface to interact with your Boltstore databases. HTTP-only — no realtime, no offline sync, no client-side cache. Works in Node.js, Bun, Deno, and browsers.

## Installation

<pre class="code-block"><span class="code-comment"># npm</span>
npm install @boltstore/client
<span class="code-comment"># yarn</span>
yarn add @boltstore/client
<span class="code-comment"># bun</span>
bun install @boltstore/client</pre>

## Initialization

<pre class="code-block"><span class="code-keyword">import</span> { BoltstoreClient } <span class="code-keyword">from</span> <span class="code-string">'@boltstore/client'</span>;
<span class="code-keyword">const</span> client = <span class="code-keyword">new</span> BoltstoreClient({
url: <span class="code-string">'http://localhost:8080'</span>,
database: <span class="code-string">'my-app'</span>,
key: <span class="code-string">'boltstore_...'</span>, <span class="code-comment">// per-database API key, or admin session token</span>
});
<span class="code-comment">// Update the key later</span>
client.setKey(<span class="code-string">'boltstore_...'</span>);</pre>

The `key` is sent as `Authorization: Bearer <key>` on every request. Use a per-database API key for data access, or an admin session token (from `POST /api/admin/login`) for admin methods.

## Tables

<pre class="code-block"><span class="code-comment">// List all tables</span>
<span class="code-keyword">const</span> tables = <span class="code-keyword">await</span> client.tables.list();
<span class="code-comment">// Create a table with column definitions</span>
<span class="code-keyword">await</span> client.tables.create(<span class="code-string">'posts'</span>, [
{ name: <span class="code-string">'id'</span>, type: <span class="code-string">'integer'</span>, primary_key: <span class="code-keyword">true</span>, auto_increment: <span class="code-keyword">true</span> },
{ name: <span class="code-string">'title'</span>, type: <span class="code-string">'text'</span>, nullable: <span class="code-keyword">false</span> },
{ name: <span class="code-string">'views'</span>, type: <span class="code-string">'integer'</span>, default: <span class="code-string">'0'</span> },
]);
<span class="code-comment">// Get table schema</span>
<span class="code-keyword">const</span> schema = <span class="code-keyword">await</span> client.tables.get(<span class="code-string">'posts'</span>);
<span class="code-comment">// Rename, add/drop columns</span>
<span class="code-keyword">await</span> client.tables.update(<span class="code-string">'posts'</span>, {
name: <span class="code-string">'articles'</span>,
add_columns: [{ name: <span class="code-string">'body'</span>, type: <span class="code-string">'text'</span> }],
});
<span class="code-comment">// Drop a table</span>
<span class="code-keyword">await</span> client.tables.delete(<span class="code-string">'articles'</span>);</pre>

## Typed Records

<pre class="code-block"><span class="code-keyword">const</span> posts = client.table&lt;{ id: number; title: string; views: number }&gt;(<span class="code-string">'posts'</span>);
<span class="code-comment">// Create</span>
<span class="code-keyword">const</span> created = <span class="code-keyword">await</span> posts.create({ title: <span class="code-string">'Hello World'</span>, views: <span class="code-number">0</span> });
<span class="code-comment">// Get by ID</span>
<span class="code-keyword">const</span> fetched = <span class="code-keyword">await</span> posts.get(created.id);
<span class="code-comment">// Update</span>
<span class="code-keyword">await</span> posts.update(created.id, { views: <span class="code-number">1</span> });
<span class="code-comment">// Delete</span>
<span class="code-keyword">await</span> posts.delete(created.id);
<span class="code-comment">// List with filter, sort, pagination</span>
<span class="code-keyword">const</span> result = <span class="code-keyword">await</span> posts.list({
filter: { title: <span class="code-string">'Hello'</span> }, <span class="code-comment">// exact match; use filter: { title__like: '%Hello%' } for pattern matching</span>
sort: <span class="code-string">'-id'</span>,
limit: <span class="code-number">10</span>,
offset: <span class="code-number">0</span>,
});</pre>

## Query Builder

<pre class="code-block"><span class="code-keyword">const</span> list = <span class="code-keyword">await</span> posts
.query()
.where(<span class="code-string">'title'</span>, <span class="code-string">'like'</span>, <span class="code-string">'Hello%'</span>)
.orWhere(<span class="code-string">'views'</span>, <span class="code-string">'gt'</span>, <span class="code-number">100</span>)
.orderBy(<span class="code-string">'id'</span>, <span class="code-string">'desc'</span>)
.limit(<span class="code-number">10</span>)
.get();
<span class="code-comment">// Select specific columns</span>
<span class="code-keyword">const</span> titles = <span class="code-keyword">await</span> posts.query().select(<span class="code-string">'id'</span>, <span class="code-string">'title'</span>).get();
<span class="code-comment">// Count rows (without fetching data)</span>
<span class="code-keyword">const</span> total = <span class="code-keyword">await</span> posts.query().where(<span class="code-string">'views'</span>, <span class="code-string">'gt'</span>, <span class="code-number">0</span>).count();
<span class="code-comment">// Get first match</span>
<span class="code-keyword">const</span> first = <span class="code-keyword">await</span> posts.query().where(<span class="code-string">'title'</span>, <span class="code-string">'eq'</span>, <span class="code-string">'Hello'</span>).first();
<span class="code-comment">// Paginate</span>
<span class="code-keyword">const</span> page = <span class="code-keyword">await</span> posts.query().paginate(<span class="code-number">1</span>, <span class="code-number">20</span>);</pre>

Supported operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `like`, `glob`.

## Raw SQL

<pre class="code-block"><span class="code-comment">// SELECT only for non-admin keys; DDL/DML requires admin</span>
<span class="code-keyword">const</span> rows = <span class="code-keyword">await</span> client.sql&lt;{ id: number; title: string }&gt;(
<span class="code-string">'SELECT id, title FROM posts WHERE views &gt; ? ORDER BY id'</span>,
[<span class="code-number">0</span>],
);</pre>

## Admin Operations

These methods require an admin session token:

<pre class="code-block"><span class="code-comment">// Database info / delete / export</span>
<span class="code-keyword">const</span> info = <span class="code-keyword">await</span> client.info();
<span class="code-keyword">await</span> client.delete();
<span class="code-keyword">const</span> blob = <span class="code-keyword">await</span> client.export();
<span class="code-comment">// Per-database config</span>
<span class="code-keyword">const</span> config = <span class="code-keyword">await</span> client.config.get();
<span class="code-keyword">await</span> client.config.update({ cors_origins: [<span class="code-string">'https://myapp.com'</span>] });
<span class="code-comment">// API key management</span>
<span class="code-keyword">const</span> keys = <span class="code-keyword">await</span> client.keys.list();
<span class="code-keyword">const</span> newKey = <span class="code-keyword">await</span> client.keys.create(<span class="code-string">'Production Backend'</span>);
<span class="code-keyword">await</span> client.keys.rotate(newKey.id);
<span class="code-keyword">await</span> client.keys.revoke(newKey.id);</pre>

## Health Check

<pre class="code-block"><span class="code-keyword">const</span> health = <span class="code-keyword">await</span> client.health();
<span class="code-comment">// { status: "ok", version: "1.0.0", databases: 3 }</span></pre>

## Authentication Model

The SDK holds a single `key` used for every request. Methods that hit admin routes (`info`, `delete`, `export`, `config.*`, `keys.*`) require an admin session token. Methods that hit data routes (`tables.*`, `table()`, `records`, `sql`) accept either a per-database API key or an admin credential.

If you only have a per-database API key, use `tables`, `table()`, `list`, and `sql()`. Calling `info()` or `keys.list()` will return `401 Unauthorized`.

## Known Issues

- **`PaginatedResult.total` may return current-page count.** In rare cases where the server doesn't return a valid `meta.total`, the SDK falls back to the current page's row count. Usually the server returns the correct total; this only affects edge cases.
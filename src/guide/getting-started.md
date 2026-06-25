---
title: Getting Started — Boltstore Docs
---

<div class="text-xs font-medium text-accent-400 uppercase tracking-wider mb-2">Introduction</div>

# Getting Started

Get up and running with Boltstore in under 5 minutes. This guide covers installation, starting the server, creating your first database, and making your first API request.

## Installation

Choose whichever method works best for you:

### Install Script (macOS / Linux)

<pre class="code-block"><span class="code-comment"># Download and install the latest binary</span>
curl -fsSL https://boltstore.dev/install.sh | bash</pre>

The script detects your OS and architecture, downloads the appropriate binary from [GitHub Releases](https://github.com/boltstore/boltstore/releases), and places it on your `PATH`.

### Download a Binary

Pre-built binaries are available on the [GitHub Releases](https://github.com/boltstore/boltstore/releases) page for:

| Platform | File |
|---|---|
| macOS (Apple Silicon) | `boltstore-darwin-arm64` |
| macOS (Intel) | `boltstore-darwin-x64` |
| Linux (x64) | `boltstore-linux-x64` |
| Windows (x64) | `boltstore-windows-x64.exe` |

Download the file for your platform, make it executable, and move it to your `PATH`:

<pre class="code-block"><span class="code-comment"># Example: macOS Apple Silicon</span>
chmod +x boltstore-darwin-arm64
<span class="code-keyword">sudo</span> mv boltstore-darwin-arm64 /usr/local/bin/boltstore</pre>

### Install via npm

If you have Node.js installed, you can install Boltstore globally via npm:

<pre class="code-block">npm install -g boltstore</pre>

### Run from Source

Requires [Bun](https://bun.sh) installed:

<pre class="code-block">git clone https://github.com/boltstore/boltstore.git
<span class="code-keyword">cd</span> boltstore/boltstore
bun install
bun run dev</pre>

### Docker

Build and run Boltstore from source using the included Dockerfile. This is useful for containerized deployments without needing Bun or Node installed locally:

<pre class="code-block"><span class="code-comment"># Clone the repo</span>
git clone https://github.com/boltstore/boltstore.git
<span class="code-keyword">cd</span> boltstore/boltstore
<span class="code-comment"># Build the image</span>
docker build -t boltstore .
<span class="code-comment"># Run the container with a data volume</span>
docker run -p 8080:8080 -v ./data:/app/data boltstore</pre>

The Dockerfile is a multi-stage build that compiles the TypeScript source with Bun and runs the production server on port 8080. Your databases are stored in `/app/data` inside the container — mount it as a volume to persist data across restarts.

## Start the Server

Start the Boltstore server with a single command. If no config file exists, one is auto-generated as `boltstore.yaml`:

<pre class="code-block">boltstore serve --port 8080 --db ./data
<span class="code-comment"># Server running on http://localhost:8080</span>
<span class="code-comment"># Dashboard available at http://localhost:8080/dashboard</span></pre>

Running from source:

<pre class="code-block">bun run boltstore serve</pre>

## Create the First Admin Account

Open `http://localhost:8080/dashboard` in your browser. On first run, the dashboard shows a "Create Admin Account" screen. Submit an email and password (min 8 chars) — the first admin is created with no auth required.

Subsequent admin creation requires either an existing admin session or the bootstrap key (`BOLTSTORE_ADMIN_KEY` env var). Treat the bootstrap key as a one-shot provisioning secret — set it during initial deployment, then unset it.

## Create Your First Database

Once logged into the dashboard, create a database from the UI, or via the API:

<pre class="code-block"><span class="code-comment"># Create a database (requires admin session token)</span>
curl -X POST http://localhost:8080/api/databases \
-H <span class="code-string">'Authorization: Bearer &lt;admin-session-token&gt;'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "my-app"}'</span></pre>

Database names must match `/^[a-z0-9][a-z0-9_-]*$/`.

## Create an API Key

Create a per-database API key for your application backend:

<pre class="code-block">curl -X POST http://localhost:8080/api/databases/my-app/keys \
-H <span class="code-string">'Authorization: Bearer &lt;admin-session-token&gt;'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"label": "My App Backend"}'</span>
<span class="code-comment"># Response — the raw key is returned only once</span>
{
<span class="code-string">"data"</span>: {
<span class="code-string">"id"</span>: <span class="code-string">"apk_..."</span>,
<span class="code-string">"label"</span>: <span class="code-string">"My App Backend"</span>,
<span class="code-string">"key"</span>: <span class="code-string">"boltstore_..."</span>
}
}</pre>

## Make Your First Request

Use the API key to create a table and insert records:

<pre class="code-block"><span class="code-comment"># Create a table</span>
curl -X POST http://localhost:8080/api/databases/my-app/tables \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "users", "columns": [{"name": "id", "type": "integer", "primary_key": true, "auto_increment": true}, {"name": "name", "type": "text", "nullable": false}, {"name": "email", "type": "text"}]}'</span>
<span class="code-comment"># Insert a record</span>
curl -X POST http://localhost:8080/api/databases/my-app/tables/users/records \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
-H <span class="code-string">'Content-Type: application/json'</span> \
-d <span class="code-string">'{"name": "Alice", "email": "alice@example.com"}'</span>
<span class="code-comment"># Query records</span>
curl http://localhost:8080/api/databases/my-app/tables/users/records \
-H <span class="code-string">'Authorization: Bearer boltstore_...'</span></pre>

## Using the SDK

For JavaScript/TypeScript applications, use the `@boltstore/client` SDK:

<pre class="code-block">npm install @boltstore/client</pre>

<br/> 

<pre class="code-block"><span class="code-keyword">import</span> { BoltstoreClient } <span class="code-keyword">from</span> <span class="code-string">'@boltstore/client'</span>;
<span class="code-keyword">const</span> client = <span class="code-keyword">new</span> BoltstoreClient({
url: <span class="code-string">'http://localhost:8080'</span>,
database: <span class="code-string">'my-app'</span>,
key: <span class="code-string">'boltstore_...'</span>,
});
<span class="code-comment">// Create a table</span>
<span class="code-keyword">await</span> client.tables.create(<span class="code-string">'users'</span>, [
{ name: <span class="code-string">'id'</span>, type: <span class="code-string">'integer'</span>, primary_key: <span class="code-keyword">true</span>, auto_increment: <span class="code-keyword">true</span> },
{ name: <span class="code-string">'name'</span>, type: <span class="code-string">'text'</span>, nullable: <span class="code-keyword">false</span> },
{ name: <span class="code-string">'email'</span>, type: <span class="code-string">'text'</span> },
]);
<span class="code-comment">// Typed record CRUD</span>
<span class="code-keyword">const</span> users = client.table&lt;{ id: number; name: string; email: string }&gt;(<span class="code-string">'users'</span>);
<span class="code-keyword">const</span> created = <span class="code-keyword">await</span> users.create({ name: <span class="code-string">'Alice'</span>, email: <span class="code-string">'alice@example.com'</span> });
<span class="code-keyword">const</span> list = <span class="code-keyword">await</span> users.query().where(<span class="code-string">'name'</span>, <span class="code-string">'like'</span>, <span class="code-string">'A%'</span>).limit(<span class="code-number">10</span>).get();
console.log(list);
<span class="code-comment">// See Filter Syntax in the API docs for all supported operators</span></pre>

Check out the [SDK Guide](/sdk/overview) for the full API reference.
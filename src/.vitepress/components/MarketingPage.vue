<template>
  <div class="marketing-page">
    <!-- Hero -->
    <section style="position: relative; padding-top: 8rem; padding-bottom: 5rem; overflow: hidden; background: var(--bg-base);">
      <div style="background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,191,255,0.12), transparent); position: absolute; inset: 0; pointer-events: none;"></div>
      <div style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px); background-size: 60px 60px; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;"></div>
      <canvas id="heroCanvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.7; z-index: 1;"></canvas>
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 10;">
        <div style="max-width: 48rem; margin: 0 auto; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 9999px; background: rgba(0,79,102,0.2); border: 1px solid rgba(0,79,102,0.3); color: var(--accent-400); font-size: 0.875rem; font-weight: 500; margin-bottom: 2.5rem;">
            <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--accent-400); display: inline-block;"></span>
            Open Source & Free Forever
          </div>
          <h1 style="font-size: clamp(2.25rem, 6vw, 4.5rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1.5rem;">
            <span style="background: linear-gradient(135deg, #26c9ff, #00bfff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">SQLite</span> Database<br>Platform
          </h1>
          <p style="font-size: 1.25rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2.5rem; max-width: 36rem; margin-left: auto; margin-right: auto;">
            Self-hostable, managed SQLite with an HTTP API and JavaScript SDK. Create databases in seconds, query from anywhere, run anywhere.
          </p>
          <div @click="copyInstallCmd" style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer; transition: border-color 0.15s;" title="Click to copy">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>{{ installCmdText }}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="/guide/getting-started" class="btn-primary" style="padding: 0.875rem 1.75rem; font-size: 1rem; border-radius: 8px; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-weight: 500;">
              Get Started
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a href="/guide/overview" class="btn-secondary" style="padding: 0.875rem 1.75rem; font-size: 1rem; border-radius: 8px; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-weight: 500;">Documentation</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Preview -->
    <section style="padding: 3rem 0; position: relative;">
      <div style="max-width: 64rem; margin: 0 auto; padding: 0 1.5rem;">
        <div style="border-radius: 12px; border: 1px solid var(--border-default); background: rgba(15,15,15,0.5); overflow: hidden; box-shadow: 0 0 40px rgba(0,191,255,0.12);">
          <div style="display: flex; align-items: center; gap: 0.375rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-default); background: rgba(20,20,20,0.5);">
            <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #ff5f57;"></div>
            <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #febc2e;"></div>
            <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #28c840;"></div>
            <div style="margin-left: 1rem; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">dashboard.boltstore.local</div>
          </div>
          <div style="padding: 1.5rem;">
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
              <span style="padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 500; border-radius: 6px; background: rgba(0,163,219,0.2); color: var(--accent-400); border: 1px solid rgba(0,163,219,0.3);">Databases</span>
              <span style="padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 500; border-radius: 6px; background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-default);">Analytics</span>
              <span style="padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 500; border-radius: 6px; background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-default);">Settings</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="feature-card" style="padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Storage</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">14.79 MB</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">of 10 GB free</div>
              </div>
              <div class="feature-card" style="padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Rows Read</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">528,001,446</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">last 24 hours</div>
              </div>
              <div class="feature-card" style="padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Avg Latency</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">12ms</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">p95: 34ms</div>
              </div>
            </div>
            <div class="feature-card" style="padding: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 1rem 1rem 0 1rem;">
                <div style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">Query Volume</div>
                <div style="display: flex; gap: 0.25rem;">
                  <button style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--border-default); background: var(--bg-hover); color: var(--text-muted); cursor: pointer;">1h</button>
                  <button style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid rgba(0,163,219,0.3); background: rgba(0,163,219,0.2); color: var(--accent-400); cursor: pointer;">24h</button>
                  <button style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--border-default); background: var(--bg-hover); color: var(--text-muted); cursor: pointer;">7d</button>
                  <button style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--border-default); background: var(--bg-hover); color: var(--text-muted); cursor: pointer;">30d</button>
                </div>
              </div>
              <div style="display: flex; align-items: flex-end; gap: 2px; height: 8rem; padding: 0 1rem 1rem 1rem;">
                <div v-for="h in barHeights" :key="h" :style="{ flex: '1', background: 'rgba(0,163,219,0.3)', borderRadius: '4px 4px 0 0', height: h + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" style="padding: 6rem 0; position: relative;">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1.5rem;">
        <div style="text-align: center; margin-bottom: 4rem;">
          <h2 style="font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.025em;">Built for Modern Developers</h2>
          <p style="color: var(--text-secondary); font-size: 1.125rem;">Everything you need to ship fast, from local development to production deployment.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">Instant Databases</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">Create a new SQLite database in under a second. No provisioning, no configuration, just a single API call.</p>
          </div>
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">HTTP API</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">Query your database from any runtime — Edge, Node, Deno, Bun. RESTful endpoints with JSON responses.</p>
          </div>
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">JavaScript SDK</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">TypeScript-first client with typed records, a query builder, and raw SQL support.</p>
          </div>
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">Per-Database Auth</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">API keys scoped to individual databases. CORS origins, read-only flags, and config per database.</p>
          </div>
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">Import & Export</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">Standard SQLite dump and restore. Migrate in and out at any time. Your data is always portable.</p>
          </div>
          <div class="feature-card card-hover">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: 8px; background: rgba(0,163,219,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-400);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>
            </div>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">Analytics</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">Query counts, storage size, request rates, and error rates per database. Monitor everything from the dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example -->
    <section style="padding: 5rem 0 7rem; position: relative;">
      <div style="max-width: 72rem; margin: 0 auto; padding: 0 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
          <div>
            <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.025em;">Query in seconds</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; font-size: 1.125rem;">
              Connect to your database with a simple HTTP client. No drivers, no connection strings, no ORM required. Just fetch and go.
            </p>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
              <li style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" fill="none" stroke="var(--accent-400)" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 0.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">Works on Node.js, Bun, Deno, and browsers</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" fill="none" stroke="var(--accent-400)" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 0.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">TypeScript types included</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" fill="none" stroke="var(--accent-400)" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 0.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">Typed records with query builder</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" fill="none" stroke="var(--accent-400)" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 0.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">Raw SQL with parameterised queries</span>
              </li>
            </ul>
          </div>
          <div>
            <div style="display: flex; gap: 1px; border-bottom: 1px solid var(--border-default); margin-bottom: 0.75rem;">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-btn', { active: activeTab === tab.id }]"
              >{{ tab.label }}</button>
            </div>
            <div style="position: relative; min-height: 480px; margin-bottom: 2rem;">
              <div v-show="activeTab === 'js'" class="code-block" style="position: absolute; top: 0; left: 0; right: 0;">
                <pre style="margin: 0;"><span class="code-keyword">import</span> { BoltstoreClient } <span class="code-keyword">from</span> <span class="code-string">'@boltstore/client'</span>;

<span class="code-keyword">const</span> client = <span class="code-keyword">new</span> BoltstoreClient({
  url: <span class="code-string">'http://localhost:8080'</span>,
  database: <span class="code-string">'myapp'</span>,
  key: <span class="code-string">'boltstore_...'</span>,
});

<span class="code-comment">// Query records</span>
<span class="code-keyword">const</span> users = <span class="code-keyword">await</span> client.table(<span class="code-string">'users'</span>).query()
  .where(<span class="code-string">'active'</span>, <span class="code-string">'eq'</span>, <span class="code-keyword">true</span>)
  .orderBy(<span class="code-string">'created'</span>, <span class="code-string">'desc'</span>)
  .limit(<span class="code-number">10</span>)
  .get();

<span class="code-comment">// Run raw SQL</span>
<span class="code-keyword">const</span> rows = <span class="code-keyword">await</span> client.sql(<span class="code-string">'SELECT * FROM users WHERE created &gt; ?'</span>, [<span class="code-string">'2026-06-01'</span>]);

console.log(rows);</pre>
              </div>
              <div v-show="activeTab === 'curl'" class="code-block" style="position: absolute; top: 0; left: 0; right: 0;">
                <pre style="margin: 0;"><span class="code-comment"># Create a database</span>
curl -X POST http://localhost:8080/api/databases \
  -H <span class="code-string">'Authorization: Bearer &lt;admin-session-token&gt;'</span> \
  -H <span class="code-string">'Content-Type: application/json'</span> \
  -d <span class="code-string">'{"name": "app-prod"}'</span>

<span class="code-comment"># Query records</span>
curl http://localhost:8080/api/databases/app-prod/tables/users/records \
  -H <span class="code-string">'Authorization: Bearer boltstore_...'</span>

<span class="code-comment"># Run raw SQL</span>
curl -X POST http://localhost:8080/api/databases/app-prod/query \
  -H <span class="code-string">'Authorization: Bearer boltstore_...'</span> \
  -H <span class="code-string">'Content-Type: application/json'</span> \
  -d <span class="code-string">'{"sql": "SELECT * FROM users", "params": []}'</span></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Source -->
    <section style="padding: 5rem 0; border-top: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default); background: rgba(15,15,15,0.3);">
      <div style="max-width: 48rem; margin: 0 auto; padding: 0 1.5rem; text-align: center;">
        <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.025em;">Free & Open Source</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; font-size: 1.125rem;">
          Boltstore is MIT licensed and available on GitHub. Self-host it, fork it, or contribute. No vendor lock-in, no hidden fees, no surprise bills.
        </p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
          <a href="https://github.com/boltstore/boltstore" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 500; border-radius: 8px; text-decoration: none;">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Star on GitHub
          </a>
          <a href="/guide/overview" style="color: var(--accent-400); font-weight: 500; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.25rem; text-decoration: none;">
            Read the docs
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="border-top: 1px solid var(--border-default); padding: 3rem 0; background: var(--bg-surface);">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1.5rem;">
        <div style="display: flex; flex-direction: row; justify-content: space-between; gap: 2rem; margin-bottom: 2rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="6" fill="#080c14"/>
                <g transform="translate(14, 13)">
                  <rect x="-11" y="-4" width="22" height="2" rx="1" fill="#00d4ff" opacity="0.35"/>
                  <rect x="-11" y="0" width="22" height="2" rx="1" fill="#00d4ff" opacity="0.25"/>
                  <rect x="-11" y="4" width="22" height="2" rx="1" fill="#00d4ff" opacity="0.15"/>
                  <path d="M-2 -9 L7 1 L1 1 L4 11 L-7 0 L-2 0 Z" fill="#00d4ff"/>
                </g>
              </svg>
              <span style="font-weight: 600; color: var(--text-primary);">Boltstore</span>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Self-hostable SQLite database platform with HTTP API and JavaScript SDK.</p>
          </div>
          <div>
            <h4 style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-primary);">Project</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><a href="/guide/overview" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none; transition: color 0.15s;">Documentation</a></li>
              <li><a href="https://github.com/boltstore/boltstore" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none; transition: color 0.15s;">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-primary);">Resources</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><a href="/guide/getting-started" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none; transition: color 0.15s;">Getting Started</a></li>
              <li><a href="/api/overview" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none; transition: color 0.15s;">API Reference</a></li>
              <li><a href="/sdk/overview" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none; transition: color 0.15s;">SDK Guide</a></li>
            </ul>
          </div>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 1.5rem; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1rem;">
          <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">2026 Boltstore. MIT Licensed.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const installCmdText = ref('curl -fsSL https://boltstore.dev/install.sh | sh')

function copyInstallCmd() {
  navigator.clipboard.writeText('curl -fsSL https://boltstore.dev/install.sh | sh')
  installCmdText.value = 'Copied!'
  setTimeout(() => { installCmdText.value = 'curl -fsSL https://boltstore.dev/install.sh | sh' }, 2000)
}

const activeTab = ref('js')
const tabs = [
  { id: 'js', label: 'JavaScript' },
  { id: 'curl', label: 'cURL' },
]

const barHeights = [40, 65, 45, 80, 55, 70, 60, 90, 75, 50, 85, 65, 70, 55, 80, 60, 45, 75, 50, 85, 95, 70, 55, 80]

onMounted(() => {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var width, height, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  var colors = ['rgba(0,191,255,0.35)', 'rgba(38,201,255,0.25)', 'rgba(0,163,219,0.30)', 'rgba(0,191,255,0.15)'];

  var nodeCount = 60;
  var nodes = [];
  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 1, color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.02 + Math.random() * 0.03
    });
  }

  var shapeCount = 8;
  var shapes = [];
  for (var i = 0; i < shapeCount; i++) {
    shapes.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      size: 15 + Math.random() * 25, rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      type: Math.random() > 0.5 ? 'hex' : 'tri',
      opacity: 0.06 + Math.random() * 0.06, color: colors[Math.floor(Math.random() * 2)]
    });
  }

  var ringCount = 3;
  var rings = [];
  for (var i = 0; i < ringCount; i++) {
    rings.push({
      x: width * (0.2 + Math.random() * 0.6), y: height * (0.2 + Math.random() * 0.6),
      radius: 40 + Math.random() * 80, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      opacity: 0.04 + Math.random() * 0.04, pulseSpeed: 0.005 + Math.random() * 0.01
    });
  }

  var time = 0;
  var mouse = { x: width / 2, y: height / 2, active: false };
  canvas.parentElement.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
  }, { passive: true });
  canvas.parentElement.addEventListener('mouseleave', function() { mouse.active = false; }, { passive: true });

  function drawHex(x, y, r, rot, color, opacity) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i - Math.PI / 6;
      var px = Math.cos(angle) * r, py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, opacity + ')'); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  }

  function drawTri(x, y, r, rot, color, opacity) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (var i = 0; i < 3; i++) {
      var angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
      var px = Math.cos(angle) * r, py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, opacity + ')'); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  }

  function drawRing(x, y, r, opacity) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,191,255,' + opacity + ')'; ctx.lineWidth = 0.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,191,255,' + (opacity * 0.5) + ')'; ctx.stroke();
  }

  function drawConnection(a, b, opacity) {
    var dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 180) return;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    var alpha = (1 - dist / 180) * opacity * 0.3;
    ctx.strokeStyle = 'rgba(0,191,255,' + alpha + ')'; ctx.lineWidth = 0.5; ctx.stroke();
  }

  function animate() {
    time += 1;
    ctx.clearRect(0, 0, width, height);

    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r];
      ring.x += ring.vx; ring.y += ring.vy;
      if (ring.x < 0 || ring.x > width) ring.vx *= -1;
      if (ring.y < 0 || ring.y > height) ring.vy *= -1;
      var pulse = 1 + Math.sin(time * ring.pulseSpeed) * 0.1;
      drawRing(ring.x, ring.y, ring.radius * pulse, ring.opacity);
    }

    for (var s = 0; s < shapes.length; s++) {
      var shape = shapes[s];
      shape.x += shape.vx; shape.y += shape.vy;
      if (shape.x < -50 || shape.x > width + 50) shape.vx *= -1;
      if (shape.y < -50 || shape.y > height + 50) shape.vy *= -1;
      shape.rotation += shape.rotSpeed;
      if (shape.type === 'hex') drawHex(shape.x, shape.y, shape.size, shape.rotation, shape.color, shape.opacity);
      else drawTri(shape.x, shape.y, shape.size, shape.rotation, shape.color, shape.opacity);
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        drawConnection(nodes[i], nodes[j], 1);
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.x += node.vx; node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      node.pulse += node.pulseSpeed;
      var size = node.size * (1 + Math.sin(node.pulse) * 0.3);
      ctx.beginPath(); ctx.arc(node.x, node.y, size, 0, Math.PI * 2); ctx.fillStyle = node.color; ctx.fill();
    }

    if (mouse.active) {
      for (var i = 0; i < nodes.length; i++) {
        var dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) { var force = (120 - dist) / 120 * 0.8; nodes[i].x += (dx / dist) * force; nodes[i].y += (dy / dist) * force; }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})
</script>

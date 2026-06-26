---
title: Production Deployment — Boltstore Docs
---

# Deploying Boltstore in Production

A step-by-step guide for each installation method: binary, npm, or Docker.

---

## Choose Your Installation

| Method | Good for | Runtime needed |
|--------|----------|----------------|
| **Binary** | VPS, bare metal, no dependencies | None (self-contained) |
| **npm** | Already have Bun on the server | Bun |
| **Docker** | Containerized infrastructure | Docker |

---

## Method 1: Binary (Shell Script or Manual)

### Install via shell script

```bash
curl -fsSL https://boltstore.dev/install.sh | sh
```

The script detects your OS and architecture, downloads the correct binary from GitHub Releases, and installs it to `/usr/local/bin/boltstore`. For a specific version:

```bash
curl -fsSL https://boltstore.dev/install.sh | sh -s -- --version v1.0.0
```

### Install manually

Download from [GitHub Releases](https://github.com/boltstore/boltstore/releases):

```bash
# macOS Apple Silicon
curl -fsSL -o boltstore https://github.com/boltstore/boltstore/releases/latest/download/boltstore-darwin-arm64
chmod +x boltstore
sudo mv boltstore /usr/local/bin/

# Linux x86_64
curl -fsSL -o boltstore https://github.com/boltstore/boltstore/releases/latest/download/boltstore-linux-x64
chmod +x boltstore
sudo mv boltstore /usr/local/bin/
```

### Where things are

| Item | Default location |
|------|-----------------|
| Binary | `/usr/local/bin/boltstore` |
| Data directory | `./data` (relative to working directory) — configure with `DATABASE_PATH` |
| Config file | `./boltstore.yaml` or `./boltstore.json` |

**Set a fixed data directory for production:**

```bash
sudo mkdir -p /var/lib/boltstore
sudo chown $USER:$USER /var/lib/boltstore
cd /var/lib/boltstore
```

### Configure

Create `boltstore.yaml` in your data directory:

```yaml
port: 8080
databasePath: /var/lib/boltstore
logLevel: info
adminKey: "your-strong-random-key"
maxBodySize: 10
requestTimeoutMs: 30000

# Restrict CORS in production
corsOrigins:
  - "https://myapp.com"

# Trust your reverse proxy
trustedProxies:
  - "127.0.0.1"
```

Or use environment variables:

```bash
export PORT=8080
export BOLTSTORE_ADMIN_KEY="your-strong-random-key"
export DATABASE_PATH="/var/lib/boltstore"
```

Generate a strong admin key:

```bash
openssl rand -base64 48 | tr -d '\n' && echo
```

> The admin key is single-use. Create your first admin account via the dashboard or `POST /api/admin/setup` immediately after starting. Once consumed, additional admins require an existing admin session.

### Run it

**Foreground (test):**

```bash
cd /var/lib/boltstore
boltstore serve
```

**Daemon with systemd** — see [Systemd Service](#systemd-service) below.

---

## Method 2: npm

### Install

Requires [Bun](https://bun.sh) on the server:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then install Boltstore globally:

```bash
npm install -g boltstore
```

Verify:

```bash
boltstore --help
```

### Where things are

| Item | Default location |
|------|-----------------|
| Command | Global npm bin (`$(npm root -g)/../bin/boltstore`) |
| Data directory | `./data` (configure with `DATABASE_PATH`) |
| Config | Same as binary — `boltstore.yaml` or env vars |

### Configure and run

Same as Method 1. Create `/var/lib/boltstore`, set up `boltstore.yaml`, and run:

```bash
cd /var/lib/boltstore
boltstore serve
```

Use systemd to daemonize — see [Systemd Service](#systemd-service) below.

---

## Method 3: Docker (build from source)

Boltstore ships with a `Dockerfile` and `docker-compose.yml`. Clone the repo, build the image, and run it.

```bash
git clone https://github.com/boltstore/boltstore.git
cd boltstore
docker compose up -d
```

The shipped `docker-compose.yml` is production-ready out of the box — it handles port binding, volume persistence, health checks, and restart policies. You only need to set the admin key:

```bash
BOLTSTORE_ADMIN_KEY="your-key" docker compose up -d
```

### Customizing

Override defaults with environment variables in `docker-compose.yml` or pass them inline:

```bash
BOLTSTORE_ADMIN_KEY="your-key" \
CORS_ORIGINS="https://myapp.com" \
docker compose up -d
```

Available env vars: `PORT`, `DATABASE_PATH`, `LOG_LEVEL`, `BOLTSTORE_ADMIN_KEY`, `CORS_ORIGINS`, `CORS_METHODS`, `CORS_HEADERS`, `TRUSTED_PROXIES`.

### Where things are

| Item | Location |
|------|---------|
| Data | Docker volume `boltstore-data` → `/app/data` in container |
| Config | Environment variables |
| Port | Binds to `8080` — place behind a reverse proxy (see below) |

---

## Systemd Service

For binary and npm installations only. Docker handles daemonizing via `docker compose up -d`.

Create `/etc/systemd/system/boltstore.service`:

```ini
[Unit]
Description=Boltstore — SQLite Database-as-a-Service
After=network.target

[Service]
Type=simple
User=boltstore
Group=boltstore
WorkingDirectory=/var/lib/boltstore
ExecStart=/usr/local/bin/boltstore serve
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/boltstore
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable boltstore --now
sudo systemctl status boltstore
```

---

## Reverse Proxy

Boltstore speaks plain HTTP. Always place it behind a reverse proxy for HTTPS.

### Caddy

Install Caddy on your server:

```bash
# Debian / Ubuntu
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/deb.debian.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

Create `/etc/caddy/Caddyfile`:

```caddyfile
api.myapp.com {
    reverse_proxy localhost:8080
}
```

Start it:

```bash
sudo systemctl enable caddy --now
```

Caddy auto-provisions Let's Encrypt TLS certificates.

### nginx

Install nginx:

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d api.myapp.com
```

Edit `/etc/nginx/sites-available/boltstore`:

```nginx
server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    ssl_certificate     /etc/letsencrypt/live/api.myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.myapp.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
        client_max_body_size 100m;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/boltstore /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Docker

The shipped `docker-compose.yml` binds boltstore to port `8080`. Point your host-level Caddy or nginx reverse proxy at `localhost:8080` — same config as above.

---

## Rate Limiting

Boltstore has built-in rate limiting for **auth endpoints only**:

| Endpoint | Limit |
|----------|-------|
| Login / Setup | 5 attempts per 15 minutes per IP |
| API key verification | 20 attempts per minute per IP per database |

**Data endpoints (records, tables, query) are intentionally unthrottled.** Boltstore is a server-to-server DBaaS — API keys are issued to developers, not end users. Throttling data operations would harm legitimate backend workloads.

If you want rate limiting on data endpoints, add it at the reverse proxy level:

**nginx:**

```nginx
# In http block
limit_req_zone $binary_remote_addr zone=boltstore_data:10m rate=600r/m;

# In server block
location /api/databases/ {
    limit_req zone=boltstore_data burst=100 nodelay;
    limit_req_status 429;
    proxy_pass http://127.0.0.1:8080;
    # ... rest of proxy settings
}
```

**Caddy:**

```caddyfile
api.myapp.com {
    rate_limit {
        zone dynamic {
            key {remote_host}
            events 600
            window 1m
        }
    }
    reverse_proxy localhost:8080
}
```

---

## Backups

SQLite databases using WAL mode can be copied safely while the server is running.

### Option A: Simple file copy (cron)

```bash
#!/bin/bash
# Save as /etc/cron.daily/boltstore-backup

BACKUP_DIR="/backups/boltstore/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"
cp /var/lib/boltstore/*.db "$BACKUP_DIR/"

# Keep only the last 7 days
find /backups/boltstore -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;
```

```bash
sudo chmod +x /etc/cron.daily/boltstore-backup
```

### Option B: sqlite3 .backup (zero-downtime)

```bash
#!/bin/bash
# Save as /etc/cron.daily/boltstore-backup

BACKUP_DIR="/backups/boltstore/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

for db in /var/lib/boltstore/*.db; do
    name=$(basename "$db" .db)
    sqlite3 "$db" ".backup $BACKUP_DIR/$name-$(date +%H%M).db"
done

find /backups/boltstore -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;
```

For Docker, run the backup from the host targeting the volume mount, or use `docker exec`:

```bash
docker exec boltstore sh -c 'sqlite3 /app/data/myapp.db ".backup /tmp/backup.db"'
docker cp boltstore:/tmp/backup.db ./myapp-$(date +%Y-%m-%d).db
```

---

## Monitoring

### Health check

```bash
curl -s https://api.myapp.com/api/health | jq
# { "status": "ok", "version": "1.0.0", "databases": 5 }
```

### Logs

```bash
# systemd (binary and npm)
journalctl -u boltstore -f --output=cat

# Docker
docker logs -f boltstore
```

### Key metrics to watch

| Metric | How |
|--------|-----|
| Disk space | `df -h /var/lib/boltstore` |
| Database count | `/api/health` |
| Memory usage | `htop` or `docker stats` |
| Response time | nginx/Caddy access logs |

---

## Security Checklist

| Step | Notes |
|------|-------|
| ☐ Generate a strong `adminKey` | `openssl rand -base64 48` |
| ☐ Create first admin account immediately | POST /api/admin/setup via dashboard |
| ☐ Set `CORS_ORIGINS` to your domain | Never use `*` in production |
| ☐ Configure `TRUSTED_PROXIES` | Your reverse proxy IP(s) |
| ☐ Run as non-root user | `boltstore` system user |
| ☐ Restrict data dir permissions | `chmod 700 /var/lib/boltstore` |
| ☐ Place behind HTTPS reverse proxy | Caddy or nginx with Let's Encrypt |
| ☐ Set up daily backups | cron + cp or sqlite3 .backup |
| ☐ Monitor disk usage | Alert at 80% |
| ☐ Restrict firewall | Only expose proxy ports 80/443, not 8080 |

---

## Upgrade

### Binary

```bash
# Stop the service
sudo systemctl stop boltstore

# Download and install the new version
curl -fsSL https://boltstore.dev/install.sh | sh

# Restart
sudo systemctl start boltstore
```

### npm

```bash
sudo systemctl stop boltstore
npm update -g boltstore
sudo systemctl start boltstore
```

### Docker

```bash
cd /path/to/boltstore
git pull origin main
docker compose up -d --build
```

Always check the [changelog](https://github.com/boltstore/boltstore/releases) for breaking changes between versions.

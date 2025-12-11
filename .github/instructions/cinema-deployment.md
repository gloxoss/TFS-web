# 🚀 Deployment & Operations Guide
## Cinema Equipment Rental Platform

---

## 1. Pre-Deployment Checklist

Before going live, ensure:

- [ ] All code committed to Git
- [ ] Environment variables set (`.env.production`)
- [ ] Database backups configured
- [ ] SSL certificates valid
- [ ] DNS pointing to production VPS
- [ ] Admin account created with strong password
- [ ] Client provided with credentials
- [ ] Monitoring/alerting set up
- [ ] Runbook created (this document)

---

## 2. Deployment Architecture

### 2.1 Final Production Setup

```
┌─────────────────────────────────────┐
│     Hostinger VPS (Production)      │
│     Ubuntu 22.04 LTS                │
│     4GB RAM / 100GB SSD             │
└─────────────────────────────────────┘
        │                   │
        │                   │
   ┌────▼────┐         ┌────▼────┐
   │PocketBase│         │ Next.js │
   │Port 8090 │         │Port 3000│
   │SQLite DB │         │  Node   │
   └────┬─────┘         └────┬────┘
        │                    │
        └────────┬───────────┘
                 │
        ┌────────▼────────┐
        │ Nginx Reverse   │
        │ Proxy (Port 80) │
        │ SSL/TLS (443)   │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Internet Users  │
        │ domain.com      │
        └─────────────────┘
```

### 2.2 DNS Configuration

```
domain.com          A record → VPS IP (e.g., 1.2.3.4)
api.domain.com      A record → Same VPS IP (or CNAME to domain.com)
www.domain.com      CNAME → domain.com
```

---

## 3. Installation Steps (First-Time Deployment)

### 3.1 SSH into VPS

```bash
ssh root@your-vps-ip
# Or use your Hostinger control panel for console access

# Verify OS
cat /etc/os-release  # Should show Ubuntu 22.04+
```

### 3.2 Install System Dependencies

```bash
apt update && apt upgrade -y
apt install -y curl wget zip unzip git openssh-server openssh-client htop
apt install -y docker.io docker-compose  # If using Docker
```

### 3.3 Setup PocketBase (Option A: Standalone Systemd)

```bash
# Create directory
mkdir -p /opt/pocketbase
cd /opt/pocketbase

# Download latest PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_*.zip
rm pocketbase_*.zip

# Make executable
chmod +x ./pocketbase

# Test run
./pocketbase serve
# You should see: "Server started at http://0.0.0.0:8090"
# Press Ctrl+C to stop
```

### 3.4 Create Systemd Service for PocketBase

Create `/etc/systemd/system/pocketbase.service`:

```ini
[Unit]
Description=PocketBase Backend Service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=5
User=root
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http=0.0.0.0:8090

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
systemctl daemon-reload
systemctl enable pocketbase
systemctl start pocketbase

# Verify running
systemctl status pocketbase
curl http://127.0.0.1:8090/_/  # Should respond (admin UI)
```

### 3.5 Setup Next.js (Option B: Node Process with PM2)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify
node --version  # v20.x
npm --version

# Create directory for Next.js app
mkdir -p /var/www/cinema-rental
cd /var/www/cinema-rental

# Clone your repo (or upload via SFTP)
git clone https://github.com/yourusername/cinema-rental.git .
# Or: scp -r ./cinema-rental/* root@your-vps-ip:/var/www/cinema-rental/

# Install dependencies
npm install

# Build
npm run build

# Install PM2 globally
npm install -g pm2

# Start Next.js with PM2
pm2 start npm --name "nextjs" -- start

# Setup PM2 to start on reboot
pm2 startup systemd -u root --hp /root
pm2 save

# Verify running
pm2 status
curl http://127.0.0.1:3000/  # Should respond with HTML
```

### 3.6 Setup Nginx Reverse Proxy

Install Nginx:

```bash
apt install -y nginx
```

Create `/etc/nginx/sites-available/cinema-rental`:

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

upstream pocketbase {
    server 127.0.0.1:8090;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name domain.com www.domain.com api.domain.com;
    return 301 https://$host$request_uri;
}

# Main site HTTPS
server {
    listen 443 ssl http2;
    server_name domain.com www.domain.com;

    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    # Modern SSL config
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 100M;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}

# API (PocketBase) HTTPS
server {
    listen 443 ssl http2;
    server_name api.domain.com;

    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 100M;

    location / {
        proxy_pass http://pocketbase;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Enable and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/cinema-rental /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site

# Test config
nginx -t  # Should show "test successful"

# Restart
systemctl restart nginx
```

### 3.7 Setup SSL with Let's Encrypt (Certbot)

```bash
apt install -y certbot python3-certbot-nginx

# Generate certificate (interactive)
certbot certonly --standalone -d domain.com -d www.domain.com -d api.domain.com

# You'll be prompted for email and to agree to terms
# Certificates saved to /etc/letsencrypt/live/domain.com/

# Test auto-renewal
certbot renew --dry-run

# Certificates auto-renew via systemd timer
systemctl status certbot.timer
```

### 3.8 Set Environment Variables

Create `/var/www/cinema-rental/.env.production`:

```bash
# Next.js
NEXT_PUBLIC_POCKETBASE_URL=https://api.domain.com
NODE_ENV=production

# PocketBase (if needed as env vars)
# PocketBase reads from: /opt/pocketbase/.env or uses defaults
```

For PocketBase admin, you'll set credentials during first login to the admin UI.

### 3.9 Verify Services Running

```bash
# Check all services
systemctl status pocketbase
pm2 status
systemctl status nginx

# View logs
journalctl -u pocketbase -f  # PocketBase logs
pm2 logs nextjs  # Next.js logs
tail -f /var/log/nginx/error.log  # Nginx logs

# Test external access
curl https://domain.com  # Should return HTML
curl https://api.domain.com/_/  # Should return admin UI
```

---

## 4. Post-Deployment Configuration

### 4.1 PocketBase Admin Setup

1. **Open `https://api.domain.com/_/` in browser**
2. **Create Admin Account:**
   - Email: `admin@yourdomain.com`
   - Password: *(Strong password, store securely)*
3. **Import Collections** (if not seeded):
   - Go to **Collections** → Create `equipment`, `quotes`, `posts`
   - Define fields as per TDD document
4. **Seed Sample Data:**
   - Add 10-20 equipment items with images
   - Ensure `visibility = true` for public items
5. **Set API Rules:**
   - Equipment: Public read, admin write
   - Quotes: Public create, admin read/update
   - Posts: Public read, admin write

### 4.2 Create Admin User Account

**For client access (if needed):**

1. In PocketBase admin → **Collections** → **users**
2. Create new user:
   - Email: `client-admin@company.com`
   - Password: *(Temporary, they'll change on first login)*
   - Role: `admin`
3. Hand off credentials to client securely

### 4.3 Email Configuration (Optional - v1.5)

For automated quote confirmations, configure email:

**Option A: Resend (Recommended)**
- Sign up at `resend.com`
- Get API key
- Add to Next.js `.env.production`: `RESEND_API_KEY=xxx`

**Option B: SMTP (Gmail, SendGrid, etc.)**
- Configure in Next.js server action or use Nodemailer
- Add credentials to `.env.production`

---

## 5. Monitoring & Maintenance

### 5.1 Daily Checks (Via SSH or Monitoring Dashboard)

```bash
# Check service status
systemctl status pocketbase
pm2 status

# Check disk space
df -h  # Should have >20GB free

# Check memory usage
free -h  # Should have >500MB free

# View recent errors
journalctl --since="1 hour ago" -p err

# Check Nginx status
systemctl status nginx
```

### 5.2 Weekly Maintenance

**Backup Database:**

```bash
# Manual backup
cp /opt/pocketbase/pb_data/data.db /opt/pocketbase/pb_data/data.db.backup.$(date +%Y%m%d)

# Or setup automatic backups (cron job)
# Add to crontab: 0 2 * * * cp /opt/pocketbase/pb_data/data.db /backups/data.db.$(date +\%Y\%m\%d)
```

**Update System:**

```bash
apt update
apt upgrade -y
```

**Review Logs:**

```bash
# Check for errors
journalctl -u pocketbase --since="7 days ago" -p err
pm2 logs nextjs --lines 50 | grep ERROR
```

### 5.3 Monthly Maintenance

**Check SSL Certificate Expiration:**

```bash
certbot certificates
# Should show expiry date (auto-renewed 30 days before expiry)
```

**Update Node Packages:**

```bash
cd /var/www/cinema-rental
npm update
npm run build
pm2 restart nextjs
```

**Review PocketBase Backups:**

```bash
ls -lh /opt/pocketbase/pb_data/data.db*
# Ensure backups exist and are recent
```

---

## 6. Troubleshooting

### Issue: PocketBase Won't Start

**Symptoms:** `systemctl status pocketbase` shows failed

**Solution:**
```bash
# Check logs
journalctl -u pocketbase -n 20

# Verify binary exists
ls -la /opt/pocketbase/pocketbase

# Manually test
cd /opt/pocketbase
./pocketbase serve

# If permission denied, fix:
chmod +x ./pocketbase
chown root:root ./pocketbase
```

### Issue: Next.js App Not Loading

**Symptoms:** `https://domain.com` times out or 502 error

**Solution:**
```bash
# Check Next.js is running
pm2 status

# Restart if stuck
pm2 restart nextjs

# Check logs
pm2 logs nextjs

# Verify port 3000 is listening
netstat -tlnp | grep 3000

# Rebuild if code changed
cd /var/www/cinema-rental
npm run build
pm2 restart nextjs
```

### Issue: SSL Certificate Error

**Symptoms:** Browser shows "Not Secure" or certificate error

**Solution:**
```bash
# Check certificate
certbot certificates

# Renew if needed
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx

# Verify in browser
curl -I https://domain.com  # Should show 200 OK
```

### Issue: Database Growing Too Large

**Symptoms:** Disk space warning

**Solution:**
```bash
# Check size
du -sh /opt/pocketbase/pb_data/data.db

# Archive old data (if needed)
cd /opt/pocketbase
cp pb_data/data.db pb_data/data.db.archive.$(date +%Y%m%d)

# Or implement data cleanup (via PocketBase admin UI)
```

### Issue: Quote Emails Not Sending

**Symptoms:** Quote submitted but no confirmation email to client

**Solution:**
```bash
# Check Next.js logs
pm2 logs nextjs | grep -i email

# Verify Resend API key is set
grep RESEND_API_KEY /var/www/cinema-rental/.env.production

# Test manually (if possible)
# Create test route to send email, then delete

# Or check PocketBase hooks (if using them)
```

---

## 7. Rollback & Recovery

### Rollback to Previous Version

**If new deployment breaks site:**

```bash
# 1. Stop services
pm2 stop nextjs
systemctl stop nginx

# 2. Revert code to previous commit
cd /var/www/cinema-rental
git log --oneline  # See recent commits
git revert HEAD~1  # Go back one version
# OR
git checkout <commit-hash>

# 3. Rebuild and restart
npm run build
pm2 start nextjs

# 4. Restart Nginx
systemctl start nginx

# 5. Test
curl https://domain.com
```

### Restore from Database Backup

**If PocketBase data corrupted:**

```bash
# 1. Stop PocketBase
systemctl stop pocketbase

# 2. Restore from backup
cp /opt/pocketbase/pb_data/data.db.backup.20250115 /opt/pocketbase/pb_data/data.db

# 3. Restart
systemctl start pocketbase

# 4. Verify admin UI loads
curl https://api.domain.com/_/
```

---

## 8. Scalability (Future)

### When to Scale

**You'll need to scale when:**
- Traffic > 5,000 visits/day (single VPS at limit)
- Database > 10GB
- Quote submissions > 100/day
- Admin complains about slowness

### Scaling Options (v2+)

1. **Upgrade Hostinger VPS:**
   - Increase RAM (4GB → 8GB)
   - Increase CPU cores (2 → 4)
   - Increase SSD (100GB → 250GB+)

2. **Use Managed Database:**
   - Migrate PocketBase SQLite → PostgreSQL on Supabase or AWS RDS
   - Improves performance and reliability

3. **Use CDN:**
   - Cloudflare for static assets (images, CSS, JS)
   - Faster delivery to international users

4. **Horizontal Scaling (Advanced):**
   - Run multiple Next.js instances behind load balancer
   - Use PostgreSQL (not SQLite)
   - Setup caching layer (Redis)

---

## 9. Monitoring & Alerting (Optional)

### Setup Error Notifications

**Using a Monitoring Service (e.g., Uptime Robot, Healthchecks.io):**

1. Create uptime check: `https://domain.com`
2. Set alert email if site down
3. Check frequency: Every 5 minutes

**Manual Monitoring (Cron Job):**

Create `/opt/monitor.sh`:

```bash
#!/bin/bash

# Check if site is up
if ! curl -sSf https://domain.com > /dev/null; then
    echo "Site is down!" | mail -s "Alert: Cinema Rental Site Down" admin@yourdomain.com
fi

# Check PocketBase
if ! systemctl is-active --quiet pocketbase; then
    systemctl start pocketbase
    echo "Restarted PocketBase" | mail -s "Alert: PocketBase Restarted" admin@yourdomain.com
fi

# Check disk space
USAGE=$(df / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
if [ "$USAGE" -gt 80 ]; then
    echo "Disk usage: $USAGE%" | mail -s "Alert: High Disk Usage" admin@yourdomain.com
fi
```

Add to crontab:

```bash
# Run every 15 minutes
*/15 * * * * /opt/monitor.sh
```

---

## 10. Client Handoff Checklist

Before handing off to client:

- [ ] Admin credentials provided securely (password manager or secure email)
- [ ] PocketBase admin URL explained (`https://api.domain.com/_/`)
- [ ] How to add/edit equipment (step-by-step guide)
- [ ] How to view quotes and change status
- [ ] How to publish blog posts
- [ ] Emergency contact (your phone/email)
- [ ] Backup procedure explained
- [ ] Password reset process explained
- [ ] Regular maintenance tasks (weekly, monthly)
- [ ] Monitoring alerts setup (if applicable)

---

## 11. Support & SLA (Service Level Agreement)

### Response Times

| Issue Severity | Response Time | Resolution Time |
|---|---|---|
| **Critical** (site down) | 1 hour | 4 hours |
| **High** (feature broken) | 4 hours | 1 day |
| **Medium** (minor bug) | 1 day | 3 days |
| **Low** (enhancement request) | 3 days | 2 weeks |

### Contact Escalation

1. **First:** Email admin@yourdomain.com
2. **Second:** Direct message (Whatsapp/Telegram)
3. **Third:** Phone call

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Production-Ready  
**Prepared By:** Full-Stack Architect  
**Audience:** Developers, System Administrators, Client IT

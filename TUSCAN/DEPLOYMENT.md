# Tuscan Verve - Complete Production Deployment Guide

This guide provides step-by-step instructions to deploy the complete **Tuscan Verve** stack using Docker, Docker Compose, and Nginx with automated SSL (Let's Encrypt / Certbot) for your domain `ecommerce-api`.

---

## 1. System Architecture

| Service | Technology | Port (Internal) | Description |
|---|---|---|---|
| **`nginx`** | Nginx 1.27 Alpine | 80, 443 (External) | Gateway reverse proxy, SSL termination, HTTP-to-HTTPS redirect |
| **`backend`** | Node.js 20 / Express 5 | 5000 | Tuscan Verve Core REST API |
| **`mongo`** | MongoDB 7.0 | 27017 | Database engine with persistent storage volume |
| **`frontend`** | React 19 + Vite | 80 | Customer Storefront application |
| **`admin`** | React 19 + Vite | 80 | Administrative dashboard |
| **`certbot`** | Certbot / Let's Encrypt | - | Automatic SSL certificate issuance and background renewal |

---

## 2. Server Preparation (VPS / Cloud Instance)

### A. Point Your Domain DNS
Before running the SSL script, ensure your domain's DNS `A` record points to your server's Public IP:
- **Type**: `A`
- **Host / Name**: `ecommerce-api` (e.g., `ecommerce-api.yourdomain.com`)
- **Value**: `<YOUR_VPS_PUBLIC_IP>`
- **TTL**: 300 seconds (or Automatic)

### B. Open Inbound Ports on Server Firewall (UFW)
Ensure ports 80 and 443 are open:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### C. Install Docker and Docker Compose (if not already installed)
```bash
# Ubuntu/Debian installation
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and log back in, or run: newgrp docker
```

---

## 3. Deployment Steps

### Step 1: Clone or Copy Project Files
Transfer the `TUSCAN` directory to your production server (e.g., in `/opt/tuscan` or `~/tuscan`):
```bash
cd /opt/tuscan
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` (or edit the existing `.env`):
```bash
nano .env
```
Set your domain, email, and security secrets:
```env
API_DOMAIN=ecommerce-api.yourdomain.com
CERTBOT_EMAIL=yourname@yourdomain.com
JWT_SECRET=generate_a_long_random_secret_here_for_security
NODE_ENV=production
CLIENT_URL=https://tuscanverve.store,https://admin.tuscanverve.store
VITE_API_BASE=/api
```

### Step 3: Run the Automated SSL Initializer
Run the initialization script. This script automatically creates a temporary certificate so Nginx can start, requests the real Let's Encrypt certificate for your domain, and reloads Nginx:
```bash
chmod +x init-ssl.sh
./init-ssl.sh
```

*(If testing on Windows locally, you can run `.\init-ssl.ps1` in PowerShell)*.

### Step 4: Start All Services in Background
```bash
docker compose up -d --build
```

### Step 5: Seed the Database with Catalog Products & Admin User
Populate Tuscan Verve's signature shirts and default admin credentials:
```bash
docker compose exec backend npm run seed
```
> **Default Admin Credentials:**
> - Email: `admin@tuscanverve.store`
> - Password: `AdminPassword2026`

---

## 4. Verification & Health Check

### Test API Health via HTTPS
```bash
curl -i https://ecommerce-api.yourdomain.com/api/health
```
Expected response:
```json
HTTP/2 200
content-type: application/json; charset=utf-8

{
  "status": "ok",
  "message": "Tuscan Verve API is operational",
  "timestamp": "..."
}
```

### Test API Product Catalog
```bash
curl -i https://ecommerce-api.yourdomain.com/api/products
```

---

## 5. Maintenance & Management Commands

### View Live Logs
```bash
# View all container logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# View Nginx access/error logs
docker compose logs -f nginx
```

### Restart a Service
```bash
docker compose restart backend
docker compose restart nginx
```

### SSL Renewal
The `certbot` container runs automatically in the background and attempts renewal every 12 hours. 
To manually trigger a test renewal dry-run:
```bash
docker compose run --rm certbot renew --dry-run
```

### Stop All Services
```bash
docker compose down
```

*(Your MongoDB data and uploaded images will be safely preserved in `mongo_data` and `backend_uploads` Docker volumes)*.

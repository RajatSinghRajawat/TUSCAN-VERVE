# Tuscan Verve - Automated SSL Initialization Script (PowerShell)
# Usage: .\init-ssl.ps1

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " Tuscan Verve SSL Initialization (Windows/PowerShell)" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Parse .env
$envVars = @{}
Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line.Split("=", 2)
        $envVars[$parts[0].Trim()] = $parts[1].Trim()
    }
}

$domain = if ($envVars["API_DOMAIN"]) { $envVars["API_DOMAIN"] } else { "ecommerce-api.yourdomain.com" }
$email = if ($envVars["CERTBOT_EMAIL"]) { $envVars["CERTBOT_EMAIL"] } else { "admin@yourdomain.com" }
$dataPath = "./certbot"

Write-Host "Target Domain: $domain" -ForegroundColor Green
Write-Host "Admin Email:   $email" -ForegroundColor Green

$liveDir = "$dataPath/conf/live/$domain"
New-Item -ItemType Directory -Force -Path $liveDir | Out-Null
New-Item -ItemType Directory -Force -Path "$dataPath/www" | Out-Null

# Step 1: Dummy cert
Write-Host ">>> Step 1/4: Generating temporary self-signed SSL certificate..." -ForegroundColor Yellow
openssl req -x509 -nodes -newkey rsa:2048 -days 1 `
    -keyout "$liveDir/privkey.pem" `
    -out "$liveDir/fullchain.pem" `
    -subj "/CN=localhost"

# Step 2: Start Nginx
Write-Host ">>> Step 2/4: Starting Nginx container..." -ForegroundColor Yellow
docker compose up --force-recreate -d nginx

# Step 3: Remove dummy & obtain real cert
Write-Host ">>> Step 3/4: Requesting real SSL certificate from Let's Encrypt for $domain..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$liveDir"

docker compose run --rm --entrypoint "`
  certbot certonly --webroot -w /var/www/certbot `
    --email $email `
    -d $domain `
    --rsa-key-size 4096 `
    --agree-tos `
    --force-renewal `
    --non-interactive" certbot

# Step 4: Reload Nginx
Write-Host ">>> Step 4/4: Reloading Nginx with authentic SSL certificate..." -ForegroundColor Yellow
docker compose exec nginx nginx -s reload

Write-Host "==============================================" -ForegroundColor Green
Write-Host "✓ SSL Setup Complete! Accessible via: https://$domain" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

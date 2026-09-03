#!/bin/bash
set -e

# Tuscan Verve - Automated SSL Initialization Script
# Usage: ./init-ssl.sh

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Load variables from .env
export $(grep -v '^#' .env | xargs)

DOMAIN="${API_DOMAIN:-ecommerce-api.yourdomain.com}"
EMAIL="${CERTBOT_EMAIL:-admin@yourdomain.com}"
DATA_PATH="./certbot"

echo "=============================================="
echo " Tuscan Verve SSL Initialization"
echo " Target Domain: $DOMAIN"
echo " Admin Email:   $EMAIL"
echo "=============================================="

if [ -d "$DATA_PATH/conf/live/$DOMAIN" ] && [ -f "$DATA_PATH/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "Existing SSL certificate found for $DOMAIN."
    read -p "Do you want to replace it? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        echo "Keeping existing certificates."
        exit 0
    fi
fi

# Step 1: Create dummy self-signed certificate so Nginx can start
echo ">>> Step 1/4: Generating dummy SSL certificate for initial Nginx startup..."
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"
mkdir -p "$DATA_PATH/www"

openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$DATA_PATH/conf/live/$DOMAIN/privkey.pem" \
    -out "$DATA_PATH/conf/live/$DOMAIN/fullchain.pem" \
    -subj "/CN=localhost"

# Step 2: Start Nginx
echo ">>> Step 2/4: Starting Nginx container..."
docker compose up --force-recreate -d nginx

# Step 3: Delete dummy certificate and request real Let's Encrypt SSL
echo ">>> Step 3/4: Requesting real SSL certificate from Let's Encrypt for $DOMAIN..."
rm -rf "$DATA_PATH/conf/live/$DOMAIN"

# Run Certbot webroot challenge
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email $EMAIL \
    -d $DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal \
    --non-interactive" certbot

# Step 4: Reload Nginx with real certificate
echo ">>> Step 4/4: Reloading Nginx with authentic SSL certificate..."
docker compose exec nginx nginx -s reload

echo "=============================================="
echo "✓ SSL Setup Complete!"
echo "Your API is now securely accessible via:"
echo "https://$DOMAIN"
echo "=============================================="

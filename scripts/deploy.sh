#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
    echo "Please set DOMAIN in .env file"
    exit 1
fi

# Replace domain in nginx config
sed -i "s/example.com/$DOMAIN/g" nginx/conf.d/app.conf

# Start the application
docker-compose up -d

# Wait for nginx to start
echo "Waiting for nginx to start..."
sleep 10

# Initialize SSL certificate
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email $SSL_EMAIL --agree-tos --no-eff-email --force-renewal -d $DOMAIN -d www.$DOMAIN

# Reload nginx to apply SSL certificate
docker-compose exec nginx nginx -s reload

echo "Deployment completed successfully!"
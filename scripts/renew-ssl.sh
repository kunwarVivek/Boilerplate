#!/bin/bash

# Exit on error
set -e

# Renew SSL certificates
docker-compose run --rm certbot renew

# Reload nginx to apply new certificates
docker-compose exec nginx nginx -s reload

echo "SSL certificates renewed successfully!"
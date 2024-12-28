#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check required environment variables
required_vars=(
    "DOMAIN"
    "SSL_EMAIL"
    "POSTGRES_PASSWORD"
    "JWT_SECRET"
    "SUPABASE_ANON_KEY"
    "SERVICE_ROLE_KEY"
    "SUPABASE_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in .env file"
        exit 1
    fi
done

echo "Starting deployment..."

# 1. Build the application
echo "Building application..."
npm run build

# 2. Initialize Supabase
echo "Initializing Supabase..."
./scripts/supabase-setup.sh

# 3. Run database migrations
echo "Running database migrations..."
for migration in supabase/migrations/*.sql; do
    PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U postgres -d postgres -f "$migration"
done

# 4. Start all services
echo "Starting all services..."
docker-compose up -d

# 5. Initialize SSL certificates
echo "Initializing SSL certificates..."
./scripts/ssl-init.sh

echo "Deployment completed successfully!"
echo "Your application is now available at https://$DOMAIN"
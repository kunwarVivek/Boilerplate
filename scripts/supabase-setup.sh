#!/bin/bash

# Exit on error
set -e

# Generate secure random keys
ANON_KEY=$(openssl rand -base64 32)
SERVICE_ROLE_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Create .env.supabase file
cat > .env.supabase << EOF
# PostgreSQL
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# Supabase
ANON_KEY=$ANON_KEY
SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
JWT_SECRET=$JWT_SECRET

# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
EOF

# Create necessary directories
mkdir -p volumes/db/init

# Start Supabase services
docker-compose -f docker-compose.supabase.yml up -d

echo "Supabase is being deployed. Please wait..."
sleep 30

echo "Supabase deployment completed!"
echo "Studio URL: http://localhost:3000"
echo "API URL: http://localhost:8000"
echo "pgAdmin URL: http://localhost:5050"
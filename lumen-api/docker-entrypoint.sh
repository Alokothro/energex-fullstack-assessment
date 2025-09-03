#!/bin/bash

# Update Apache to listen on the PORT environment variable
if [ ! -z "$PORT" ]; then
    sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf
    sed -i "s/80/$PORT/g" /etc/apache2/ports.conf
fi

# Run migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    php artisan migrate --force || true
fi

# Start Apache
apache2-foreground
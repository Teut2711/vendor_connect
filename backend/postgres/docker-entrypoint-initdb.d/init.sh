#!/bin/bash

# Connect to the PostgreSQL server and enable extensions


# Append shared_preload_libraries configuration to postgresql.auto.conf
echo "shared_preload_libraries = 'postgis-3, pg_cron'" >> $PGDATA/postgresql.auto.conf
echo "cron.database_name ='$POSTGRES_DB'" >> $PGDATA/postgresql.auto.conf

/etc/init.d/postgresql restart

psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT pg_reload_conf();"

# Enable PostGIS extension
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# # Enable TimescaleDB extension
# psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"

# Enable pg_cron extension
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pg_cron;"

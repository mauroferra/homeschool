#!/bin/sh
set -e

echo "[entrypoint] applying database migrations..."
node src/db/migrate.js

echo "[entrypoint] seeding initial data (admin + optional demo)..."
node scripts/seed/run-seed.js

echo "[entrypoint] starting server..."
exec node src/app.js

# ---- Stage 1: build the frontend (pure-JS, alpine is fine) ----
FROM node:20-alpine AS frontend-build
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: backend production dependencies ----
# node:20-slim (glibc) so the prebuilt sqlite3 binary installs without build tools.
FROM node:20-slim AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---- Stage 3: runtime ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production \
    PORT=4000 \
    BASE_URL=http://localhost:4000 \
    FRONTEND_URL=http://localhost:4000

WORKDIR /app/backend

# App source
COPY backend/src ./src
COPY backend/docs ./docs
COPY backend/scripts ./scripts

# Production dependencies
COPY --from=backend-deps /app/backend/node_modules ./node_modules

# Built frontend (served by Express as an SPA)
COPY --from=frontend-build /build/dist /app/frontend/dist

# Runtime data (SQLite DB + uploaded files). Mount a volume here to persist.
RUN mkdir -p /app/backend/data
VOLUME ["/app/backend/data"]

# Run as a non-root user
RUN useradd -m -u 1000 app && chown -R app:app /app
USER app

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" || exit 1

ENTRYPOINT ["sh", "scripts/maintenance/docker-entrypoint.sh"]
CMD ["node", "src/app.js"]

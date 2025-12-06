# ---------- BUILD STAGE ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package & tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL deps (build needs devDependencies)
RUN npm ci

# Copy source
COPY src ./src

# Build TypeScript
RUN npm run build

# Copy migrations to dist
RUN mkdir -p dist/db/migrations && \
    cp -r src/db/migrations dist/db/migrations


# ---------- PRODUCTION STAGE ----------
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# ⚠️ IMPORTANT:
# tsconfig-paths MUST be in prod deps
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# ✅ Run with tsconfig-paths
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]

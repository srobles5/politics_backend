# ---------- BUILD STAGE ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package & tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL deps (including dev)
RUN npm ci

# Copy source code
COPY src ./src

# ✅ Build + resolve aliases
RUN npm run build

# ✅ Copy migrations into dist
RUN mkdir -p dist/db/migrations && \
    cp -r src/db/migrations/. dist/db/migrations/


# ---------- PRODUCTION STAGE ----------
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# ✅ Only production deps
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Non-root user (security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# ✅ PURE NODE RUNTIME
CMD ["node", "dist/index.js"]

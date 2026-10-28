# Multi-stage production Dockerfile for VeriShield AI frontend
# Target: Nebius Cloud Serverless Containers
# Build: docker build --build-arg NEXT_PUBLIC_API_URL=https://YOUR-BACKEND --build-arg NEXT_PUBLIC_API_PATH=/verify-link -t verishield-frontend:latest .

# ------------------------------------------------------------------
# Base stage
# ------------------------------------------------------------------
FROM node:22-alpine AS base
WORKDIR /app

# ------------------------------------------------------------------
# Dependencies stage
# ------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ------------------------------------------------------------------
# Builder stage
# ------------------------------------------------------------------
FROM base AS builder
# Build arguments for Next.js public env vars (embedded at build time)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_PATH=/verify-link
ARG NEXT_PUBLIC_MOCK_MODE=false
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_PATH=${NEXT_PUBLIC_API_PATH}
ENV NEXT_PUBLIC_MOCK_MODE=${NEXT_PUBLIC_MOCK_MODE}
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ------------------------------------------------------------------
# Runner stage
# ------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy standalone server files, static assets, and public files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set working directory to standalone server location for execution
WORKDIR /app/standalone

USER nextjs

EXPOSE 3000

# Start standalone server
CMD ["node", "server.js"]

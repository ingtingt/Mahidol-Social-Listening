# 1. Base Image
FROM node:18-alpine AS base

# 2. Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install dependencies (including devDependencies for building)
RUN npm ci

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app (this creates the .next/standalone folder)
RUN npm run build

# 4. Production Runner Stage (The final, small image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a system user for security (don't run as root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public assets
COPY --from=builder /app/public ./public

# Copy the standalone build
# This automatically includes the necessary node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Also copy Prisma schema/migrations for the init script
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/facebook_data.json ./facebook_data.json
COPY --from=builder --chown=nextjs:nodejs /app/merged_facebook_sentiment_results.csv ./merged_facebook_sentiment_results.csv

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start the standalone server
CMD ["node", "server.js"]
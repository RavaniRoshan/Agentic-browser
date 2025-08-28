# Node.js/NestJS Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Generate Prisma client
RUN pnpm prisma generate

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/node/health || exit 1

# Start application
CMD ["pnpm", "start:prod"]
# Production Dockerfile for Althaf Leathers Full-Stack SQLite Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and database
COPY . .

# Build Vite frontend and bundled Express server (dist/server.cjs)
RUN npm run build

# Production Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets, server bundle, and SQLite database
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/althaf_leathers.sqlite ./althaf_leathers.sqlite
COPY --from=builder /app/data ./data

# Ensure data directory exists and has write permissions
RUN mkdir -p /app/data && chmod -R 777 /app/data /app/althaf_leathers.sqlite

EXPOSE 3000

CMD ["node", "dist/server.cjs"]

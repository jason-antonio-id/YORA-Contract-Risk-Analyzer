# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Production deps only (server.cjs requires these at runtime since --packages=external)
COPY package*.json ./
RUN npm install --omit=dev

# Copy built output (contains both frontend static files AND server.cjs)
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/server.cjs"]

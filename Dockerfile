# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Runs: vite build (frontend -> dist/) + esbuild bundle (server.ts -> dist/server.cjs)
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# server.cjs uses --packages=external, so node_modules must exist at runtime
COPY package*.json ./
RUN npm install --omit=dev

# dist/ contains both the built frontend AND server.cjs
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.cjs"]

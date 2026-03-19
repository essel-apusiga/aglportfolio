# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

# The backend package.json uses a local dependency (file:..),
# so we include the root package manifest as well.
COPY package.json ./package.json
COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app /app
COPY server ./server
WORKDIR /app/server
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./package.json
COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/server/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]

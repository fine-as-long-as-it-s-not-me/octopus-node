# -------- Build stage --------
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# -------- Runtime stage --------
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/app.js"]

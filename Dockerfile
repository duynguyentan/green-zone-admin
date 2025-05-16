# Stage 1: Build stage 
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Stage 2: Run (production)
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=production

# Copy build output (Vite builds into "dist")
COPY --from=build /app/dist ./dist

EXPOSE 5173

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]

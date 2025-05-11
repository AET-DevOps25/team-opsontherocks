# Stage 1: build the Vite + React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package metadata and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Copy rest of the sources and build
COPY . ./
RUN npm run build

# Stage 2: serve the built assets
FROM node:18-alpine AS runner
WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy built files from the builder
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 8080

# Serve the app statically
CMD ["serve", "-s", "dist", "-l", "8080"]

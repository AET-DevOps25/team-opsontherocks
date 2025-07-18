# Stage 1: build the Vite + React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package metadata and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production=false

ARG VITE_SERVER_URL
ARG VITE_GENAI_URL
ARG VITE_AUTH_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_GENAI_URL=${VITE_GENAI_URL}
ENV VITE_AUTH_URL=${VITE_AUTH_URL}

# Inject vars into .env for Vite to pick up
RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" >> .env && \
    echo "VITE_GENAI_URL=$VITE_GENAI_URL" >> .env && \
    echo "VITE_AUTH_URL=$VITE_AUTH_URL" >> .env

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

# Expose the desired port
EXPOSE 5173

# Serve the app statically on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

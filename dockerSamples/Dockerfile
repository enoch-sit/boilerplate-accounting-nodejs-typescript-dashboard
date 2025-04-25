# Standard Dockerfile with environment support
# Updated as of April 23, 2025

# Build stage
FROM node:18-alpine AS builder

# Build arguments for environment configuration
ARG NODE_ENV=production
ARG VITE_API_URL
ARG VITE_APP_ENVIRONMENT
ARG VITE_APP_NAME
ARG VITE_APP_VERSION=1.0.0

# Set environment variables for build
ENV NODE_ENV=${NODE_ENV}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_ENVIRONMENT=${VITE_APP_ENVIRONMENT}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Add build timestamp to index.html for cache busting
RUN sed -i "s#</head>#<meta name=\"build-timestamp\" content=\"$(date +%Y%m%d%H%M%S)\" /></head>#" ./dist/index.html

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Use entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
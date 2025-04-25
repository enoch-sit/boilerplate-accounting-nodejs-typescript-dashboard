# Docker Configuration Guide

This document provides instructions for setting up and using Docker with the admin dashboard application in both development and production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Development Environment](#development-environment)
- [Production Environment](#production-environment)
- [Customizing the Base URL](#customizing-the-base-url)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Docker Compose
- Git (to clone the repository)

## Environment Variables

The application uses environment variables to configure the API base URL:

- `VITE_API_BASE_URL`: The base URL for API requests
  - Development default: `http://localhost:3000`
  - Production default: `https://your-production-api.com`

These variables can be modified in the docker-compose files or passed at runtime.

## Development Environment

The development setup uses hot-reloading and mounts your local code as a volume for quick development.

### Starting the Development Environment

```bash
# Navigate to the admin-dashboard directory
cd admin-dashboard

# Start the development container
docker-compose -f docker-compose.dev.yml up
```

This will:
1. Build the development image using `Dockerfile.dev`
2. Mount your local code into the container
3. Start the Vite development server on port 5173
4. Enable hot-reloading for fast development

### Accessing the Development Application

Once running, you can access the application at:
- http://localhost:5173

### Stopping the Development Environment

```bash
# Press Ctrl+C in the terminal where docker-compose is running
# or run:
docker-compose -f docker-compose.dev.yml down
```

## Production Environment

The production setup builds an optimized version of the application and serves it using Nginx.

### Building and Starting the Production Environment

```bash
# Navigate to the admin-dashboard directory
cd admin-dashboard

# Build and start the production container
docker-compose -f docker-compose.prod.yml up -d
```

This will:
1. Build the production image using a multi-stage build process in `Dockerfile.prod`
2. Compile and optimize the React application
3. Serve the static files using Nginx on port 80

### Accessing the Production Application

Once running, you can access the application at:
- http://localhost:80 (or just http://localhost)

### Stopping the Production Environment

```bash
docker-compose -f docker-compose.prod.yml down
```

## Customizing the Base URL

### Development Environment

To use a custom API base URL in development:

1. Edit the `docker-compose.dev.yml` file:

```yaml
services:
  admin-dashboard-dev:
    environment:
      - VITE_API_BASE_URL=http://your-custom-api.com
```

2. Or pass it as an environment variable when starting the container:

```bash
VITE_API_BASE_URL=http://your-custom-api.com docker-compose -f docker-compose.dev.yml up
```

### Production Environment

To use a custom API base URL in production:

1. Edit the `docker-compose.prod.yml` file:

```yaml
services:
  admin-dashboard-prod:
    build:
      args:
        - VITE_API_BASE_URL=https://your-custom-production-api.com
```

2. Or pass it as a build argument:

```bash
docker-compose -f docker-compose.prod.yml build --build-arg VITE_API_BASE_URL=https://your-custom-production-api.com
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container Won't Start

If the container fails to start, check the following:

```bash
# View container logs
docker logs admin-dashboard-dev
# or
docker logs admin-dashboard-prod
```

### Port Conflicts

If you see an error about ports already being in use, change the port mapping in the docker-compose file:

```yaml
ports:
  - "8080:80"  # Maps container port 80 to host port 8080
```

### Missing Environment Variables

If the application can't connect to the API, verify that the environment variables are correctly set:

```bash
# For development container
docker exec admin-dashboard-dev printenv | grep VITE

# For production container (during build)
docker history admin-dashboard-prod | grep VITE
```
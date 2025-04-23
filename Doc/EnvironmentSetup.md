# Environment Setup Guide

This comprehensive guide explains how to configure the Simple Accounting Dashboard application across different environments, from local development to production deployment.

## Table of Contents

- [Environment Setup Guide](#environment-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Environment Configuration Overview](#environment-configuration-overview)
    - [Configuration Priority (Highest to Lowest)](#configuration-priority-highest-to-lowest)
  - [Environment Variables Reference](#environment-variables-reference)
    - [API Configuration](#api-configuration)
    - [Application Settings](#application-settings)
    - [Feature Flags](#feature-flags)
    - [Authentication Settings](#authentication-settings)
    - [Analytics and Monitoring](#analytics-and-monitoring)
  - [Local Development Setup](#local-development-setup)
    - [Hot Module Replacement (HMR)](#hot-module-replacement-hmr)
    - [Local-only overrides](#local-only-overrides)
  - [Testing Environment Configuration](#testing-environment-configuration)
    - [Testing with Mock API](#testing-with-mock-api)
  - [Staging Environment Setup](#staging-environment-setup)
    - [Staging-specific features](#staging-specific-features)
  - [Production Environment Setup](#production-environment-setup)
    - [Production deployment strategies](#production-deployment-strategies)
  - [Docker Deployment Options](#docker-deployment-options)
    - [Using docker-compose](#using-docker-compose)
    - [Using Multi-Stage Docker Builds](#using-multi-stage-docker-builds)
    - [Runtime Configuration with Docker](#runtime-configuration-with-docker)
  - [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
    - [GitHub Actions Example](#github-actions-example)
    - [GitLab CI Example](#gitlab-ci-example)
  - [Advanced Configuration Techniques](#advanced-configuration-techniques)
    - [Feature Flags Management](#feature-flags-management)
    - [Environment-Specific Code](#environment-specific-code)
    - [Multi-Region Configuration](#multi-region-configuration)
  - [Troubleshooting Guide](#troubleshooting-guide)
    - [Common Issues and Solutions](#common-issues-and-solutions)
      - [Environment Variables Not Working](#environment-variables-not-working)
      - [API Connection Problems](#api-connection-problems)
      - [Build Fails with Environment Errors](#build-fails-with-environment-errors)
    - [Debugging Environment Configuration](#debugging-environment-configuration)
    - [Environment File Validation](#environment-file-validation)
  - [Conclusion](#conclusion)

## Environment Configuration Overview

The Simple Accounting Dashboard uses a tiered approach to environment configuration:

1. **Build-time environment variables**: Set during the build process via `.env` files or CLI arguments
2. **Runtime environment variables**: Injected into Docker containers during startup
3. **Dynamic configuration**: Loaded at runtime from a configuration endpoint or local file

This approach allows for maximum flexibility while maintaining security and performance.

### Configuration Priority (Highest to Lowest)

1. Runtime environment variables
2. Build-time arguments
3. Environment-specific `.env` files (e.g., `.env.production`)
4. Local override files (`.env.local`, `.env.development.local`, etc.)
5. Default values in code

## Environment Variables Reference

The application recognizes the following environment variables:

### API Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_URL` | Base URL for authentication API | `http://localhost:3000/api` | `https://api.example.com/api` |

### Application Settings

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_NAME` | Application name displayed in UI | `Simple Accounting Dashboard` | `Acme Financial Portal` |
| `VITE_APP_VERSION` | Application version | `1.0.0` | `2.3.1` |
| `VITE_APP_ENVIRONMENT` | Environment name | `development` | `production` |
| `VITE_PUBLIC_PATH` | Base path for the application | `/` | `/accounting-app/` |

### Feature Flags

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_FEATURE_ADMIN_PANEL` | Enable admin features | `true` | `false` |
| `VITE_FEATURE_DARK_MODE` | Enable dark mode toggle | `true` | `true` |
| `VITE_FEATURE_DEBUG_TOOLS` | Enable debug tools | `false` | `true` |

### Authentication Settings

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_AUTH_REQUIRE_EMAIL_VERIFICATION` | Email verification required | `true` | `false` |
| `VITE_AUTH_TOKEN_EXPIRATION` | Token expiration (minutes) | `30` | `60` |

### Analytics and Monitoring

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_ANALYTICS_ENABLED` | Enable analytics tracking | `false` | `true` |
| `VITE_ANALYTICS_ID` | Analytics ID/key | `` | `UA-123456789-1` |
| `VITE_ERROR_REPORTING_DSN` | Error reporting service DSN | `` | `https://key@sentry.example.com/1` |

## Local Development Setup

For local development with hot-module replacement and fast refresh:

1. **Create environment file**

   Copy the template environment file:
   ```bash
   cp .env.example .env.development.local
   ```

2. **Configure local development settings**

   Edit `.env.development.local` with appropriate values:
   ```properties
   # API Configuration
   VITE_API_URL=http://localhost:3000/api
   
   # App Settings
   VITE_APP_NAME=Simple Accounting Dashboard (DEV)
   VITE_APP_ENVIRONMENT=development
   
   # Feature Flags
   VITE_FEATURE_DEBUG_TOOLS=true
   
   # Authentication
   VITE_AUTH_REQUIRE_EMAIL_VERIFICATION=false
   VITE_AUTH_TOKEN_EXPIRATION=120
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Using the mock API server**

   The project includes a mock API server for development. To use it:
   ```bash
   # In a separate terminal
   cd mock-api
   npm install
   npm start
   ```

### Hot Module Replacement (HMR)

Vite provides Hot Module Replacement out of the box. When you make changes:
- JavaScript/TypeScript modules will be hot-updated without page refresh
- CSS/SCSS changes apply instantly
- React components maintain their state during update when possible

### Local-only overrides

To override settings just for your local environment (not committed to git):
- Create `.env.local` file for overrides that apply to all modes
- Create `.env.development.local` for development-only overrides

## Testing Environment Configuration

For unit and integration testing configuration:

1. **Create test environment file**

   ```bash
   cp .env.example .env.test
   ```

2. **Configure test settings**

   ```properties
   # API Configuration
   VITE_API_URL=http://localhost:3001/api
   
   # App Settings
   VITE_APP_NAME=Simple Accounting Dashboard (TEST)
   VITE_APP_ENVIRONMENT=test
   
   # Enable all features for comprehensive testing
   VITE_FEATURE_ADMIN_PANEL=true
   VITE_FEATURE_DARK_MODE=true
   VITE_FEATURE_DEBUG_TOOLS=true
   
   # Test-specific settings
   VITE_TEST_USER_EMAIL=test@example.com
   VITE_TEST_USER_PASSWORD=Test123!
   VITE_MOCK_API_DELAY=50
   ```

3. **Run tests**

   ```bash
   npm test
   # or for specific tests
   npm test -- components/auth/Login.test.tsx
   ```

### Testing with Mock API

During testing, a mock API server is automatically started with preconfigured responses. To customize this behavior:

1. **Update mock API data**

   Edit files in the `mock-api/data` directory to change the test data.

2. **Configure mock API behavior**

   Set `VITE_MOCK_API_DELAY` to add realistic API latency during tests.

## Staging Environment Setup

For staging environment deployment:

1. **Create staging environment file**

   ```bash
   cp .env.example .env.staging
   ```

2. **Configure staging settings**

   ```properties
   # API Configuration
   VITE_API_URL=https://staging-api.example.com/api
   
   # App Settings
   VITE_APP_NAME=Simple Accounting Dashboard (STAGING)
   VITE_APP_ENVIRONMENT=staging
   
   # Feature Flags - Enable all features for testing
   VITE_FEATURE_ADMIN_PANEL=true
   VITE_FEATURE_DARK_MODE=true
   VITE_FEATURE_DEBUG_TOOLS=true
   
   # Analytics - Use staging values
   VITE_ANALYTICS_ENABLED=true
   VITE_ANALYTICS_ID=UA-STAGING-ID
   VITE_ERROR_REPORTING_DSN=https://staging-key@sentry.example.com/1
   ```

3. **Build for staging**

   ```bash
   npm run build -- --mode staging
   ```

4. **Deploy to staging server**

   ```bash
   # Using rsync example
   rsync -avz --delete dist/ user@staging-server:/path/to/deploy
   ```

### Staging-specific features

The staging environment is configured to:
- Display environment name in UI for clarity
- Enable debug tools for testing and verification
- Use staging analytics ID to separate data from production
- Connect to the staging API endpoint

## Production Environment Setup

For production environment deployment:

1. **Create production environment file**

   ```bash
   cp .env.example .env.production
   ```

2. **Configure production settings**

   ```properties
   # API Configuration
   VITE_API_URL=https://api.example.com/api
   
   # App Settings
   VITE_APP_NAME=Simple Accounting Dashboard
   VITE_APP_ENVIRONMENT=production
   
   # Feature Flags - Only enable production-ready features
   VITE_FEATURE_ADMIN_PANEL=true
   VITE_FEATURE_DARK_MODE=true
   VITE_FEATURE_DEBUG_TOOLS=false
   
   # Analytics - Use production values
   VITE_ANALYTICS_ENABLED=true
   VITE_ANALYTICS_ID=UA-PRODUCTION-ID
   
   # Security settings
   VITE_AUTH_REQUIRE_EMAIL_VERIFICATION=true
   VITE_AUTH_TOKEN_EXPIRATION=30
   ```

3. **Build for production**

   ```bash
   npm run build
   # or explicitly specify mode
   npm run build -- --mode production
   ```

4. **Production optimizations**

   The production build process automatically:
   - Minifies JavaScript and CSS
   - Optimizes and compresses images
   - Removes development-only code
   - Adds cache-busting hashes to filenames

### Production deployment strategies

Multiple deployment strategies are available for production:

1. **Static server deployment**
   - Copy the `dist` directory to any static web server
   - Configure server to redirect 404s to `index.html` for SPA routing

2. **CDN deployment**
   - Upload static assets to a CDN
   - Set `VITE_CDN_URL` to point to your CDN base URL

3. **Container deployment**
   - Use Docker to build and deploy the application
   - See [Docker Deployment Options](#docker-deployment-options) below

## Docker Deployment Options

The application includes several Docker configurations for different deployment scenarios.

### Using docker-compose

For simple multi-container deployment:

1. **Development environment**

   ```bash
   # Start development containers
   docker-compose --profile dev up
   ```

2. **Staging environment**

   ```bash
   # Start staging containers
   docker-compose --profile staging up -d
   ```

3. **Production environment**

   ```bash
   # Start production containers 
   docker-compose --profile prod up -d
   ```

### Using Multi-Stage Docker Builds

For optimized container builds based on environment:

1. **Development with hot-reloading**

   ```bash
   docker-compose -f docker-compose.multi-stage.yml --profile dev up
   ```

2. **Staging deployment**

   ```bash
   docker-compose -f docker-compose.multi-stage.yml --profile staging up -d
   ```

3. **Production deployment**

   ```bash
   docker-compose -f docker-compose.multi-stage.yml --profile prod up -d
   ```

### Runtime Configuration with Docker

The application's Docker setup supports runtime configuration:

1. **Environment variables at runtime**

   ```bash
   docker run -p 80:80 \
     -e VITE_API_URL=https://api.example.com/api \
     -e VITE_APP_ENVIRONMENT=production \
     accounting-dashboard
   ```

2. **Configuration mounting**

   ```bash
   # Create runtime config
   echo 'window.APP_CONFIG = { apiUrl: "https://api.example.com" };' > config.js
   
   # Mount at runtime
   docker run -p 80:80 -v $(pwd)/config.js:/usr/share/nginx/html/config.js accounting-dashboard
   ```

3. **Docker secrets (swarm mode)**

   ```yaml
   version: '3.8'
   services:
     frontend:
       image: accounting-dashboard
       secrets:
         - api_url
   secrets:
     api_url:
       external: true
   ```

## CI/CD Pipeline Configuration

The application supports various CI/CD pipeline configurations:

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          VITE_APP_ENVIRONMENT: production
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: dist
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/html"
```

### GitLab CI Example

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache rsync openssh
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - rsync -avz --delete dist/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
  only:
    - main
```

## Advanced Configuration Techniques

### Feature Flags Management

The application supports dynamic feature flags management:

1. **At build time via environment variables**:
   ```
   VITE_FEATURE_ADMIN_PANEL=true
   VITE_FEATURE_DARK_MODE=true
   ```

2. **At runtime via config.js**:
   ```js
   window.APP_CONFIG = {
     features: {
       adminPanel: true,
       darkMode: false
     }
   };
   ```

3. **Remote feature flags service**:

   To integrate with a remote feature flags service:
   
   ```typescript
   // src/lib/featureFlags.ts
   import { getConfig } from './config';
   
   export async function initializeFeatureFlags() {
     const apiKey = getConfig('FEATURE_FLAGS_API_KEY');
     // Initialize remote feature flags SDK
   }
   ```

### Environment-Specific Code

You can conditionally include code based on the environment:

```typescript
// Import only in development
if (import.meta.env.DEV) {
  await import('./devTools').then(module => module.initialize());
}

// Environment-specific behavior
const apiUrl = import.meta.env.VITE_APP_ENVIRONMENT === 'production'
  ? 'https://api.example.com'
  : 'http://localhost:3000';
```

### Multi-Region Configuration

For applications deployed to multiple regions:

1. **Create region-specific .env files**:
   - `.env.production.us`
   - `.env.production.eu`

2. **Build for specific regions**:
   ```bash
   # US region build
   npm run build -- --mode production.us
   
   # EU region build
   npm run build -- --mode production.eu
   ```

## Troubleshooting Guide

### Common Issues and Solutions

#### Environment Variables Not Working

**Symptoms**: Environment variables are undefined in the application.

**Possible Causes and Solutions**:

1. **Variables not prefixed with `VITE_`**
   - Vite only exposes variables prefixed with `VITE_` to client-side code
   - Solution: Rename variables to start with `VITE_`

2. **Incorrect .env file**
   - Solution: Verify you're using the correct .env file for your build mode
   - Check file naming: `.env.development`, `.env.production`, etc.

3. **Variable defined after build**
   - Vite replaces variables at build time, not runtime
   - Solution: Use the runtime configuration approach with `config.js`

#### API Connection Problems

**Symptoms**: Cannot connect to API, seeing CORS errors.

**Solutions**:

1. **Check API URL configuration**:
   ```bash
   # Verify the current API URL
   grep VITE_API_URL .env*
   ```

2. **CORS issues**:
   - Ensure API server allows requests from your frontend domain
   - For local development, set up a proxy in `vite.config.ts`:
     ```typescript
     export default defineConfig({
       server: {
         proxy: {
           '/api': {
             target: 'http://localhost:3000',
             changeOrigin: true
           }
         }
       }
     });
     ```

3. **Using Docker networks**:
   - Ensure containers can communicate via Docker network
   - Check network configuration in docker-compose.yml

#### Build Fails with Environment Errors

**Symptoms**: Build fails with "process is not defined" or similar errors.

**Solutions**:

1. **Update import.meta.env usage**:
   - Use `import.meta.env.VITE_*` instead of `process.env.*`
   - For TypeScript, ensure `vite-env.d.ts` is properly included

2. **Check for Node.js API usage in client code**:
   - Browser code can't use Node.js APIs
   - Solution: Move Node.js-specific code to build scripts or server

### Debugging Environment Configuration

To debug your current environment configuration:

1. **Add a debug utility**:

   Create `src/lib/debugEnv.ts`:
   ```typescript
   export function logEnvironment() {
     if (import.meta.env.DEV) {
       console.group('Environment Configuration:');
       Object.entries(import.meta.env).forEach(([key, value]) => {
         if (key.startsWith('VITE_')) {
           console.log(`${key}: ${value}`);
         }
       });
       console.groupEnd();
     }
   }
   ```

2. **Add a debug route in development**:

   ```typescript
   // Only in development
   if (import.meta.env.DEV) {
     routes.push({
       path: '/debug-env',
       element: <DebugEnvironment />
     });
   }
   ```

3. **Use browser console**:

   In your browser's dev tools console:
   ```javascript
   // View all environment variables
   Object.entries(window.configs).forEach(([k,v]) => console.log(k,v))
   ```

### Environment File Validation

To validate your environment files:

1. **Create a validation script**:

   Create `scripts/validate-env.js`:
   ```javascript
   const fs = require('fs');
   const dotenv = require('dotenv');
   
   // Required variables
   const requiredVars = [
     'VITE_API_URL',
     'VITE_APP_ENVIRONMENT'
   ];
   
   // Read the environment file
   const envFile = process.argv[2] || '.env';
   const config = dotenv.parse(fs.readFileSync(envFile));
   
   // Check for required variables
   const missing = requiredVars.filter(v => !config[v]);
   
   if (missing.length > 0) {
     console.error(`Error: Missing required variables in ${envFile}:`);
     missing.forEach(v => console.error(`  - ${v}`));
     process.exit(1);
   } else {
     console.log(`✅ Environment file ${envFile} is valid`);
   }
   ```

2. **Run validation**:

   ```bash
   node scripts/validate-env.js .env.production
   ```

3. **Add to build process**:

   In `package.json`:
   ```json
   "scripts": {
     "prebuild": "node scripts/validate-env.js .env.production"
   }
   ```

## Conclusion

This guide has provided comprehensive information for configuring the Simple Accounting Dashboard application across different environments. By following these instructions, you can ensure consistent behavior from development through production deployment.

For further assistance, refer to the [DeveloperGuide.md](./DeveloperGuide.md) document or contact the development team.
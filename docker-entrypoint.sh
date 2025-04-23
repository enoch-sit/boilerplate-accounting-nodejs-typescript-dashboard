#!/bin/sh
set -e

# Configure API upstream for nginx
API_UPSTREAM=${VITE_API_URL:-http://localhost:3000/api}
echo "Setting API upstream to: $API_UPSTREAM"
# Make sure variable is available to nginx
echo "env API_UPSTREAM=$API_UPSTREAM;" > /etc/nginx/conf.d/environment.conf
chmod 644 /etc/nginx/conf.d/environment.conf

# Replace environment variables in the runtime config
CONFIG_FILE="/usr/share/nginx/html/config.js"

# Create runtime config if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Creating runtime configuration file..."
  cat > "$CONFIG_FILE" << EOF
window.APP_CONFIG = {
  apiUrl: '${VITE_API_URL:-http://localhost:3000/api}',
  environment: '${VITE_APP_ENVIRONMENT:-production}',
  appName: '${VITE_APP_NAME:-Simple Accounting Dashboard}',
  appVersion: '${VITE_APP_VERSION:-1.0.0}',
  features: {
    adminPanel: ${VITE_FEATURE_ADMIN_PANEL:-true},
    darkMode: ${VITE_FEATURE_DARK_MODE:-true},
    debugTools: ${VITE_FEATURE_DEBUG_TOOLS:-false}
  },
  analytics: {
    enabled: ${VITE_ANALYTICS_ENABLED:-false},
    id: '${VITE_ANALYTICS_ID:-}'
  },
  auth: {
    requireEmailVerification: ${VITE_AUTH_REQUIRE_EMAIL_VERIFICATION:-true},
    tokenExpiration: ${VITE_AUTH_TOKEN_EXPIRATION:-30}
  }
};
EOF
fi

# Apply additional security headers for production environment
if [ "${VITE_APP_ENVIRONMENT}" = "production" ]; then
  echo "Applying production security headers..."
  echo "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;" >> /etc/nginx/conf.d/security.conf
fi

# Use timestamp for versioning of static assets
TIMESTAMP=$(date +%Y%m%d%H%M%S)
sed -i "s/__BUILD_TIMESTAMP__/$TIMESTAMP/g" /usr/share/nginx/html/index.html 2>/dev/null || true

echo "Starting Nginx..."
# Execute the main container command
exec "$@"
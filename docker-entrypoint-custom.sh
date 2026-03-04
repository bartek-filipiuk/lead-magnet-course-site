#!/bin/sh
# Generate htpasswd from environment variables
if [ -n "$BASIC_AUTH_USER" ] && [ -n "$BASIC_AUTH_PASSWORD" ]; then
    htpasswd -bc /etc/nginx/.htpasswd "$BASIC_AUTH_USER" "$BASIC_AUTH_PASSWORD"
    echo "Basic Auth configured for user: $BASIC_AUTH_USER"
else
    echo "WARNING: BASIC_AUTH_USER or BASIC_AUTH_PASSWORD not set, disabling auth"
    # Create empty config that disables auth
    sed -i 's/auth_basic .*;/auth_basic off;/g' /etc/nginx/conf.d/default.conf
fi

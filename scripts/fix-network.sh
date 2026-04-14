#!/bin/bash

################################################################################
# Network Configuration Script
# Fixes connectivity issues between frontend and backend
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

log_info "Network Configuration Tool\n"

# ============================================================================
# Network diagnostics
# ============================================================================
log_info "Running network diagnostics...\n"

# Check internet connectivity
log_info "Checking internet connectivity..."
if curl -s http://www.google.com > /dev/null; then
    log_success "Internet connection: ACTIVE"
else
    log_warning "Internet connection: SLOW or UNAVAILABLE"
fi

# Check localhost connectivity
log_info "Checking localhost connectivity..."
if curl -s http://localhost > /dev/null 2>&1; then
    log_success "Localhost: AVAILABLE"
else
    log_info "Localhost: Not responding (this is normal if services not running)"
fi

# ============================================================================
# Fix CORS issues
# ============================================================================
log_info "\nConfiguring CORS settings..."

# Update .env.local with correct URLs
if [ -f ".env.local" ]; then
    log_info "Updating .env.local with network settings..."
    
    # Get system IP address
    SYSTEM_IP=$(hostname -I | awk '{print $1}' || echo "127.0.0.1")
    
    # Backup original
    cp .env.local .env.local.bak
    
    # Update URLs
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:5000|g" .env.local
    sed -i "s|NEXT_PUBLIC_BACKEND_URL=.*|NEXT_PUBLIC_BACKEND_URL=http://localhost:5000|g" .env.local
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=http://localhost:3000|g" .env.local
    
    # Add CORS header settings
    if ! grep -q "CORS_ORIGIN" .env.local; then
        cat >> .env.local << EOF

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,http://$SYSTEM_IP:3000
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
CORS_HEADERS=Content-Type,Authorization
EOF
    fi
    
    log_success "Updated .env.local"
fi

# ============================================================================
# Fix DNS issues
# ============================================================================
log_info "\nConfiguring DNS settings..."

# Check if /etc/resolv.conf is configurable
if [ -w /etc/resolv.conf ]; then
    log_info "Checking DNS resolution..."
    
    # Add Google DNS if not present
    if ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf; then
        log_warning "Google DNS (8.8.8.8) not found. Adding..."
        echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf > /dev/null
        echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf > /dev/null
        log_success "DNS servers added"
    else
        log_success "DNS correctly configured"
    fi
else
    log_warning "Cannot modify /etc/resolv.conf (read-only or permission denied)"
fi

# ============================================================================
# Test connectivity to API endpoints
# ============================================================================
log_info "\nTesting API endpoint connectivity...\n"

test_endpoint() {
    local endpoint=$1
    local description=$2
    
    log_info "Testing: $description"
    if timeout 5 curl -s -I "$endpoint" > /dev/null 2>&1; then
        log_success "  ✓ Response received"
    else
        log_warning "  ✗ No response (service may not be running)"
    fi
}

# These would be your actual endpoints
test_endpoint "http://localhost:3000" "Frontend (Next.js)"
test_endpoint "http://localhost:5000" "Backend API"
test_endpoint "http://localhost:5000/api/health" "Backend Health Check"

# ============================================================================
# Configure firewall rules (if needed)
# ============================================================================
log_info "\nChecking firewall configuration...\n"

if command -v ufw &> /dev/null; then
    log_info "Checking UFW firewall..."
    
    if sudo ufw status | grep -q "Status: active"; then
        log_info "UFW is active. Checking required ports..."
        
        # Check if ports are allowed
        if ! sudo ufw status | grep -q "3000"; then
            log_warning "Port 3000 not in UFW rules"
            read -p "Allow port 3000 (frontend)? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                sudo ufw allow 3000/tcp
                log_success "Port 3000 allowed"
            fi
        fi
        
        if ! sudo ufw status | grep -q "5000"; then
            log_warning "Port 5000 not in UFW rules"
            read -p "Allow port 5000 (backend)? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                sudo ufw allow 5000/tcp
                log_success "Port 5000 allowed"
            fi
        fi
    else
        log_success "UFW is not active"
    fi
fi

# ============================================================================
# Check for proxy issues
# ============================================================================
log_info "\nChecking proxy configuration...\n"

if [ ! -z "$HTTP_PROXY" ] || [ ! -z "$http_proxy" ]; then
    log_warning "HTTP proxy detected: ${HTTP_PROXY:-$http_proxy}"
    log_warning "This may cause connectivity issues"
    
    read -p "Disable proxy for localhost? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        export no_proxy=localhost,127.0.0.1
        export NO_PROXY=localhost,127.0.0.1
        
        # Add to .env.local
        echo "NO_PROXY=localhost,127.0.0.1" >> .env.local
        log_success "Proxy disabled for localhost"
    fi
fi

# ============================================================================
# Generate network configuration file
# ============================================================================
log_info "\nGenerating network configuration...\n"

cat > .network-config.json << 'EOF'
{
  "frontend": {
    "url": "http://localhost:3000",
    "port": 3000,
    "host": "localhost"
  },
  "backend": {
    "url": "http://localhost:5000",
    "port": 5000,
    "host": "localhost"
  },
  "api": {
    "endpoints": {
      "dashboard": "/api/admin/dashboard",
      "providers": "/api/admin/providers",
      "models": "/api/admin/models",
      "health": "/api/health",
      "status": "/api/status"
    }
  },
  "cors": {
    "enabled": true,
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    "headers": ["Content-Type", "Authorization"]
  }
}
EOF

log_success "Created .network-config.json"

# ============================================================================
# Create health check endpoint test
# ============================================================================
log_info "\nCreating health check test...\n"

cat > test-network.sh << 'EOF'
#!/bin/bash

echo "Testing network connectivity..."

# Frontend
echo -n "Frontend (3000): "
curl -s -m 3 http://localhost:3000 > /dev/null && echo "✓ OK" || echo "✗ FAILED"

# Backend
echo -n "Backend (5000): "
curl -s -m 3 http://localhost:5000 > /dev/null && echo "✓ OK" || echo "✗ FAILED"

# API health endpoint
echo -n "API Health: "
curl -s -m 3 http://localhost:5000/api/health > /dev/null && echo "✓ OK" || echo "✗ FAILED"

EOF

chmod +x test-network.sh
log_success "Created test-network.sh"

# ============================================================================
# Final summary
# ============================================================================
echo -e "\n${GREEN}========================================${NC}"
log_success "Network configuration complete!"
echo -e "${GREEN}========================================${NC}\n"

echo "Configuration files created:"
echo "  ✓ .env.local - Updated with correct URLs"
echo "  ✓ .network-config.json - Network configuration"
echo "  ✓ test-network.sh - Connectivity test script"
echo ""
echo "To test connectivity run:"
echo "  bash test-network.sh"
echo ""
echo "Common fixes applied:"
echo "  ✓ CORS settings configured"
echo "  ✓ DNS settings checked"
echo "  ✓ Firewall rules configured (if applicable)"
echo "  ✓ Proxy settings checked"
echo ""

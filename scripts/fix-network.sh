#!/bin/bash

# ZombieCoder Network Configuration
# Fixes connectivity between frontend and backend

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Network Configuration"
echo "==========================================${NC}"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Test connectivity
test_connection() {
    echo -e "${YELLOW}Testing connections...${NC}"
    
    echo -n "Frontend (http://localhost:3000): "
    if timeout 2 curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${YELLOW}Not running${NC}"
    fi
    
    echo -n "Backend (http://localhost:5000): "
    if timeout 2 curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${YELLOW}Not running${NC}"
    fi
    
    echo -n "Internet (8.8.8.8): "
    if timeout 2 curl -s http://8.8.8.8 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${YELLOW}No internet${NC}"
    fi
}

# Configure DNS if needed
configure_dns() {
    echo -e "${YELLOW}Configuring DNS...${NC}"
    
    if ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf 2>/dev/null; then
        echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf > /dev/null 2>&1 || true
        echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf > /dev/null 2>&1 || true
        echo -e "${GREEN}DNS configured${NC}"
    fi
}

# Setup firewall if needed
setup_firewall() {
    if command -v ufw &> /dev/null; then
        echo -e "${YELLOW}Configuring firewall...${NC}"
        sudo ufw allow 3000/tcp 2>/dev/null || true
        sudo ufw allow 5000/tcp 2>/dev/null || true
        echo -e "${GREEN}Firewall configured${NC}"
    fi
}

# Main execution
test_connection
configure_dns
setup_firewall

echo ""
echo -e "${GREEN}Network setup complete${NC}"

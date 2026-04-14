#!/bin/bash

# ZombieCoder Dependency Checker
# Checks if system has all required tools
# For: Ubuntu, Debian, Fedora, CentOS, Alpine

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "ZombieCoder Dependency Check"
echo "==========================================${NC}"
echo ""

MISSING=0
INSTALLED=0

# Helper function
check_cmd() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 installed"
        INSTALLED=$((INSTALLED + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $2 NOT found"
        MISSING=$((MISSING + 1))
        return 1
    fi
}

echo -e "${YELLOW}Checking required tools:${NC}"
echo ""

# Check critical tools
check_cmd "node" "Node.js"
check_cmd "npm" "npm"
check_cmd "git" "Git"
check_cmd "curl" "curl"

echo ""
echo -e "${YELLOW}Optional tools:${NC}"
echo ""

# Optional tools
check_cmd "python3" "Python3" || true
check_cmd "docker" "Docker" || true

echo ""
echo "Summary: $INSTALLED installed, $MISSING missing"
echo ""

if [ $MISSING -gt 0 ]; then
    echo -e "${YELLOW}Install missing dependencies? Run scripts/install.sh${NC}"
    exit 1
else
    echo -e "${GREEN}All critical dependencies are present${NC}"
    exit 0
fi

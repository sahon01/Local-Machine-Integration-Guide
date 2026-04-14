#!/bin/bash

# ZombieCoder Local Machine Integration Guide - Complete Installer
# For Ubuntu/Debian Linux Systems
# Usage: bash install.sh

set -e

echo "=========================================="
echo "ZombieCoder System Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detect OS
detect_os() {
    if grep -qi ubuntu /etc/os-release; then
        echo "Ubuntu detected"
        PKG_MANAGER="apt"
    elif grep -qi debian /etc/os-release; then
        echo "Debian detected"
        PKG_MANAGER="apt"
    elif grep -qi fedora /etc/os-release; then
        echo "Fedora detected"
        PKG_MANAGER="dnf"
    elif grep -qi arch /etc/os-release; then
        echo "Arch Linux detected"
        PKG_MANAGER="pacman"
    else
        echo -e "${RED}Unsupported OS${NC}"
        exit 1
    fi
}

# Check if running as root for package installation
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}Some operations require sudo. You may be prompted for password.${NC}"
    fi
}

# Install system dependencies
install_dependencies() {
    echo -e "${GREEN}Installing system dependencies...${NC}"
    
    if [ "$PKG_MANAGER" = "apt" ]; then
        sudo apt-get update
        sudo apt-get install -y \
            curl \
            wget \
            git \
            nodejs \
            npm \
            python3 \
            python3-pip \
            build-essential \
            libssl-dev \
            libffi-dev \
            postgresql \
            postgresql-contrib \
            redis-server \
            fontconfig \
            fonts-dejavu \
            fonts-liberation \
            fonts-noto \
            fonts-noto-cjk
    elif [ "$PKG_MANAGER" = "dnf" ]; then
        sudo dnf install -y \
            curl \
            wget \
            git \
            nodejs \
            npm \
            python3 \
            python3-pip \
            gcc \
            gcc-c++ \
            make \
            openssl-devel \
            libffi-devel \
            postgresql \
            postgresql-server \
            redis \
            fontconfig \
            dejavu-fonts \
            liberation-fonts \
            google-noto-fonts \
            google-noto-sans-cjk-fonts
    elif [ "$PKG_MANAGER" = "pacman" ]; then
        sudo pacman -Syu --noconfirm \
            curl \
            wget \
            git \
            nodejs \
            npm \
            python \
            python-pip \
            base-devel \
            openssl \
            libffi \
            postgresql \
            redis \
            fontconfig \
            dejavu-fonts \
            liberation-fonts \
            noto-fonts \
            noto-fonts-cjk
    fi
    
    echo -e "${GREEN}System dependencies installed${NC}"
}

# Install Node.js dependencies
install_node_deps() {
    echo -e "${GREEN}Installing Node.js dependencies...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}package.json not found${NC}"
        return 1
    fi
    
    npm install
    npm install -g next
    npm install -g typescript
    
    echo -e "${GREEN}Node dependencies installed${NC}"
}

# Install Python dependencies
install_python_deps() {
    echo -e "${GREEN}Installing Python dependencies...${NC}"
    
    if [ ! -f "requirements.txt" ]; then
        echo -e "${YELLOW}requirements.txt not found, creating basic one...${NC}"
        cat > requirements.txt << 'EOF'
python-dotenv==1.0.0
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
redis==5.0.1
pydantic==2.5.2
aiohttp==3.9.1
requests==2.31.0
EOF
    fi
    
    pip3 install -r requirements.txt
    
    echo -e "${GREEN}Python dependencies installed${NC}"
}

# Setup fonts
setup_fonts() {
    echo -e "${GREEN}Setting up fonts...${NC}"
    
    mkdir -p ~/.local/share/fonts
    
    # Download popular web fonts
    cd ~/.local/share/fonts
    
    # Inter font
    if ! fc-list | grep -q "Inter"; then
        echo "Downloading Inter font..."
        wget -q https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip
        unzip -q Inter-4.0.zip
        rm Inter-4.0.zip
    fi
    
    # Geist font
    if ! fc-list | grep -q "Geist"; then
        echo "Downloading Geist font..."
        wget -q https://github.com/vercel/geist-font/releases/download/1.0.0/GeistMonoVF.woff2
        wget -q https://github.com/vercel/geist-font/releases/download/1.0.0/GeistVF.woff2
    fi
    
    # Refresh font cache
    fc-cache -fv
    
    cd - > /dev/null
    echo -e "${GREEN}Fonts installed${NC}"
}

# Setup database
setup_database() {
    echo -e "${GREEN}Setting up PostgreSQL database...${NC}"
    
    # Start PostgreSQL
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql || true
        sudo systemctl enable postgresql || true
    else
        sudo service postgresql start || true
    fi
    
    # Create database and user (adjust as needed)
    sudo -u postgres psql << EOF || true
CREATE USER zombiecoder WITH PASSWORD 'zombiecoder_dev';
CREATE DATABASE zombiecoder_db OWNER zombiecoder;
ALTER USER zombiecoder CREATEDB;
EOF
    
    echo -e "${GREEN}PostgreSQL database configured${NC}"
}

# Setup Redis
setup_redis() {
    echo -e "${GREEN}Setting up Redis...${NC}"
    
    if command -v systemctl &> /dev/null; then
        sudo systemctl start redis-server || true
        sudo systemctl enable redis-server || true
    else
        sudo service redis-server start || true
    fi
    
    echo -e "${GREEN}Redis configured${NC}"
}

# Fix network connectivity
fix_network() {
    echo -e "${GREEN}Configuring network...${NC}"
    
    # Ensure DNS resolution
    if [ ! -f "/etc/resolv.conf.backup" ]; then
        sudo cp /etc/resolv.conf /etc/resolv.conf.backup
    fi
    
    # Add Google DNS as fallback
    if ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf; then
        echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf > /dev/null
        echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf > /dev/null
    fi
    
    # Test connectivity
    echo "Testing internet connectivity..."
    if ping -c 1 8.8.8.8 &> /dev/null; then
        echo -e "${GREEN}Internet connectivity OK${NC}"
    else
        echo -e "${RED}Internet connectivity check failed${NC}"
        echo "You may need to check your network configuration manually"
    fi
}

# Setup environment
setup_env() {
    echo -e "${GREEN}Setting up environment variables...${NC}"
    
    if [ ! -f ".env" ]; then
        cat > .env << 'EOF'
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend
BACKEND_PORT=5000
DATABASE_URL=postgresql://zombiecoder:zombiecoder_dev@localhost:5432/zombiecoder_db
REDIS_URL=redis://localhost:6379

# API Keys (add your own)
OPENAI_API_KEY=your_api_key_here
ANTHROPIC_API_KEY=your_api_key_here

# Development
NODE_ENV=development
DEBUG=true
EOF
        echo -e "${YELLOW}Created .env file - update API keys as needed${NC}"
    fi
}

# Main installation flow
main() {
    check_root
    detect_os
    
    echo ""
    echo -e "${YELLOW}Starting installation...${NC}"
    echo ""
    
    install_dependencies
    install_node_deps
    install_python_deps
    setup_fonts
    setup_database
    setup_redis
    fix_network
    setup_env
    
    echo ""
    echo -e "${GREEN}=========================================="
    echo "Installation Complete!"
    echo "==========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your API keys"
    echo "2. Run: bash scripts/run.sh"
    echo ""
}

main

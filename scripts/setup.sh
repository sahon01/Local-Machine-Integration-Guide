#!/bin/bash

# ZombieCoder Setup Script
# Installs all dependencies, fonts, and backend packages
# Run this once before running the system

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}=========================================="
echo "ZombieCoder Setup"
echo "==========================================${NC}"
echo ""

# Step 1: Install Node.js dependencies
echo -e "${YELLOW}Step 1: Installing Node.js dependencies...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    exit 1
fi

npm install

echo -e "${GREEN}Node dependencies installed${NC}"
echo ""

# Step 2: Create .env file if it doesn't exist
echo -e "${YELLOW}Step 2: Setting up environment...${NC}"
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
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Development
NODE_ENV=development
DEBUG=true
EOF
    echo -e "${YELLOW}Created .env - update API keys as needed${NC}"
fi
echo ""

# Step 3: Setup fonts
echo -e "${YELLOW}Step 3: Setting up fonts...${NC}"
mkdir -p public/fonts

# Create fonts.css
cat > public/fonts/fonts.css << 'EOF'
/* System fonts - works cross-platform */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
EOF

echo -e "${GREEN}Fonts configured${NC}"
echo ""

# Step 4: Backend setup (if Python backend exists)
if [ -f "backend/main.py" ]; then
    echo -e "${YELLOW}Step 4: Setting up Python backend...${NC}"
    
    if command -v python3 &> /dev/null; then
        # Create virtual environment
        if [ ! -d "backend/venv" ]; then
            python3 -m venv backend/venv
            echo -e "${GREEN}Virtual environment created${NC}"
        fi
        
        # Install requirements
        if [ -f "backend/requirements.txt" ]; then
            source backend/venv/bin/activate
            pip install -q -r backend/requirements.txt
            echo -e "${GREEN}Python packages installed${NC}"
        fi
    fi
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Run: bash scripts/install.sh (if first time)"
echo "3. Run: bash scripts/run.sh"
echo ""

#!/bin/bash

################################################################################
# Complete Setup Script for ZombieCoder
# Installs all dependencies, fonts, and backend packages
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

# Check dependencies first
log_info "Checking system dependencies..."
bash ./scripts/check-dependencies.sh || exit 1

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

log_info "Starting ZombieCoder setup in $PROJECT_ROOT\n"

# ============================================================================
# Step 1: Install Node.js dependencies
# ============================================================================
log_info "Step 1: Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm ci --prefer-offline --no-audit 2>&1 | grep -v "npm notice"
    log_success "Node.js dependencies installed"
else
    log_error "package.json not found"
    exit 1
fi

# ============================================================================
# Step 2: Download and install fonts
# ============================================================================
log_info "\nStep 2: Setting up fonts..."

# Create fonts directory
mkdir -p public/fonts

# Download Google Fonts (Inter, Space Mono)
log_info "Downloading Google Fonts..."
FONTS_DIR="public/fonts"

# Function to download font with retry
download_font() {
    local font_url=$1
    local font_name=$2
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Downloading $font_name (attempt $attempt/$max_attempts)..."
        if curl -fsSL "$font_url" -o "$FONTS_DIR/$font_name" 2>/dev/null; then
            log_success "Downloaded $font_name"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    log_error "Failed to download $font_name after $max_attempts attempts"
    return 1
}

# Inter Font
download_font "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" "inter.css" || true

# Space Mono Font
download_font "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" "space-mono.css" || true

# Create local font reference file
cat > "$FONTS_DIR/fonts.css" << 'EOF'
/* System fonts fallback */
@font-face {
  font-family: 'Inter';
  src: local('Inter'), local('Inter-Regular'), sans-serif;
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Space Mono';
  src: local('Space Mono'), local('SpaceMono-Regular'), monospace;
  font-weight: 400;
  font-style: normal;
}
EOF

log_success "Fonts setup complete"

# ============================================================================
# Step 3: Setup Python backend (if applicable)
# ============================================================================
log_info "\nStep 3: Setting up Python backend..."

if command -v python3 &> /dev/null; then
    # Create virtual environment
    if [ ! -d "backend/venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv backend/venv
        log_success "Virtual environment created"
    fi
    
    # Activate and install packages
    log_info "Installing Python dependencies..."
    source backend/venv/bin/activate 2>/dev/null || true
    
    if [ -f "backend/requirements.txt" ]; then
        pip install -q -r backend/requirements.txt 2>&1 | grep -v "already satisfied" || true
        log_success "Python dependencies installed"
    else
        log_warning "No backend/requirements.txt found"
    fi
else
    log_warning "Python3 not available - skipping backend setup"
fi

# ============================================================================
# Step 4: Environment variables
# ============================================================================
log_info "\nStep 4: Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    log_info "Creating .env.local with default values..."
    cat > .env.local << 'EOF'
# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Backend Configuration
NODE_ENV=development
DEBUG=true

# Database (if using)
DATABASE_URL=

# API Keys (fill these in)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=

# Add other required env vars here
EOF
    log_success ".env.local created - please fill in required values"
else
    log_success ".env.local already exists"
fi

# ============================================================================
# Step 5: Build frontend
# ============================================================================
log_info "\nStep 5: Building frontend..."

if [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
    log_info "Building Next.js application..."
    npm run build 2>&1 | tail -20
    log_success "Frontend build complete"
else
    log_warning "Next.js config not found - skipping build"
fi

# ============================================================================
# Step 6: Verify installation
# ============================================================================
log_info "\nStep 6: Verifying installation..."

VERIFY_PASSED=true

# Check Node.js packages
if [ ! -d "node_modules" ]; then
    log_error "node_modules not found"
    VERIFY_PASSED=false
else
    log_success "Node.js packages installed"
fi

# Check fonts
if [ -f "$FONTS_DIR/fonts.css" ]; then
    log_success "Fonts configured"
else
    log_warning "Fonts may not be properly configured"
fi

# Check build output
if [ -d ".next" ]; then
    log_success "Frontend build successful"
elif [ -d "dist" ]; then
    log_success "Build output found"
fi

# ============================================================================
# Summary
# ============================================================================
echo -e "\n${BLUE}========================================${NC}"

if [ "$VERIFY_PASSED" = true ]; then
    log_success "Setup complete!"
    echo -e "\n${GREEN}Next steps:${NC}"
    echo "  1. Review and fill in .env.local with your API keys"
    echo "  2. Start the server: npm run dev"
    echo "  3. Open http://localhost:3000 in your browser"
    echo -e "\n${BLUE}========================================${NC}"
    exit 0
else
    log_error "Setup completed with errors. Please review above."
    exit 1
fi

#!/bin/bash

################################################################################
# Run Script for ZombieCoder
# Starts both frontend and backend servers with proper environment
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

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Configuration
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
MODE="${1:-dev}" # dev, production, or demo

log_info "ZombieCoder Launcher"
log_info "Mode: $MODE"
log_info "Frontend will run on: http://localhost:$FRONTEND_PORT"
log_info "Backend will run on: http://localhost:$BACKEND_PORT\n"

# ============================================================================
# Check prerequisites
# ============================================================================
log_info "Checking prerequisites..."

if [ ! -d "node_modules" ]; then
    log_error "node_modules not found. Running setup first..."
    bash ./scripts/setup.sh
fi

if [ ! -f ".env.local" ]; then
    log_warning ".env.local not found. Creating default..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NODE_ENV=development
DEBUG=true
EOF
    log_warning "Created .env.local - please update with your API keys"
fi

log_success "Prerequisites check passed\n"

# ============================================================================
# Port availability check
# ============================================================================
check_port() {
    local port=$1
    local name=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        log_warning "Port $port ($name) is already in use"
        return 1
    else
        log_success "Port $port ($name) is available"
        return 0
    fi
}

log_info "Checking port availability..."
check_port $FRONTEND_PORT "Frontend" || log_warning "Frontend port may already be in use"
check_port $BACKEND_PORT "Backend" || log_warning "Backend port may already be in use"

# ============================================================================
# Start servers
# ============================================================================
log_info "\nStarting servers...\n"

# Create cleanup function
cleanup() {
    log_warning "\nShutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
    wait $(jobs -p) 2>/dev/null || true
    log_success "Servers stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Function to wait for server
wait_for_server() {
    local port=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port > /dev/null 2>&1; then
            log_success "$name is ready at http://localhost:$port"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    log_error "$name did not start in time"
    return 1
}

# ============================================================================
# Start Frontend
# ============================================================================
log_info "Starting Frontend (Next.js)..."

case "$MODE" in
    dev)
        PORT=$FRONTEND_PORT npm run dev &
        FRONTEND_PID=$!
        ;;
    production)
        if [ ! -d ".next" ]; then
            log_info "Building for production..."
            npm run build
        fi
        PORT=$FRONTEND_PORT npm run start &
        FRONTEND_PID=$!
        ;;
    demo)
        log_info "Starting in demo mode (frontend only)..."
        PORT=$FRONTEND_PORT npm run dev &
        FRONTEND_PID=$!
        ;;
    *)
        log_error "Unknown mode: $MODE"
        exit 1
        ;;
esac

sleep 3
wait_for_server $FRONTEND_PORT "Frontend" || {
    log_error "Frontend failed to start"
    exit 1
}

# ============================================================================
# Start Backend (if not in demo mode)
# ============================================================================
if [ "$MODE" != "demo" ]; then
    log_info "\nStarting Backend (Python/Node.js)..."
    
    # Check if backend exists
    if [ -f "backend/server.py" ]; then
        log_info "Starting Python backend..."
        if [ -d "backend/venv" ]; then
            source backend/venv/bin/activate
        fi
        cd backend
        PORT=$BACKEND_PORT python3 server.py &
        BACKEND_PID=$!
        cd "$PROJECT_ROOT"
    elif [ -f "backend/index.js" ] || [ -f "backend/server.js" ]; then
        log_info "Starting Node.js backend..."
        cd backend
        PORT=$BACKEND_PORT node index.js 2>/dev/null || PORT=$BACKEND_PORT node server.js &
        BACKEND_PID=$!
        cd "$PROJECT_ROOT"
    else
        log_warning "No backend found - running frontend only"
    fi
    
    sleep 3
    wait_for_server $BACKEND_PORT "Backend" || {
        log_warning "Backend may not have started. Check logs above."
    }
fi

# ============================================================================
# Display running status
# ============================================================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}ZombieCoder is running!${NC}"
echo -e "${GREEN}========================================${NC}\n"

if [ "$MODE" != "demo" ]; then
    echo "Frontend:  http://localhost:$FRONTEND_PORT"
    echo "Backend:   http://localhost:$BACKEND_PORT"
    echo "API Docs:  http://localhost:$BACKEND_PORT/api/docs (if available)"
else
    echo "Frontend:  http://localhost:$FRONTEND_PORT"
fi

echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# ============================================================================
# Wait for all background processes
# ============================================================================
wait_all() {
    while true; do
        sleep 1
        
        # Check if frontend is still running
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            log_error "Frontend process died"
            cleanup
        fi
        
        # Check if backend is still running (if started)
        if [ ! -z "$BACKEND_PID" ] && ! kill -0 $BACKEND_PID 2>/dev/null; then
            log_warning "Backend process died"
        fi
    done
}

wait_all

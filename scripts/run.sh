#!/bin/bash

# ZombieCoder System Runner
# Starts both frontend (Next.js) and backend (Python/FastAPI)
# Usage: bash scripts/run.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}=========================================="
echo "ZombieCoder System Startup"
echo "==========================================${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please run: bash scripts/install.sh"
    exit 1
fi

# Load environment
export $(cat .env | grep -v '^#' | xargs)

# Function to check if port is in use
check_port() {
    if netstat -tuln 2>/dev/null | grep -q ":$1 "; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service
wait_for_service() {
    local host=$1
    local port=$2
    local name=$3
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}Waiting for $name to start...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            echo -e "${GREEN}$name is running${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo -e "${RED}$name failed to start${NC}"
    return 1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not installed${NC}"
    echo "Run: bash scripts/install.sh"
    exit 1
fi
echo -e "${GREEN}Node.js OK ($(node -v))${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not installed${NC}"
    exit 1
fi
echo -e "${GREEN}npm OK ($(npm -v))${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python3 not installed${NC}"
    exit 1
fi
echo -e "${GREEN}Python3 OK ($(python3 --version))${NC}"

# Check PostgreSQL
echo -e "${YELLOW}Checking database...${NC}"
if command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql || true
else
    sudo service postgresql start || true
fi
sleep 2
echo -e "${GREEN}PostgreSQL started${NC}"

# Check Redis
echo -e "${YELLOW}Checking cache...${NC}"
if command -v systemctl &> /dev/null; then
    sudo systemctl start redis-server || true
else
    sudo service redis-server start || true
fi
sleep 2
echo -e "${GREEN}Redis started${NC}"

echo ""
echo -e "${YELLOW}Starting services...${NC}"
echo ""

# Kill existing processes on ports (cleanup)
cleanup_ports() {
    # Frontend port
    if check_port 3000; then
        echo -e "${YELLOW}Cleaning up port 3000...${NC}"
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    # Backend port
    if check_port 5000; then
        echo -e "${YELLOW}Cleaning up port 5000...${NC}"
        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

cleanup_ports

# Start backend (if it exists)
if [ -f "backend/main.py" ]; then
    echo -e "${BLUE}Starting backend on port 5000...${NC}"
    cd "$PROJECT_ROOT/backend"
    python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 5000 &
    BACKEND_PID=$!
    cd "$PROJECT_ROOT"
    wait_for_service localhost 5000 "Backend"
else
    echo -e "${YELLOW}No backend/main.py found, skipping backend${NC}"
fi

# Start frontend
echo -e "${BLUE}Starting frontend on port 3000...${NC}"

# Build frontend if needed
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}Building frontend...${NC}"
    npm run build
fi

npm run dev &
FRONTEND_PID=$!

wait_for_service localhost 3000 "Frontend"

echo ""
echo -e "${GREEN}=========================================="
echo "System is Running!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend:  http://localhost:5000${NC}"
echo -e "${BLUE}API Docs: http://localhost:5000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Trap Ctrl+C to cleanup
trap 'echo -e "\n${YELLOW}Shutting down...${NC}"; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true; exit 0' INT TERM

# Wait for both processes
wait

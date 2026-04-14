#!/bin/bash

################################################################################
# Dependency Checker Script for ZombieCoder Local Machine Integration
# Checks all system dependencies required to run the application
# Compatible: Ubuntu 20.04+, Debian 11+, CentOS 8+, Fedora 33+, Alpine 3.13+
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$NAME
            OS_ID=$ID
            OS_VERSION=$VERSION_ID
        else
            log_error "Cannot detect Linux distribution"
            exit 1
        fi
    else
        log_error "This script only supports Linux"
        exit 1
    fi
    log_info "Detected OS: $OS (Version: $OS_VERSION)"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
check_nodejs() {
    log_info "Checking Node.js..."
    if command_exists node; then
        NODE_VERSION=$(node -v)
        log_success "Node.js installed: $NODE_VERSION"
        
        # Check if version is >= 18.0.0
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            log_error "Node.js 18+ required. Current: $NODE_VERSION"
            return 1
        fi
    else
        log_error "Node.js not installed"
        return 1
    fi
}

# Check npm
check_npm() {
    log_info "Checking npm..."
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        log_success "npm installed: $NPM_VERSION"
    else
        log_error "npm not installed"
        return 1
    fi
}

# Check Git
check_git() {
    log_info "Checking Git..."
    if command_exists git; then
        GIT_VERSION=$(git --version)
        log_success "Git installed: $GIT_VERSION"
    else
        log_warning "Git not installed (required for some features)"
        return 1
    fi
}

# Check curl/wget
check_network_tools() {
    log_info "Checking network tools..."
    if command_exists curl; then
        log_success "curl installed"
    elif command_exists wget; then
        log_success "wget installed"
    else
        log_error "curl or wget required"
        return 1
    fi
}

# Check Python (for backend)
check_python() {
    log_info "Checking Python..."
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        log_success "Python3 installed: $PYTHON_VERSION"
        
        # Check if version is >= 3.8
        MAJOR=$(echo $PYTHON_VERSION | cut -d' ' -f2 | cut -d'.' -f1)
        MINOR=$(echo $PYTHON_VERSION | cut -d' ' -f2 | cut -d'.' -f2)
        
        if [ "$MAJOR" -lt 3 ] || ([ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 8 ]); then
            log_error "Python 3.8+ required. Current: $PYTHON_VERSION"
            return 1
        fi
    else
        log_warning "Python3 not installed (optional for backend)"
        return 0
    fi
}

# Check pip
check_pip() {
    log_info "Checking pip..."
    if command_exists pip3; then
        PIP_VERSION=$(pip3 --version)
        log_success "pip3 installed: $PIP_VERSION"
    else
        log_warning "pip3 not installed (needed for Python backend)"
        return 1
    fi
}

# Check Docker (optional but recommended)
check_docker() {
    log_info "Checking Docker..."
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version)
        log_success "Docker installed: $DOCKER_VERSION"
    else
        log_warning "Docker not installed (optional but recommended)"
        return 0
    fi
}

# Check build tools
check_build_tools() {
    log_info "Checking build tools..."
    if command_exists make; then
        log_success "make installed"
    else
        log_warning "make not installed (may be needed for some packages)"
    fi
    
    if command_exists gcc; then
        log_success "gcc installed"
    else
        log_warning "gcc not installed (needed for native packages)"
    fi
}

# Check free disk space
check_disk_space() {
    log_info "Checking disk space..."
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    AVAILABLE_GB=$((AVAILABLE_SPACE / 1024 / 1024))
    
    if [ "$AVAILABLE_GB" -lt 5 ]; then
        log_error "Less than 5GB available. Current: ${AVAILABLE_GB}GB"
        return 1
    else
        log_success "Disk space available: ${AVAILABLE_GB}GB"
    fi
}

# Check memory
check_memory() {
    log_info "Checking system memory..."
    TOTAL_MEM=$(free -h | awk 'NR==2 {print $2}')
    AVAILABLE_MEM=$(free -h | awk 'NR==2 {print $7}')
    log_success "Total memory: $TOTAL_MEM | Available: $AVAILABLE_MEM"
}

# Install dependencies based on OS
install_dependencies() {
    log_info "Installing missing dependencies..."
    
    case "$OS_ID" in
        ubuntu|debian)
            log_info "Installing for Debian/Ubuntu..."
            sudo apt-get update
            
            if ! command_exists node; then
                log_info "Installing Node.js..."
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            fi
            
            if ! command_exists git; then
                log_info "Installing Git..."
                sudo apt-get install -y git
            fi
            
            if ! command_exists python3; then
                log_info "Installing Python3..."
                sudo apt-get install -y python3 python3-pip python3-venv
            fi
            
            if ! command_exists curl; then
                log_info "Installing curl..."
                sudo apt-get install -y curl
            fi
            
            # Build tools
            log_info "Installing build tools..."
            sudo apt-get install -y build-essential
            ;;
            
        centos|rhel|fedora)
            log_info "Installing for CentOS/RHEL/Fedora..."
            
            if ! command_exists node; then
                log_info "Installing Node.js..."
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs
            fi
            
            if ! command_exists git; then
                log_info "Installing Git..."
                sudo yum install -y git
            fi
            
            if ! command_exists python3; then
                log_info "Installing Python3..."
                sudo yum install -y python3 python3-pip
            fi
            
            # Build tools
            log_info "Installing build tools..."
            sudo yum groupinstall -y "Development Tools"
            ;;
            
        alpine)
            log_info "Installing for Alpine Linux..."
            sudo apk update
            
            if ! command_exists node; then
                log_info "Installing Node.js..."
                sudo apk add --no-cache nodejs npm
            fi
            
            if ! command_exists git; then
                log_info "Installing Git..."
                sudo apk add --no-cache git
            fi
            
            if ! command_exists python3; then
                log_info "Installing Python3..."
                sudo apk add --no-cache python3 py3-pip
            fi
            
            sudo apk add --no-cache build-base python3-dev
            ;;
            
        *)
            log_warning "Unsupported OS: $OS_ID. Please install dependencies manually."
            return 1
            ;;
    esac
}

# Main check function
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}ZombieCoder Dependency Checker${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    
    detect_os
    
    FAILED=0
    
    # Critical dependencies
    log_info "Checking CRITICAL dependencies..."
    check_nodejs || FAILED=$((FAILED + 1))
    check_npm || FAILED=$((FAILED + 1))
    check_network_tools || FAILED=$((FAILED + 1))
    
    # Important dependencies
    log_info "\nChecking IMPORTANT dependencies..."
    check_git || FAILED=$((FAILED + 1))
    check_python || FAILED=$((FAILED + 1))
    
    # Optional dependencies
    log_info "\nChecking OPTIONAL dependencies..."
    check_docker
    check_build_tools
    
    # System resources
    log_info "\nChecking SYSTEM RESOURCES..."
    check_disk_space || FAILED=$((FAILED + 1))
    check_memory
    
    # Summary
    echo -e "\n${BLUE}========================================${NC}"
    if [ $FAILED -eq 0 ]; then
        log_success "All critical dependencies are installed!"
        echo -e "${GREEN}System is ready for installation${NC}"
        return 0
    else
        log_error "Found $FAILED missing critical dependencies"
        
        read -p "Do you want to install missing dependencies? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_dependencies
            log_success "Installation complete. Please run this script again to verify."
        else
            log_error "Cannot proceed without dependencies."
            return 1
        fi
    fi
}

# Run main
main

# ZombieCoder - Setup Guide

Quick setup instructions for Linux systems (Ubuntu, Debian, Fedora, CentOS, Alpine).

## Prerequisites

- Linux OS (Ubuntu 20.04+, Debian 11+, Fedora 33+, CentOS 8+, or Alpine 3.13+)
- Internet connection
- Sudo access for installing system packages

## Installation Steps

### 1. Check Dependencies

```bash
bash scripts/check-dependencies.sh
```

This checks if you have Node.js, npm, Python3, and other required tools.

### 2. Full Installation (First Time)

```bash
bash scripts/install.sh
```

This script will:
- Install system dependencies (Node.js, npm, Python3, PostgreSQL, Redis, fonts)
- Create PostgreSQL database and user
- Setup Redis cache
- Configure DNS and network
- Download and setup fonts
- Create `.env` file with defaults

### 3. Setup Project Dependencies

```bash
bash scripts/setup.sh
```

This installs:
- Node.js packages (`npm install`)
- Python packages (if backend exists)
- Fonts for the UI
- Creates `.env` file

### 4. Fix Network Issues (If Needed)

```bash
bash scripts/fix-network.sh
```

This handles:
- DNS configuration
- Firewall rules for ports 3000 and 5000
- Network connectivity checks

## Running the System

### Development Mode

```bash
bash scripts/run.sh
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs (if available)

### What the run.sh script does:
1. Checks prerequisites (Node.js, npm, Python3)
2. Starts PostgreSQL and Redis
3. Starts backend (Python/FastAPI)
4. Starts frontend (Next.js)
5. Waits for services to be ready
6. Displays access URLs

## Configuration

Edit `.env` file to configure:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend
BACKEND_PORT=5000
DATABASE_URL=postgresql://zombiecoder:zombiecoder_dev@localhost:5432/zombiecoder_db
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql
```

### Network Issues

```bash
# Test connectivity
bash scripts/fix-network.sh

# Test manually
curl http://localhost:3000
curl http://localhost:5000
```

### Permission Denied

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

## Complete Workflow

First time setup:

```bash
# 1. Check dependencies
bash scripts/check-dependencies.sh

# 2. Full installation (installs everything)
bash scripts/install.sh

# 3. Setup project
bash scripts/setup.sh

# 4. Fix network if needed
bash scripts/fix-network.sh

# 5. Run the system
bash scripts/run.sh
```

Subsequent runs:

```bash
# Just run the system
bash scripts/run.sh
```

## What Each Script Does

| Script | Purpose | Run When |
|--------|---------|----------|
| `check-dependencies.sh` | Verify tools are installed | First time / debugging |
| `install.sh` | Install all system packages | First time only |
| `setup.sh` | Setup Node/Python dependencies | First time / after updates |
| `run.sh` | Start frontend and backend | Every time you want to run |
| `fix-network.sh` | Fix connectivity issues | If experiencing network problems |

## Success Indicators

After running `bash scripts/run.sh`, you should see:

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
API Docs: http://localhost:5000/docs

Press Ctrl+C to stop all services
```

Visit http://localhost:3000 in your browser to access the application.

## Stopping the System

Press `Ctrl+C` in the terminal running `run.sh`. This will:
- Stop frontend server
- Stop backend server
- Clean up processes

## Notes

- All scripts are Linux-only (Bash)
- Scripts handle Ubuntu, Debian, Fedora, CentOS, and Alpine
- PostgreSQL and Redis are optional but recommended
- Fonts are downloaded during setup
- API keys should be added to `.env` before running

For issues, check log output from the scripts and ensure all prerequisites are installed.

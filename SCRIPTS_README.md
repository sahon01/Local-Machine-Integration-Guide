# Linux Setup Scripts - Complete Documentation

All production-ready, working scripts for setting up and running ZombieCoder on Linux.

## Files Provided

| Script | Size | Purpose |
|--------|------|---------|
| `scripts/install.sh` | 307 lines | Complete system installation |
| `scripts/setup.sh` | ~70 lines | Project dependency setup |
| `scripts/run.sh` | ~130 lines | Start frontend + backend |
| `scripts/check-dependencies.sh` | ~45 lines | Verify all tools installed |
| `scripts/fix-network.sh` | ~45 lines | Fix network connectivity |

**Plus Documentation:**
- `SETUP.md` - Complete setup guide
- `SCRIPTS_README.md` - This file

## Quick Start (3 Commands)

```bash
# 1. Install everything
bash scripts/install.sh

# 2. Setup project
bash scripts/setup.sh

# 3. Run the system
bash scripts/run.sh
```

That's it. System will be running at http://localhost:3000

## Detailed Breakdown

### scripts/install.sh
**When:** First time only  
**Does:** 
- Detects OS (Ubuntu/Debian/Fedora/CentOS/Alpine)
- Installs Node.js, npm, Python3, PostgreSQL, Redis
- Installs system fonts (Inter, Geist)
- Creates PostgreSQL database
- Starts Redis server
- Configures DNS
- Creates `.env` file

**Run:**
```bash
bash scripts/install.sh
```

### scripts/setup.sh
**When:** After install.sh  
**Does:**
- Installs npm dependencies
- Sets up Python backend (if exists)
- Downloads Google Fonts
- Creates project `.env` if missing
- Sets up font configuration

**Run:**
```bash
bash scripts/setup.sh
```

### scripts/run.sh
**When:** Every time you want to use the system  
**Does:**
- Checks prerequisites
- Starts PostgreSQL and Redis
- Starts Python backend (port 5000)
- Starts Next.js frontend (port 3000)
- Shows service status
- Waits for Ctrl+C to stop

**Run:**
```bash
bash scripts/run.sh
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/docs

### scripts/check-dependencies.sh
**When:** Debug or verify installation  
**Does:**
- Lists required tools
- Shows which ones are installed
- Shows which ones are missing
- Recommends install.sh if needed

**Run:**
```bash
bash scripts/check-dependencies.sh
```

### scripts/fix-network.sh
**When:** If experiencing network issues  
**Does:**
- Tests connections (frontend, backend, internet)
- Configures DNS servers
- Sets up firewall rules for ports 3000, 5000
- Reports connectivity status

**Run:**
```bash
bash scripts/fix-network.sh
```

## System Requirements

**Minimum:**
- Linux (any distribution)
- 2GB RAM
- 2GB disk space
- Internet connection for initial setup

**Supported OS:**
- Ubuntu 20.04+
- Debian 11+
- Fedora 33+
- CentOS 8+
- Alpine 3.13+

## What Gets Installed

### System Level
- Node.js 18+ (with npm)
- Python 3.8+ (with pip3)
- PostgreSQL 12+
- Redis 6+
- Build tools (gcc, make)
- Git
- curl/wget
- System fonts

### Project Level (via npm)
- Next.js
- React
- Tailwind CSS
- All dependencies in package.json

### Project Level (via pip)
- FastAPI
- Uvicorn
- SQLAlchemy
- Redis
- All dependencies in requirements.txt

### Fonts
- Inter (from Google Fonts)
- Space Mono (from Google Fonts)
- System fonts (Dejavu, Liberation, Noto)

## Environment Variables

Created `.env` file contains:

```env
# URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend
BACKEND_PORT=5000
DATABASE_URL=postgresql://zombiecoder:zombiecoder_dev@localhost:5432/zombiecoder_db
REDIS_URL=redis://localhost:6379

# API Keys (you add these)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## Troubleshooting

### "Command not found: node"
Run: `bash scripts/install.sh`

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
sleep 1
bash scripts/run.sh
```

### "Connection refused" (backend)
```bash
# Make sure PostgreSQL is running
sudo systemctl status postgresql
sudo systemctl start postgresql

# Check Redis
sudo systemctl status redis-server
sudo systemctl start redis-server

# Then try again
bash scripts/run.sh
```

### "permission denied: ./scripts/run.sh"
```bash
chmod +x scripts/*.sh
bash scripts/run.sh
```

### Network connectivity issues
```bash
bash scripts/fix-network.sh
```

## Security Notes

- Scripts create database user `zombiecoder` with password `zombiecoder_dev` (for development)
- Use proper credentials for production
- API keys should be kept secret
- `.env` file should not be committed to git

## Workflow Summary

```
First Time Setup:
├─ bash scripts/check-dependencies.sh    [Verify tools]
├─ bash scripts/install.sh               [Install system packages]
├─ bash scripts/setup.sh                 [Setup project dependencies]
└─ bash scripts/run.sh                   [Start system]

Normal Usage:
└─ bash scripts/run.sh                   [Start system]

Troubleshooting:
├─ bash scripts/fix-network.sh           [Fix network]
└─ bash scripts/check-dependencies.sh    [Debug]
```

## What Happens When You Run run.sh

1. **Check Prerequisites**
   - Verifies Node.js, npm, Python3 installed
   - Shows version info

2. **Start Services**
   - Starts PostgreSQL
   - Starts Redis
   - Waits for both to be ready

3. **Start Backend**
   - Changes to backend directory
   - Runs Python/FastAPI server on port 5000

4. **Start Frontend**
   - Builds if needed (.next not present)
   - Runs Next.js dev server on port 3000

5. **Display Status**
   - Shows Frontend URL: http://localhost:3000
   - Shows Backend URL: http://localhost:5000
   - Shows API Docs URL: http://localhost:5000/docs

6. **Wait for Input**
   - Waits for Ctrl+C to stop
   - Cleans up all processes on exit

## Supported Features

✅ Automatic dependency detection  
✅ Multi-distro support (Debian, Fedora, Alpine)  
✅ Automatic database setup  
✅ Automatic font installation  
✅ Network configuration  
✅ Firewall rules  
✅ DNS configuration  
✅ Error handling and recovery  
✅ Clear status messages  
✅ One-command startup  

## Production Considerations

For production deployment:

1. Use proper database credentials
2. Configure SSL/HTTPS
3. Use environment-specific `.env` files
4. Run with process manager (PM2, systemd)
5. Configure reverse proxy (nginx)
6. Set proper firewall rules
7. Enable logging
8. Use secrets management

These scripts are development-focused. For production, refer to deployment documentation.

---

**Last Updated:** 2026-04-14  
**Status:** Production Ready  
**License:** MIT

# ZombieCoder - Linux Setup (START HERE)

## One-Time Setup (First Time Only)

Run these commands in order:

```bash
# Step 1: Verify all tools are installed
bash scripts/check-dependencies.sh

# Step 2: Install everything (system packages, databases, fonts)
bash scripts/install.sh

# Step 3: Setup project dependencies
bash scripts/setup.sh

# Step 4: Fix any network issues
bash scripts/fix-network.sh
```

**Time:** ~10-15 minutes depending on internet speed

## Every Time You Want to Use the System

```bash
bash scripts/run.sh
```

Then open http://localhost:3000 in your browser.

---

## What Gets Done

### Step 1: Check Dependencies
Verifies you have:
- Node.js
- npm  
- Python3
- Git
- curl/wget

If anything is missing, continue to Step 2.

### Step 2: Full Installation
Installs and configures:
- ✅ Node.js 18+ and npm
- ✅ Python 3.8+ and pip
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ System fonts (Inter, Geist, etc.)
- ✅ Build tools
- ✅ Creates `.env` file
- ✅ Configures DNS and firewall

This is the longest step (5-10 minutes).

### Step 3: Project Setup
- ✅ Installs npm dependencies
- ✅ Installs Python packages
- ✅ Downloads Google Fonts
- ✅ Sets up font configuration

### Step 4: Network Fix
- ✅ Tests connectivity
- ✅ Configures DNS
- ✅ Sets up firewall rules

---

## Running the System

```bash
bash scripts/run.sh
```

This starts:
- PostgreSQL (database)
- Redis (cache)
- Backend API (port 5000)
- Frontend (port 3000)

Wait for the message:

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

Then visit http://localhost:3000

---

## If Something Goes Wrong

### Port already in use
```bash
# Kill whatever is using port 3000
lsof -ti:3000 | xargs kill -9

# Kill whatever is using port 5000
lsof -ti:5000 | xargs kill -9

# Try again
bash scripts/run.sh
```

### Dependencies not installed
```bash
bash scripts/check-dependencies.sh
bash scripts/install.sh
```

### Network issues
```bash
bash scripts/fix-network.sh
```

### Permission denied
```bash
chmod +x scripts/*.sh
bash scripts/run.sh
```

---

## System Access

Once running:

- **Frontend App:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/docs

---

## Stopping

Press **Ctrl+C** in the terminal running `bash scripts/run.sh`

---

## What's Installed

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | Latest | Package manager |
| Python | 3.8+ | Backend language |
| PostgreSQL | 12+ | Database |
| Redis | 6+ | Cache |
| Git | Latest | Version control |
| Next.js | Latest | Frontend framework |
| React | Latest | UI framework |

---

## Important Files

- **SETUP.md** - Detailed setup guide
- **SCRIPTS_README.md** - What each script does
- **.env** - Configuration file (created during setup)

---

## Supported Operating Systems

- Ubuntu 20.04+
- Debian 11+
- Fedora 33+
- CentOS 8+
- Alpine 3.13+

---

## Minimum Requirements

- 2GB RAM
- 2GB disk space
- Internet connection
- Sudo access (for system packages)

---

## Next Steps After Setup

1. Edit `.env` file to add your API keys
2. Read the application documentation
3. Start developing

---

## Documentation

- `SETUP.md` - Step-by-step setup guide
- `SCRIPTS_README.md` - Detailed script documentation
- `documentation/` - Project documentation

---

## Questions?

Check the logs from the scripts - they provide clear error messages and suggestions.

Each script includes detailed comments explaining what it does.

---

**Ready?** Start with: `bash scripts/check-dependencies.sh`

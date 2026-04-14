# Installation Verification Checklist

Use this to verify everything was installed correctly.

## After Running `scripts/install.sh`

### System Packages
- [ ] Node.js installed: `node --version` (should show v18+)
- [ ] npm installed: `npm --version`
- [ ] Python3 installed: `python3 --version` (should show 3.8+)
- [ ] PostgreSQL running: `sudo systemctl status postgresql`
- [ ] Redis running: `sudo systemctl status redis-server`
- [ ] Git installed: `git --version`

### Databases
- [ ] PostgreSQL database exists: `sudo -u postgres psql -l | grep zombiecoder`
- [ ] Database user created: `sudo -u postgres psql -c "SELECT * FROM pg_user WHERE usename='zombiecoder'"`
- [ ] Redis is listening: `redis-cli ping` (should return "PONG")

### Environment
- [ ] `.env` file exists in project root
- [ ] `.env` contains `DATABASE_URL`
- [ ] `.env` contains `REDIS_URL`
- [ ] `.env` contains `NEXT_PUBLIC_API_URL`

---

## After Running `scripts/setup.sh`

### Node Packages
- [ ] `node_modules/` directory exists
- [ ] No errors during npm install
- [ ] `next` is installed: `npm list next`

### Python Packages (if backend exists)
- [ ] `backend/venv` directory exists (if backend exists)
- [ ] Python packages installed: `source backend/venv/bin/activate && pip list`

### Fonts
- [ ] `public/fonts/` directory exists
- [ ] `public/fonts/fonts.css` exists

### Build
- [ ] Next.js build succeeds: `.next` directory exists
- [ ] No build errors in console

---

## After Running `scripts/run.sh`

### Services Running
- [ ] PostgreSQL running: `ps aux | grep postgres`
- [ ] Redis running: `ps aux | grep redis`
- [ ] Backend running: `ps aux | grep "python\|uvicorn"` or `ps aux | grep "node"`
- [ ] Frontend running: `ps aux | grep "next\|node"`

### Port Availability
- [ ] Port 3000 open: `netstat -tuln | grep 3000`
- [ ] Port 5000 open: `netstat -tuln | grep 5000`

### Connectivity
- [ ] Frontend accessible: `curl http://localhost:3000` (should return HTML)
- [ ] Backend accessible: `curl http://localhost:5000` (should return JSON or 404, not "connection refused")
- [ ] DNS working: `curl http://8.8.8.8` (should work or timeout, not "name resolution failed")

---

## Manual Tests

### Test Database Connection
```bash
psql -U zombiecoder -d zombiecoder_db -c "SELECT 1;"
```
Should return: `?column?`  
       `1`

### Test Redis Connection
```bash
redis-cli ping
```
Should return: `PONG`

### Test API Health (if backend has health endpoint)
```bash
curl http://localhost:5000/api/health
```
Should return JSON response (not error)

### Test Frontend
Open browser to: `http://localhost:3000`
Should see the application (not error page)

---

## If Tests Fail

### Node/npm not found
```bash
# Install Node.js
bash scripts/install.sh

# Verify
node --version
npm --version
```

### PostgreSQL connection error
```bash
# Check if running
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql

# Verify connection
psql -U zombiecoder -d zombiecoder_db -c "SELECT 1;"
```

### Redis connection error
```bash
# Check if running
sudo systemctl status redis-server

# Start if stopped
sudo systemctl start redis-server

# Verify connection
redis-cli ping
```

### Port already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Do same for port 5000
lsof -i :5000
kill -9 <PID>
```

### Network connectivity
```bash
# Run network fix
bash scripts/fix-network.sh

# Test
curl http://8.8.8.8
ping -c 1 8.8.8.8
```

### Frontend build failed
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Success Indicators

When everything is working correctly:

1. **All packages installed** without errors
2. **Databases running** and accessible
3. **Ports 3000 and 5000 open** and listening
4. **Frontend loads** in browser
5. **Backend API responding** to requests
6. **No error messages** in console

---

## Verification Script

You can create this script to automate verification:

```bash
#!/bin/bash

echo "=== Installation Verification ==="
echo ""

echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "npm: $(npm --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "Python: $(python3 --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "Git: $(git --version 2>/dev/null || echo 'NOT INSTALLED')"
echo ""

echo "PostgreSQL status: $(sudo systemctl is-active postgresql 2>/dev/null || echo 'Unknown')"
echo "Redis status: $(sudo systemctl is-active redis-server 2>/dev/null || echo 'Unknown')"
echo ""

echo "Frontend port (3000): $(curl -s http://localhost:3000 > /dev/null && echo 'OPEN' || echo 'CLOSED')"
echo "Backend port (5000): $(curl -s http://localhost:5000 > /dev/null && echo 'OPEN' || echo 'CLOSED')"
echo ""

echo ".env file: $([ -f .env ] && echo 'EXISTS' || echo 'MISSING')"
echo "node_modules: $([ -d node_modules ] && echo 'EXISTS' || echo 'MISSING')"
echo ".next build: $([ -d .next ] && echo 'EXISTS' || echo 'MISSING')"
```

Save as `verify.sh`, run with `bash verify.sh`

---

## Still Having Issues?

1. **Check logs:** Look at console output for error messages
2. **Run individually:** Test each script separately
3. **Check prerequisites:** `bash scripts/check-dependencies.sh`
4. **Fix network:** `bash scripts/fix-network.sh`
5. **Review documentation:** Check SETUP.md and SCRIPTS_README.md

Every error has a solution - the key is identifying which component is failing.

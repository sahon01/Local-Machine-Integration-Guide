# Getting Started - ZombieCoder AI Panel

Complete setup guide from zero to production.

## System Requirements

### Operating System
- Windows 10/11 (Recommended) or Linux/Mac
- Administrator access for installations

### Software
- **Node.js**: 18.x or 20.x (LTS recommended)
- **npm**: 9.x or higher
- **Git**: Latest version (optional, for version control)

### Hardware Minimum
- CPU: 4 cores
- RAM: 8 GB
- Storage: 10 GB SSD
- Network: 100 Mbps

## Installation (Windows)

### Step 1: Install Node.js

1. Download from https://nodejs.org/ (LTS version)
2. Run installer with administrator privileges
3. Follow default installation steps
4. Open PowerShell and verify:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Clone/Download Project

```powershell
# Option 1: Using Git
git clone <your-repo-url>
cd zombiecoder-ai-panel

# Option 2: Download ZIP
# Extract the downloaded file
# Open PowerShell in the extracted folder
```

### Step 3: Install Dependencies

```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 4: Configure Environment

```powershell
# Copy and modify environment file
Copy-Item ".env.setup" -Destination ".env.local"
Copy-Item "backend\.env.setup" -Destination "backend\.env"

# Edit .env.local and backend\.env with your settings
# At minimum, configure:
# - NEXT_PUBLIC_API_URL
# - JWT_SECRET
# - API_KEYS for providers
```

### Step 5: Initialize Database

```powershell
# Navigate to backend
cd backend

# Run seed script
npm run seed

# You should see:
# [Seed] Database seeding completed successfully!
# [Seed] Default credentials:
#   Admin: administrator / admin123456
#   User 1: dev-user-one / user123456
#   User 2: dev-user-two / user123456

cd ..
```

### Step 6: Start Services

Open 2 PowerShell windows:

**Terminal 1 - Backend API:**
```powershell
cd backend
npm run dev
# Should show: [Server] Running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
# Should show: ▲ Next.js 15.0
#            - Local: http://localhost:3000
```

### Step 7: Access Application

Open browser and navigate to:

```
Frontend: http://localhost:3000
Admin:    http://localhost:3000/admin
Chat:     http://localhost:3000/chat
API Docs: http://localhost:5000/docs
```

## Quick Start Credentials

Use these to test the system:

### Admin Account
- **URL**: http://localhost:3000/auth/login
- **Username**: administrator
- **Password**: admin123456
- **Access**: Full admin dashboard

### User Account 1
- **URL**: http://localhost:3000/auth/login
- **Username**: dev-user-one
- **Password**: user123456
- **Access**: Chat interface only

### User Account 2
- **URL**: http://localhost:3000/auth/login
- **Username**: dev-user-two
- **Password**: user123456
- **Access**: Chat interface only

## First Run Checklist

After installation, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads on http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Admin dashboard displays all pages
- [ ] Can login with user credentials
- [ ] Chat interface works
- [ ] Can send messages and receive responses
- [ ] Logout works correctly

## Project Structure

```
zombiecoder-ai-panel/
├── app/                          # Next.js frontend
│   ├── admin/                    # Admin dashboard pages
│   ├── auth/                     # Authentication pages
│   ├── chat/                     # Public chat interface
│   ├── api/                      # API routes
│   ├── layout.tsx                # Main layout
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── admin/                    # Admin components
│   ├── chat/                     # Chat components
│   └── ui/                       # UI library (shadcn)
│
├── backend/                      # Express backend
│   ├── src/
│   │   ├── routes/              # API routes (8 modules)
│   │   ├── services/            # Business logic services
│   │   ├── middleware/          # Express middleware
│   │   ├── database/            # Database layer
│   │   └── config/              # Configuration files
│   ├── data/                    # SQLite database
│   └── .env                     # Backend config
│
├── public/                       # Static assets
├── lib/                          # Utility functions
├── .env.local                    # Frontend config
├── package.json                  # Dependencies
└── Documentation files           # Guides and references
```

## Development Workflow

### Making Changes

1. **Backend Changes**:
   ```powershell
   # Backend auto-reloads with nodemon
   # Edit files in backend/src/
   # Changes apply immediately
   ```

2. **Frontend Changes**:
   ```powershell
   # Frontend hot-reloads automatically
   # Edit files in app/, components/, lib/
   # Refresh browser to see changes
   ```

3. **Database Changes**:
   ```powershell
   # Stop both servers
   # Modify database schema in backend/src/database/init.ts
   # Delete data/zombiecoder.db
   # npm run seed
   # Restart servers
   ```

### Testing Changes

1. Test in browser at http://localhost:3000
2. Check backend logs in Terminal 1
3. Check frontend console (F12)
4. Verify no errors appear

### Git Workflow (Optional)

```powershell
# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

## Common Issues

### Port Already in Use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Locked

```powershell
# Stop all servers
# Delete database
Remove-Item backend/data/zombiecoder.db -Force

# Reseed
cd backend
npm run seed
cd ..

# Restart servers
```

### Node Modules Issues

```powershell
# Clear and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

# Same for backend
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
cd ..
```

### Memory Issues

```powershell
# Increase Node memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## Building for Production

### Create Production Build

```powershell
# Frontend build
npm run build

# Backend is already production-ready
# Just use npm start instead of npm run dev
```

### Deployment Steps

1. Update `.env.local` with production URLs
2. Update `backend/.env` with production settings
3. Use production API keys for providers
4. Run database migrations if needed
5. Deploy to hosting platform (Vercel, AWS, etc.)

### Environment Variables for Production

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
JWT_SECRET=<very-long-random-string>
OPENAI_API_KEY=<your-production-key>
```

## Support & Documentation

### Quick References
- API Documentation: `/API_TESTING.md`
- Feature Checklist: `/FEATURE_CHECKLIST.md`
- Verification Guide: `/SYSTEM_VERIFICATION.md`
- Architecture: `/ARCHITECTURE.md`
- Quick Reference: `/QUICK_REFERENCE.md`

### Troubleshooting
- Check logs in backend terminal
- Check browser console (F12)
- Review error messages carefully
- Search documentation for similar issues
- Contact support if stuck

## Next Steps After Setup

1. **Configure Providers**:
   - Get API keys from OpenAI, Ollama, Gemini
   - Add keys to backend/.env
   - Test provider connections

2. **Customize System**:
   - Update branding in components
   - Modify agent prompts
   - Add custom tools

3. **Add Data**:
   - Import documents for RAG
   - Create custom agents
   - Set up webhooks

4. **Monitor System**:
   - Watch backend logs
   - Check analytics dashboard
   - Review usage metrics

5. **Scale Up**:
   - Deploy to production
   - Set up monitoring
   - Configure backups
   - Enable high availability

## Congratulations! 🎉

Your ZombieCoder AI Infrastructure Panel is ready to use. Start exploring the features and building amazing AI-powered applications!

For questions or issues, refer to the comprehensive documentation included in the project.

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Support**: infi@zombiecoder.my.id  
**Website**: https://zombiecoder.my.id

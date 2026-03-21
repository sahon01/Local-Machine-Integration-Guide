# System Verification Guide

Complete checklist to verify all components are working correctly.

## Prerequisites

- Node.js 18+
- npm or yarn
- SQLite 3
- Port 3000 (Frontend) and 5000 (Backend) available

## Step 1: Database Seeding

```bash
# Navigate to backend
cd backend

# Run seed script
npm run seed
```

**Expected Output:**
```
[Seed] Starting database seeding...
[Seed] Database schema initialized
[Seed] Seeding users table...
[Seed] Seeding providers table...
[Seed] Seeding models table...
[Seed] Seeding agents table...
[Seed] Seeding servers table...
[Seed] Seeding tools table...
[Seed] Seeding settings table...
[Seed] Database seeding completed successfully!
[Seed] Default credentials:
  Admin: administrator / admin123456
  User 1: dev-user-one / user123456
  User 2: dev-user-two / user123456
```

## Step 2: Backend Server Startup

```bash
# Terminal 1: Start Backend API
cd backend
npm install
npm run dev
```

**Expected Output:**
```
[Server] Running on http://localhost:5000
[CORS] Enabled for http://localhost:3000
[WebSocket] Enabled at ws://localhost:5000/api/ws
[API Docs] Available at http://localhost:5000/docs
```

**Verification:**
- Visit http://localhost:5000/api/admin/health/all in browser
- Should return JSON with system health status

## Step 3: Frontend Setup

```bash
# Terminal 2: Start Frontend
npm install
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 15.0
   - Local:        http://localhost:3000
   - Environments: .env.local
```

## Step 4: Authentication Testing

### Admin Login Test

1. Navigate to http://localhost:3000/auth/login
2. Enter credentials:
   - Username: `administrator`
   - Password: `admin123456`
3. Should redirect to `/admin` dashboard
4. Verify navbar shows "administrator" and "admin" role

### User Login Test

1. Navigate to http://localhost:3000/auth/login
2. Enter credentials:
   - Username: `dev-user-one`
   - Password: `user123456`
3. Should redirect to `/chat` page
4. Verify navbar shows "dev-user-one" and "user" role

### Registration Test

1. Navigate to http://localhost:3000/auth/register
2. Fill form with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123456`
   - Confirm Password: `Test123456`
3. Should show success message
4. Should redirect to login page
5. Verify new user can login

## Step 5: Admin Dashboard Testing

### Access Control
- Navigate to http://localhost:3000/admin
- Should require admin login
- Non-admin users should be redirected to `/chat`

### Dashboard Pages (Verify Each)

```
✓ /admin - Dashboard Overview
✓ /admin/providers - Provider Management
✓ /admin/models - Model Management
✓ /admin/agents - Agent Management
✓ /admin/agents/chat - Agent Chat Interface
✓ /admin/agents/editor - Agent Code Editor
✓ /admin/agents/master - Master Agent Control
✓ /admin/servers - Server Management
✓ /admin/servers/monitoring - Real-time Monitoring
✓ /admin/tools - Tools Management
✓ /admin/memory-management - Memory & History
✓ /admin/analytics - Analytics Dashboard
✓ /admin/users - User Management
```

**Check for each page:**
- Loads without errors
- Navigation sidebar is visible
- Navbar displays user info
- Data loads from backend

## Step 6: Chat Interface Testing

### New Chat
1. Login as user: `dev-user-one`
2. Click "New chat" button
3. Verify new conversation is created
4. Should be able to enter text

### Send Message
1. Type: `Hello, how are you?`
2. Click send button
3. Verify:
   - User message appears on right (blue)
   - Loading indicator shows
   - Response appears on left (gray)
   - Response uses markdown formatting
   - Real-time typing effect visible

### HTML Rendering
1. Send: `Show me an **example** of markdown`
2. Verify response is properly rendered:
   - Bold text appears bold
   - Code blocks have dark background
   - Lists are properly formatted
   - Links are clickable

### Conversation History
1. Send multiple messages
2. Refresh page
3. Verify:
   - Conversation persists in sidebar
   - Message history is preserved
   - All previous messages display

### Search Chats
1. Click in "Search chats" box
2. Type conversation title
3. Verify filtering works

## Step 7: Backend API Testing

### Health Check
```bash
curl http://localhost:5000/api/admin/health/all
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "agents": "ok"
  }
}
```

### Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "administrator",
    "password": "admin123456"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "admin-001",
    "username": "administrator",
    "email": "admin@zombiecoder.my.id",
    "role": "admin"
  }
}
```

### Chat Completions
```bash
curl -X POST http://localhost:5000/api/completions/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'
```

## Step 8: Database Verification

### Check Users Table
```sql
SELECT username, role, email FROM users;
```

**Expected Results:**
```
| username      | role  | email                        |
|---------------|-------|------------------------------|
| administrator | admin | admin@zombiecoder.my.id      |
| dev-user-one  | user  | user1@zombiecoder.my.id      |
| dev-user-two  | user  | user2@zombiecoder.my.id      |
```

### Check Providers Table
```sql
SELECT name, type, is_active FROM providers;
```

### Check Models Table
```sql
SELECT name, provider_id, status FROM models;
```

### Check Agents Table
```sql
SELECT name, model_id, is_active FROM agents;
```

## Step 9: Feature Checklist

- [ ] Admin can login successfully
- [ ] User can login successfully
- [ ] New user registration works
- [ ] Admin dashboard loads all pages
- [ ] Chat interface responds to messages
- [ ] Markdown renders correctly in chat
- [ ] HTML responses display properly
- [ ] Real-time typing visible
- [ ] Conversation history saves
- [ ] Logout clears authentication
- [ ] Unauthorized access redirects properly
- [ ] Backend API endpoints respond
- [ ] Database seeding completes
- [ ] WebSocket connection establishes
- [ ] Admin sidebar navigation works

## Step 10: Browser Console Check

Open browser DevTools (F12) and check:

**No Critical Errors:**
- [ ] No red error messages
- [ ] No undefined variable warnings
- [ ] No CORS errors

**Network Tab:**
- [ ] API calls to `localhost:5000` succeeding
- [ ] Status codes are 200/201 for success
- [ ] No 401/403 authorization failures
- [ ] WebSocket connection established

## Step 11: Performance Check

- [ ] Page loads in < 3 seconds
- [ ] Chat responses stream smoothly
- [ ] No lag when typing
- [ ] No memory leaks (check DevTools)
- [ ] CPU usage normal during idle

## Troubleshooting

### Backend won't start
```bash
# Check port 5000 is available
lsof -i :5000

# Check Node.js version
node --version  # Should be 18+

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Reinitialize database
rm -f ./data/zombiecoder.db
npm run seed
```

### Frontend won't connect
```bash
# Check .env.local has correct API URL
cat .env.local

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Authentication failing
- Check token is stored in localStorage
- Verify token expiration
- Check backend JWT secret matches
- Review browser console for errors

### WebSocket connection issues
- Check WebSocket endpoint: `ws://localhost:5000/api/ws`
- Verify CORS allows WebSocket
- Check firewall isn't blocking port 5000

## Success Criteria

✅ All checklist items completed
✅ No critical errors in console
✅ All API endpoints respond correctly
✅ Database contains seeded data
✅ Authentication works for admin and user
✅ Chat interface streams responses
✅ Admin dashboard fully functional
✅ Real-time features working

## Next Steps

If verification passes:
1. Deploy to production
2. Update environment variables
3. Configure real provider API keys
4. Monitor system logs
5. Set up regular backups

If issues found:
1. Check logs for specific errors
2. Verify all dependencies installed
3. Review configuration files
4. Test with different browsers
5. Contact support if needed

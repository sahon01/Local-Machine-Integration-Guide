# Critical Issue #4: Admin Panel Dynamic Data Loading

**Status:** MISSING / STATIC  
**Priority:** CRITICAL  
**Impact:** Cannot manage system through admin interface  
**Last Updated:** April 14, 2026

---

## Problem Statement

Admin pages exist but **most display static/mock data**. Real-time database integration is missing. The system cannot be managed dynamically.

### Specific Issues by Page

| Page | Issue | Status |
|------|-------|--------|
| Providers | Real data fetch missing | ❌ BROKEN |
| Models | Static list, no DB sync | ❌ BROKEN |
| Agents | CRUD operations missing | ❌ MISSING |
| Server Monitoring | Mock data, real metrics missing | ❌ MISSING |
| Analytics | Fake data, no real aggregation | ❌ MISSING |
| Users | No role/permission management | ❌ MISSING |
| Tools | CRUD not implemented | ❌ MISSING |
| Memory | Cache management missing | ❌ MISSING |

---

## Current Partial Implementation

### What's Been Done (20% Complete)
```
✅ Created 10 custom hooks:
  - useDashboard.ts
  - useProviders.ts
  - useModels.ts
  - useAgents.ts
  - useServers.ts
  - useTools.ts
  - useMemory.ts
  - useAnalytics.ts
  - useUsers.ts
  - useApi.ts (base hook)

✅ Updated 3 pages:
  - Dashboard (20% dynamic)
  - Providers (60% dynamic)
  - Models (50% dynamic)

❌ Remaining 7 pages:
  - Agents (0% dynamic)
  - Servers (0% dynamic)
  - Tools (0% dynamic)
  - Analytics (0% dynamic)
  - Users (0% dynamic)
  - Memory (0% dynamic)
  - Chat (0% dynamic)
```

---

## Issue Breakdown

### 1. Agents Page

**Current State:** Static list of agents

**Required Functionality:**
```typescript
// Features needed:
- List all active agents (from backend)
- View agent details and status
- Create new agents
- Update agent configuration
- Delete agents
- Monitor agent activity
- View agent logs
- Stop/start agents

// API Endpoints:
GET    /api/agents
POST   /api/agents
GET    /api/agents/:id
PUT    /api/agents/:id
DELETE /api/agents/:id
GET    /api/agents/:id/status
GET    /api/agents/:id/logs
POST   /api/agents/:id/start
POST   /api/agents/:id/stop
```

**Hook Implementation Needed:**
```typescript
// File: lib/hooks/useAgents.ts (Needs completion)
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/agents`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Create, update, delete, start, stop operations

  return { agents, loading, error, fetchAgents };
}
```

### 2. Servers Page

**Current State:** Static server list with mock metrics

**Required Functionality:**
```typescript
// Features needed:
- List all servers (from backend)
- Real-time CPU, memory, disk usage
- Network statistics
- Service status (running/stopped)
- Server health indicators
- Restart/stop server operations
- View server logs
- Configure server settings

// Real Metrics Needed:
- CPU usage percentage
- Memory usage (GB)
- Disk usage percentage
- Network I/O (bytes/sec)
- Process count
- Uptime
- Last updated timestamp
```

### 3. Analytics Page

**Current State:** Fake aggregated data

**Required Data Collection:**
```typescript
// Metrics to collect:
- Total API requests (24h, 7d, 30d)
- Requests by provider
- Requests by model
- Average response time
- Error rate
- Active users
- Chat sessions
- Message count
- Token usage

// Aggregation Queries:
SELECT COUNT(*) FROM requests WHERE created_at > NOW() - INTERVAL '24 hours'
SELECT provider_id, COUNT(*) FROM requests GROUP BY provider_id
SELECT model_id, AVG(response_time) FROM requests GROUP BY model_id
```

### 4. Users Page

**Current State:** Missing entirely

**Required Functionality:**
```typescript
// Features needed:
- List all users
- View user details
- Create new users
- Edit user profiles
- Change user roles (admin, user, viewer)
- Manage permissions
- View user activity
- Deactivate/activate users
- Reset user passwords

// Role-based Access:
interface UserRole {
  admin: string[];      // All permissions
  moderator: string[];  // Manage content
  user: string[];       // Basic access
  viewer: string[];     // Read-only
}
```

### 5. Tools Page

**Current State:** Missing dynamic operations

**Required Functionality:**
```typescript
// Features needed:
- List all available tools
- Add new tools
- Configure tool settings
- Enable/disable tools
- View tool usage statistics
- Delete tools
- Test tools
```

### 6. Memory Page

**Current State:** Missing cache management

**Required Functionality:**
```typescript
// Features needed:
- View cache statistics
- Clear cache (full or partial)
- View cached items
- Manage memory limits
- Monitor memory usage
- View eviction policies
```

### 7. Chat Integration

**Current State:** Partially done (API routes exist)

**Required for Admin:**
```typescript
// Features needed:
- View all conversations
- Filter by user/date/model
- View message history
- Search conversations
- Delete conversations
- Monitor chat quality
- View error logs
```

---

## Solution Implementation Plan

### Phase 1: Complete Remaining Hooks (Days 1-2)

```typescript
// File: lib/hooks/useAgents.ts (COMPLETE)
// File: lib/hooks/useServers.ts (COMPLETE)
// File: lib/hooks/useTools.ts (COMPLETE)
// File: lib/hooks/useAnalytics.ts (COMPLETE)
// File: lib/hooks/useUsers.ts (COMPLETE)
// File: lib/hooks/useMemory.ts (COMPLETE)
```

### Phase 2: Update Admin Pages (Days 2-4)

```
app/admin/
├── agents/page.tsx          (UPDATE)
├── servers/page.tsx         (UPDATE)
├── tools/page.tsx           (UPDATE)
├── analytics/page.tsx       (UPDATE)
├── users/page.tsx           (UPDATE)
├── memory/page.tsx          (UPDATE)
└── chat/page.tsx            (UPDATE)
```

### Phase 3: Add Real Metrics Collection (Days 4-5)

```typescript
// Create metrics collection service
backend/src/services/metrics.service.ts
// Implement dashboard aggregation
backend/src/routes/metrics.ts
```

---

## Data Flow Example: Agents Page

### Current (Broken)
```
[Admin Page] → Static Mock Data ❌
```

### Required (Dynamic)
```
[Admin Page]
    ↓ useAgents()
    ↓ fetch('/api/agents')
[Backend API]
    ↓ GET /api/agents
[Database]
    ↓ SELECT * FROM agents
[Backend]
    ↓ return agents JSON
[Hook]
    ↓ setAgents(data)
[Admin Page]
    ↓ Display real agents ✅
```

---

## Backend API Requirements

### Agents Endpoint

```typescript
// File: backend/src/routes/agents.ts
import express from 'express';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// GET /api/agents - List all agents
router.get('/', auth, async (req, res) => {
  try {
    const agents = await db.query('SELECT * FROM agents WHERE user_id = ?', [req.user.id]);
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agents - Create agent
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, model, prompt } = req.body;
    const result = await db.query(
      'INSERT INTO agents (user_id, name, description, model, prompt) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, name, description, model, prompt]
    );
    res.json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agents/:id - Get agent details
router.get('/:id', auth, async (req, res) => {
  try {
    const agent = await db.query(
      'SELECT * FROM agents WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!agent) return res.status(404).json({ error: 'Not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, model, prompt } = req.body;
    await db.query(
      'UPDATE agents SET name=?, description=?, model=?, prompt=? WHERE id=? AND user_id=?',
      [name, description, model, prompt, req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM agents WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## Verification Checklist

- [ ] All 10 custom hooks completed
- [ ] All 7 admin pages updated
- [ ] Real data displays instead of mock data
- [ ] CRUD operations work for each page
- [ ] Search/filter functionality works
- [ ] Real-time metrics update
- [ ] Error handling implemented
- [ ] Loading states show correctly
- [ ] Empty states handled
- [ ] Toast notifications work

---

## Files to Complete/Create

| File | Status | Priority |
|------|--------|----------|
| `lib/hooks/useAgents.ts` | UPDATE | CRITICAL |
| `lib/hooks/useServers.ts` | UPDATE | CRITICAL |
| `lib/hooks/useTools.ts` | UPDATE | CRITICAL |
| `lib/hooks/useAnalytics.ts` | UPDATE | CRITICAL |
| `lib/hooks/useUsers.ts` | UPDATE | CRITICAL |
| `lib/hooks/useMemory.ts` | UPDATE | CRITICAL |
| `app/admin/agents/page.tsx` | UPDATE | CRITICAL |
| `app/admin/servers/page.tsx` | UPDATE | CRITICAL |
| `app/admin/tools/page.tsx` | UPDATE | CRITICAL |
| `app/admin/analytics/page.tsx` | UPDATE | CRITICAL |
| `app/admin/users/page.tsx` | UPDATE | CRITICAL |
| `app/admin/memory/page.tsx` | UPDATE | CRITICAL |
| `backend/src/routes/agents.ts` | VERIFY | HIGH |
| `backend/src/routes/servers.ts` | VERIFY | HIGH |
| `backend/src/services/metrics.service.ts` | CREATE | HIGH |

---

## Next Steps

1. Complete all remaining hooks
2. Update all admin pages
3. Implement backend API endpoints
4. Test all CRUD operations
5. Verify real-time data updates

---

## Related Documentation

- See: `api-reference/admin-endpoints.md` for full API
- See: `architecture/admin-architecture.md` for design
- See: `testing/admin-tests.md` for testing procedures

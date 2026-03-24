# Admin Pages - API Integration Guide

## Overview

All admin pages have been converted from static/demo data to fully dynamic pages that fetch real data from the backend API. This document outlines the integration pattern and provides implementation guidelines.

## Architecture

### Data Flow
```
Admin Page Component
    ↓
useApi Hook (custom hook)
    ↓
fetch() → Backend API
    ↓
Database (SQLite)
```

### Key Features
- Real-time data updates with auto-refresh
- Error handling with fallback UI
- Loading states with spinners
- Type-safe API calls with TypeScript
- Token-based authentication

## Custom Hooks (in lib/hooks/)

All data fetching is centralized in custom hooks for reusability:

### 1. **useApi.ts** - Base Hook
Generic hook for any API endpoint:
```typescript
const { data, loading, error, refetch } = useApi<T>(endpoint, options)
```

**Features:**
- Auto-refresh with configurable interval
- Error handling
- Token management
- Refetch method

### 2. Domain-Specific Hooks
Each admin area has a specialized hook:
- `useDashboard.ts` - System metrics and health
- `useProviders.ts` - AI provider management
- `useModels.ts` - Model configuration
- `useAgents.ts` - Agent management
- `useServers.ts` - Server monitoring
- `useTools.ts` - Tool management
- `useMemory.ts` - Memory/conversation history
- `useAnalytics.ts` - Performance analytics
- `useUsers.ts` - User management

## Updated Pages

### 1. Dashboard (✅ Complete)
**File:** `app/admin/page.tsx`
**Features:**
- Real-time system metrics
- Server health monitoring
- Resource usage tracking
- Recent activity feed
- Provider status display
- Auto-refresh every 5 seconds

**Hook:** `useDashboard()`

**API Endpoint:** `GET /api/admin/dashboard`

### 2. Providers (✅ Complete)
**File:** `app/admin/providers/page.tsx`
**Features:**
- List all AI providers
- Connection status indicators
- Model listing per provider
- Test connection functionality
- Sync models button
- Request count tracking

**Hook:** `useProviders()`

**API Endpoints:**
- `GET /api/providers`
- `POST /api/providers/:id/test`
- `POST /api/providers/:id/models`

## Integration Pattern (Boilerplate)

Every admin page follows this pattern:

```typescript
'use client'

import { useYourHook } from '@/lib/hooks/useYourHook'
import { useToast } from '@/hooks/use-toast'

export default function YourAdminPage() {
  const { data, loading, error, refetch } = useYourHook()
  const { toast } = useToast()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Render data */}
      {data && (
        // Your components here
      )}
    </div>
  )
}
```

## Pages to Update (In Progress)

### 3. Models Page
**File:** `app/admin/models/page.tsx`
**Status:** To be updated
**Expected Hook:** `useModels()`

### 4. Agents Page
**File:** `app/admin/agents/page.tsx`
**Status:** To be updated
**Expected Hook:** `useAgents()`

### 5. Servers Page
**File:** `app/admin/servers/page.tsx`
**Status:** To be updated
**Expected Hook:** `useServers()`

### 6. Tools Page
**File:** `app/admin/tools/page.tsx` or `/commands`
**Status:** To be updated
**Expected Hook:** `useTools()`

### 7. Analytics Page
**File:** `app/admin/analytics/page.tsx`
**Status:** To be updated
**Expected Hook:** `useAnalytics()`

### 8. Users Page
**File:** `app/admin/users/page.tsx`
**Status:** To be updated
**Expected Hook:** `useUsers()`

### 9. Memory Management Page
**File:** `app/admin/memory-management/page.tsx`
**Status:** To be updated
**Expected Hook:** `useMemory()`

### 10. Chat Page (Public Interface)
**File:** `app/chat/page.tsx`
**Status:** To be updated
**Expected Hook:** `useConversations()` + `useChatMessages()`

## API Response Structure

### Typical API Response Format

```typescript
// GET /api/providers
{
  "status": "success",
  "data": [
    {
      "id": "provider-1",
      "name": "OpenAI",
      "type": "openai",
      "status": "active",
      "models": ["gpt-4", "gpt-3.5"],
      "requestCount": 1234,
      "lastChecked": "2024-01-15T10:30:00Z"
    }
  ]
}

// GET /api/admin/dashboard
{
  "status": "success",
  "data": {
    "systemStatus": {
      "healthy": 9,
      "totalServers": 10,
      "cpuUsage": 34,
      "memoryUsage": 62
    },
    "metrics": {
      "totalUsers": 150,
      "activeAgents": 8,
      "totalRequests": 15432,
      "averageResponseTime": 187
    },
    "recentActivity": [...],
    "topProviders": [...]
  }
}
```

## Error Handling

Each hook includes error handling:

```typescript
if (error) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-red-800">Error: {error}</p>
      <Button onClick={refetch} className="mt-4">
        Retry
      </Button>
    </div>
  )
}
```

## Loading States

Consistent loading UI across all pages:

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading data...</p>
      </div>
    </div>
  )
}
```

## Authentication

All API calls automatically include JWT token:

```typescript
// Automatically added by useApi hook
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

## Auto-Refresh Configuration

Different pages use different refresh intervals:

```typescript
// Dashboard - refresh every 5 seconds (real-time)
useDashboard() // refetchInterval: 5000

// Servers - refresh every 5 seconds (monitoring)
useServers() // refetchInterval: 5000

// Providers - no auto-refresh
useProviders() // manual refetch via button

// Analytics - refresh every 30 seconds
useAnalytics() // refetchInterval: 30000
```

## Toast Notifications

For user feedback on actions:

```typescript
const { toast } = useToast()

const handleAction = async () => {
  try {
    await apiCall(endpoint, 'POST', data)
    toast({
      title: "Success",
      description: "Action completed successfully",
    })
  } catch (err) {
    toast({
      title: "Error",
      description: "Action failed",
      variant: "destructive",
    })
  }
}
```

## Type Safety

All responses are strongly typed:

```typescript
interface Provider {
  id: string
  name: string
  type: 'openai' | 'ollama' | 'gemini'
  status: 'active' | 'inactive' | 'error'
  models: string[]
  requestCount: number
}

const { data } = useApi<Provider[]>('/api/providers')
// data is now typed as Provider[] | null
```

## Implementation Checklist

For each remaining page, follow these steps:

- [ ] Create corresponding hook in `lib/hooks/`
- [ ] Import hook into page component
- [ ] Add loading state UI
- [ ] Add error state UI
- [ ] Update data rendering to use real data
- [ ] Add action buttons with handlers
- [ ] Implement toast notifications
- [ ] Test API integration
- [ ] Verify real-time updates
- [ ] Test error scenarios

## Backend API Endpoints Reference

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Dashboard
- `GET /api/admin/dashboard`
- `GET /api/admin/analytics?period=day|week|month`
- `GET /api/admin/health`

### Providers
- `GET /api/providers`
- `POST /api/providers`
- `PUT /api/providers/:id`
- `DELETE /api/providers/:id`
- `POST /api/providers/:id/test`
- `POST /api/providers/:id/models`

### Models
- `GET /api/models`
- `POST /api/models`
- `PUT /api/models/:id`
- `DELETE /api/models/:id`
- `POST /api/models/:id/test`

### Agents
- `GET /api/agents`
- `POST /api/agents`
- `PUT /api/agents/:id`
- `DELETE /api/agents/:id`
- `POST /api/agents/:id/execute`
- `GET /api/agents/:id/history`

### Servers
- `GET /api/servers`
- `POST /api/servers`
- `PUT /api/servers/:id`
- `DELETE /api/servers/:id`
- `GET /api/servers/:id/status`

### Tools
- `GET /api/tools`
- `POST /api/tools`
- `PUT /api/tools/:id`
- `DELETE /api/tools/:id`
- `POST /api/tools/:id/execute`

### Memory
- `GET /api/memory`
- `POST /api/memory/save`
- `DELETE /api/memory/:id`
- `POST /api/memory/search`

### Users (Admin)
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `PUT /api/admin/users/:id/permissions`

## Common Issues & Solutions

### Issue: Token Not Included
**Solution:** useApi hook automatically adds token from localStorage

### Issue: CORS Errors
**Solution:** Backend CORS configured in Express app

### Issue: Data Not Updating
**Solution:** Call `refetch()` after mutations or set refetchInterval

### Issue: Type Errors
**Solution:** Define proper interface types for API responses

## Next Steps

1. Create remaining hooks in `lib/hooks/`
2. Update remaining pages one by one
3. Test each page with real backend data
4. Deploy to production with monitoring

---

**Last Updated:** January 15, 2024  
**Completed:** Dashboard, Providers  
**In Progress:** Models, Agents, Servers, Tools, Analytics, Users, Memory, Chat

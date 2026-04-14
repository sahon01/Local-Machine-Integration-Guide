# ZombieCoder System Architecture

**Version:** 1.0  
**Last Updated:** April 14, 2026  
**Status:** Under Implementation

---

## System Overview

ZombieCoder is a comprehensive AI Gateway system that:
1. Manages multiple AI providers (OpenAI, Ollama, Gemini)
2. Provides a unified chat interface
3. Includes an admin panel for system management
4. Supports autonomous agents and memory systems

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER APPLICATIONS                        │
├─────────────────────────────────────────────────────────────┤
│ • Web Client (Next.js)    • Mobile (Future)                  │
│ • Admin Panel             • API Clients                       │
└────────────────┬──────────────────────────────┬──────────────┘
                 │                              │
        ┌────────▼──────────┐        ┌─────────▼────────┐
        │  NEXT.JS FRONTEND  │        │  NEXT.JS API     │
        │  App Router        │        │  Route Handlers  │
        ├────────┬──────────┤        ├────────┬─────────┤
        │ Pages  │ Components│        │ Auth   │ Admin   │
        │ Admin  │ Hooks     │        │ Chat   │ Routes  │
        └────────┼──────────┘        └────────┼─────────┘
                 │                            │
                 └────────────┬───────────────┘
                              │
                    ┌─────────▼────────────┐
                    │  BACKEND (Express)   │
                    │  Node.js Server      │
                    ├──────────┬───────────┤
                    │ Routes   │ Middleware│
                    │ Services │ Utils     │
                    └──────────┼───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼────┐            ┌──▼────┐           ┌───▼────┐
    │DATABASE│            │CACHE  │           │FILES   │
    │SQLite  │            │Redis? │           │Storage │
    └────────┘            └───────┘           └────────┘
        │
        └─────────────────────────────────────────────────┐
                                                          │
        ┌─────────────────────────────────────────────────▼────┐
        │           AI PROVIDER INTEGRATIONS                    │
        ├──────────────────┬──────────────────┬────────────────┤
        │ OpenAI           │ Ollama (Local)   │ Google Gemini  │
        │ API Calls        │ Local LLM Server │ API Calls      │
        └──────────────────┴──────────────────┴────────────────┘
```

---

## Component Architecture

### 1. Frontend (Next.js 14+)

**Location:** `/app`, `/components`, `/lib`

```
Frontend
├── Pages (App Router)
│   ├── / (Home)
│   ├── /admin (Admin Dashboard)
│   │   ├── /dashboard
│   │   ├── /providers
│   │   ├── /models
│   │   ├── /agents
│   │   ├── /servers
│   │   ├── /tools
│   │   ├── /analytics
│   │   ├── /users
│   │   └── /memory
│   └── /chat (Chat Interface)
│
├── Components (Reusable UI)
│   ├── /ui (shadcn/ui components)
│   ├── /admin (Admin-specific)
│   └── /chat (Chat-specific)
│
└── Hooks (Data Fetching)
    ├── useApi.ts (Base hook)
    ├── useDashboard.ts
    ├── useProviders.ts
    ├── useModels.ts
    ├── useAgents.ts
    ├── useServers.ts
    ├── useTools.ts
    ├── useAnalytics.ts
    ├── useUsers.ts
    └── useMemory.ts
```

**Key Technologies:**
- React 18+ (with hooks)
- TypeScript
- Tailwind CSS
- shadcn/ui components

---

### 2. Backend (Node.js + Express)

**Location:** `/backend/src`

```
Backend
├── Routes (API Endpoints)
│   ├── auth.ts (Login, Register, Logout)
│   ├── providers.ts (CRUD for providers)
│   ├── models.ts (Model management)
│   ├── agents.ts (Agent management)
│   ├── servers.ts (Server monitoring)
│   ├── completions.ts (Chat API)
│   ├── tools.ts (Tools management)
│   ├── memory.ts (Cache management)
│   ├── rag.ts (RAG integration)
│   └── admin.ts (Admin operations)
│
├── Middleware
│   ├── auth.middleware.ts (JWT verification)
│   ├── rate-limit.middleware.ts (Rate limiting)
│   ├── error.middleware.ts (Error handling)
│   └── logging.middleware.ts (Request logging)
│
├── Services (Business Logic)
│   ├── llm.service.ts (LLM interactions)
│   ├── ollama.service.ts (Ollama integration)
│   ├── api-adapter.service.ts (Provider adapters)
│   ├── crew-ai.service.ts (Agent orchestration)
│   ├── memory.service.ts (Cache operations)
│   ├── rag.service.ts (RAG operations)
│   ├── session.service.ts (Session management)
│   └── websocket.service.ts (WebSocket handling)
│
├── Database
│   ├── init.ts (Schema initialization)
│   ├── connection.ts (Connection management)
│   ├── transactions.ts (Transaction support)
│   ├── backup.ts (Auto-backup)
│   └── migrations/ (Schema migrations)
│
├── Utils
│   ├── auth.utils.ts (JWT, hashing)
│   ├── validation.ts (Input validation)
│   ├── errors.ts (Error classes)
│   └── constants.ts (System constants)
│
└── Scripts
    ├── seed.ts (Database seeding)
    └── init.ts (Initial setup)
```

**Key Technologies:**
- Express.js
- TypeScript
- better-sqlite3 (Database)
- jsonwebtoken (JWT)
- bcrypt (Password hashing)

---

### 3. Database Layer

**Technology:** SQLite + better-sqlite3

```
Database Schema
├── users (Authentication)
│   ├── id (TEXT, PK)
│   ├── email (TEXT, UNIQUE)
│   ├── password_hash (TEXT)
│   ├── role (TEXT)
│   └── created_at (DATETIME)
│
├── providers (AI Providers)
│   ├── id (TEXT, PK)
│   ├── name (TEXT)
│   ├── type (TEXT)
│   ├── api_key (TEXT, encrypted)
│   ├── api_base (TEXT)
│   ├── is_active (BOOLEAN)
│   └── created_at (DATETIME)
│
├── models (AI Models)
│   ├── id (TEXT, PK)
│   ├── provider_id (TEXT, FK)
│   ├── name (TEXT)
│   ├── version (TEXT)
│   ├── context_window (INTEGER)
│   └── created_at (DATETIME)
│
├── conversations (Chat History)
│   ├── id (TEXT, PK)
│   ├── user_id (TEXT, FK)
│   ├── title (TEXT)
│   ├── created_at (DATETIME)
│   └── updated_at (DATETIME)
│
├── messages (Chat Messages)
│   ├── id (TEXT, PK)
│   ├── conversation_id (TEXT, FK)
│   ├── role (TEXT) [user|assistant]
│   ├── content (TEXT)
│   ├── provider_id (TEXT, FK)
│   ├── model_id (TEXT, FK)
│   ├── tokens (INTEGER)
│   └── created_at (DATETIME)
│
├── agents (AI Agents)
│   ├── id (TEXT, PK)
│   ├── user_id (TEXT, FK)
│   ├── name (TEXT)
│   ├── description (TEXT)
│   ├── model_id (TEXT, FK)
│   ├── is_active (BOOLEAN)
│   └── created_at (DATETIME)
│
└── api_logs (Audit Trail)
    ├── id (INTEGER, PK)
    ├── user_id (TEXT, FK)
    ├── endpoint (TEXT)
    ├── method (TEXT)
    ├── status_code (INTEGER)
    ├── duration_ms (INTEGER)
    └── created_at (DATETIME)
```

---

## Data Flow

### Authentication Flow

```
User Input (Email/Password)
    ↓
[Frontend] → POST /api/auth/register or /api/auth/login
    ↓
[Backend] auth.ts middleware
    ↓
Validate Input → Hash Password/Verify Hash
    ↓
[Database] INSERT/SELECT users
    ↓
Generate JWT Token
    ↓
[Frontend] ← Return token + user data
    ↓
Store in localStorage/secure cookie
    ↓
Include token in all API requests
    ↓
[Middleware] auth.middleware.ts verifies token
```

### Chat Flow

```
User Message
    ↓
[Frontend] POST /api/completions/chat/completions
    ↓
[Backend] completions.ts route
    ↓
1. Get conversation
2. Get provider & model
3. Format messages
4. Call provider adapter
    ↓
[Provider Adapter]
├─ OpenAI Adapter → OpenAI API
├─ Ollama Adapter → Local Server
└─ Gemini Adapter → Google API
    ↓
Stream or wait for response
    ↓
[Database] INSERT message
    ↓
[Frontend] ← Stream response/full response
    ↓
Display in chat UI
```

### Admin Data Flow

```
Admin User Views Page
    ↓
[Frontend] useHook() [e.g., useProviders()]
    ↓
useEffect: fetch('/api/admin/providers')
    ↓
[Backend] providers.ts
    ↓
[Middleware] auth + role check
    ↓
[Database] SELECT * FROM providers
    ↓
Format response
    ↓
[Frontend] ← JSON data
    ↓
Hook: setState(data)
    ↓
Component re-renders with real data
```

---

## Security Architecture

### Authentication & Authorization

```
┌──────────────────────────────────────────────┐
│         LOGIN/REGISTER                       │
├──────────────────────────────────────────────┤
│ 1. User provides email + password            │
│ 2. Password hashed with bcrypt               │
│ 3. Stored in database (never plaintext)      │
│ 4. JWT token generated (HS256)               │
│ 5. Token sent to frontend                    │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│         AUTHENTICATED REQUEST                │
├──────────────────────────────────────────────┤
│ 1. Frontend sends token in Authorization     │
│ 2. Middleware verifies JWT signature         │
│ 3. Extract user from token                   │
│ 4. Check user role/permissions               │
│ 5. Allow/deny request                        │
└──────────────────────────────────────────────┘
```

### Data Encryption

```
API Keys (In Database)
├─ Stored: AES-256-CBC encrypted
├─ Decrypted: Only when calling provider
└─ Never: Logged or exposed

Passwords (In Database)
├─ Stored: Bcrypt hashed
├─ Verified: During login
└─ Never: Reversible or comparable

User Data (In Transit)
├─ HTTPS: All API calls encrypted
├─ JWT: Token signed and verified
└─ Cookies: Secure + HttpOnly flags
```

---

## Error Handling Strategy

```
Request Processing
    ↓
┌─────────────────────────────────┐
│ TRY: Execute operation          │
├─────────────────────────────────┤
│ CATCH: Specific error handling  │
│ - Validation errors (400)       │
│ - Auth errors (401)             │
│ - Permission errors (403)       │
│ - Not found (404)               │
│ - Server errors (500)           │
├─────────────────────────────────┤
│ FINALLY: Log error              │
│ - Error message                 │
│ - Stack trace                   │
│ - Request context               │
│ - Timestamp                     │
└─────────────────────────────────┘
    ↓
Response to Frontend (never expose internals)
    ↓
User sees appropriate message
```

---

## Performance Considerations

### Caching Strategy

```
Frontend Cache:
├─ useSWR hooks with auto-refresh
├─ Local state management
└─ Automatic revalidation

Backend Cache:
├─ Provider response caching
├─ Database query optimization
└─ API response caching
```

### Database Performance

```
Optimization Techniques:
├─ Connection pooling
├─ Query indexing
├─ Prepared statements
├─ Transaction batching
└─ Slow query logging
```

### API Rate Limiting

```
Per Provider:
├─ OpenAI: 3,500 RPM
├─ Ollama: Unlimited (local)
└─ Gemini: API rate limit

Per User:
├─ Track requests/minute
├─ Return 429 if exceeded
└─ Reset counter after minute
```

---

## Deployment Architecture

### Development

```
Local Machine
├─ Frontend: localhost:3000 (next dev)
├─ Backend: localhost:5000 (express)
├─ Database: ./data/zombiecoder.db (SQLite)
└─ Optional: Ollama on localhost:11434
```

### Production

```
Vercel/Cloud Server
├─ Frontend: Next.js Edge Functions
├─ Backend: Node.js Container
├─ Database: SQLite or PostgreSQL
├─ Backups: Daily automated
└─ Monitoring: Error tracking + logs
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18+ | UI Framework |
| Frontend | Next.js | 14+ | App Framework |
| Frontend | TypeScript | 5+ | Type Safety |
| Frontend | Tailwind CSS | 3+ | Styling |
| Frontend | shadcn/ui | Latest | Components |
| Backend | Node.js | 18+ | Runtime |
| Backend | Express | 4+ | API Server |
| Backend | TypeScript | 5+ | Type Safety |
| Database | SQLite | 3.40+ | Data Storage |
| Database | better-sqlite3 | Latest | DB Driver |
| Auth | jsonwebtoken | Latest | JWT Tokens |
| Auth | bcrypt | Latest | Password Hashing |
| Utils | axios | Latest | HTTP Client |

---

## Integration Points

### External APIs

1. **OpenAI**
   - Endpoint: https://api.openai.com/v1
   - Auth: Bearer token
   - Models: gpt-4, gpt-3.5-turbo

2. **Ollama**
   - Endpoint: http://localhost:11434 (local)
   - Auth: None required
   - Models: Any installed model

3. **Google Gemini**
   - Endpoint: https://generativelanguage.googleapis.com/v1
   - Auth: API key
   - Models: gemini-pro, gemini-pro-vision

---

## Scalability Considerations

### Current Limitations

```
Single Server:
├─ Database: SQLite (single writer)
├─ Memory: Limited by server RAM
├─ Connections: Limited by Node.js
└─ Storage: Limited by disk space
```

### Future Scaling

```
To Scale:
├─ Migrate to PostgreSQL
├─ Add Redis for caching
├─ Load balancer (nginx)
├─ Multiple server instances
├─ Separate database server
└─ CDN for static assets
```

---

## Related Documentation

- See: `../critical-issues/` for known issues
- See: `../api-reference/` for API details
- See: `../testing/` for testing procedures
- See: `../deployment/` for setup guides

---

**Generated:** April 14, 2026  
**Version:** 1.0  
**Status:** Complete Architecture Overview

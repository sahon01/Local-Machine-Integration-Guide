# ZombieCoder - System Architecture

**System Owner:** Sahon Srabon | Developer Zone  
**Version:** 1.0.0  
**Architecture Type:** Modular, Microservices-Ready  
**Last Updated:** 2024-03-21

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ZombieCoder Platform                        │
│                "Where Code and Conversation Speak"              │
└─────────────────────────────────────────────────────────────────┘
        │                                           │
        ├─────────────────────┬─────────────────────┤
        ▼                     ▼                     ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ Frontend│         │ Backend │         │Database │
    │Next.js  │         │Express  │         │SQLite   │
    │   3000  │         │  5000   │         │  Local  │
    └─────────┘         └─────────┘         └─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  Auth   │         │  Chat   │         │ RAG/ML  │
    │  JWT    │         │  API    │         │ Agents  │
    └─────────┘         └─────────┘         └─────────┘
        │
        ├─ Users
        ├─ Tokens
        └─ Sessions
                │
                ├─ OpenAI
                ├─ Ollama
                ├─ Gemini
                └─ Custom
```

---

## Layered Architecture

### 1. **Presentation Layer** (Frontend)
```
┌──────────────────────────────────────────┐
│          Next.js Frontend (React 19)      │
├──────────────────────────────────────────┤
│  Pages:                                  │
│  ├─ Dashboard (Analytics)                │
│  ├─ Providers Management                 │
│  ├─ Agents Configuration                 │
│  ├─ Chat Interface                       │
│  ├─ Code Editor                          │
│  └─ Settings                             │
│                                          │
│  Components:                             │
│  ├─ shadcn/ui (form, table, etc)        │
│  ├─ Custom Admin Components              │
│  └─ Responsive Layout                    │
└──────────────────────────────────────────┘
```

**Key Files:**
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Dashboard
- `app/admin/*` - Admin pages
- `components/*` - Reusable components

---

### 2. **API/Application Layer** (Backend)

```
┌──────────────────────────────────────────┐
│        Express.js Backend Server         │
├──────────────────────────────────────────┤
│  API Routes:                             │
│  ├─ /api/auth/*                         │
│  ├─ /api/admin/*                        │
│  ├─ /api/completions/*                  │
│  ├─ /api/providers/*                    │
│  ├─ /api/models/*                       │
│  ├─ /api/agents/*                       │
│  ├─ /api/servers/*                      │
│  └─ /api/tools/*                        │
│                                          │
│  Middleware:                             │
│  ├─ JWT Authentication                   │
│  ├─ Error Handling                       │
│  ├─ Request Logging                      │
│  └─ CORS                                 │
└──────────────────────────────────────────┘
```

**Key Files:**
- `src/index.ts` - Server entry point
- `src/routes/*.ts` - API endpoints
- `src/middleware/*.ts` - Auth & validation
- `src/services/*.ts` - Business logic

---

### 3. **Data Access Layer** (Database)

```
┌──────────────────────────────────────────┐
│         SQLite Database Layer            │
├──────────────────────────────────────────┤
│  Tables:                                 │
│  ├─ users                                │
│  ├─ providers                            │
│  ├─ models                               │
│  ├─ agents                               │
│  ├─ servers                              │
│  ├─ tools                                │
│  ├─ rag_documents                        │
│  ├─ conversation_memory                  │
│  ├─ api_requests                         │
│  ├─ settings                             │
│  └─ webhooks                             │
└──────────────────────────────────────────┘
```

**Key Files:**
- `src/db/database.ts` - Database interface
- `database/*.sql` - Schema definitions
- `src/db/migrations.ts` - Schema updates

---

## Request Flow

### Authentication Flow
```
User Login Request
    │
    ├─ POST /api/auth/login
    │     │
    │     ├─ Validate email/password
    │     ├─ Hash password check
    │     └─ Generate JWT token
    │
    └─ Return { token, user }
         │
         └─ Store in client storage
              │
              └─ Include in Authorization header for future requests
```

### Chat Completion Flow
```
User Message
    │
    ├─ POST /api/completions/chat/completions
    │     │
    │     ├─ Verify JWT token
    │     ├─ Validate request schema
    │     ├─ Get provider configuration
    │     ├─ Build prompt with context
    │     └─ Forward to AI provider
    │
    ├─ AI Provider Response
    │     │
    │     ├─ Stream tokens back
    │     ├─ Log API usage
    │     └─ Store conversation
    │
    └─ Return completion to frontend
         │
         └─ Display to user
```

### Agent Execution Flow
```
Start Agent Task
    │
    ├─ Load agent config from DB
    ├─ Get assigned tools
    ├─ Create execution context
    ├─ Initialize conversation memory
    │
    ├─ [Agent Loop]
    │   ├─ Analyze current state
    │   ├─ Plan next action
    │   ├─ Execute tool if needed
    │   ├─ Update memory
    │   └─ Check completion condition
    │
    └─ Return final result
```

---

## Component Architecture

### Backend Structure
```
backend/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── db/
│   │   ├── database.ts             # DB interface
│   │   └── migrations.ts           # Schema setup
│   ├── routes/
│   │   ├── auth.ts                 # Authentication
│   │   ├── admin.ts                # Admin operations
│   │   ├── providers.ts            # Provider CRUD
│   │   ├── models.ts               # Model management
│   │   ├── agents.ts               # Agent config
│   │   ├── servers.ts              # Server info
│   │   ├── tools.ts                # Tool management
│   │   └── completions.ts          # Chat API
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification
│   │   └── errorHandler.ts         # Error handling
│   ├── services/
│   │   ├── providers.ts            # Provider logic
│   │   ├── agents.ts               # Agent logic
│   │   └── rag.ts                  # RAG operations
│   └── types/
│       └── index.ts                # TypeScript types
├── database/
│   ├── schema.sql                  # Main schema
│   └── seed.sql                    # Sample data
├── .env                            # Configuration
└── package.json                    # Dependencies
```

### Frontend Structure
```
frontend/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Dashboard
│   ├── admin/
│   │   ├── page.tsx                # Admin overview
│   │   ├── providers/
│   │   │   ├── page.tsx            # Providers list
│   │   │   └── [id]/page.tsx       # Provider detail
│   │   ├── models/page.tsx         # Models list
│   │   ├── agents/page.tsx         # Agents list
│   │   ├── servers/page.tsx        # Servers list
│   │   ├── tools/page.tsx          # Tools list
│   │   ├── settings/page.tsx       # Settings
│   │   ├── users/page.tsx          # User management
│   │   └── logs/page.tsx           # API logs
│   ├── chat/page.tsx               # Chat interface
│   ├── code/page.tsx               # Code editor
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # shadcn components
│   ├── layout/
│   │   ├── Sidebar.tsx             # Navigation
│   │   └── Header.tsx              # Top bar
│   ├── admin/                      # Admin components
│   │   ├── ProviderForm.tsx        # Provider form
│   │   ├── AgentCard.tsx           # Agent display
│   │   └── StatsCard.tsx           # Stat display
│   └── chat/                       # Chat components
│       ├── ChatBox.tsx             # Chat interface
│       ├── MessageList.tsx         # Messages
│       └── InputBox.tsx            # Message input
├── hooks/
│   ├── useAuth.ts                  # Auth hook
│   ├── useAPI.ts                   # API calls
│   └── useChat.ts                  # Chat logic
├── lib/
│   ├── api.ts                      # API client
│   ├── utils.ts                    # Helpers
│   └── types.ts                    # TypeScript types
├── .env.local                      # Configuration
└── package.json                    # Dependencies
```

---

## Data Flow Diagram

### User Registration
```
┌─────────────────────────────────────────────────────┐
│  1. User enters email & password in signup form    │
├─────────────────────────────────────────────────────┤
│  2. Frontend sends POST /api/auth/register          │
├─────────────────────────────────────────────────────┤
│  3. Backend validates input                         │
├─────────────────────────────────────────────────────┤
│  4. Backend hashes password with bcryptjs           │
├─────────────────────────────────────────────────────┤
│  5. Backend stores user in database                 │
├─────────────────────────────────────────────────────┤
│  6. Backend generates JWT token                     │
├─────────────────────────────────────────────────────┤
│  7. Frontend stores token + user data               │
├─────────────────────────────────────────────────────┤
│  8. User redirected to dashboard                    │
└─────────────────────────────────────────────────────┘
```

### Provider Integration
```
┌─────────────────────────────────────────────────────┐
│  1. Admin enters OpenAI API key                     │
├─────────────────────────────────────────────────────┤
│  2. Frontend sends POST /api/providers              │
├─────────────────────────────────────────────────────┤
│  3. Backend validates API key format                │
├─────────────────────────────────────────────────────┤
│  4. Backend tests connection to provider            │
├─────────────────────────────────────────────────────┤
│  5. If valid, stores encrypted key in database      │
├─────────────────────────────────────────────────────┤
│  6. Fetches available models from provider          │
├─────────────────────────────────────────────────────┤
│  7. Stores models in database                       │
├─────────────────────────────────────────────────────┤
│  8. Provider now available in chat/agent system     │
└─────────────────────────────────────────────────────┘
```

---

## Scalability Architecture

### Current (Single Server)
```
┌──────────────────────────────┐
│   Single Node Deployment     │
├──────────────────────────────┤
│   Frontend (React)           │
│   Backend (Node.js)          │
│   Database (SQLite)          │
│   WebSocket (Optional)       │
└──────────────────────────────┘
```

### Future (Distributed)
```
┌─────────────────────────────────────────────────────┐
│              Load Balancer                          │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │  Backend 1   │  │  Backend 2   │  │  Backend N   │
│  │  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │
│  └──────────────┘  └──────────────┘  └──────────────┘
│         │                 │                 │
│         └─────────────────┼─────────────────┘
│                           │
│         ┌─────────────────┴──────────────────┐
│         ▼                                    ▼
│    ┌─────────────────┐         ┌──────────────────┐
│    │  PostgreSQL DB  │         │  Redis Cache     │
│    │  (Cluster)      │         │  (Session Store) │
│    └─────────────────┘         └──────────────────┘
│
│    WebSocket Gateway
│    ├─ Socket.io or ws library
│    └─ Real-time updates
└─────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────┐
│              Security Layers                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. HTTPS/TLS                                      │
│     └─ Encrypt data in transit                    │
│                                                    │
│  2. JWT Authentication                            │
│     └─ Verify user identity                       │
│                                                    │
│  3. Password Hashing (bcryptjs)                   │
│     └─ Secure password storage                    │
│                                                    │
│  4. Role-Based Access Control                     │
│     ├─ Admin: Full system access                  │
│     ├─ User: Limited to own resources             │
│     └─ Guest: Read-only access                    │
│                                                    │
│  5. API Key Encryption                            │
│     └─ Encrypt provider keys in database          │
│                                                    │
│  6. Input Validation (Zod)                        │
│     └─ Prevent malicious data                     │
│                                                    │
│  7. CORS Configuration                            │
│     └─ Restrict cross-origin requests             │
│                                                    │
│  8. Rate Limiting                                 │
│     └─ Prevent abuse & DoS attacks                │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Integration Points

### External Provider Integration
```
┌─────────────────────────────────────────┐
│    ZombieCoder Backend                  │
├─────────────────────────────────────────┤
│                                         │
│   Provider Integration Layer            │
│   ├─ OpenAI Compatible                 │
│   ├─ Ollama (Local)                    │
│   ├─ Google Gemini                     │
│   └─ Custom Endpoints                  │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│                │        │        │      │
│                ▼        ▼        ▼      │
│            ┌──────┬──────┬──────┐      │
│            │OpenAI│Ollama│Gemini│      │
│            └──────┴──────┴──────┘      │
└─────────────────────────────────────────┘
```

### Database Integration
```
Backend ◄──────────────► SQLite Database
         │
         ├─ CRUD Operations
         ├─ Authentication
         ├─ Provider Config
         ├─ Agent Memory
         └─ Analytics
```

---

## Technology Decision Matrix

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | Next.js 15 | Server components, SSR, optimal performance |
| UI Framework | React 19 | Latest features, better reactivity |
| Styling | Tailwind CSS | Utility-first, responsive design |
| Components | shadcn/ui | Accessible, customizable, open-source |
| Backend | Express.js | Lightweight, flexible, large ecosystem |
| Language | TypeScript | Type safety, better IDE support |
| Database | SQLite | Embedded, serverless, no setup needed |
| Auth | JWT | Stateless, scalable, industry standard |
| Password Hash | bcryptjs | Slow hash, resistant to brute force |
| Validation | Zod | Runtime validation, type-safe |
| AI Integration | OpenAI API | Standard interface, multiple providers |

---

## Performance Considerations

### Frontend Optimization
- Server-side rendering (Next.js)
- Code splitting & lazy loading
- Image optimization
- CSS minification
- Caching strategies

### Backend Optimization
- Database indexing
- Query optimization
- Connection pooling
- Request caching (Redis-ready)
- Rate limiting

### Database Optimization
- Indexed queries
- Optimized schemas
- Connection pooling
- Query execution plans
- Archiving old data

---

## Monitoring & Observability

```
┌─────────────────────────────────────┐
│    Monitoring Stack (Future)        │
├─────────────────────────────────────┤
│  ├─ API Logs                        │
│  ├─ Error Tracking                  │
│  ├─ Performance Metrics              │
│  ├─ User Analytics                  │
│  └─ Resource Usage                  │
│                                     │
│  Integration Points:                │
│  ├─ Sentry (Error tracking)         │
│  ├─ DataDog (Monitoring)            │
│  ├─ LogRocket (Session replay)      │
│  └─ Google Analytics                │
└─────────────────────────────────────┘
```

---

## Summary

ZombieCoder uses a **modern, scalable architecture** optimized for:
- ✅ Developer productivity
- ✅ User experience
- ✅ System reliability
- ✅ Future growth
- ✅ Security & privacy

The system is production-ready for deployment with optional enhancements for scaling and advanced monitoring.

---

**System Owner:** Sahon Srabon | Developer Zone  
**Contact:** infi@zombiecoder.my.id | +880 1323-626282

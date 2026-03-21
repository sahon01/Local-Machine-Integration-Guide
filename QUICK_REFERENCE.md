# ZombieCoder - Quick Reference Guide

**Version:** 1.0.0 | **Owner:** Sahon Srabon | **Organization:** Developer Zone

---

## 🚀 Quick Start Commands

### Backend (Terminal 1)
```bash
cd backend
npm install              # Install dependencies
npm run db:init         # Initialize database
npm run dev             # Start development server
```

**Backend runs on:** http://localhost:5000

### Frontend (Terminal 2)
```bash
npm install              # Install dependencies
npm run dev             # Start development server
```

**Frontend runs on:** http://localhost:3000

---

## 🔑 API Quick Reference

### Authentication

**Login**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "eyJhbGc...",
    "role": "admin"
  }
}
```

**Use token in all requests:**
```bash
Authorization: Bearer <token>
```

### Chat Completion (Main API)

**Single Response**
```bash
POST /api/completions/chat/completions
Content-Type: application/json
Authorization: Bearer <token>

{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false
}
```

**Streaming Response**
```bash
POST /api/completions/chat/completions
Content-Type: application/json
Authorization: Bearer <token>

{
  "model": "gpt-4",
  "messages": [...],
  "stream": true
}

# Response is Server-Sent Events:
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" there"}}]}
data: [DONE]
```

### Get Available Models

**List all models**
```bash
GET /api/completions/models
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "GPT-4",
      "model_id": "gpt-4",
      "provider_name": "OpenAI",
      "context_window": 8192,
      "max_tokens": 2048,
      "is_active": true,
      "is_default": true
    }
  ],
  "count": 1
}
```

### Admin Operations

**System Stats**
```bash
GET /api/admin/stats
Authorization: Bearer <token>
```

**Health Check**
```bash
GET /api/admin/health/all
Authorization: Bearer <token>
```

**List Providers**
```bash
GET /api/providers
Authorization: Bearer <token>
```

**Add Provider**
```bash
POST /api/providers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "OpenAI",
  "type": "openai",
  "api_url": "https://api.openai.com/v1",
  "api_key": "sk-...",
  "is_active": true,
  "is_default": true
}
```

---

## 📁 Directory Structure

```
project-root/
├── backend/                    # Backend (Express, TypeScript)
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, error handling
│   │   ├── db/                # Database layer
│   │   └── types/             # TypeScript types
│   ├── database/              # SQL schemas
│   ├── .env                   # Configuration
│   └── package.json
│
├── app/                       # Frontend (Next.js, React)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Dashboard
│   ├── admin/                 # Admin pages
│   ├── chat/                  # Chat interface
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── globals.css            # Global styles
│   ├── .env.local             # Configuration
│   └── package.json
│
├── SETUP_AND_DEPLOYMENT.md    # Setup guide
├── ARCHITECTURE.md            # System architecture
├── IMPLEMENTATION_STATUS.md   # What's done, what's next
├── PROJECT_SUMMARY.md         # Complete overview
└── QUICK_REFERENCE.md         # This file
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# Database
DATABASE_PATH=./data/zombiecoder.db

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d

# Providers (Optional - configure via admin panel)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# System Identity
SYSTEM_NAME=ZombieCoder
SYSTEM_VERSION=1.0.0
SYSTEM_OWNER=Sahon Srabon
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=ZombieCoder
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🗂️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, email, password_hash, role, status |
| `providers` | AI providers | id, name, type, api_url, api_key |
| `models` | LLM models | id, provider_id, model_id, context_window |
| `agents` | AI agents | id, name, type, model_id, status, system_prompt |
| `servers` | Infrastructure | id, hostname, status, cpu_usage, memory_usage |
| `tools` | Admin tools | id, name, type, is_active, configuration |
| `rag_documents` | Knowledge base | id, title, content, embedding, metadata |
| `conversation_memory` | Chat history | id, agent_id, messages, context |
| `api_requests` | Analytics | id, user_id, provider_id, tokens_used, status_code |
| `settings` | Configuration | id, key, value, category |
| `webhooks` | Integrations | id, event_type, url, is_active |

---

## 🔐 Role-Based Access

| Role | Permissions |
|------|------------|
| **Admin** | Full access, system config, all user data |
| **User** | Own resources, API access, view usage |
| **Guest** | Read-only access, limited API usage |

---

## 🎯 Common Tasks

### Add a New Provider

1. Go to **Admin → Providers**
2. Click **Add New Provider**
3. Fill form:
   - **Name:** e.g., "OpenAI"
   - **Type:** Select from dropdown
   - **API URL:** Provider endpoint
   - **API Key:** Your API key
4. Click **Test Connection**
5. Click **Save**

### Enable a Model

1. Go to **Admin → Models**
2. Find the model you want
3. Click **Enable**
4. Set as **Default** if desired
5. Save

### Create an Agent

1. Go to **Admin → Agents**
2. Click **Create New**
3. Fill:
   - **Name:** Agent name
   - **Type:** General, Code Editor, Chatting, or Master
   - **Model:** Select from dropdown
   - **System Prompt:** Define behavior
4. Click **Deploy**

### Make a Chat Request

```javascript
// Using fetch
const response = await fetch('http://localhost:5000/api/completions/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
    stream: false
  })
});

const data = await response.json();
console.log(data);
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in .env or kill process |
| Database error | Run `npm run db:init` |
| API key invalid | Check .env and provider config |
| CORS error | Check CORS_ORIGIN in .env |
| Ollama not found | Make sure `ollama serve` is running |
| Token expired | Login again to get new token |

---

## 📊 API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

### Chat Completion Response
```json
{
  "id": "chatcmpl-...",
  "object": "text_completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "text": "Response text",
      "index": 0,
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| System Info | http://localhost:5000/api/system/identity |
| API Docs | http://localhost:5000/api/docs |

---

## 📱 Frontend Pages

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/` | Main overview |
| Overview | `/admin` | Statistics & metrics |
| Providers | `/admin/providers` | Manage AI providers |
| Models | `/admin/models` | Manage LLM models |
| Agents | `/admin/agents` | Configure AI agents |
| Servers | `/admin/servers` | Infrastructure status |
| Tools | `/admin/tools` | Admin tools |
| Settings | `/admin/settings` | System configuration |
| Users | `/admin/users` | User management |
| Logs | `/admin/logs` | API activity logs |
| Chat | `/chat` | Chat interface |
| Code Editor | `/code` | Code editor |

---

## 🎨 Styling with Tailwind

### Common Classes

```
Spacing: m-4, p-2, gap-3, mx-auto
Layout: flex, grid, absolute, relative
Text: text-lg, font-bold, text-center
Colors: bg-blue-500, text-white, border-gray-300
Responsive: md:grid-cols-2, lg:text-xl
States: hover:bg-blue-600, focus:outline-none
```

### Theme Colors (shadcn defaults)

```
Primary: Blue (#3b82f6)
Secondary: Gray (#6b7280)
Accent: Indigo (#4f46e5)
Success: Green (#10b981)
Warning: Amber (#f59e0b)
Error: Red (#ef4444)
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Configure database backup
- [ ] Setup HTTPS/SSL
- [ ] Whitelist CORS domains
- [ ] Create admin user
- [ ] Test all providers
- [ ] Setup monitoring
- [ ] Configure rate limits
- [ ] Document custom settings

---

## 📚 Documentation Files

| File | Size | Content |
|------|------|---------|
| SETUP_AND_DEPLOYMENT.md | 525 lines | Installation & deployment |
| ARCHITECTURE.md | 523 lines | System design & patterns |
| IMPLEMENTATION_STATUS.md | 381 lines | What's done & roadmap |
| PROJECT_SUMMARY.md | 648 lines | Complete overview |
| QUICK_REFERENCE.md | 350 lines | This quick reference |

---

## 💡 Pro Tips

1. **Use streaming for long responses:** Set `stream: true` for better UX
2. **Adjust temperature:** 0.7 for balanced, 0 for consistent, 1 for creative
3. **Monitor API usage:** Check `/api/admin/stats` regularly
4. **Test before production:** Use Ollama locally first
5. **Keep backups:** SQLite database is just a file
6. **Document custom agents:** Add descriptions for team reference
7. **Use system prompts:** Guide agent behavior with clear instructions

---

## 🔗 Important Files to Edit

| File | When | What |
|------|------|------|
| `.env` | Config | Server settings, API keys |
| `.env.local` | Config | Frontend settings |
| `identity.json` | Branding | System identity |
| `tailwind.config.ts` | Design | Color scheme, fonts |
| `app/layout.tsx` | Layout | Global styles, fonts |

---

## 🆘 Getting Help

**Issues?** Check these in order:
1. SETUP_AND_DEPLOYMENT.md (troubleshooting section)
2. IMPLEMENTATION_STATUS.md (known issues)
3. API error messages (often helpful)
4. Console logs (frontend & backend)

**Contact:** infi@zombiecoder.my.id | +880 1323-626282

---

## 📝 Notes

- ✅ Backend is fully functional
- ✅ Frontend dashboard is complete
- ✅ All API endpoints are documented
- ⚠️ WebSocket support coming soon
- ⚠️ RAG system structure in place, implementation pending
- 🔄 CrewAI multi-agent support ready for setup

---

**ZombieCoder v1.0.0** | Sahon Srabon | Developer Zone  
*Where Code and Conversation Speak*

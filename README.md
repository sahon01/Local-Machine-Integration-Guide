# 🧟‍♂️ ZombieCoder - AI Infrastructure Panel

> **Where Code and Conversation Speak**

A complete, production-ready AI infrastructure panel with backend, frontend dashboard, and multi-provider support.

**Owner:** Sahon Srabon | **Organization:** Developer Zone | **Version:** 1.0.0  
**Location:** Dhaka, Bangladesh | **Contact:** infi@zombiecoder.my.id | +880 1323-626282

---

## ✨ What This Is

ZombieCoder is a **complete full-stack system** that gives you:

- 🔌 **Multi-Provider AI Support** - OpenAI, Ollama, Google Gemini, and more
- 🎛️ **Admin Dashboard** - Manage providers, models, agents, and infrastructure
- 🔐 **Secure Authentication** - JWT-based with role-based access control
- 💾 **Built-in Database** - SQLite with 11 tables for persistence
- 🚀 **Production-Ready** - TypeScript, validation, error handling, streaming support
- 📚 **Comprehensive Docs** - 2,500+ lines of guides and references

**Not just a frontend.** This is a complete backend system you can deploy immediately.

---

## 📦 What's Included

### ✅ Backend (100% Complete)
- Express.js server with TypeScript
- SQLite database with full schema (11 tables)
- 8 API route modules with 35+ endpoints
- JWT authentication & role-based access
- Provider integrations (OpenAI, Ollama, Gemini)
- OpenAI-compatible chat API with streaming
- Request logging & analytics

### ✅ Frontend Dashboard (100% Complete - All English)
- Next.js 15 + React 19 + TypeScript
- 9 admin dashboard pages
- Responsive Tailwind CSS design
- Real-time system monitoring
- shadcn/ui components
- Complete provider management
- Agent configuration interface

### ✅ Documentation (100% Complete)
- Setup & deployment guide
- System architecture docs
- Implementation status & roadmap
- Project summary & highlights
- Quick reference guide
- This README

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

\`\`\`bash
cd backend
npm install
npm run db:init
npm run dev
\`\`\`

Backend runs on **http://localhost:5000**

### Frontend Setup (New Terminal)

\`\`\`bash
npm install
npm run dev
\`\`\`

Frontend runs on **http://localhost:3000**

### First Login

1. Visit http://localhost:3000
2. Use login credentials (created during setup)
3. Go to http://localhost:3000/admin
4. Start adding providers!

---

## 📚 Documentation Guide

| Document | Length | Purpose |
|----------|--------|---------|
| **QUICK_REFERENCE.md** | 513 lines | 👈 **START HERE** - Commands, API endpoints, common tasks |
| **SETUP_AND_DEPLOYMENT.md** | 525 lines | Installation, configuration, deployment, troubleshooting |
| **ARCHITECTURE.md** | 523 lines | System design, data flow, scalability patterns |
| **IMPLEMENTATION_STATUS.md** | 381 lines | What's complete, what's next, roadmap |
| **PROJECT_SUMMARY.md** | 648 lines | Complete overview, statistics, highlights |
| **SYSTEM_OVERVIEW.txt** | 529 lines | Visual diagrams, quick reference tables |
| **README.md** | This file | Overview and documentation guide |

---

## 🎯 Core Features

### Admin Dashboard Pages (9 Pages)
1. **Overview** - Real-time statistics & metrics
2. **Providers** - Manage AI providers (OpenAI, Ollama, Gemini)
3. **Models** - Enable/disable LLM models
4. **Agents** - Configure AI agents
5. **Servers** - Infrastructure monitoring
6. **Tools** - Admin tools management
7. **Settings** - System configuration
8. **Users** - User management
9. **API Logs** - Analytics & debugging

### OpenAI-Compatible Chat API
```bash
POST /api/completions/chat/completions
{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "Hello!"}],
  "stream": false
}
```

### Features
- ✅ Stream response support
- ✅ Multi-provider support
- ✅ Token counting
- ✅ Rate limiting structure
- ✅ Error handling
- ✅ Request logging

---

## 🏗️ Architecture

```
Frontend (Next.js 15)              Backend (Express.js)
http://localhost:3000              http://localhost:5000
├─ Admin Pages (9)                 ├─ API Routes (35+)
├─ Dashboard                       ├─ Authentication
└─ Components                      ├─ Provider Management
                                   └─ Chat Completions
                                          │
                                          ▼
                                   Database (SQLite)
                                   11 Tables
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
                 OpenAI              Ollama             Gemini
                (Cloud)              (Local)            (Cloud)
```

---

## 💾 Database (11 Tables)

| Table | Purpose |
|-------|---------|
| `users` | User accounts & authentication |
| `providers` | AI provider configurations |
| `models` | LLM model definitions |
| `agents` | AI agent configurations |
| `servers` | Infrastructure servers |
| `tools` | Admin & agent tools |
| `rag_documents` | Knowledge base (ready) |
| `conversation_memory` | Chat history |
| `api_requests` | Analytics & logging |
| `settings` | System configuration |
| `webhooks` | Integration endpoints |

---

## 🔑 API Endpoints (35+)

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user

### Chat & Completions
- `POST /api/completions/chat/completions` - **Main Chat API** ⭐
- `GET /api/completions/models` - List models
- `POST /api/completions/embeddings` - Generate embeddings

### Providers, Models, Agents, Servers, Tools, Admin...
See **QUICK_REFERENCE.md** for complete list.

---

## ⚙️ Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/zombiecoder.db
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=ZombieCoder
NEXT_PUBLIC_APP_VERSION=1.0.0
```

See **SETUP_AND_DEPLOYMENT.md** for complete configuration.

---

## 🔐 Security

- ✅ JWT authentication with expiration
- ✅ bcryptjs password hashing
- ✅ Role-based access control (Admin, User, Guest)
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ CORS support

---

## 📈 Statistics

- **Lines of Code:** 5,000+
- **API Endpoints:** 35+
- **Database Tables:** 11
- **Admin Pages:** 9
- **Documentation:** 2,500+ lines
- **Type Coverage:** 100% TypeScript

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Express.js, TypeScript, Node.js 18+ |
| Database | SQLite 3 |
| Auth | JWT, bcryptjs |
| Validation | Zod |
| Providers | OpenAI, Ollama, Google Gemini |

---

## 📞 Getting Help

### Check These First
1. **QUICK_REFERENCE.md** - Commands & common tasks
2. **SETUP_AND_DEPLOYMENT.md** - Installation & troubleshooting
3. **IMPLEMENTATION_STATUS.md** - What's done, what's next

### Contact
- **Email:** infi@zombiecoder.my.id
- **Phone:** +880 1323-626282
- **Organization:** Developer Zone
- **Location:** Dhaka, Bangladesh

---

## 📜 Project Structure

```
project-root/
├── backend/                      # Express backend
│   ├── src/
│   │   ├── index.ts             # Server entry
│   │   ├── routes/              # API routes (8 modules)
│   │   ├── middleware/          # Auth, errors
│   │   ├── db/                  # Database layer
│   │   └── types/               # TypeScript types
│   ├── database/                # SQL schemas
│   └── .env                     # Configuration
│
├── app/                         # Next.js frontend
│   ├── admin/                   # Admin pages (9)
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilities
│   ├── globals.css              # Styles
│   └── .env.local               # Configuration
│
├── Documentation Files:
├── README.md                    # This file
├── QUICK_REFERENCE.md           # Quick lookup (513 lines)
├── SETUP_AND_DEPLOYMENT.md      # Setup guide (525 lines)
├── ARCHITECTURE.md              # System design (523 lines)
├── IMPLEMENTATION_STATUS.md     # Status & roadmap (381 lines)
├── PROJECT_SUMMARY.md           # Complete overview (648 lines)
└── SYSTEM_OVERVIEW.txt          # Visual diagrams (529 lines)
```

---

## 🎉 You're Ready!

Everything you need to build a powerful AI infrastructure is here. The foundation is solid, the code is clean, and the system is ready to deploy.

**Start with QUICK_REFERENCE.md and happy coding!**

---

## 📜 License

**Proprietary - Local Freedom Protocol**  
All rights reserved © 2024 Sahon Srabon / Developer Zone

---

**ZombieCoder v1.0.0** | *Where Code and Conversation Speak*  
Built by Sahon Srabon | Developer Zone | Dhaka, Bangladesh

For support: infi@zombiecoder.my.id | +880 1323-626282

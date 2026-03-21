# ZombieCoder - Complete Setup and Deployment Guide

**Version:** 1.0.0  
**Owner:** Sahon Srabon | Developer Zone  
**Location:** Dhaka, Bangladesh  
**Contact:** infi@zombiecoder.my.id | +880 1323-626282

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Configuration](#database-configuration)
6. [Provider Integration](#provider-integration)
7. [Running the System](#running-the-system)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

ZombieCoder is a unified AI infrastructure panel with:
- TypeScript backend with Express.js and SQLite
- Next.js 15 frontend with React
- OpenAI-compatible provider support (OpenAI, Ollama, Google Gemini)
- JWT-based authentication and authorization
- Real-time WebSocket streaming
- RAG system with CrewAI integration
- Multi-agent AI system (Code Editor, Chatting, Master Agent)

**System Identity:**
```json
{
  "name": "ZombieCoder",
  "version": "1.0.0",
  "tagline": "Where Code and Conversation Speak",
  "owner": "Sahon Srabon",
  "organization": "Developer Zone"
}
```

---

## Prerequisites

### Windows System Requirements
- Windows 10 / Windows 11 / Windows Server 2019 / Windows Server 2022
- Node.js 18+ (Download from nodejs.org)
- Python 3.8+ (for optional CrewAI features)
- 4GB RAM minimum, 8GB recommended
- 2GB free disk space

### Required Software
- Node.js & npm
- Git (optional, for cloning repository)
- Text Editor (VS Code recommended)

### Verify Installation
```bash
node --version  # v18.0.0 or higher
npm --version   # v9.0.0 or higher
```

---

## Backend Setup

### 1. Initialize Backend Directory
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in `/backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# Database
DATABASE_PATH=./data/zombiecoder.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# OpenAI Provider (if using OpenAI)
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_API_BASE=https://api.openai.com/v1

# Ollama Configuration (if using Ollama locally)
OLLAMA_BASE_URL=http://localhost:11434

# Google Gemini (if using Gemini)
GOOGLE_API_KEY=your-google-api-key-here

# System Identity
SYSTEM_NAME=ZombieCoder
SYSTEM_VERSION=1.0.0
SYSTEM_OWNER=Sahon Srabon
SYSTEM_ORG=Developer Zone
SYSTEM_LOCATION=Dhaka, Bangladesh

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### 3. Initialize Database
```bash
npm run db:init
```

This creates SQLite database with all necessary tables:
- Users (with authentication)
- Providers (OpenAI, Ollama, etc.)
- Models (LLM models from each provider)
- Agents (AI agents - Code Editor, Chatting, Master)
- Servers (Infrastructure servers)
- Tools (Admin tools for agents)
- RAG Documents (for knowledge base)
- Conversation Memory (session memory)
- API Requests (analytics)
- Settings (system configuration)
- Webhooks (integrations)

### 4. Start Backend Server
```bash
npm run dev
```

Output should show:
```
╔════════════════════════════════════════╗
║       ZombieCoder Backend Server       ║
║          Where Code Speaks             ║
╚════════════════════════════════════════╝

  System: ZombieCoder v1.0.0
  Owner: Sahon Srabon
  
  Server running on: http://localhost:5000
  Environment: development
  Database: ./data/zombiecoder.db
  
  API Documentation: http://localhost:5000/api/docs
  Health Check: http://localhost:5000/api/health
  System Identity: http://localhost:5000/api/system/identity
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=ZombieCoder
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Start Development Server
```bash
npm run dev
```

Access at: `http://localhost:3000`

---

## Database Configuration

### SQLite Database Structure

**Users Table**
- id (UUID)
- email (unique)
- username (unique)
- password_hash (bcryptjs)
- role (admin | user | guest)
- status (active | inactive | suspended)
- last_login

**Providers Table**
- id (UUID)
- name (e.g., "OpenAI", "Ollama Local")
- type (openai | ollama | gemini | other)
- api_url (provider endpoint)
- api_key (encrypted in production)
- is_active, is_default
- rate_limit_requests, rate_limit_period

**Models Table**
- id (UUID)
- provider_id (foreign key)
- model_id (e.g., "gpt-4", "llama2")
- name, display_name
- context_window, max_tokens
- is_active, is_default

**Agents Table**
- id (UUID)
- name
- type (general | code_editor | chatting | master | custom)
- model_id (foreign key)
- server_id (foreign key)
- system_prompt
- status (idle | active | error | training)
- temperature, top_p

**Servers Table**
- id (UUID)
- hostname, ip_address, port
- region, os
- status (online | offline | maintenance)
- cpu_usage, memory_usage, disk_usage
- last_health_check

---

## Provider Integration

### Adding OpenAI Provider

1. Get API key from https://platform.openai.com/api-keys
2. Via Admin Panel → Providers → Add New
3. Fill:
   - **Name:** OpenAI
   - **Type:** openai
   - **API URL:** https://api.openai.com/v1
   - **API Key:** sk-...

### Adding Ollama (Local)

1. Install Ollama: https://ollama.ai
2. Run: `ollama serve`
3. Via Admin Panel → Providers → Add New
4. Fill:
   - **Name:** Ollama Local
   - **Type:** ollama
   - **API URL:** http://localhost:11434
   - **API Key:** (leave empty)

### Adding Google Gemini

1. Get API key from https://ai.google.dev/
2. Via Admin Panel → Providers → Add New
3. Fill:
   - **Name:** Google Gemini
   - **Type:** gemini
   - **API URL:** https://generativelanguage.googleapis.com/v1beta
   - **API Key:** your-gemini-key

---

## Running the System

### Start Both Services (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Admin Dashboard, AI Chat |
| Backend API | http://localhost:5000 | API Endpoints |
| API Health | http://localhost:5000/api/health | Status Check |
| System Identity | http://localhost:5000/api/system/identity | System Info |

---

## API Documentation

### Authentication

**Login**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "jwt-token",
    "role": "admin"
  }
}
```

**Use Token in Headers**
```bash
Authorization: Bearer <token>
```

### Chat Completion (OpenAI Compatible)

```bash
POST /api/completions/chat/completions

{
  "provider_id": "uuid",
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are helpful..."},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false
}
```

### Stream Responses
```bash
POST /api/completions/chat/completions
+ "stream": true

# Response is Server-Sent Events (SSE)
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: [DONE]
```

### List Models
```bash
GET /api/completions/models

Response:
{
  "success": true,
  "data": [
    {
      "name": "gpt-4",
      "provider_name": "OpenAI",
      "model_id": "gpt-4",
      "context_window": 8192
    }
  ]
}
```

### Admin Endpoints

**Dashboard Stats**
```bash
GET /api/admin/stats

{
  "total_users": 5,
  "total_agents": 3,
  "total_models": 12,
  "active_providers": 2,
  "api_requests_today": 234
}
```

**System Health**
```bash
GET /api/admin/health/all

{
  "database": "operational",
  "agents": 3,
  "servers": {
    "online": 10,
    "offline": 1
  },
  "providers": {
    "active": 2,
    "total": 3
  }
}
```

---

## Deployment

### Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure DATABASE_PATH to persistent location
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Setup database backups
- [ ] Configure API rate limiting
- [ ] Enable CORS for specific domains
- [ ] Setup monitoring and logging
- [ ] Create admin user account
- [ ] Test all providers
- [ ] Configure webhook endpoints

### Docker Deployment (Optional)

Create `Dockerfile` for backend:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t zombiecoder-backend .
docker run -p 5000:5000 -e DATABASE_PATH=/data/db.sqlite zombiecoder-backend
```

### Vercel Deployment (Frontend)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

---

## Troubleshooting

### Backend Won't Start
```
Error: EADDRINUSE: address already in use :::5000
```
**Solution:** Port 5000 is in use. Either:
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Change PORT in .env

### Database Connection Error
```
Error: Cannot open database
```
**Solution:**
1. Ensure `/data` directory exists
2. Check file permissions
3. Run: `npm run db:init` again

### API Key Invalid
```
401 Unauthorized
```
**Solution:**
1. Verify API key in `.env`
2. Test provider connection via Admin Panel
3. Check provider status

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:** Update CORS_ORIGIN in `.env` to match frontend URL

### Ollama Not Connecting
```
Failed to connect to Ollama
```
**Solution:**
1. Ensure Ollama is running: `ollama serve`
2. Check OLLAMA_BASE_URL is correct
3. Verify port 11434 is accessible

---

## System Identity & Sovereignty

This system includes embedded metadata that identifies it as **ZombieCoder** by **Sahon Srabon**:

- Every API response includes `X-Powered-By: ZombieCoder-by-SahonSrabon` header
- System metadata is immutable and embedded in `identity.json`
- All agents are anchored to this identity
- This provides legal protection against intellectual property theft

---

## Support & Contact

**Issues?** Contact: infi@zombiecoder.my.id | +880 1323-626282  
**Website:** https://zombiecoder.my.id/  
**Organization:** Developer Zone | Dhaka, Bangladesh

---

## License

Proprietary - Local Freedom Protocol  
All rights reserved © 2024 Sahon Srabon / Developer Zone

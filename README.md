# 🧠 ZombieCoder AI Infrastructure Panel

**Version:** 2.0.0  
**Language:** English  
**Platform:** Windows 10/11, Windows Server 2019/2022

---

## Overview

ZombieCoder AI Infrastructure Panel is a **unified control center** for managing all AI servers, agents, models, and services from a single dynamic admin interface.

### Key Features

✅ **Dynamic Server Management** - Add/remove servers without code changes  
✅ **AI Model Control** - Manage models across multiple providers  
✅ **Agent Orchestration** - Configure and monitor AI agents  
✅ **Real-time Monitoring** - Live health checks and performance metrics  
✅ **Provider Integration** - OpenAI, Ollama, Anthropic, and custom providers  
✅ **Productivity Tools** - Integrated development workflow tools  
✅ **WHMCS Integration** - Client management and billing  
✅ **Command Line Tools** - Execute system commands from UI  
✅ **Prompt Management** - Template library for AI interactions

---

## System Requirements

### Operating System
- Windows 10 (Version 1809+)
- Windows 11
- Windows Server 2019/2022

### Software Requirements
- **Node.js**: 18.x or 20.x LTS
- **Python**: 3.10 or 3.11
- **MySQL**: 8.0+
- **Git**: Latest version

### Hardware (Minimum)
- CPU: Intel Core i5 / AMD Ryzen 5 (4 cores)
- RAM: 8 GB
- Storage: 50 GB SSD
- Network: 100 Mbps

### Hardware (Recommended)
- CPU: Intel Core i7/i9 / AMD Ryzen 7/9 (8+ cores)
- RAM: 16 GB+
- Storage: 256 GB NVMe SSD
- Network: 1 Gbps

---

## Quick Start

### 1. Install Dependencies

\`\`\`bash
# Node.js (v18 or v20)
https://nodejs.org/

# Python (3.10 or 3.11)
https://www.python.org/downloads/

# MySQL (8.0+)
https://dev.mysql.com/downloads/installer/
# or XAMPP
https://www.apachefriends.org/
\`\`\`

### 2. Setup Database

\`\`\`bash
# Create database
mysql -u root -p
CREATE DATABASE zombiecoder_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
SOURCE backend-setup/database/schema.sql;

# Import initial data
SOURCE backend-setup/database/initial_data.sql;
\`\`\`

### 3. Configure Backend

\`\`\`bash
# Create backend directory
cd backend-gateway

# Create virtual environment
python -m venv venv

# Activate (PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install fastapi uvicorn sqlalchemy mysql-connector-python python-dotenv httpx websockets

# Configure .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=zombiecoder_admin
\`\`\`

### 4. Start Services

\`\`\`bash
# Terminal 1: Backend API
cd backend-gateway
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 5000 --reload

# Terminal 2: Frontend
npm install
npm run dev
\`\`\`

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/api/admin/health/all

---

## Documentation

📘 **Comprehensive Documentation**: See [COMPREHENSIVE_DOCUMENTATION.md](./COMPREHENSIVE_DOCUMENTATION.md)

### Quick Links

- [Installation Guide](./COMPREHENSIVE_DOCUMENTATION.md#installation-guide)
- [Feature Pages](./COMPREHENSIVE_DOCUMENTATION.md#feature-pages-documentation)
- [Configuration](./COMPREHENSIVE_DOCUMENTATION.md#configuration-systems)
- [Service Integration](./COMPREHENSIVE_DOCUMENTATION.md#service-integration-guide)
- [Testing](./COMPREHENSIVE_DOCUMENTATION.md#testing-procedures)
- [Troubleshooting](./COMPREHENSIVE_DOCUMENTATION.md#troubleshooting)
- [API Reference](./COMPREHENSIVE_DOCUMENTATION.md#api-reference)

---

## Features

### Core Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | System overview and metrics |
| Models | `/admin/models` | AI model management |
| Agents | `/admin/agents` | Agent configuration |
| Servers | `/admin/servers` | Server management |
| Providers | `/admin/providers` | AI provider setup |
| Database | `/database` | Database tools |
| Prompts | `/admin/prompts` | Prompt templates |
| Commands | `/admin/commands` | CLI tools |
| Chat | `/ai-chat` | AI chat interface |
| Webhooks | `/webhooks` | Webhook management |
| WHMCS | `/admin/whmcs` | Client management |
| Analytics | `/admin/analytics` | Usage analytics |
| Users | `/admin/users` | User management |

### Productivity Tools

- **Notepad** - Multi-tab code editor
- **Scheduler** - Project timeline management
- **Projects** - Project management
- **Delivery** - Client delivery tracking
- **Todo List** - Daily task management
- **Character** - Custom character creator
- **Text Correction** - Grammar and spell check
- **Music Player** - MP3 playlist

---

## Architecture

\`\`\`
┌─────────────────────────────────────────┐
│  Frontend (Port 3000)                   │
│  Next.js 14 + TypeScript + Tailwind     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Backend Gateway (Port 5000)            │
│  FastAPI + SQLAlchemy + MySQL           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  AI Server Network                      │
│  11 Servers + 12 Agents                 │
└─────────────────────────────────────────┘
\`\`\`

---

## Configuration

### Environment Variables

\`\`\`bash
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=ZombieCoder AI
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# .env (Backend)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=zombiecoder_admin
GATEWAY_PORT=5000
\`\`\`

---

## Support

### Documentation
- Main Docs: `/documentation`
- API Docs: http://localhost:5000/docs

### Contact
- Email: infi@zombiecoder.my.id
- Website: https://zombiecoder.my.id

---

## License

Proprietary software developed by ZombieCoder. All rights reserved.

---

## Changelog

### Version 2.0.0 (October 2025)
- ✨ Complete system redesign
- ✨ Dynamic loading for all pages
- ✨ English-first UI with language toggle
- ✨ Comprehensive documentation
- ✨ WHMCS integration
- ✨ Provider management
- ✨ Enhanced productivity tools
- ✨ Real-time monitoring
- ✨ WebSocket support

---

**Last Updated**: October 2025  
**Author**: ZombieCoder Team

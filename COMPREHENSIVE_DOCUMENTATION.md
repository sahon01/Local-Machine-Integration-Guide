# 🧠 ZombieCoder AI Infrastructure Panel
## Complete Setup & Feature Documentation

**Version:** 2.0.0  
**Date:** October 2025  
**Language:** English  
**Platform:** Windows 10/11 (64-bit)

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [System Requirements](#system-requirements)
3. [Architecture](#architecture)
4. [Installation Guide](#installation-guide)
5. [Feature Pages Documentation](#feature-pages-documentation)
6. [Configuration Systems](#configuration-systems)
7. [Service Integration Guide](#service-integration-guide)
8. [Testing Procedures](#testing-procedures)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## 🎯 System Overview

ZombieCoder AI Infrastructure Panel is a **unified control center** for managing all AI servers, agents, models, and services from a single dynamic admin interface.

### Core Capabilities

- **Dynamic Server Management**: Add/remove servers without code changes
- **AI Model Control**: Manage models across multiple providers
- **Agent Orchestration**: Configure and monitor AI agents
- **Real-time Monitoring**: Live health checks and performance metrics
- **Provider Integration**: Support for OpenAI, Ollama, and custom providers
- **Productivity Tools**: Integrated tools for development workflow
- **WHMCS Integration**: Client management and billing integration

### Key Principles

1. **Zero-Code Deployment**: All configurations via Admin UI
2. **Database-Driven**: Everything loads dynamically from MySQL
3. **Real-Time Updates**: WebSocket-based live monitoring
4. **Fully Extensible**: Add new features without touching code
5. **English First**: Clean English interface with optional language support

---

## 💻 System Requirements

### Operating System
- **Windows 10** (Version 1809 or later)
- **Windows 11** (All versions)
- **Windows Server 2019/2022**

### Hardware Requirements

**Minimum:**
- CPU: Intel Core i5 or AMD Ryzen 5 (4 cores)
- RAM: 8 GB
- Storage: 50 GB SSD
- Network: 100 Mbps

**Recommended:**
- CPU: Intel Core i7/i9 or AMD Ryzen 7/9 (8+ cores)
- RAM: 16 GB or more
- Storage: 256 GB NVMe SSD
- Network: 1 Gbps

### Software Requirements

#### Required Software
1. **Node.js**: Version 18.x or 20.x LTS
   - Download: https://nodejs.org/
   - Verify: `node --version` should show v18.x or v20.x

2. **Python**: Version 3.10 or 3.11
   - Download: https://www.python.org/downloads/
   - Verify: `python --version` should show 3.10.x or 3.11.x
   - **Important**: Check "Add Python to PATH" during installation

3. **MySQL**: Version 8.0 or later
   - Download: https://dev.mysql.com/downloads/installer/
   - OR use XAMPP: https://www.apachefriends.org/
   - Verify: `mysql --version`

4. **Git**: Latest version
   - Download: https://git-scm.com/download/win
   - Verify: `git --version`

#### Optional but Recommended
- **VS Code**: For code editing
- **Postman**: For API testing
- **MySQL Workbench**: For database management

---

## 🏗️ Architecture

### System Components

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  Frontend Layer (Port 3000)                             │
│  ├── Next.js 14 + TypeScript                            │
│  ├── shadcn/ui Components                               │
│  ├── Real-time Dashboard                                │
│  └── Dynamic Page Loading                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Backend Gateway (Port 5000)                            │
│  ├── FastAPI + Uvicorn                                  │
│  ├── SQLAlchemy ORM                                     │
│  ├── WebSocket Support                                  │
│  └── Health Monitoring                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Database Layer (Port 3306)                             │
│  └── MySQL 8.0+ (zombiecoder_admin)                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AI Server Network                                      │
│  ├── Our-Server (Port 12345)                            │
│  ├── Orchestration Engine (Port 8000)                   │
│  ├── Ollama Server (Port 11434)                         │
│  ├── OpenAI Gateway (Port 8001)                         │
│  └── Specialized Agents (Ports 8002-8007, 8014)         │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Network Architecture

| Component | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Frontend | 3000 | HTTP/WS | Admin UI |
| Backend API | 5000 | HTTP/WS | API Gateway |
| MySQL | 3306 | TCP | Database |
| Our-Server | 12345 | HTTP | Main AI Server |
| Orchestration | 8000 | HTTP | Agent Orchestrator |
| OpenAI Gateway | 8001 | HTTP | API Router |
| Bengali NLP | 8002 | HTTP | NLP Agent |
| Code Gen | 8003 | HTTP | Code Generator |
| Code Review | 8004 | HTTP | Code Reviewer |
| Documentation | 8005 | HTTP | Doc Generator |
| Testing | 8006 | HTTP | Test Generator |
| Deployment | 8007 | HTTP | Deploy Agent |
| Voice Processor | 8014 | HTTP | Voice Agent |
| Ollama | 11434 | HTTP | Local Models |

---

## 📦 Installation Guide

### Step 1: System Preparation

\`\`\`bash
# Open PowerShell as Administrator

# Check Node.js installation
node --version
# Should show: v18.x.x or v20.x.x

# Check Python installation
python --version
# Should show: 3.10.x or 3.11.x

# Check MySQL installation
mysql --version
# Should show: mysql Ver 8.0.x
\`\`\`

### Step 2: Database Setup

#### Option A: Using MySQL Command Line

\`\`\`bash
# Open MySQL Command Line Client
mysql -u root -p

# Create database
CREATE DATABASE zombiecoder_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Use the database
USE zombiecoder_admin;

# Run schema file
SOURCE C:/path/to/backend-setup/database/schema.sql;

# Run initial data
SOURCE C:/path/to/backend-setup/database/initial_data.sql;

# Verify tables
SHOW TABLES;
# Should show: servers, agents, ai_models, settings, menu_items, activity_logs

# Check data
SELECT COUNT(*) FROM servers;
SELECT COUNT(*) FROM agents;
\`\`\`

#### Option B: Using XAMPP

\`\`\`bash
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create new database: zombiecoder_admin
5. Import schema.sql
6. Import initial_data.sql
7. Verify tables and data
\`\`\`

### Step 3: Backend API Setup

\`\`\`bash
# Navigate to project directory
cd C:\Users\YourName\Downloads\ZombieCoder-AI-Infrastructure-Panel

# Create backend directory
mkdir backend-gateway
cd backend-gateway

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat

# Install dependencies
pip install fastapi uvicorn sqlalchemy mysql-connector-python python-dotenv httpx websockets pydantic

# Create .env file
echo DB_HOST=localhost > .env
echo DB_PORT=3306 >> .env
echo DB_USER=root >> .env
echo DB_PASSWORD= >> .env
echo DB_NAME=zombiecoder_admin >> .env
echo GATEWAY_PORT=5000 >> .env
\`\`\`

### Step 4: Frontend Setup

\`\`\`bash
# Open new terminal
cd C:\Users\YourName\Downloads\ZombieCoder-AI-Infrastructure-Panel

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local

# Start development server
npm run dev
# or
yarn dev
\`\`\`

### Step 5: Start All Services

#### Terminal 1: Backend API
\`\`\`bash
cd backend-gateway
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
\`\`\`

#### Terminal 2: Frontend
\`\`\`bash
npm run dev
\`\`\`

#### Terminal 3: AI Servers (if needed)
\`\`\`bash
# Start Our-Server
cd E:\Production-Ready Our-Server
python servers/main_server.py

# Start Orchestration
cd E:\Production-Ready Our-Server\orchestration
python api/orchestration_api.py

# Start Ollama
ollama serve
\`\`\`

### Step 6: Verify Installation

Open browser and navigate to:
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:5000/docs
- Health Check: http://localhost:5000/api/admin/health/all

---

## 📄 Feature Pages Documentation

### 1. Dashboard (`/admin`)

**Purpose**: Central overview of entire AI infrastructure

**Features**:
- System health overview
- Active models count
- Total requests tracking
- Average response time
- Connected editors count
- Recent activity feed
- Performance charts

**Data Sources**:
- Real-time from backend API
- WebSocket updates every 5 seconds
- Database aggregations

**Testing**:
\`\`\`bash
# Test API endpoint
curl http://localhost:5000/api/admin/dashboard

# Expected response:
{
  "active_models": 5,
  "total_requests": 12543,
  "avg_response_time": 234,
  "connected_editors": 3,
  "health_status": "healthy"
}
\`\`\`

---

### 2. Models Page (`/admin/models`)

**Purpose**: Manage all AI models across providers

**Features**:
- List all available models
- Add new models dynamically
- Edit model configurations
- Delete models
- Test model connectivity
- Performance metrics per model
- Provider filtering

**Configuration**:
\`\`\`javascript
// Model structure
{
  id: 1,
  name: "GPT-4",
  provider: "OpenAI",
  model_identifier: "gpt-4-turbo",
  server_id: 3,
  status: "active",
  version: "2024-01",
  parameters: {
    temperature: 0.7,
    max_tokens: 4096
  }
}
\`\`\`

**Add Model Process**:
1. Click "Add Model" button
2. Fill form:
   - Model Name
   - Provider (OpenAI/Ollama/Custom)
   - Model Identifier
   - Server Assignment
   - Parameters (JSON)
3. Click "Save"
4. Model appears instantly in list

**Testing**:
\`\`\`bash
# Test model endpoint
POST http://localhost:5000/api/admin/models
Content-Type: application/json

{
  "name": "Llama 3.2",
  "provider": "Ollama",
  "model_identifier": "llama3.2:1b",
  "server_id": 11,
  "parameters": {"temperature": 0.7}
}
\`\`\`

---

### 3. Agents Page (`/admin/agents`)

**Purpose**: Manage AI agents and their capabilities

**Features**:
- Dynamic agent listing
- Add new agents with endpoints
- Test agent functionality
- View agent details
- Performance monitoring
- Capability management
- Health status tracking

**Agent Structure**:
\`\`\`javascript
{
  id: 1,
  name: "Editor Agent",
  agent_type: "editor",
  server_id: 2,
  endpoint: "/agents/editor",
  capabilities: [
    "code_editing",
    "refactoring",
    "debugging"
  ],
  health_status: "healthy"
}
\`\`\`

**Add Agent Process**:
1. Navigate to `/admin/agents`
2. Click "Add Agent"
3. Fill form:
   - Agent Name
   - Agent Type
   - Server Selection
   - **Endpoint Path** (critical!)
   - Capabilities (comma-separated)
   - Description
4. Save → Agent appears with live status

**Testing**:
\`\`\`bash
# Test agent
POST http://localhost:5000/api/admin/agents/1/test
Content-Type: application/json

{
  "message": "Test message",
  "test": true
}
\`\`\`

---

### 4. Server Management (`/admin/servers`)

**Purpose**: Manage all server instances

**Features**:
- Server inventory
- Add/edit/delete servers
- Port management
- Health monitoring
- Latency tracking
- Connection testing

**Server Configuration**:
\`\`\`javascript
{
  id: 1,
  name: "Our-Server",
  port: 12345,
  base_url: "http://localhost",
  type: "main_server",
  is_active: true,
  latency_ms: 45
}
\`\`\`

---

### 5. Database Tools (`/database`)

**Purpose**: Database management and monitoring

**Features**:
- Connection testing
- Table viewer
- Query executor
- Backup/restore
- Performance monitoring
- Index management

**Usage**:
\`\`\`sql
-- Test query
SELECT * FROM servers WHERE is_active = TRUE;

-- Add server via SQL
INSERT INTO servers (name, port, type) 
VALUES ('New Server', 9000, 'agent');
\`\`\`

---

### 6. Prompt Management (`/admin/prompts`)

**Purpose**: Manage system prompts and templates

**Features**:
- Prompt library
- Template creation
- Variable substitution
- Version control
- Category organization
- Prompt testing

**Prompt Structure**:
\`\`\`javascript
{
  id: 1,
  title: "Code Review Prompt",
  category: "code_analysis",
  template: "Review the following code and provide feedback:\n\n{code}\n\nFocus on: {focus_areas}",
  variables: ["code", "focus_areas"],
  model_recommendations: ["gpt-4", "claude-3"],
  created_by: "admin"
}
\`\`\`

**Add Prompt**:
1. Go to `/admin/prompts`
2. Click "New Prompt"
3. Fill template with `{variable}` placeholders
4. Test with sample data
5. Save and categorize

---

### 7. Chat Interface (`/ai-chat`)

**Purpose**: Interactive AI chat with model selection

**Features**:
- Multi-model support
- Conversation history
- File attachments
- Code highlighting
- Export conversations
- Voice input/output

**Configuration**:
\`\`\`javascript
// Chat settings
{
  model: "gpt-4",
  temperature: 0.7,
  max_tokens: 2048,
  stream: true,
  system_prompt: "You are a helpful coding assistant"
}
\`\`\`

**Usage**:
1. Select model from dropdown
2. Type message or upload file
3. Send → Streaming response
4. Continue conversation
5. Export as markdown/JSON

---

### 8. Command Line Tools (`/admin/commands`)

**Purpose**: Execute system commands and scripts

**Features**:
- Command library
- Script execution
- Output logging
- Scheduled tasks
- Batch operations

**Available Commands**:
\`\`\`bash
# Server commands
start-server --port 8000
stop-server --port 8000
restart-all

# Database commands
db-backup --name backup_2024
db-restore --file backup_2024.sql
db-migrate

# Model commands
model-pull llama3.2:1b
model-list --provider ollama
model-test gpt-4
\`\`\`

---

### 9. WHMCS Integration (`/admin/whmcs`)

**Purpose**: Client and billing management

**Features**:
- Client list
- Invoice management
- Service provisioning
- API token configuration
- Usage tracking
- Payment processing

**Configuration**:
\`\`\`javascript
// WHMCS settings
{
  api_url: "https://your-whmcs.com/includes/api.php",
  api_identifier: "your_api_id",
  api_secret: "your_api_secret",
  auto_provision: true,
  sync_interval: 300 // 5 minutes
}
\`\`\`

**Setup Process**:
1. Go to `/admin/whmcs`
2. Enter WHMCS API credentials
3. Test connection
4. Enable auto-provisioning
5. Configure product mappings

**Integration Features**:
- Auto-create AI access when service is activated
- Usage metering for billing
- Automatic invoice generation
- Client portal integration

---

### 10. Provider Management (`/admin/providers`)

**Purpose**: Manage AI service providers

**Features**:
- Provider configuration
- API key management
- Rate limit settings
- Cost tracking
- Fallback configuration

**Supported Providers**:
- OpenAI
- Anthropic (Claude)
- Google (Gemini)
- Ollama (local)
- Custom providers

**Provider Configuration**:
\`\`\`javascript
{
  id: 1,
  name: "OpenAI",
  api_base: "https://api.openai.com/v1",
  api_key: "sk-...",
  models: ["gpt-4", "gpt-3.5-turbo"],
  rate_limits: {
    requests_per_minute: 3500,
    tokens_per_minute: 90000
  },
  cost_per_1k_tokens: {
    input: 0.03,
    output: 0.06
  },
  is_active: true
}
\`\`\`

**Add Provider**:
1. Navigate to `/admin/providers`
2. Click "Add Provider"
3. Select provider type
4. Enter API credentials
5. Configure rate limits
6. Test connection
7. Enable provider

---

### 11. Webhooks (`/admin/webhooks`)

**Purpose**: Event-driven integrations

**Features**:
- Webhook creation
- Event triggers
- Payload customization
- Retry logic
- Delivery logs

**Webhook Structure**:
\`\`\`javascript
{
  id: 1,
  name: "Slack Notification",
  url: "https://hooks.slack.com/services/...",
  events: ["model_added", "server_down", "high_latency"],
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  payload_template: {
    "text": "Event: {event_type}\nDetails: {details}"
  },
  is_active: true
}
\`\`\`

**Create Webhook**:
1. Go to `/admin/webhooks`
2. Click "New Webhook"
3. Enter webhook URL
4. Select trigger events
5. Customize payload
6. Test webhook
7. Activate

---

### 12. Productivity Tools

#### 12.1 Notepad (`/admin/productivity/notepad`)
- Multi-tab editor
- Syntax highlighting
- Auto-save
- Search and replace
- Code snippets

#### 12.2 Project Scheduler (`/admin/productivity/scheduler`)
- Project timeline
- Task dependencies
- Resource allocation
- Milestone tracking
- Calendar view

#### 12.3 Project Manager (`/admin/productivity/projects`)
- Project creation
- Task management
- Team collaboration
- File attachments
- Status tracking

#### 12.4 Delivery Tracker (`/admin/productivity/delivery`)
- Client projects
- Delivery status
- Progress tracking
- Client communication
- Invoice linking

#### 12.5 Todo List (`/admin/productivity/todo`)
- Daily tasks
- Priority levels
- Due dates
- Categories
- Completion tracking

#### 12.6 Custom Character (`/admin/productivity/character`)
- Character profiles
- Appearance customization
- Personality traits
- Background stories
- Export/import

#### 12.7 Text Correction (`/admin/productivity/correction`)
- Grammar checking
- Spell checking
- Style suggestions
- Multi-language support
- Batch processing

#### 12.8 Music Player (`/admin/productivity/music`)
- MP3 playlist
- Custom playlists
- Shuffle/repeat
- Volume control
- Background play

---

## ⚙️ Configuration Systems

### 1. Dynamic Menu System

**Database Structure**:
\`\`\`sql
-- menu_items table
CREATE TABLE menu_items (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    route VARCHAR(255),
    icon VARCHAR(50),
    category VARCHAR(100),
    parent_id INT,
    order_index INT,
    visible BOOLEAN,
    requires_auth BOOLEAN
);
\`\`\`

**Add Menu Item**:
\`\`\`sql
INSERT INTO menu_items (name, route, icon, category, order_index) 
VALUES ('My New Page', '/admin/my-page', 'Star', 'Custom', 100);
\`\`\`

**Result**: New menu item appears instantly in sidebar!

---

### 2. Settings System

**Settings Table**:
\`\`\`sql
CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    category VARCHAR(100),
    data_type ENUM('string', 'number', 'boolean', 'json')
);
\`\`\`

**Available Settings**:

| Key | Category | Purpose |
|-----|----------|---------|
| site_name | general | Application title |
| site_logo | general | Logo URL |
| theme | appearance | Color theme |
| default_model | ai | Default AI model |
| ollama_url | ai | Ollama server URL |
| auto_health_check | monitoring | Enable health checks |
| health_check_interval | monitoring | Check interval (seconds) |

**Change Settings**:
\`\`\`javascript
// Via API
PUT /api/admin/settings/site_name
Body: { "value": "My AI Control Center" }

// Via SQL
UPDATE settings 
SET setting_value = 'My AI Control Center' 
WHERE setting_key = 'site_name';
\`\`\`

---

### 3. Theme Configuration

**Available Themes**:
- Light
- Dark
- Auto (system preference)

**Custom Theme**:
\`\`\`javascript
// Add to settings
{
  "theme": "custom",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#10b981",
    "background": "#ffffff",
    "text": "#1f2937"
  }
}
\`\`\`

---

## 🔌 Service Integration Guide

### OpenAI Integration

\`\`\`javascript
// Add OpenAI provider
POST /api/admin/providers
{
  "name": "OpenAI",
  "type": "openai",
  "api_key": "sk-your-key",
  "base_url": "https://api.openai.com/v1",
  "models": ["gpt-4", "gpt-3.5-turbo"]
}

// Use in chat
POST /api/chat
{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "Hello"}]
}
\`\`\`

---

### Ollama Integration

\`\`\`bash
# Install Ollama
winget install Ollama.Ollama

# Pull models
ollama pull llama3.2:1b
ollama pull codellama

# Verify
curl http://localhost:11434/api/version
\`\`\`

\`\`\`javascript
// Add Ollama server
POST /api/admin/servers
{
  "name": "Ollama Server",
  "port": 11434,
  "type": "ollama",
  "base_url": "http://localhost"
}

// Add Ollama models
POST /api/admin/models
{
  "name": "Llama 3.2",
  "provider": "Ollama",
  "model_identifier": "llama3.2:1b",
  "server_id": 11
}
\`\`\`

---

### Custom Provider Integration

\`\`\`javascript
// Generic provider template
{
  "name": "My Custom Provider",
  "api_base": "https://api.custom.com",
  "api_key": "your-key",
  "headers": {
    "Authorization": "Bearer {api_key}",
    "Content-Type": "application/json"
  },
  "request_format": {
    "model": "{model}",
    "messages": "{messages}",
    "temperature": "{temperature}"
  },
  "response_format": {
    "content_path": "choices[0].message.content",
    "usage_path": "usage"
  }
}
\`\`\`

---

## 🧪 Testing Procedures

### Health Check Testing

\`\`\`bash
# Test all servers
curl http://localhost:5000/api/admin/health/all

# Test specific server
curl http://localhost:5000/api/admin/health/server/1

# Test model
curl http://localhost:5000/api/admin/health/model/1
\`\`\`

---

### Load Testing

\`\`\`bash
# Install Apache Bench
# Included with XAMPP or download separately

# Test API endpoint
ab -n 1000 -c 10 http://localhost:5000/api/admin/servers

# Results should show:
# - Requests per second > 100
# - Average response time < 100ms
# - No failed requests
\`\`\`

---

### Database Testing

\`\`\`sql
-- Test connection
SELECT 1;

-- Check all tables
SHOW TABLES;

-- Verify data integrity
SELECT COUNT(*) FROM servers WHERE port IS NULL; -- Should be 0
SELECT COUNT(*) FROM agents WHERE server_id NOT IN (SELECT id FROM servers); -- Should be 0

-- Performance check
EXPLAIN SELECT * FROM agents WHERE agent_type = 'editor';
-- Should use index
\`\`\`

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Backend won't start
\`\`\`bash
# Error: Port 5000 already in use
# Solution:
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Or use different port
uvicorn main:app --port 5001
\`\`\`

#### Issue 2: Database connection failed
\`\`\`bash
# Check MySQL service
net start MySQL80

# Test connection
mysql -u root -p -e "SELECT 1"

# Check .env file
type .env
# Verify DB_HOST, DB_USER, DB_PASSWORD
\`\`\`

#### Issue 3: Frontend can't reach backend
\`\`\`javascript
// Check CORS configuration in backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

// Check frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

#### Issue 4: Models not loading
\`\`\`bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# Restart Ollama
taskkill /F /IM ollama.exe
ollama serve

# Verify models
ollama list
\`\`\`

---

## 📚 API Reference

### Server Endpoints

\`\`\`bash
GET    /api/admin/servers              # List all servers
POST   /api/admin/servers              # Add server
GET    /api/admin/servers/{id}         # Get server details
PUT    /api/admin/servers/{id}         # Update server
DELETE /api/admin/servers/{id}         # Delete server
POST   /api/admin/servers/{id}/test    # Test server connection
\`\`\`

### Model Endpoints

\`\`\`bash
GET    /api/admin/models               # List all models
POST   /api/admin/models               # Add model
GET    /api/admin/models/{id}          # Get model details
PUT    /api/admin/models/{id}          # Update model
DELETE /api/admin/models/{id}          # Delete model
POST   /api/admin/models/{id}/test     # Test model
\`\`\`

### Agent Endpoints

\`\`\`bash
GET    /api/admin/agents               # List all agents
POST   /api/admin/agents               # Add agent
GET    /api/admin/agents/{id}          # Get agent details
PUT    /api/admin/agents/{id}          # Update agent
DELETE /api/admin/agents/{id}          # Delete agent
POST   /api/admin/agents/{id}/test     # Test agent
\`\`\`

### Settings Endpoints

\`\`\`bash
GET    /api/admin/settings             # Get all settings
GET    /api/admin/settings/{key}       # Get specific setting
PUT    /api/admin/settings/{key}       # Update setting
\`\`\`

### Health Endpoints

\`\`\`bash
GET    /api/admin/health/all           # Check all services
GET    /api/admin/health/server/{id}   # Check specific server
GET    /api/admin/health/model/{id}    # Check specific model
GET    /api/admin/health/agent/{id}    # Check specific agent
\`\`\`

---

## 🎓 Best Practices

### 1. Naming Conventions
- Servers: Descriptive names (e.g., "OpenAI Gateway", "Ollama Server")
- Models: Format: `Provider - Model Name` (e.g., "OpenAI - GPT-4")
- Agents: Function-based (e.g., "Code Editor Agent", "Bengali NLP Agent")

### 2. Port Management
- Keep ports documented in spreadsheet
- Use port ranges for categories:
  - 8000-8099: Internal agents
  - 8100-8199: External APIs
  - 11000-11999: AI model servers

### 3. Security
- Never commit API keys to Git
- Use environment variables
- Rotate keys regularly
- Enable HTTPS in production

### 4. Monitoring
- Set up health check intervals: 60 seconds
- Enable email alerts for downtime
- Review logs daily
- Archive old logs monthly

### 5. Backup Strategy
- Daily database backups
- Weekly full system backups
- Test restore procedure monthly
- Keep 30 days of backups

---

## 📈 Performance Optimization

### Database Optimization
\`\`\`sql
-- Add indexes for common queries
CREATE INDEX idx_agents_type ON agents(agent_type);
CREATE INDEX idx_servers_active ON servers(is_active);
CREATE INDEX idx_models_provider ON ai_models(provider);

-- Regular maintenance
OPTIMIZE TABLE servers;
OPTIMIZE TABLE agents;
OPTIMIZE TABLE ai_models;
\`\`\`

### Caching Strategy
\`\`\`javascript
// Enable Redis caching
{
  "cache": {
    "enabled": true,
    "ttl": 300, // 5 minutes
    "keys": [
      "servers:list",
      "models:list",
      "agents:list"
    ]
  }
}
\`\`\`

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Database backed up
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Documentation updated

### Deployment Steps
1. Build frontend: `npm run build`
2. Test build locally: `npm start`
3. Deploy backend to server
4. Configure nginx/Apache reverse proxy
5. Set up SSL certificates
6. Update DNS records
7. Test all endpoints
8. Monitor for 24 hours

### Post-Deployment
- [ ] Health checks passing
- [ ] Logs monitoring
- [ ] Performance metrics normal
- [ ] Backup system active
- [ ] Team notified

---

## 📞 Support & Resources

### Documentation
- Main Docs: `/documentation`
- API Docs: `http://localhost:5000/docs`
- Video Tutorials: Coming soon

### Community
- GitHub: https://github.com/zombiecoder
- Discord: Join our server
- Email: infi@zombiecoder.my.id

### Getting Help
1. Check this documentation
2. Review troubleshooting section
3. Check logs: `backend-gateway/logs/`
4. Search GitHub issues
5. Contact support

---

## 📝 Changelog

### Version 2.0.0 (October 2025)
- Complete system redesign
- Dynamic loading for all pages
- English-first UI
- Comprehensive documentation
- WHMCS integration
- Provider management
- Enhanced productivity tools
- Real-time monitoring
- WebSocket support

### Version 1.0.0 (September 2025)
- Initial release
- Basic admin panel
- Server management
- Agent orchestration

---

## 🎯 Roadmap

### Q4 2025
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI model fine-tuning UI
- [ ] Multi-tenancy support
- [ ] Docker containerization

### Q1 2026
- [ ] Kubernetes deployment
- [ ] Advanced monitoring (Prometheus/Grafana)
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Public API marketplace

---

## ⚖️ License

This project is proprietary software developed by ZombieCoder.
All rights reserved.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI team for the high-performance backend
- shadcn/ui for beautiful components
- Our beta testers for valuable feedback

---

**Last Updated**: October 2025  
**Version**: 2.0.0  
**Author**: ZombieCoder Team

For questions or support, contact: infi@zombiecoder.my.id
\`\`\`

Now let me update the main pages to be fully in English with dynamic loading:

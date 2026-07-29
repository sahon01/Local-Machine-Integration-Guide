import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/zombiecoder.db';
const dataDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user', 'guest')),
    avatar_url TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Providers table
db.exec(`
  CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('openai', 'ollama', 'gemini', 'other')),
    api_key TEXT,
    api_url TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    is_default BOOLEAN DEFAULT 0,
    metadata JSON,
    rate_limit_requests INTEGER DEFAULT 100,
    rate_limit_period INTEGER DEFAULT 60,
    requests_today INTEGER DEFAULT 0,
    last_request_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
  );
`);

// Models table
db.exec(`
  CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    provider_id TEXT REFERENCES providers(id),
    name TEXT NOT NULL,
    display_name TEXT,
    model_id TEXT NOT NULL,
    description TEXT,
    version TEXT,
    context_window INTEGER,
    max_tokens INTEGER,
    is_active BOOLEAN DEFAULT 1,
    is_default BOOLEAN DEFAULT 0,
    capabilities JSON,
    pricing JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Servers table
db.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    hostname TEXT UNIQUE NOT NULL,
    ip_address TEXT NOT NULL,
    port INTEGER,
    region TEXT,
    os TEXT,
    status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'maintenance')),
    cpu_usage REAL,
    memory_usage REAL,
    disk_usage REAL,
    last_health_check DATETIME,
    is_active BOOLEAN DEFAULT 1,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Agents table
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('general', 'code_editor', 'chatting', 'master', 'custom')),
    status TEXT DEFAULT 'idle' CHECK(status IN ('idle', 'active', 'error', 'training')),
    model_id TEXT REFERENCES models(id),
    server_id TEXT REFERENCES servers(id),
    system_prompt TEXT,
    max_memory_tokens INTEGER DEFAULT 2000,
    temperature REAL DEFAULT 0.7,
    top_p REAL DEFAULT 0.9,
    is_active BOOLEAN DEFAULT 1,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
  );
`);

// Tools table
db.exec(`
  CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK(category IN ('productivity', 'development', 'system', 'ai', 'utility')),
    implementation TEXT,
    parameters JSON,
    is_active BOOLEAN DEFAULT 1,
    agent_id TEXT REFERENCES agents(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
  );
`);

// RAG Documents table
db.exec(`
  CREATE TABLE IF NOT EXISTS rag_documents (
    id TEXT PRIMARY KEY,
    agent_id TEXT REFERENCES agents(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding BLOB,
    chunk_index INTEGER,
    metadata JSON,
    indexed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Conversation Memory table
db.exec(`
  CREATE TABLE IF NOT EXISTS conversation_memory (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    agent_id TEXT REFERENCES agents(id),
    user_id TEXT REFERENCES users(id),
    role TEXT CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// API Requests Log table
db.exec(`
  CREATE TABLE IF NOT EXISTS api_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    model_id TEXT REFERENCES models(id),
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Settings table
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'string',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Webhooks table
db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    event_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    secret_token TEXT,
    retry_count INTEGER DEFAULT 3,
    last_triggered DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
  );
`);

// Create indexes for performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
  CREATE INDEX IF NOT EXISTS idx_models_provider ON models(provider_id);
  CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active);
  CREATE INDEX IF NOT EXISTS idx_conversation_session ON conversation_memory(session_id);
  CREATE INDEX IF NOT EXISTS idx_api_requests_user ON api_requests(user_id);
`);

console.log('✓ Database initialized successfully');
console.log(`✓ Database location: ${dbPath}`);

db.close();

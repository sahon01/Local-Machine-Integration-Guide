import { initializeDatabase } from '../database/init.js';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const db = new Database('./data/zombiecoder.db');

async function seedDatabase() {
  console.log('[Seed] Starting database seeding...');

  try {
    // Initialize database schema first
    initializeDatabase();
    console.log('[Seed] Database schema initialized');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123456', 10);
    const user1Password = await bcrypt.hash('user123456', 10);
    const user2Password = await bcrypt.hash('user123456', 10);

    // Seed Users Table
    console.log('[Seed] Seeding users table...');
    db.exec(`
      INSERT OR IGNORE INTO users (id, username, email, password, role, is_active, created_at) VALUES
      ('admin-001', 'administrator', 'admin@zombiecoder.my.id', '${adminPassword}', 'admin', 1, datetime('now')),
      ('user-001', 'dev-user-one', 'user1@zombiecoder.my.id', '${user1Password}', 'user', 1, datetime('now')),
      ('user-002', 'dev-user-two', 'user2@zombiecoder.my.id', '${user2Password}', 'user', 1, datetime('now'))
    `);

    // Seed Providers Table
    console.log('[Seed] Seeding providers table...');
    db.exec(`
      INSERT OR IGNORE INTO providers (id, name, type, endpoint, api_key, is_active, config) VALUES
      ('provider-openai', 'OpenAI', 'openai', 'https://api.openai.com/v1', 'sk-', 1, '{"model": "gpt-4"}'),
      ('provider-ollama', 'Ollama', 'ollama', 'http://localhost:11434', '', 1, '{"model": "llama2"}'),
      ('provider-gemini', 'Google Gemini', 'gemini', 'https://generativelanguage.googleapis.com/v1beta', '', 0, '{"model": "gemini-pro"}')
    `);

    // Seed Models Table
    console.log('[Seed] Seeding models table...');
    db.exec(`
      INSERT OR IGNORE INTO models (id, provider_id, name, model_id, status, tokens_limit) VALUES
      ('model-gpt4', 'provider-openai', 'GPT-4', 'gpt-4', 'active', 8192),
      ('model-gpt35', 'provider-openai', 'GPT-3.5 Turbo', 'gpt-3.5-turbo', 'active', 4096),
      ('model-llama2', 'provider-ollama', 'Llama 2', 'llama2', 'active', 4096),
      ('model-gemini', 'provider-gemini', 'Gemini Pro', 'gemini-pro', 'inactive', 30000)
    `);

    // Seed Agents Table
    console.log('[Seed] Seeding agents table...');
    db.exec(`
      INSERT OR IGNORE INTO agents (id, name, description, model_id, system_prompt, is_active) VALUES
      ('agent-general', 'General Assistant', 'General purpose AI assistant', 'model-gpt4', 'You are a helpful AI assistant.', 1),
      ('agent-code', 'Code Expert', 'Specialized in code generation and debugging', 'model-gpt4', 'You are an expert programmer. Provide clean, efficient code with explanations.', 1),
      ('agent-zombie', 'ZombieCoder Dev Agent', 'Development assistant with Bengali support', 'model-llama2', 'You are ZombieCoder Dev Agent. Speak in Bengali when conversing, keep technical terms in English.', 1)
    `);

    // Seed Servers Table
    console.log('[Seed] Seeding servers table...');
    db.exec(`
      INSERT OR IGNORE INTO servers (id, name, host, port, status, cpu_usage, memory_usage) VALUES
      ('server-primary', 'Primary Server', 'localhost', 5000, 'online', 25, 45),
      ('server-backup', 'Backup Server', 'backup.zombiecoder.my.id', 5000, 'online', 15, 35),
      ('server-gpu', 'GPU Server', 'gpu.zombiecoder.my.id', 5001, 'online', 85, 72)
    `);

    // Seed Tools Table
    console.log('[Seed] Seeding tools table...');
    db.exec(`
      INSERT OR IGNORE INTO tools (id, name, description, category, endpoint, is_enabled) VALUES
      ('tool-code-execute', 'Code Executor', 'Execute code snippets safely', 'developer', '/api/tools/execute', 1),
      ('tool-search', 'Web Search', 'Search the internet for information', 'utility', '/api/tools/search', 1),
      ('tool-file-reader', 'File Reader', 'Read files from the system', 'file', '/api/tools/read', 1),
      ('tool-db-query', 'Database Query', 'Execute database queries', 'database', '/api/tools/query', 0)
    `);

    // Seed Settings Table
    console.log('[Seed] Seeding settings table...');
    db.exec(`
      INSERT OR IGNORE INTO settings (key, value, category) VALUES
      ('app_name', 'ZombieCoder', 'general'),
      ('app_version', '1.0.0', 'general'),
      ('max_tokens', '8192', 'limits'),
      ('request_timeout', '30', 'limits'),
      ('enable_streaming', 'true', 'features'),
      ('enable_rag', 'true', 'features')
    `);

    console.log('[Seed] Database seeding completed successfully!');
    console.log('[Seed] Default credentials:');
    console.log('  Admin: administrator / admin123456');
    console.log('  User 1: dev-user-one / user123456');
    console.log('  User 2: dev-user-two / user123456');

  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

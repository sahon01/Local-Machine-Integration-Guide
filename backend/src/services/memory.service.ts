import Database from 'better-sqlite3';

interface MemoryEntry {
  id: string;
  agentId: string;
  type: 'conversation' | 'context' | 'task' | 'learning';
  content: string;
  metadata: Record<string, any>;
  importance: number;
  createdAt: number;
  accessCount: number;
  lastAccessedAt: number;
}

interface ConversationMemory {
  id: string;
  agentId: string;
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
  }>;
  summary: string;
  createdAt: number;
  updatedAt: number;
}

export class MemoryService {
  private db: Database.Database;
  private maxMemorySize: number = 100; // Max entries per agent

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initializeMemoryTables();
  }

  private initializeMemoryTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversation_memory (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        messages TEXT NOT NULL,
        summary TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS memory_entries (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata TEXT,
        importance REAL DEFAULT 0.5,
        created_at INTEGER NOT NULL,
        access_count INTEGER DEFAULT 0,
        last_accessed_at INTEGER,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS memory_relationships (
        id TEXT PRIMARY KEY,
        source_memory_id TEXT NOT NULL,
        target_memory_id TEXT NOT NULL,
        relationship_type TEXT,
        strength REAL DEFAULT 1.0,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (source_memory_id) REFERENCES memory_entries(id),
        FOREIGN KEY (target_memory_id) REFERENCES memory_entries(id)
      );

      CREATE INDEX IF NOT EXISTS idx_conversation_agent ON conversation_memory(agent_id);
      CREATE INDEX IF NOT EXISTS idx_conversation_session ON conversation_memory(session_id);
      CREATE INDEX IF NOT EXISTS idx_memory_agent ON memory_entries(agent_id);
      CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_entries(type);
      CREATE INDEX IF NOT EXISTS idx_memory_importance ON memory_entries(importance DESC);
    `);
  }

  saveConversation(agentId: string, sessionId: string, messages: any[], summary?: string): string {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = Date.now();

    const stmt = this.db.prepare(`
      INSERT INTO conversation_memory (id, agent_id, session_id, messages, summary, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, agentId, sessionId, JSON.stringify(messages), summary || null, now, now);
    return id;
  }

  getConversation(agentId: string, sessionId: string): ConversationMemory | null {
    const stmt = this.db.prepare(`
      SELECT * FROM conversation_memory WHERE agent_id = ? AND session_id = ?
      ORDER BY created_at DESC LIMIT 1
    `);

    const result = stmt.get(agentId, sessionId) as any;
    if (!result) return null;

    return {
      id: result.id,
      agentId: result.agent_id,
      sessionId: result.session_id,
      messages: JSON.parse(result.messages),
      summary: result.summary,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  addMemory(
    agentId: string,
    type: 'conversation' | 'context' | 'task' | 'learning',
    content: string,
    metadata: Record<string, any> = {},
    importance: number = 0.5
  ): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = Date.now();

    // Check if we need to prune old memories
    const count = this.db
      .prepare('SELECT COUNT(*) as count FROM memory_entries WHERE agent_id = ?')
      .get(agentId) as any;

    if (count.count >= this.maxMemorySize) {
      this.pruneOldMemories(agentId);
    }

    const stmt = this.db.prepare(`
      INSERT INTO memory_entries (id, agent_id, type, content, metadata, importance, created_at, access_count, last_accessed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `);

    stmt.run(id, agentId, type, content, JSON.stringify(metadata), importance, now, now);
    return id;
  }

  retrieveMemories(agentId: string, type?: string, limit: number = 10): MemoryEntry[] {
    let query = `
      SELECT * FROM memory_entries
      WHERE agent_id = ?
    `;
    const params: any[] = [agentId];

    if (type) {
      query += ` AND type = ?`;
      params.push(type);
    }

    query += ` ORDER BY importance DESC, last_accessed_at DESC LIMIT ?`;
    params.push(limit);

    const stmt = this.db.prepare(query);
    const results = stmt.all(...params) as any[];

    return results.map((r) => ({
      id: r.id,
      agentId: r.agent_id,
      type: r.type,
      content: r.content,
      metadata: JSON.parse(r.metadata || '{}'),
      importance: r.importance,
      createdAt: r.created_at,
      accessCount: r.access_count,
      lastAccessedAt: r.last_accessed_at,
    }));
  }

  accessMemory(memoryId: string) {
    const now = Date.now();
    const stmt = this.db.prepare(`
      UPDATE memory_entries
      SET access_count = access_count + 1, last_accessed_at = ?
      WHERE id = ?
    `);
    stmt.run(now, memoryId);
  }

  updateImportance(memoryId: string, importance: number) {
    const stmt = this.db.prepare(`
      UPDATE memory_entries SET importance = ? WHERE id = ?
    `);
    stmt.run(importance, memoryId);
  }

  createRelationship(sourceId: string, targetId: string, type: string, strength: number = 1.0) {
    const id = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = Date.now();

    const stmt = this.db.prepare(`
      INSERT INTO memory_relationships (id, source_memory_id, target_memory_id, relationship_type, strength, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, sourceId, targetId, type, strength, now);
    return id;
  }

  getRelatedMemories(memoryId: string, limit: number = 5) {
    const stmt = this.db.prepare(`
      SELECT me.* FROM memory_entries me
      JOIN memory_relationships mr ON me.id = mr.target_memory_id
      WHERE mr.source_memory_id = ?
      ORDER BY mr.strength DESC LIMIT ?
    `);

    const results = stmt.all(memoryId, limit) as any[];
    return results.map((r) => ({
      id: r.id,
      agentId: r.agent_id,
      type: r.type,
      content: r.content,
      metadata: JSON.parse(r.metadata || '{}'),
      importance: r.importance,
      createdAt: r.created_at,
      accessCount: r.access_count,
      lastAccessedAt: r.last_accessed_at,
    }));
  }

  private pruneOldMemories(agentId: string) {
    // Remove memories with lowest importance scores
    const stmt = this.db.prepare(`
      DELETE FROM memory_entries
      WHERE agent_id = ? AND id IN (
        SELECT id FROM memory_entries
        WHERE agent_id = ?
        ORDER BY importance ASC, last_accessed_at ASC
        LIMIT ?
      )
    `);

    const pruneCount = Math.ceil(this.maxMemorySize * 0.2); // Remove 20% of oldest
    stmt.run(agentId, agentId, pruneCount);
  }

  clearMemories(agentId: string) {
    const stmt = this.db.prepare('DELETE FROM memory_entries WHERE agent_id = ?');
    stmt.run(agentId);
  }

  getMemoryStats(agentId: string) {
    const stmt = this.db.prepare(`
      SELECT
        COUNT(*) as total_entries,
        AVG(importance) as avg_importance,
        MAX(importance) as max_importance,
        COUNT(DISTINCT type) as unique_types,
        SUM(access_count) as total_accesses
      FROM memory_entries
      WHERE agent_id = ?
    `);

    const result = stmt.get(agentId) as any;
    return {
      totalEntries: result.total_entries || 0,
      avgImportance: result.avg_importance || 0,
      maxImportance: result.max_importance || 0,
      uniqueTypes: result.unique_types || 0,
      totalAccesses: result.total_accesses || 0,
    };
  }
}

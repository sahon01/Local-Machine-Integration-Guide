import Database from 'better-sqlite3';
import { createHash } from 'crypto';

interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
  createdAt: number;
}

interface SearchResult {
  document: Document;
  similarity: number;
}

export class RAGService {
  private db: Database.Database;
  private chunkSize: number = 512;
  private overlapSize: number = 50;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initializeRAGTables();
  }

  private initializeRAGTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rag_documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        source TEXT,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rag_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (document_id) REFERENCES rag_documents(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_chunks_document ON rag_chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_documents_source ON rag_documents(source);
    `);
  }

  addDocument(title: string, content: string, source: string, metadata?: Record<string, any>): string {
    const id = createHash('sha256').update(title + content).digest('hex').substring(0, 16);
    const now = Date.now();

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO rag_documents (id, title, content, source, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, title, content, source, JSON.stringify(metadata || {}), now, now);

    // Create chunks
    this.createChunks(id, content);

    return id;
  }

  private createChunks(documentId: string, content: string) {
    const chunks = this.chunkText(content);
    const deleteStmt = this.db.prepare('DELETE FROM rag_chunks WHERE document_id = ?');
    deleteStmt.run(documentId);

    const insertStmt = this.db.prepare(`
      INSERT INTO rag_chunks (id, document_id, chunk_index, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const now = Date.now();
    chunks.forEach((chunk, index) => {
      const chunkId = `${documentId}_${index}`;
      insertStmt.run(chunkId, documentId, index, chunk, now);
    });
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      let chunkEnd = end;

      // Try to break at sentence boundary
      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        const lastNewline = text.lastIndexOf('\n', end);
        chunkEnd = Math.max(lastPeriod, lastNewline);
        if (chunkEnd <= start) chunkEnd = end;
      }

      chunks.push(text.substring(start, chunkEnd).trim());
      start = chunkEnd - this.overlapSize;
    }

    return chunks.filter((c) => c.length > 0);
  }

  search(query: string, limit: number = 5): SearchResult[] {
    const stmt = this.db.prepare(`
      SELECT dc.id, dc.document_id, dc.content, rd.title, rd.source, rd.metadata
      FROM rag_chunks dc
      JOIN rag_documents rd ON dc.document_id = rd.id
      LIMIT ?
    `);

    const results = stmt.all(limit) as any[];

    return results
      .map((r) => ({
        document: {
          id: r.document_id,
          content: r.content,
          metadata: JSON.parse(r.metadata || '{}'),
          createdAt: r.created_at || 0,
        },
        similarity: this.calculateSimilarity(query, r.content),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  private calculateSimilarity(query: string, text: string): number {
    const queryTokens = this.tokenize(query);
    const textTokens = this.tokenize(text);

    const intersection = queryTokens.filter((t) => textTokens.includes(t));
    const union = new Set([...queryTokens, ...textTokens]);

    return intersection.length / (union.size || 1);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length > 2);
  }

  getDocument(id: string): Document | null {
    const stmt = this.db.prepare('SELECT * FROM rag_documents WHERE id = ?');
    const result = stmt.get(id) as any;

    if (!result) return null;

    return {
      id: result.id,
      content: result.content,
      metadata: JSON.parse(result.metadata || '{}'),
      createdAt: result.created_at,
    };
  }

  listDocuments(limit: number = 50, offset: number = 0) {
    const stmt = this.db.prepare(`
      SELECT id, title, source, created_at, updated_at
      FROM rag_documents
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(limit, offset) as any[];
  }

  deleteDocument(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM rag_documents WHERE id = ?');
    const result = stmt.run(id);
    return (result.changes || 0) > 0;
  }

  getStats() {
    const docStmt = this.db.prepare('SELECT COUNT(*) as count FROM rag_documents');
    const chunkStmt = this.db.prepare('SELECT COUNT(*) as count FROM rag_chunks');

    return {
      documents: (docStmt.get() as any).count,
      chunks: (chunkStmt.get() as any).count,
    };
  }
}

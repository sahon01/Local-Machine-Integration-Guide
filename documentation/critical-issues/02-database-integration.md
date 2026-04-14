# Critical Issue #2: Database Integration & Data Persistence

**Status:** UNVERIFIED  
**Priority:** CRITICAL  
**Impact:** Data may not be persisted correctly  
**Last Updated:** April 14, 2026

---

## Problem Statement

The system uses `better-sqlite3` for database operations, but **the actual data persistence has NOT been verified**. Table schemas exist, but CRUD operations functionality is unknown.

### Specific Issues

1. **No Connection Pooling**
   - Current implementation: Direct database connections
   - **Problem:** Concurrent requests may cause connection conflicts
   - **Risk:** Race conditions, data corruption

2. **No Transaction Support**
   - Current state: Individual queries without transactions
   - **Problem:** Multi-step operations can fail partially
   - **Risk:** Inconsistent data state

3. **Foreign Key Constraints Unknown**
   - **Problem:** Referential integrity not enforced
   - **Risk:** Orphaned records, data corruption

4. **No Query Performance Monitoring**
   - **Problem:** Cannot identify slow queries
   - **Risk:** System performance degradation

5. **No Backup Mechanism**
   - **Problem:** Data loss risk
   - **Risk:** Unrecoverable data loss on database corruption

6. **No Migration System**
   - **Problem:** Schema changes require manual updates
   - **Risk:** Database inconsistency across environments

---

## Current Implementation Analysis

### Database File Location
```
backend/src/database/init.ts
```

### What EXISTS (✅)
- SQLite database file
- Table schema definitions
- Basic initialization code

### What's MISSING (❌)
- Connection pooling layer
- Transaction wrapper
- Migration system
- Backup automation
- Query logging
- Performance monitoring
- Foreign key enforcement

---

## Critical Database Operations Required

### 1. Users Table
```sql
-- Current state: ASSUMED to exist
-- UNVERIFIED: Foreign key relationships
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Providers Table
```sql
-- UNVERIFIED: API key storage method
CREATE TABLE providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_key TEXT NOT NULL,  -- SECURITY ISSUE: Encrypted?
  api_base TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Models Table
```sql
-- UNVERIFIED: Relationship to providers
CREATE TABLE models (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT,
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

### 4. Conversations Table
```sql
-- Current file: app/api/conversations/route.ts
-- UNVERIFIED: Message relationship
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Solution Implementation Plan

### Phase 1: Connection Layer (Day 1)
```typescript
// Create file: backend/src/database/connection.ts
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database;

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  constructor() {
    this.db = new Database(DB_PATH);
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    try {
      return this.db.prepare(sql).run(...params);
    } catch (error) {
      console.error('DB Error:', error);
      throw error;
    }
  }
}
```

### Phase 2: Transaction Wrapper (Day 2)
```typescript
// Create file: backend/src/database/transactions.ts
async function withTransaction<T>(
  fn: () => Promise<T>
): Promise<T> {
  const db = getDatabase();
  db.exec('BEGIN TRANSACTION');
  
  try {
    const result = await fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
```

### Phase 3: Query Logging (Day 2)
```typescript
// Create file: backend/src/database/logger.ts
function logQuery(sql: string, duration: number, params: any[]) {
  console.log(`[DB] ${duration}ms - ${sql}`);
  if (duration > 1000) {
    console.warn(`⚠️ SLOW QUERY: ${duration}ms`);
  }
}
```

### Phase 4: Backup System (Day 3)
```typescript
// Create file: backend/src/database/backup.ts
async function backupDatabase() {
  const timestamp = new Date().toISOString();
  const backupPath = `./backups/db-${timestamp}.db`;
  // Copy database file
  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
}

// Schedule daily backup
schedule.scheduleJob('0 0 * * *', backupDatabase);
```

### Phase 5: Migration System (Day 3)
```typescript
// Create file: backend/src/database/migrations/001-initial-schema.ts
export async function up(db: Database) {
  // Run all CREATE TABLE statements
}

export async function down(db: Database) {
  // Rollback statements
}
```

---

## Verification Checklist

- [ ] Foreign keys are enabled
- [ ] Users table has valid data
- [ ] Providers table stores encrypted API keys
- [ ] Models table has correct provider relationship
- [ ] Conversations table has valid user relationship
- [ ] Transaction rollback works on error
- [ ] Concurrent requests don't conflict
- [ ] Backup runs daily
- [ ] Query logging works
- [ ] Slow queries are identified

---

## Security Concerns

### 🔴 CRITICAL: API Key Storage
**Current:** API keys stored as plain text in database  
**Risk:** Complete system compromise if database is breached  
**Solution:** Encrypt API keys before storage
```typescript
// Use crypto module
const crypto = require('crypto');

function encryptApiKey(apiKey: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
  return cipher.update(apiKey, 'utf8', 'hex') + cipher.final('hex');
}

function decryptApiKey(encryptedKey: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
  return decipher.update(encryptedKey, 'hex', 'utf8') + decipher.final('utf8');
}
```

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `backend/src/database/connection.ts` | Create | CRITICAL |
| `backend/src/database/transactions.ts` | Create | CRITICAL |
| `backend/src/database/logger.ts` | Create | HIGH |
| `backend/src/database/backup.ts` | Create | HIGH |
| `backend/src/database/migrations/` | Create | HIGH |
| `backend/src/database/encryption.ts` | Create | CRITICAL |
| `backend/src/database/init.ts` | Modify | CRITICAL |

---

## Next Steps

1. Create database connection layer
2. Add transaction support
3. Implement API key encryption
4. Set up backup system
5. Create migration system
6. Run verification tests

---

## Related Documentation

- See: `security/data-encryption.md` for encryption details
- See: `database/schema.md` for full schema
- See: `testing/database-tests.md` for test procedures

import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
  createdAt: number;
  lastActivityAt: number;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

class SessionService {
  createSession(userId: string, ipAddress?: string, userAgent?: string): Session {
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    const refreshToken = jwt.sign(
      { id: userId, type: 'refresh' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    
    const sessionId = uuidv4();
    const now = Date.now();
    const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Store session info in a sessions table (you'd need to add this table)
    // For now, we'll keep it in memory but should be persisted
    
    return {
      id: sessionId,
      userId,
      token,
      refreshToken,
      expiresAt,
      createdAt: now,
      lastActivityAt: now,
      ipAddress,
      userAgent,
      isActive: true
    };
  }
  
  validateSession(token: string): { valid: boolean; userId?: string; error?: string } {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      if (decoded.type === 'refresh') {
        return { valid: false, error: 'Refresh token cannot be used for access' };
      }
      
      return { valid: true, userId: decoded.id };
    } catch (error: any) {
      return {
        valid: false,
        error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      };
    }
  }
  
  refreshSession(refreshToken: string): { token?: string; error?: string } {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret');
      
      if (decoded.type !== 'refresh') {
        return { error: 'Invalid refresh token' };
      }
      
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      
      return { token: newToken };
    } catch (error) {
      return { error: 'Failed to refresh token' };
    }
  }
  
  revokeSession(userId: string, sessionId: string): boolean {
    // Implementation would depend on persistent storage
    return true;
  }
  
  revokeAllSessions(userId: string): boolean {
    // Implementation would depend on persistent storage
    return true;
  }
  
  updateLastActivity(userId: string): void {
    // Update last activity timestamp for user
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
  }
}

export default new SessionService();

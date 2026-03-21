import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { verifyToken } from './auth.js';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Middleware to check if user is admin
const requireAdmin = (req: Request, res: Response, next: Function) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// Dashboard stats
router.get('/stats', verifyToken, (req: Request, res: Response) => {
  try {
    const stats = {
      total_users: (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count,
      total_agents: (db.prepare('SELECT COUNT(*) as count FROM agents').get() as any).count,
      total_models: (db.prepare('SELECT COUNT(*) as count FROM models').get() as any).count,
      total_servers: (db.prepare('SELECT COUNT(*) as count FROM servers').get() as any).count,
      active_providers: (db.prepare('SELECT COUNT(*) as count FROM providers WHERE is_active = 1').get() as any).count,
      api_requests_today: (db.prepare(`
        SELECT COUNT(*) as count FROM api_requests 
        WHERE DATE(created_at) = DATE('now')
      `).get() as any).count
    };
    
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all users
router.get('/users', verifyToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const users = db.prepare(`
      SELECT id, email, username, full_name, role, status, last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `).all();
    
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user role
router.patch('/users/:userId/role', verifyToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'user', 'guest'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }
    
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, userId);
    
    res.json({ success: true, message: 'User role updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get system settings
router.get('/settings', verifyToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const settings = db.prepare('SELECT * FROM settings ORDER BY key').all();
    
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update setting
router.patch('/settings/:key', verifyToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const existing = db.prepare('SELECT id FROM settings WHERE key = ?').get(key);
    
    if (existing) {
      db.prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO settings (id, key, value) VALUES (?, ?, ?)').run(require('uuid').v4(), key, value);
    }
    
    res.json({ success: true, message: 'Setting updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get API request logs
router.get('/logs/api-requests', verifyToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    
    const logs = db.prepare(`
      SELECT * FROM api_requests
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const total = (db.prepare('SELECT COUNT(*) as count FROM api_requests').get() as any).count;
    
    res.json({ success: true, data: logs, total, limit, offset });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System health check
router.get('/health/all', verifyToken, (req: Request, res: Response) => {
  try {
    const health = {
      database: 'operational',
      agents: (db.prepare('SELECT COUNT(*) as count FROM agents WHERE is_active = 1').get() as any).count,
      servers: {
        online: (db.prepare("SELECT COUNT(*) as count FROM servers WHERE status = 'online'").get() as any).count,
        offline: (db.prepare("SELECT COUNT(*) as count FROM servers WHERE status = 'offline'").get() as any).count
      },
      providers: {
        active: (db.prepare('SELECT COUNT(*) as count FROM providers WHERE is_active = 1').get() as any).count,
        total: (db.prepare('SELECT COUNT(*) as count FROM providers').get() as any).count
      },
      timestamp: new Date().toISOString()
    };
    
    res.json({ success: true, data: health });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

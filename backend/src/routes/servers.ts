import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Get all servers
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const servers = db.prepare(`
      SELECT id, hostname, ip_address, port, region, os, status, 
             cpu_usage, memory_usage, disk_usage, last_health_check, is_active, created_at
      FROM servers
      WHERE is_active = 1
      ORDER BY created_at DESC
    `).all();
    
    res.json({ success: true, data: servers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new server
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { hostname, ip_address, port, region, os, description } = req.body;
    
    if (!hostname || !ip_address) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const serverId = uuidv4();
    
    db.prepare(`
      INSERT INTO servers (id, hostname, ip_address, port, region, os, status)
      VALUES (?, ?, ?, ?, ?, ?, 'offline')
    `).run(serverId, hostname, ip_address, port || 22, region || '', os || '');
    
    res.status(201).json({
      success: true,
      message: 'Server created successfully',
      data: { id: serverId, hostname, ip_address }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check server
router.post('/:serverId/health-check', verifyToken, (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    
    const server: any = db.prepare('SELECT * FROM servers WHERE id = ?').get(serverId);
    if (!server) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }
    
    // Simulate health check - would be real in production
    const isOnline = Math.random() > 0.1; // 90% online
    
    db.prepare(`
      UPDATE servers
      SET status = ?, 
          cpu_usage = ?,
          memory_usage = ?,
          disk_usage = ?,
          last_health_check = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      isOnline ? 'online' : 'offline',
      Math.random() * 80,
      Math.random() * 70,
      Math.random() * 60,
      serverId
    );
    
    res.json({
      success: true,
      data: {
        server_id: serverId,
        status: isOnline ? 'online' : 'offline',
        checked_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update server
router.patch('/:serverId', verifyToken, (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { hostname, region, os, is_active } = req.body;
    
    db.prepare(`
      UPDATE servers
      SET hostname = COALESCE(?, hostname),
          region = COALESCE(?, region),
          os = COALESCE(?, os),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(hostname, region, os, is_active, serverId);
    
    res.json({ success: true, message: 'Server updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete server
router.delete('/:serverId', verifyToken, (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    
    db.prepare('UPDATE servers SET is_active = 0 WHERE id = ?').run(serverId);
    
    res.json({ success: true, message: 'Server deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

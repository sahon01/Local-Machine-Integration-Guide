import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Get all agents
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const agents = db.prepare(`
      SELECT a.*, m.name as model_name, s.hostname as server_name
      FROM agents a
      LEFT JOIN models m ON a.model_id = m.id
      LEFT JOIN servers s ON a.server_id = s.id
      WHERE a.is_active = 1
      ORDER BY a.created_at DESC
    `).all();
    
    res.json({ success: true, data: agents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent by ID
router.get('/:agentId', verifyToken, (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    
    const agent = db.prepare(`
      SELECT a.*, m.name as model_name, s.hostname as server_name
      FROM agents a
      LEFT JOIN models m ON a.model_id = m.id
      LEFT JOIN servers s ON a.server_id = s.id
      WHERE a.id = ?
    `).get(agentId);
    
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    
    res.json({ success: true, data: agent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new agent
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { name, type, model_id, server_id, system_prompt, description } = req.body;
    const userId = (req as any).user.id;
    
    if (!name || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const agentId = uuidv4();
    
    db.prepare(`
      INSERT INTO agents (id, name, type, model_id, server_id, system_prompt, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(agentId, name, type, model_id || null, server_id || null, system_prompt || '', description || '', userId);
    
    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      data: { id: agentId, name, type }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update agent
router.patch('/:agentId', verifyToken, (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { name, description, status, model_id, system_prompt, temperature, top_p, is_active } = req.body;
    
    db.prepare(`
      UPDATE agents
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          model_id = COALESCE(?, model_id),
          system_prompt = COALESCE(?, system_prompt),
          temperature = COALESCE(?, temperature),
          top_p = COALESCE(?, top_p),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, status, model_id, system_prompt, temperature, top_p, is_active, agentId);
    
    res.json({ success: true, message: 'Agent updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test agent
router.post('/:agentId/test', verifyToken, (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { message } = req.body;
    
    const agent: any = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    
    // This is a placeholder - real implementation would call the provider API
    res.json({
      success: true,
      data: {
        agent_id: agentId,
        input: message,
        output: 'Test response from agent',
        model_used: agent.model_id,
        tokens_used: 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete agent
router.delete('/:agentId', verifyToken, (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    
    db.prepare('UPDATE agents SET is_active = 0 WHERE id = ?').run(agentId);
    
    res.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

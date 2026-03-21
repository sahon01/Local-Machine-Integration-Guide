import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Get all tools
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const tools = db.prepare(`
      SELECT id, name, description, category, is_active, agent_id, created_at
      FROM tools
      WHERE is_active = 1
      ORDER BY category, created_at DESC
    `).all();
    
    res.json({ success: true, data: tools });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get tools by category
router.get('/category/:category', verifyToken, (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    const tools = db.prepare(`
      SELECT * FROM tools
      WHERE category = ? AND is_active = 1
      ORDER BY created_at DESC
    `).all(category);
    
    res.json({ success: true, data: tools });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new tool
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { name, description, category, implementation, parameters, agent_id } = req.body;
    const userId = (req as any).user.id;
    
    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const toolId = uuidv4();
    
    db.prepare(`
      INSERT INTO tools (id, name, description, category, implementation, parameters, agent_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      toolId, name, description || '', category, implementation || '', 
      JSON.stringify(parameters || {}), agent_id || null, userId
    );
    
    res.status(201).json({
      success: true,
      message: 'Tool created successfully',
      data: { id: toolId, name, category }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update tool
router.patch('/:toolId', verifyToken, (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const { name, description, implementation, parameters, is_active } = req.body;
    
    db.prepare(`
      UPDATE tools
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          implementation = COALESCE(?, implementation),
          parameters = COALESCE(?, parameters),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, implementation, JSON.stringify(parameters), is_active, toolId);
    
    res.json({ success: true, message: 'Tool updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete tool
router.delete('/:toolId', verifyToken, (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    
    db.prepare('UPDATE tools SET is_active = 0 WHERE id = ?').run(toolId);
    
    res.json({ success: true, message: 'Tool deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

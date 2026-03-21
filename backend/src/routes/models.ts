import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Get all models
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const models = db.prepare(`
      SELECT m.*, p.name as provider_name, p.type as provider_type
      FROM models m
      LEFT JOIN providers p ON m.provider_id = p.id
      WHERE m.is_active = 1
      ORDER BY m.created_at DESC
    `).all();
    
    res.json({ success: true, data: models });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get model by ID
router.get('/:modelId', verifyToken, (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    
    const model = db.prepare(`
      SELECT m.*, p.name as provider_name
      FROM models m
      LEFT JOIN providers p ON m.provider_id = p.id
      WHERE m.id = ?
    `).get(modelId);
    
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    
    res.json({ success: true, data: model });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new model
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { provider_id, name, display_name, model_id, description, version, context_window, max_tokens, capabilities } = req.body;
    
    if (!provider_id || !name || !model_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO models (id, provider_id, name, display_name, model_id, description, version, context_window, max_tokens, capabilities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, provider_id, name, display_name || name, model_id, description || '', 
      version || '1.0.0', context_window || 4096, max_tokens || 2048, JSON.stringify(capabilities || {})
    );
    
    res.status(201).json({
      success: true,
      message: 'Model created successfully',
      data: { id, name, model_id }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update model
router.patch('/:modelId', verifyToken, (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { name, description, is_active, is_default } = req.body;
    
    db.prepare(`
      UPDATE models
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          is_active = COALESCE(?, is_active),
          is_default = COALESCE(?, is_default),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, is_active, is_default, modelId);
    
    res.json({ success: true, message: 'Model updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set default model
router.post('/:modelId/set-default', verifyToken, (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    
    // Reset all defaults
    db.prepare('UPDATE models SET is_default = 0').run();
    
    // Set this as default
    db.prepare('UPDATE models SET is_default = 1 WHERE id = ?').run(modelId);
    
    res.json({ success: true, message: 'Default model updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete model
router.delete('/:modelId', verifyToken, (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    
    db.prepare('DELETE FROM models WHERE id = ?').run(modelId);
    
    res.json({ success: true, message: 'Model deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

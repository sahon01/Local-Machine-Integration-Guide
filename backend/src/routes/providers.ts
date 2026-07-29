import express, { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';
import axios from 'axios';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

// Get all providers
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const providers = db.prepare(`
      SELECT id, name, type, description, is_active, is_default, 
             requests_today, last_request_time, created_at, updated_at
      FROM providers
      ORDER BY created_at DESC
    `).all();
    
    res.json({ success: true, data: providers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new provider
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { name, type, api_key, api_url, description } = req.body;
    const userId = (req as any).user.id;
    
    if (!name || !type || !api_url) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const providerId = uuidv4();
    
    db.prepare(`
      INSERT INTO providers (id, name, type, api_key, api_url, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(providerId, name, type, api_key || null, api_url, description || '', userId);
    
    res.status(201).json({
      success: true,
      message: 'Provider created successfully',
      data: { id: providerId, name, type, api_url }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test provider connection
router.post('/:providerId/test', verifyToken, async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    
    const provider: any = db.prepare('SELECT * FROM providers WHERE id = ?').get(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }
    
    // Test connection based on provider type
    let testResult = { success: false, message: '' };
    
    try {
      const response = await axios.get(`${provider.api_url}/models`, {
        headers: {
          'Authorization': `Bearer ${provider.api_key}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      testResult = {
        success: true,
        message: `Connected successfully. Found ${response.data.data?.length || 0} models.`
      };
    } catch (error: any) {
      testResult = {
        success: false,
        message: error.message || 'Connection failed'
      };
    }
    
    res.json({
      success: testResult.success,
      data: { ...testResult, provider_id: providerId, tested_at: new Date().toISOString() }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update provider
router.patch('/:providerId', verifyToken, (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const { name, api_key, api_url, description, is_active, is_default } = req.body;
    
    db.prepare(`
      UPDATE providers 
      SET name = COALESCE(?, name),
          api_key = COALESCE(?, api_key),
          api_url = COALESCE(?, api_url),
          description = COALESCE(?, description),
          is_active = COALESCE(?, is_active),
          is_default = COALESCE(?, is_default),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, api_key, api_url, description, is_active, is_default, providerId);
    
    res.json({ success: true, message: 'Provider updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete provider
router.delete('/:providerId', verifyToken, (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    
    db.prepare('DELETE FROM providers WHERE id = ?').run(providerId);
    
    res.json({ success: true, message: 'Provider deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

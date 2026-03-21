import { Router, Request, Response } from 'express';
import { MemoryService } from '../services/memory.service.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const memoryService = new MemoryService('./data/zombiecoder.db');

// Save conversation
router.post('/conversations', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { agentId, sessionId, messages, summary } = req.body;

    if (!agentId || !sessionId || !messages) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }

    const conversationId = memoryService.saveConversation(
      agentId,
      sessionId,
      messages,
      summary
    );

    res.json({ conversationId, message: 'Conversation saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save conversation' });
  }
});

// Get conversation
router.get('/conversations/:agentId/:sessionId', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { agentId, sessionId } = req.params;
    const conversation = memoryService.getConversation(agentId, sessionId);

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
});

// Add memory entry
router.post('/entries', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { agentId, type, content, metadata, importance } = req.body;

    if (!agentId || !type || !content) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }

    const entryId = memoryService.addMemory(
      agentId,
      type,
      content,
      metadata || {},
      importance || 0.5
    );

    res.json({ entryId, message: 'Memory entry added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add memory entry' });
  }
});

// Retrieve memories
router.get('/entries/:agentId', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const type = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 10;

    const memories = memoryService.retrieveMemories(agentId, type, limit);

    // Access the memories
    memories.forEach((m) => memoryService.accessMemory(m.id));

    res.json({ memories, count: memories.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
});

// Update memory importance
router.put('/entries/:memoryId/importance', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { memoryId } = req.params;
    const { importance } = req.body;

    if (importance === undefined) {
      res.status(400).json({ error: 'Importance value required' });
      return;
    }

    memoryService.updateImportance(memoryId, importance);
    res.json({ message: 'Memory importance updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update importance' });
  }
});

// Create memory relationship
router.post('/relationships', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { sourceId, targetId, type, strength } = req.body;

    if (!sourceId || !targetId || !type) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }

    const relationshipId = memoryService.createRelationship(
      sourceId,
      targetId,
      type,
      strength || 1.0
    );

    res.json({ relationshipId, message: 'Relationship created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create relationship' });
  }
});

// Get related memories
router.get('/relationships/:memoryId', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { memoryId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const relatedMemories = memoryService.getRelatedMemories(memoryId, limit);
    res.json({ relatedMemories, count: relatedMemories.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve related memories' });
  }
});

// Get memory stats
router.get('/stats/:agentId', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const stats = memoryService.getMemoryStats(agentId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve memory stats' });
  }
});

// Clear memories
router.delete('/:agentId', authMiddleware('admin'), (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    memoryService.clearMemories(agentId);
    res.json({ message: 'Agent memories cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear memories' });
  }
});

export default router;

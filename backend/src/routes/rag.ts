import { Router, Request, Response } from 'express';
import { RAGService } from '../services/rag.service.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const ragService = new RAGService('./data/zombiecoder.db');

// Add document
router.post('/documents', authMiddleware('admin'), (req: Request, res: Response) => {
  try {
    const { title, content, source, metadata } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const documentId = ragService.addDocument(title, content, source, metadata);
    res.json({ documentId, message: 'Document added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// Search documents
router.post('/search', authMiddleware(), (req: Request, res: Response) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const results = ragService.search(query, limit);
    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search documents' });
  }
});

// Get document
router.get('/documents/:id', authMiddleware(), (req: Request, res: Response) => {
  try {
    const document = ragService.getDocument(req.params.id);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

// List documents
router.get('/documents', authMiddleware(), (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const documents = ragService.listDocuments(limit, offset);
    res.json({ documents, count: documents.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list documents' });
  }
});

// Delete document
router.delete('/documents/:id', authMiddleware('admin'), (req: Request, res: Response) => {
  try {
    const success = ragService.deleteDocument(req.params.id);

    if (!success) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Get stats
router.get('/stats', authMiddleware(), (req: Request, res: Response) => {
  try {
    const stats = ragService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;

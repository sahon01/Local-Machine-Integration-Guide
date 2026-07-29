import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';

const router = Router();
const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Middleware to verify JWT
export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, fullName } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    // Create user
    const stmt = db.prepare(`
      INSERT INTO users (id, email, username, password_hash, full_name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, email, username, passwordHash, fullName || username, 'user');
    
    // Generate JWT
    const token = jwt.sign(
      { id: userId, email, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: userId,
        email,
        username,
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    // Find user
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user
router.get('/me', verifyToken, (req: Request, res: Response) => {
  try {
    const user: any = db.prepare('SELECT id, email, username, full_name, role FROM users WHERE id = ?').get((req as any).user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Refresh token
router.post('/refresh', verifyToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

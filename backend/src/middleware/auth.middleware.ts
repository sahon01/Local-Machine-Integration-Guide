import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    role: 'admin' | 'user' | 'guest';
  };
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided',
        code: 'NO_TOKEN'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    // Verify user still exists and is active
    const user: any = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?').get(decoded.id, 'active');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }
    
    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: `Required role(s): ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as AuthenticatedRequest).user;
  
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      code: 'ADMIN_ONLY'
    });
  }
  
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const user: any = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?').get(decoded.id, 'active');
      
      if (user) {
        (req as AuthenticatedRequest).user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        };
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }
  
  next();
};

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );
};

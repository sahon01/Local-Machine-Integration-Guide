import { Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimit = (options: {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
} = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100;
  const message = options.message || 'Too many requests, please try again later';
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    if (now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    store[key].count++;
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count));
    res.setHeader('X-RateLimit-Reset', store[key].resetTime);
    
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
      });
    }
    
    next();
  };
};

export const apiKeyRateLimit = (options: {
  windowMs?: number;
  maxRequests?: number;
} = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const maxRequests = options.maxRequests || 1000;
  
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return next();
    
    const key = `user-${user.id}`;
    const now = Date.now();
    
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    if (now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    store[key].count++;
    
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded for API requests'
      });
    }
    
    next();
  };
};

export const cleanupExpiredLimits = () => {
  setInterval(() => {
    const now = Date.now();
    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    }
  }, 5 * 60 * 1000); // Clean every 5 minutes
};

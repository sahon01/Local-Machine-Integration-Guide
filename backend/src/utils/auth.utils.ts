import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class AuthUtils {
  /**
   * Hash password securely
   */
  static async hashPassword(password: string, rounds: number = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }
  
  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters');
    
    if (password.length >= 12) score++;
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Password should contain lowercase letters');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Password should contain uppercase letters');
    
    if (/\d/.test(password)) score++;
    else feedback.push('Password should contain numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Password should contain special characters');
    
    return {
      valid: score >= 4,
      score,
      feedback
    };
  }
  
  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  /**
   * Hash token for storage (one-way)
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate username format
   */
  static validateUsername(username: string): {
    valid: boolean;
    feedback: string[];
  } {
    const feedback: string[] = [];
    
    if (username.length < 3) {
      feedback.push('Username should be at least 3 characters');
    }
    
    if (username.length > 32) {
      feedback.push('Username should be at most 32 characters');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      feedback.push('Username should only contain letters, numbers, underscores, and hyphens');
    }
    
    return {
      valid: feedback.length === 0,
      feedback
    };
  }
  
  /**
   * Generate JWT token
   */
  static generateJWT(payload: any, expiresIn: string = '7d'): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn });
  }
  
  /**
   * Verify JWT token
   */
  static verifyJWT(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return { valid: true, payload };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  }
  
  /**
   * Decode JWT token without verification
   */
  static decodeJWT(token: string): any {
    return jwt.decode(token);
  }
  
  /**
   * Check if email is allowed (whitelist/blacklist)
   */
  static isEmailAllowed(email: string, allowedDomains?: string[]): boolean {
    if (!allowedDomains) return true;
    
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }
  
  /**
   * Generate login code for passwordless auth
   */
  static generateLoginCode(length: number = 6): string {
    const characters = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
  
  /**
   * Mask sensitive data in logs
   */
  static maskSensitiveData(data: any, fields: string[] = ['password', 'api_key', 'token', 'secret']): any {
    const masked = { ...data };
    
    for (const field of fields) {
      if (masked[field]) {
        masked[field] = '***masked***';
      }
    }
    
    return masked;
  }
}

export default AuthUtils;

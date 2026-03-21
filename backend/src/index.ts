import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import providersRoutes from './routes/providers.js';
import modelsRoutes from './routes/models.js';
import agentsRoutes from './routes/agents.js';
import serversRoutes from './routes/servers.js';
import toolsRoutes from './routes/tools.js';
import completionsRoutes from './routes/completions.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Load system identity
const identityPath = path.join(process.cwd(), 'src/config/identity.json');
const systemIdentity = JSON.parse(fs.readFileSync(identityPath, 'utf-8'));

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  next();
});

// Custom header middleware - System Identity
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'ZombieCoder-by-SahonSrabon');
  res.setHeader('X-System-Version', systemIdentity.system_identity.version);
  res.setHeader('X-API-Version', systemIdentity.system_identity.api_version);
  next();
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    system: systemIdentity.system_identity.name,
    version: systemIdentity.system_identity.version,
    uptime: process.uptime()
  });
});

// System identity endpoint
app.get('/api/system/identity', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: systemIdentity.system_identity
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/servers', serversRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/completions', completionsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    requestId: req.id
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       ZombieCoder Backend Server       ║
║          Where Code Speaks             ║
╚════════════════════════════════════════╝

  System: ${systemIdentity.system_identity.name} v${systemIdentity.system_identity.version}
  Owner: ${systemIdentity.system_identity.branding.owner}
  
  Server running on: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: ${process.env.DATABASE_PATH || './data/zombiecoder.db'}
  
  API Documentation: http://localhost:${PORT}/api/docs
  Health Check: http://localhost:${PORT}/api/health
  System Identity: http://localhost:${PORT}/api/system/identity
  
  ${new Date().toLocaleTimeString()}
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nServer shutting down gracefully...');
  process.exit(0);
});

// Declare request type extension
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export default app;

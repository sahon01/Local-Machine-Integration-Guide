import WebSocket from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedWS extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

interface ServerHealthUpdate {
  type: 'server_health';
  data: {
    serverId: string;
    status: 'online' | 'offline' | 'warning';
    cpu: number;
    memory: number;
    disk: number;
    timestamp: number;
  };
}

interface AgentStatusUpdate {
  type: 'agent_status';
  data: {
    agentId: string;
    status: 'running' | 'idle' | 'error';
    activeRequests: number;
    lastUpdate: number;
  };
}

type WSMessage = ServerHealthUpdate | AgentStatusUpdate | { type: string };

export class WebSocketService {
  private wss: WebSocket.Server;
  private heartbeatInterval: NodeJS.Timer | null = null;
  private clients = new Map<string, Set<AuthenticatedWS>>();

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server, path: '/api/ws' });
    this.setupServer();
  }

  private setupServer() {
    this.wss.on('connection', (ws: AuthenticatedWS, req) => {
      const token = new URL(req.url || '', 'http://localhost').searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Missing authentication token');
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        ws.userId = decoded.userId;
        (ws as AuthenticatedWS).isAlive = true;

        const userId = decoded.userId;
        if (!this.clients.has(userId)) {
          this.clients.set(userId, new Set());
        }
        this.clients.get(userId)!.add(ws);

        ws.on('message', (data) => this.handleMessage(ws, data));
        ws.on('close', () => this.handleClose(ws, userId));
        ws.on('pong', () => {
          (ws as AuthenticatedWS).isAlive = true;
        });

        ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });

    this.startHeartbeat();
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWS) => {
        if (ws.isAlive === false) {
          ws.terminate();
          return;
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  private handleMessage(ws: AuthenticatedWS, data: WebSocket.Data) {
    try {
      const message = JSON.parse(data.toString()) as { subscribe?: string; unsubscribe?: string };

      if (message.subscribe) {
        // User wants to subscribe to updates for a specific resource
        console.log(`[WebSocket] User ${ws.userId} subscribed to ${message.subscribe}`);
      } else if (message.unsubscribe) {
        console.log(`[WebSocket] User ${ws.userId} unsubscribed from ${message.unsubscribe}`);
      }
    } catch (error) {
      console.error('[WebSocket] Message parsing error:', error);
    }
  }

  private handleClose(ws: AuthenticatedWS, userId: string) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  broadcast(message: WSMessage) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  sendToUser(userId: string, message: WSMessage) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const data = JSON.stringify(message);
      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  }

  updateServerHealth(serverId: string, status: 'online' | 'offline' | 'warning', metrics: {
    cpu: number;
    memory: number;
    disk: number;
  }) {
    this.broadcast({
      type: 'server_health',
      data: {
        serverId,
        status,
        cpu: metrics.cpu,
        memory: metrics.memory,
        disk: metrics.disk,
        timestamp: Date.now(),
      },
    });
  }

  updateAgentStatus(agentId: string, status: 'running' | 'idle' | 'error', activeRequests: number) {
    this.broadcast({
      type: 'agent_status',
      data: {
        agentId,
        status,
        activeRequests,
        lastUpdate: Date.now(),
      },
    });
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}

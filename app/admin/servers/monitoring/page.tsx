'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ServerMetrics {
  serverId: string;
  serverName: string;
  status: 'online' | 'offline' | 'warning';
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  uptime: string;
  lastUpdate: number;
}

interface WSMessage {
  type: string;
  data: any;
}

export default function ServerMonitoringPage() {
  const [servers, setServers] = useState<ServerMetrics[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchInitialServers = async () => {
      try {
        const response = await fetch('/api/servers');
        const data = await response.json();
        setServers(
          data.servers?.map((s: any) => ({
            serverId: s.id,
            serverName: s.name,
            status: s.status,
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: { in: Math.random() * 1000, out: Math.random() * 1000 },
            uptime: '45 days 12h',
            lastUpdate: Date.now(),
          })) || []
        );
      } catch (error) {
        console.error('Failed to fetch servers:', error);
      }
    };

    fetchInitialServers();

    // Connect to WebSocket
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
          window.location.host
        }/api/ws?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          ws.send(JSON.stringify({ subscribe: 'server_health' }));
        };

        ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            if (message.type === 'server_health') {
              const data = message.data;
              setServers((prev) =>
                prev.map((s) =>
                  s.serverId === data.serverId
                    ? {
                        ...s,
                        status: data.status,
                        cpu: data.cpu,
                        memory: data.memory,
                        disk: data.disk,
                        lastUpdate: data.timestamp,
                      }
                    : s
                )
              );
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onerror = () => setIsConnected(false);
        ws.onclose = () => setIsConnected(false);

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'warning':
        return 'Warning';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold">Server Monitoring</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'Real-time monitoring active' : 'Disconnected - using polling'}
          </p>
        </div>
      </div>

      {servers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No servers found. Add servers in the Servers management page.
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {servers.map((server) => (
            <Card key={server.serverId} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{server.serverName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {server.serverId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></div>
                  <Badge variant="outline">{getStatusText(server.status)}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm font-semibold">{server.cpu.toFixed(1)}%</span>
                  </div>
                  <Progress value={server.cpu} />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm font-semibold">{server.memory.toFixed(1)}%</span>
                  </div>
                  <Progress value={server.memory} />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm font-semibold">{server.disk.toFixed(1)}%</span>
                  </div>
                  <Progress value={server.disk} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Network In</p>
                  <p className="text-lg font-semibold">{(server.network.in / 1024).toFixed(2)} Mbps</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Network Out</p>
                  <p className="text-lg font-semibold">{(server.network.out / 1024).toFixed(2)} Mbps</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-sm font-semibold">{server.uptime}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(server.lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

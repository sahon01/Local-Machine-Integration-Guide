'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  model: string;
  activeRequests: number;
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
}

interface SystemStats {
  totalAgents: number;
  onlineAgents: number;
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  uptime: string;
}

export default function MasterAgentPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsResponse = await fetch('/api/agents');
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.agents || []);

        // Calculate system stats
        const agents = agentsData.agents || [];
        setSystemStats({
          totalAgents: agents.length,
          onlineAgents: agents.filter((a: Agent) => a.status === 'online').length,
          totalRequests: agents.reduce((sum: number, a: Agent) => sum + a.totalRequests, 0),
          successRate:
            agents.length > 0
              ? agents.reduce((sum: number, a: Agent) => sum + a.successRate, 0) /
                agents.length
              : 0,
          avgResponseTime:
            agents.length > 0
              ? agents.reduce((sum: number, a: Agent) => sum + a.avgResponseTime, 0) /
                agents.length
              : 0,
          uptime: '99.8%',
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Master Agent Control</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and control all AI agents in the system
        </p>
      </div>

      {/* System Stats */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Agents</div>
            <div className="text-3xl font-bold mt-2">{systemStats.totalAgents}</div>
            <div className="text-xs text-green-600 mt-1">
              {systemStats.onlineAgents} online
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-3xl font-bold mt-2">
              {systemStats.totalRequests.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-3xl font-bold mt-2">
              {systemStats.successRate.toFixed(1)}%
            </div>
            <Progress value={systemStats.successRate} className="mt-2" />
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
            <div className="text-3xl font-bold mt-2">{systemStats.avgResponseTime.toFixed(0)}ms</div>
            <div className="text-xs text-muted-foreground mt-1">System average</div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="agents" className="w-full">
        <TabsList>
          <TabsTrigger value="agents">All Agents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="settings">Master Settings</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center text-muted-foreground">
              Loading agents...
            </Card>
          ) : agents.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No agents found. Create your first agent to get started.
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.model}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <Badge variant="outline">{agent.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Active Requests</div>
                      <div className="font-semibold">{agent.activeRequests}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Requests</div>
                      <div className="font-semibold">{agent.totalRequests}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                    <Progress value={agent.successRate} />
                    <div className="text-xs font-semibold mt-1">{agent.successRate.toFixed(1)}%</div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Avg Response: {agent.avgResponseTime.toFixed(0)}ms
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Configure
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">System Performance Metrics</h3>
            <div className="space-y-4 text-muted-foreground text-sm">
              <p>Performance analytics and charts will be displayed here.</p>
              <p>This section includes request latency, throughput, and error rates.</p>
            </div>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Activity Logs</h3>
            <div className="space-y-4 text-muted-foreground text-sm">
              <p>Real-time activity logs from all agents.</p>
              <p>Filter and search through system events and agent actions.</p>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Master Agent Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Global Temperature</label>
                <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">Max Concurrent Requests</label>
                <input type="number" defaultValue="100" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Request Timeout (seconds)</label>
                <input type="number" defaultValue="30" className="w-full border rounded p-2" />
              </div>
              <Button className="w-full">Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

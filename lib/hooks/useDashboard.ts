'use client';

import { useApi } from './useApi';

export interface DashboardData {
  systemStatus: {
    healthy: number;
    totalServers: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  metrics: {
    totalUsers: number;
    activeAgents: number;
    totalRequests: number;
    averageResponseTime: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  topProviders: Array<{
    name: string;
    requests: number;
    status: 'active' | 'inactive';
  }>;
}

export function useDashboard() {
  return useApi<DashboardData>('/api/admin/dashboard', {
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

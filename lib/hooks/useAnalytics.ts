'use client';

import { useApi } from './useApi';

export interface AnalyticsData {
  period: string;
  requests: number;
  users: number;
  avgResponseTime: number;
  errorRate: number;
  topAgents: Array<{ name: string; requests: number }>;
  topProviders: Array<{ name: string; requests: number }>;
  hourlyData: Array<{ hour: string; requests: number }>;
  modelUsage: Array<{ model: string; tokens: number; cost: number }>;
}

export function useAnalytics(period: 'day' | 'week' | 'month' = 'day') {
  return useApi<AnalyticsData>(`/api/admin/analytics?period=${period}`, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

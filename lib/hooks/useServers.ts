'use client';

import { useApi, apiCall } from './useApi';

export interface Server {
  id: string;
  name: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'error';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  lastHealthCheck: string;
  services: string[];
}

export function useServers() {
  const { data, loading, error, refetch } = useApi<Server[]>('/api/servers', {
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  const addServer = async (server: Omit<Server, 'id' | 'status'>) => {
    await apiCall('/api/servers', 'POST', server);
    refetch();
  };

  const updateServer = async (id: string, updates: Partial<Server>) => {
    await apiCall(`/api/servers/${id}`, 'PUT', updates);
    refetch();
  };

  const deleteServer = async (id: string) => {
    await apiCall(`/api/servers/${id}`, 'DELETE');
    refetch();
  };

  const checkHealth = async (id: string) => {
    return apiCall(`/api/servers/${id}/status`, 'GET');
  };

  return {
    servers: data || [],
    loading,
    error,
    refetch,
    addServer,
    updateServer,
    deleteServer,
    checkHealth,
  };
}

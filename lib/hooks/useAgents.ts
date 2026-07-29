'use client';

import { useApi, apiCall } from './useApi';

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive' | 'error';
  systemPrompt: string;
  tools: string[];
  createdAt: string;
  lastActive: string;
  usageCount: number;
  successRate: number;
}

export function useAgents() {
  const { data, loading, error, refetch } = useApi<Agent[]>('/api/agents', {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const createAgent = async (agent: Omit<Agent, 'id' | 'createdAt' | 'usageCount' | 'successRate'>) => {
    await apiCall('/api/agents', 'POST', agent);
    refetch();
  };

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    await apiCall(`/api/agents/${id}`, 'PUT', updates);
    refetch();
  };

  const deleteAgent = async (id: string) => {
    await apiCall(`/api/agents/${id}`, 'DELETE');
    refetch();
  };

  const executeAgent = async (id: string, input: string) => {
    return apiCall(`/api/agents/${id}/execute`, 'POST', { input });
  };

  const getHistory = async (id: string) => {
    return apiCall(`/api/agents/${id}/history`, 'GET');
  };

  return {
    agents: data || [],
    loading,
    error,
    refetch,
    createAgent,
    updateAgent,
    deleteAgent,
    executeAgent,
    getHistory,
  };
}

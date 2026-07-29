'use client';

import { useApi, apiCall } from './useApi';

export interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'agent' | 'admin' | 'utility';
  enabled: boolean;
  category: string;
  config: Record<string, unknown>;
  usageCount: number;
  lastUsed?: string;
}

export function useTools() {
  const { data, loading, error, refetch } = useApi<Tool[]>('/api/tools');

  const createTool = async (tool: Omit<Tool, 'id' | 'usageCount'>) => {
    await apiCall('/api/tools', 'POST', tool);
    refetch();
  };

  const updateTool = async (id: string, updates: Partial<Tool>) => {
    await apiCall(`/api/tools/${id}`, 'PUT', updates);
    refetch();
  };

  const deleteTool = async (id: string) => {
    await apiCall(`/api/tools/${id}`, 'DELETE');
    refetch();
  };

  const executeTool = async (id: string, input: unknown) => {
    return apiCall(`/api/tools/${id}/execute`, 'POST', { input });
  };

  return {
    tools: data || [],
    loading,
    error,
    refetch,
    createTool,
    updateTool,
    deleteTool,
    executeTool,
  };
}

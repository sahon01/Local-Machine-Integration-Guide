'use client';

import { useApi, apiCall } from './useApi';

export interface MemoryEntry {
  id: string;
  agentId: string;
  conversationId: string;
  content: string;
  type: 'conversation' | 'entity' | 'learning';
  importance: number;
  createdAt: string;
  accessCount: number;
}

export function useMemory(agentId?: string) {
  const endpoint = agentId ? `/api/memory?agent=${agentId}` : '/api/memory';
  const { data, loading, error, refetch } = useApi<MemoryEntry[]>(endpoint);

  const saveMemory = async (memory: Omit<MemoryEntry, 'id'>) => {
    const result = await apiCall('/api/memory/save', 'POST', memory);
    refetch();
    return result;
  };

  const searchMemory = async (query: string, agentId?: string) => {
    return apiCall('/api/memory/search', 'POST', { query, agentId });
  };

  const deleteMemory = async (id: string) => {
    await apiCall(`/api/memory/${id}`, 'DELETE');
    refetch();
  };

  const clearCache = async (agentId?: string) => {
    await apiCall('/api/memory/clear', 'POST', { agentId });
    refetch();
  };

  return {
    memories: data || [],
    loading,
    error,
    refetch,
    saveMemory,
    searchMemory,
    deleteMemory,
    clearCache,
  };
}

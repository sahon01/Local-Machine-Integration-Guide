'use client';

import { useApi, apiCall } from './useApi';

export interface Provider {
  id: string;
  name: string;
  type: 'openai' | 'ollama' | 'gemini' | 'custom';
  apiKey: string;
  baseUrl?: string;
  status: 'active' | 'inactive' | 'error';
  models: string[];
  lastChecked?: string;
  requestCount: number;
}

export function useProviders() {
  const { data, loading, error, refetch } = useApi<Provider[]>('/api/providers');

  const addProvider = async (provider: Omit<Provider, 'id'>) => {
    await apiCall('/api/providers', 'POST', provider);
    refetch();
  };

  const updateProvider = async (id: string, updates: Partial<Provider>) => {
    await apiCall(`/api/providers/${id}`, 'PUT', updates);
    refetch();
  };

  const deleteProvider = async (id: string) => {
    await apiCall(`/api/providers/${id}`, 'DELETE');
    refetch();
  };

  const testConnection = async (id: string) => {
    return apiCall(`/api/providers/${id}/test`, 'POST');
  };

  const syncModels = async (id: string) => {
    return apiCall(`/api/providers/${id}/models`, 'POST');
  };

  return {
    providers: data || [],
    loading,
    error,
    refetch,
    addProvider,
    updateProvider,
    deleteProvider,
    testConnection,
    syncModels,
  };
}

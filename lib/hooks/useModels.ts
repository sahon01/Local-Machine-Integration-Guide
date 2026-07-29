'use client';

import { useApi, apiCall } from './useApi';

export interface Model {
  id: string;
  name: string;
  provider: string;
  version: string;
  enabled: boolean;
  contextWindow: number;
  maxTokens: number;
  costPerToken: number;
  type: 'chat' | 'embedding' | 'code';
  lastUpdated: string;
  usageCount: number;
}

export function useModels(providerId?: string) {
  const endpoint = providerId 
    ? `/api/models?provider=${providerId}`
    : '/api/models';

  const { data, loading, error, refetch } = useApi<Model[]>(endpoint);

  const updateModel = async (id: string, updates: Partial<Model>) => {
    await apiCall(`/api/models/${id}`, 'PUT', updates);
    refetch();
  };

  const toggleModel = async (id: string, enabled: boolean) => {
    await apiCall(`/api/models/${id}`, 'PUT', { enabled });
    refetch();
  };

  const testModel = async (id: string) => {
    return apiCall(`/api/models/${id}/test`, 'POST');
  };

  return {
    models: data || [],
    loading,
    error,
    refetch,
    updateModel,
    toggleModel,
    testModel,
  };
}

'use client';

import { useApi, apiCall } from './useApi';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
}

export function useUsers() {
  const { data, loading, error, refetch } = useApi<User[]>('/api/admin/users');

  const createUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
    await apiCall('/api/admin/users', 'POST', user);
    refetch();
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await apiCall(`/api/admin/users/${id}`, 'PUT', updates);
    refetch();
  };

  const deleteUser = async (id: string) => {
    await apiCall(`/api/admin/users/${id}`, 'DELETE');
    refetch();
  };

  const updatePermissions = async (id: string, permissions: string[]) => {
    await apiCall(`/api/admin/users/${id}/permissions`, 'PUT', { permissions });
    refetch();
  };

  return {
    users: data || [],
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    updatePermissions,
  };
}

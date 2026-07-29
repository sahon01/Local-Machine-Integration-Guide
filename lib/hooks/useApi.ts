'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useApi<T>(
  endpoint: string,
  options?: { skip?: boolean; refetchInterval?: number }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    if (options?.refetchInterval) {
      intervalId = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [endpoint, options?.skip, options?.refetchInterval]);

  const refetch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

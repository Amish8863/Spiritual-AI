import { useState, useCallback } from 'react';
import { apiService, ApiError } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiCall();
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err as ApiError;
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    []
  );

  return { ...state, execute };
}

// Specific hooks for common operations
export function useZodiacSigns() {
  const api = useApi<any[]>();

  const fetch = useCallback(async () => {
    return api.execute(() => apiService.getZodiacSigns());
  }, [api]);

  return { ...api, fetch };
}

export function useDailyHoroscope(sign: string) {
  const api = useApi<any>();

  const fetch = useCallback(async () => {
    if (!sign) return null;
    return api.execute(() => apiService.getDailyHoroscope(sign));
  }, [api, sign]);

  return { ...api, fetch };
}

export function useCompatibility(sign1: string, sign2: string) {
  const api = useApi<any>();

  const fetch = useCallback(async () => {
    if (!sign1 || !sign2) return null;
    return api.execute(() => apiService.getCompatibility(sign1, sign2));
  }, [api, sign1, sign2]);

  return { ...api, fetch };
}

export function useBirthChart() {
  const api = useApi<any>();

  const calculate = useCallback(
    async (data: {
      birthDate: string;
      birthTime: string;
      birthLocation: string;
    }) => {
      return api.execute(() => apiService.calculateBirthChart(data));
    },
    [api]
  );

  return { ...api, calculate };
}

export function useAuth() {
  const api = useApi<{ token: string; user: any }>();

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      zodiacSign?: string;
    }) => {
      const result = await api.execute(() => apiService.registerUser(data));
      if (result?.token) {
        localStorage.setItem('authToken', result.token);
      }
      return result;
    },
    [api]
  );

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const result = await api.execute(() => apiService.loginUser(data));
      if (result?.token) {
        localStorage.setItem('authToken', result.token);
      }
      return result;
    },
    [api]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...api, register, login, logout };
}

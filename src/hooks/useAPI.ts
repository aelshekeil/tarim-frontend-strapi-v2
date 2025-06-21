import { useState, useEffect } from 'react';
import strapiAPI from '../lib/api';
import { StrapiUser } from '../lib/types';

// Authentication hook
export const useAuth = () => {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwt');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      strapiAPI.setToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await strapiAPI.login(identifier, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await strapiAPI.register(username, email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    strapiAPI.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};

// Generic data fetching hook
export const useAPI = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Form submission hook
export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (submitFunction: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await submitFunction();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    submitForm,
    reset,
  };
};


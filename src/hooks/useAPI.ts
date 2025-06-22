import { useState, useEffect } from 'react';
import strapiAPI from '../lib/api';

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAPI<T>(fetchFunction: () => Promise<T>, dependencies: any[] = []): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          // Check if the error is a 'Forbidden' message from Strapi
          if (err.message && err.message.includes('Forbidden')) {
            setError('Forbidden: You do not have permission to access this resource. Please check Strapi permissions.');
          } else {
            setError(err.message || 'An unknown error occurred');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

export { useAPI };

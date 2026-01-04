import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPackages } from '../utils/firebase';

const PackagesContext = createContext();

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPackages();
      setPackages(data);
    } catch (err) {
      setError(err.message);
      if (import.meta.env.DEV) {
        console.error('Error loading packages:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
    
    // Real-time updates - check every 5 seconds
    const interval = setInterval(() => {
      loadPackages();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadPackages]);

  const value = {
    packages,
    loading,
    error,
    refreshPackages: loadPackages
  };

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
}


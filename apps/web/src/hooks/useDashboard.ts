import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboard.service';
import { DashboardStats } from '../types';

export function useDashboard(pollInterval = 3000) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        if (active) {
          setStats(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    const timer = setInterval(fetchStats, pollInterval);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [pollInterval]);

  return { stats, loading, error };
}

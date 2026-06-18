import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject } from '../services/project.service';
import { Project } from '../types';

export function useProjects(pollInterval = 5000) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const timer = setInterval(fetchProjects, pollInterval);
    return () => clearInterval(timer);
  }, [fetchProjects, pollInterval]);

  const addProject = async (data: Partial<Project>) => {
    const newProject = await createProject(data);
    await fetchProjects();
    return newProject;
  };

  return { projects, loading, error, refresh: fetchProjects, addProject };
}

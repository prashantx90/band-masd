import { useState, useEffect, useCallback } from 'react';
import { getWorkflow, getWorkflowRuns, getWorkflowByProject, startWorkflowSimulation } from '../services/workflow.service';
import { Workflow, AgentRun } from '../types';

export function useWorkflow(workflowId: string | null, projectId: string | null = null, pollInterval = 2000) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflowData = useCallback(async () => {
    try {
      let wf: Workflow | null = null;
      if (workflowId) {
        wf = await getWorkflow(workflowId);
      } else if (projectId) {
        wf = await getWorkflowByProject(projectId);
      }

      setWorkflow(wf);

      if (wf) {
        const agentRuns = await getWorkflowRuns(wf.id);
        setRuns(agentRuns);
      } else {
        setRuns([]);
      }
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workflowId, projectId]);

  useEffect(() => {
    fetchWorkflowData();
    const timer = setInterval(fetchWorkflowData, pollInterval);
    return () => clearInterval(timer);
  }, [fetchWorkflowData, pollInterval]);

  const startSimulation = async (projId: string) => {
    setLoading(true);
    try {
      const wf = await startWorkflowSimulation(projId);
      setWorkflow(wf);
      setError(null);
      return wf;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { workflow, runs, loading, error, refresh: fetchWorkflowData, startSimulation };
}

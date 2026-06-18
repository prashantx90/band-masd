import { useState, useEffect, useCallback } from 'react';
import { getReport, getRequirements, getFindings, getArtifacts } from '../services/report.service';
import { Report, Requirement, Finding, Artifact } from '../types';

export function useReport(workflowId: string | null, projectId: string | null, pollInterval = 5000) {
  const [report, setReport] = useState<Report | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReportData = useCallback(async () => {
    if (!workflowId) {
      setLoading(false);
      return;
    }
    try {
      const rep = await getReport(workflowId);
      setReport(rep);

      if (projectId) {
        const reqs = await getRequirements(projectId);
        setRequirements(reqs);
      }

      const fnds = await getFindings(workflowId);
      setFindings(fnds);

      const arts = await getArtifacts(workflowId);
      setArtifacts(arts);

      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workflowId, projectId]);

  useEffect(() => {
    fetchReportData();
    const timer = setInterval(fetchReportData, pollInterval);
    return () => clearInterval(timer);
  }, [fetchReportData, pollInterval]);

  return { report, requirements, findings, artifacts, loading, error, refresh: fetchReportData };
}

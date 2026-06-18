import directus from '../lib/directus';
import { readItems } from '@directus/sdk';
import { DashboardStats } from '../types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const projects = await directus.request(readItems('projects', { limit: -1 }));
  const runs = await directus.request(readItems('agent_runs', { limit: -1 }));
  const reports = await directus.request(readItems('reports', { limit: -1 }));

  const activeProjects = projects.filter(p => p.status === 'running').length;
  const totalAgentRuns = runs.length;
  const completedTasks = runs.filter(r => r.status === 'completed').length;

  const approvedReports = reports.filter(r => r.approval_decision === 'approved').length;
  const totalReports = reports.length;
  const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;

  return {
    activeProjects,
    totalAgentRuns,
    completedTasks,
    approvalRate: parseFloat(approvalRate.toFixed(1)),
  };
}

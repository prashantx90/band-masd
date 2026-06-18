import directus from '../lib/directus';
import { readItems } from '@directus/sdk';
import { Report, Requirement, Finding, Artifact } from '../types';

export async function getReport(workflowId: string): Promise<Report | null> {
  const list = await directus.request(
    readItems('reports', {
      filter: {
        workflow_id: { _eq: workflowId },
      },
      limit: 1,
    })
  );
  return list.length > 0 ? list[0] : null;
}

export async function getRequirements(projectId: string): Promise<Requirement[]> {
  return directus.request(
    readItems('requirements', {
      filter: {
        project_id: { _eq: projectId },
      },
      sort: ['requirement_code'] as any,
    })
  );
}

export async function getFindings(workflowId: string): Promise<Finding[]> {
  return directus.request(
    readItems('findings', {
      filter: {
        workflow_id: { _eq: workflowId },
      },
    })
  );
}

export async function getArtifacts(workflowId: string): Promise<Artifact[]> {
  return directus.request(
    readItems('artifacts', {
      filter: {
        workflow_id: { _eq: workflowId },
      },
    })
  );
}

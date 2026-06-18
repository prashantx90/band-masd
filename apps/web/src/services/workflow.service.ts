import directus from '../lib/directus';
import { readItems, readItem, createItem, updateItem } from '@directus/sdk';
import { Workflow, AgentRun, Message } from '../types';

export async function getWorkflow(id: string): Promise<Workflow> {
  return directus.request(readItem('workflows', id));
}

export async function getWorkflowRuns(workflowId: string): Promise<AgentRun[]> {
  return directus.request(
    readItems('agent_runs', {
      filter: {
        workflow_id: { _eq: workflowId },
      },
      sort: ['created_at'] as any,
    })
  );
}

export async function getWorkflowByProject(projectId: string): Promise<Workflow | null> {
  const list = await directus.request(
    readItems('workflows', {
      filter: {
        project_id: { _eq: projectId },
      },
      limit: 1,
      sort: ['-created_at'] as any,
    })
  );
  return list.length > 0 ? list[0] : null;
}

// Client-side simulator that writes directly to Directus
export async function startWorkflowSimulation(projectId: string): Promise<Workflow> {
  // 1. Create the workflow
  const workflow = await directus.request(
    createItem('workflows', {
      project_id: projectId,
      status: 'running',
      current_agent: 'PM Agent',
      started_at: new Date().toISOString(),
    } as any)
  );

  // 2. Fetch all agents from Directus to get their UUIDs
  const agents = await directus.request(
    readItems('agents', {
      sort: ['sort_order'] as any,
    })
  );

  const agentMap = new Map(agents.map(a => [a.code, a.id]));

  // Run the simulation asynchronously
  runSimulation(workflow.id, agentMap).catch(err => {
    console.error('Simulation failed:', err);
  });

  return workflow;
}

async function runSimulation(workflowId: string, agentMap: Map<string, string>) {
  const steps = [
    {
      code: 'pm',
      name: 'PM Agent',
      messages: [
        { title: 'Project Requirements Initialized', content: 'Analyzing business requirements and defining product scope.', severity: 'info' },
        { title: 'PRD Generated', content: 'Created comprehensive PRD with 42 distinct functional requirements.', severity: 'success' }
      ]
    },
    {
      code: 'architect',
      name: 'Architect Agent',
      messages: [
        { title: 'System Architecture Design Started', content: 'Analyzing tech stack options and microservices layout.', severity: 'info' },
        { title: 'Architecture Draft Completed', content: 'Designed database schema, API gateway protocols, and service communication graph.', severity: 'success' }
      ]
    },
    {
      code: 'engineer',
      name: 'Engineer Agent',
      messages: [
        { title: 'Implementation Plan Started', content: 'Translating design docs to actionable development milestones.', severity: 'info' },
        { title: 'API Contracts Established', content: 'Completed API specifications and created 312 subtasks for engineering execution.', severity: 'success' }
      ]
    },
    {
      code: 'qa',
      name: 'QA Agent',
      messages: [
        { title: 'QA Analysis Initialized', content: 'Generating test cases, integration tests, and validating endpoint contracts.', severity: 'info' },
        { title: 'QA Results Summary', content: 'All unit and integration test runs passed successfully. Code coverage at 94%.', severity: 'success' }
      ]
    },
    {
      code: 'security',
      name: 'Security Agent',
      messages: [
        { title: 'Security Scanning Triggered', content: 'Performing OWASP dependency checks, static analysis, and token rotation verification.', severity: 'info' },
        { title: 'Security Audit Cleared', content: 'No critical vulnerabilities detected. Encryption at rest validated.', severity: 'success' }
      ]
    },
    {
      code: 'reviewer',
      name: 'Reviewer Agent',
      messages: [
        { title: 'Final Review Initiated', content: 'Aggregating all agent deliverables and testing logs for final sign-off.', severity: 'info' },
        { title: 'Workflow Approved', content: 'All criteria met. Review complete. Project is ready for deployment.', severity: 'success' }
      ]
    }
  ];

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const agentId = agentMap.get(step.code);
    if (!agentId) continue;

    // Update workflow current agent
    await directus.request(
      updateItem('workflows', workflowId, {
        current_agent: step.name,
      } as any)
    );

    // Create Agent Run
    const run = await directus.request(
      createItem('agent_runs', {
        workflow_id: workflowId,
        agent_id: agentId,
        status: 'running',
        progress: 10,
        tokens_in: 4500 + Math.floor(Math.random() * 1000),
        tokens_out: 2000 + Math.floor(Math.random() * 800),
        started_at: new Date().toISOString(),
      } as any)
    );

    // First Message
    await directus.request(
      createItem('messages', {
        workflow_id: workflowId,
        from_agent_id: agentId,
        event_type: 'log',
        title: step.messages[0].title,
        content: step.messages[0].content,
        severity: step.messages[0].severity,
      } as any)
    );

    await delay(1500);

    // Progress Update
    await directus.request(
      updateItem('agent_runs', run.id, {
        progress: 60,
      } as any)
    );

    await delay(1500);

    // Complete Agent Run and Second Message
    await directus.request(
      updateItem('agent_runs', run.id, {
        progress: 100,
        status: 'completed',
        completed_at: new Date().toISOString(),
        execution_time_ms: 3000 + Math.floor(Math.random() * 2000),
        output_summary: step.messages[1].content,
      } as any)
    );

    await directus.request(
      createItem('messages', {
        workflow_id: workflowId,
        from_agent_id: agentId,
        event_type: 'completion',
        title: step.messages[1].title,
        content: step.messages[1].content,
        severity: step.messages[1].severity,
      } as any)
    );

    // If Reviewer completed, generate final report and update project/workflow status
    if (step.code === 'reviewer') {
      await directus.request(
        createItem('reports', {
          workflow_id: workflowId,
          summary: 'All software agent phases completed successfully.',
          architecture_summary: 'Microservices architecture with API gateway and PostgreSQL verified.',
          implementation_summary: 'All 312 engineering subtasks marked complete and verified.',
          qa_summary: 'Integration testing success rate: 100%. Coverage: 94%.',
          security_summary: 'OWASP vulnerability scan passed. 0 critical bugs.',
          approval_decision: 'approved',
          generated_at: new Date().toISOString(),
        } as any)
      );

      await directus.request(
        updateItem('workflows', workflowId, {
          status: 'completed',
          completed_at: new Date().toISOString(),
        } as any)
      );

      // Get project ID and update project status
      const wf = await directus.request(readItem('workflows', workflowId));
      await directus.request(
        updateItem('projects', wf.project_id, {
          status: 'completed',
          approval_status: 'approved',
        } as any)
      );
    }

    await delay(1000);
  }
}
